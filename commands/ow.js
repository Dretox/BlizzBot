const Discord = require('discord.js');
const config = require('../config');
const overwatch = require('overwatch-js');
exports.run = (client, message, args) => {

    const [name, origin, platform] = args;
    let platformFinal;

    if (args.length < 2 || args.lenth > 3){
        message.channel.send('Wrong input, type ?help for help!')
        return;
    };

    if (platform === undefined) {
        platformFinal = 'pc';
    } else {
        platformFinal = platform;
    };

    overwatch.getOverall(platformFinal, origin, name)
    .then(data => {
        let respuesta = data;
        let levelTotal;
        let playtimeQp;
        let playtimeComp;
        
        levelTotal = (respuesta.profile.tier * 100) + respuesta.profile.level;
        playtimeQp = respuesta.quickplay.global.time_played / 3600000;
        playtimeComp = respuesta.competitive.global.time_played / 3600000;

        const embed = new Discord.RichEmbed()
            .setColor('#fcbd49')
            .setThumbnail(respuesta.profile.avatar)
            .addField(`${respuesta.profile.nick}, level ${levelTotal}`,`[View profile page.](${respuesta.profile.url})`)
            .addField('QP Wins:', respuesta.quickplay.global.games_won, true)
            .addField('QP Playtime:', `${playtimeQp} Hours`, true)
            .addField('Competitive Wins:', respuesta.competitive.global.games_won, true)
            .addField('Competitive Losses:', respuesta.competitive.global.games_lost, true)
            .addField('Competitive Playtime:', `${playtimeComp} Hours`, true)
            .addField('Rank:', respuesta.profile.rank, true)

        message.channel.send({embed});
        console.log(respuesta.profile.nick);
    })
    .catch(error => {
        console.log(error);
        message.channel.send(`${args[0]} not found.`);
    });
};