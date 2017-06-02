const Discord = require('discord.js');
const config = require('../config.json');
const blizzard = require('blizzard.js').initialize({ apikey: config.blizzapi });
exports.run = (client, message, args) => {

    if (args.length < 3){
      message.channel.send('Wrong input, type ?help for help!')
      return;
    };
        
    let origin = args[args.length - 1];
    let realm = args[args.length - 2];
    let nameTotal = args.length - 3;
    let name = args[0];
    
    for (i = 1; i <= nameTotal; i++) {
        name = name + ' ' + args[i];
    };

    blizzard.wow.guild(['profile', 'members'], {name, realm, origin} )
    .then(response => {
        const respuestaGuild = response.data;
        console.log(`Guild: ${respuestaGuild.name}`);
        // Guild memebers numer:
        const totalMembers = respuestaGuild.members.length;
        // Faction and color:
        let color;
        if (respuestaGuild.side == 0) {
            respuesta.faction = 'Alliance';
            color = '#1560d8';
        } else {
            respuestaGuild.side = 'Horde';
            color = '#b71b1b';
        };
        // Buscar Guild Master.
        let guildMaster;
        for (i = 0; i < totalMembers; i++) {
            if (respuestaGuild.members[i].rank == 0) {
                guildMaster = respuestaGuild.members[i].character.name;
            };
        };
        // replace spaces with underscores for guild name.
        let guildName;
        guildName = respuestaGuild.name.split(' ').join('_');

        // Construct RichEmbed.
        const embed = new Discord.RichEmbed()
            .setColor(color)
            .addField(`${respuestaGuild.name}, ${respuestaGuild.realm}`, `[Armory page](http://${origin}.battle.net/wow/guild/${realm}/${guildName}/)`)
            .addField('Members:', totalMembers, true)
            .addField('Achievement Points:', respuestaGuild.achievementPoints, true)
            .addField('Faction:', respuestaGuild.side, true)
            .addField('Guild Master:', `${guildMaster} ([Armory page](https://worldofwarcraft.com/character/${realm}/${guildMaster}))`, true);

            message.channel.send({embed});
    })
    .catch(error => {
        console.log(error);
        message.channel.send(`${name} not found in Armory`);
    });
};