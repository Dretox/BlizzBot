const Discord = require('discord.js');
const config = require('../config.json');
const blizzard = require('blizzard.js').initialize({ apikey: config.blizzapi });
exports.run = (client, message, args) => {

    if (args.length != 3){
      message.channel.send('Wrong input, type ?help for help!')
      return;
    };

    const [name, realm, origin] = args;
    const classes = {
        1: 'Warrior',
        2: 'Paladin',
        3: 'Hunter',
        4: 'Rogue',
        5: 'Priest',
        6: 'Death Knight',
        7: 'Shaman',
        8: 'Mage',
        9: 'Warlock',
        10: 'Monk',
        11: 'Druid',
        12: 'Demon Hunter',
    };
    const races = {
        1: 'Human',
        2: 'Orc',
        3: 'Dwarf',
        4: 'Night Elf',
        5: 'Undead',
        6: 'Tauren',
        7: 'Gnome',
        8: 'Troll',
        9: 'Goblin',
        10: 'Blood Elf',
        11: 'Draeni',
        22: 'Worgen',
        25: 'Pandaren',
        26: 'Pandaren',
    };

    blizzard.wow.character(
        ['profile', 'guild', 'items'],
        { name, realm, origin }
    ).then(response => {
        let respuesta = response.data;
        let color;
        let guildname;
        // class is a reserved keyword in JavaScript
        const [clss, race] = [ respuesta.class, respuesta.race ];
    
        // Para determinar y asignar el nombre de la clase.
        respuesta.class = classes[clss];

        // Para determinar la raza.
        respuesta.race = races[race];
    
        // Para determinar la facción:
        if (respuesta.faction == 0) {
            respuesta.faction = 'Alliance';
            color = '#1560d8';
        } else {
            respuesta.faction = 'Horde';
            color = '#b71b1b';
        };
        
        //  Para determinar género.
        if (respuesta.gender == 0) {
            respuesta.gender = '&#9794';
        } else {
            respuesta.gender = '&#9792;';
        };

        // No guild error handle.
        if (respuesta.guild == undefined) {
            guildname = `${respuesta.name} hasn't joined a guild yet`;
        } else {
            guildname = respuesta.guild.name;
        }
        
        // No ilvl error handle.
        if (respuesta.items.averageItemLevelEquipped == undefined) {
            respuesta.items.averageItemLevelEquipped = 'No ilvl info at the moment';
        };

        console.log(respuesta.name);

        const embed = new Discord.RichEmbed()
            .setColor(color)
            .setThumbnail(`http://render-api-${origin}.worldofwarcraft.com/static-render/${origin}/${respuesta.thumbnail}`)
            .addField(`${respuesta.name}, level ${respuesta.level} ${respuesta.race} ${respuesta.class}`, `[Armory page.](https://worldofwarcraft.com/character/${realm}/${name})`)
            .addField('Equipped ilvl:', respuesta.items.averageItemLevelEquipped, true)
            .addField('Achievement Points:', respuesta.achievementPoints, true)
            .addField('Faction:', respuesta.faction, true)
            .addField('Guild:', guildname, true)

        message.channel.send({embed});
    })
    .catch(error => {
        console.log(error);
        message.channel.send(`${args[0]} not found in Armory`);
    });
};