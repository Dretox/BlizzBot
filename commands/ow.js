const Discord = require('discord.js');
const config = require('../config');
const overwatch = require('overwatch-js');
exports.run = (client, message, args) => {

    const [name, origin, platform] = args;
    let platformFinal

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
        console.log(respuesta.profile.nick);

        const embed = new Discord.RichEmbed()
            .setColor('#fcbd49')
            .setThumbnail(respuesta.profile.avatar)
            .addField('Info:', 'To be continued...')

        message.channel.send({embed});
    })
    .catch(error => {
        console.log(error);
        message.channel.send(`${args[0]} not found.`);
    });
};