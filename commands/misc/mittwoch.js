module.exports = {
    slash: false,
    description: 'is it, or is it not? 🤔',
    maxArgs: 0,
    category: 'Misc.',
    callback: ({ message }) => {
        const Discord = require('discord.js')
        const fs = require('fs')
        var date = new Date()
        var tage = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag']
        var text = [null, 'Es ist Montag meine Münmler! ', null, 'Es ist Mittwoch meine Kerle!', 'Es ist nicht mehr Mittwoch meine Kerle!', 'Es ist Freitag meine Kerl*innen! ', null]
        var fotos = []

        var filename
        var content

        fs.readdir('./assets/mittwoch', (err, files) => {
            if (err) { return err }
            files.forEach(file => {
                fotos.push(file.slice(0, file.length - 4))
            })
            if (fotos.includes(tage[date.getDay()].toLowerCase())) {
                /* 
                Es ist Montag meine Münmler! 
                Es ist nicht Mittwoch meine Kerle! 
                Es ist Mittwoch meine Kerle! 
                Es ist nicht mehr Mittwoch meine Kerle! 
                Es ist Freitag meine Kerl*innen! 
                Es ist nicht Mittwoch meine Kerle!
                Es ist nicht Mittwoch meine Kerle!
                */
                filename = tage[date.getDay()].toLowerCase()
                content = text[date.getDay()]
            } else {
                filename = 'nicht_mittwoch'
                content = "Es ist nicht Mittwoch, meine Kerle . . ."
            }

            const attachment = new Discord.MessageAttachment(`assets/mittwoch/${filename}.jpg`, `${filename}.jpg`);
            const embed = new Discord.MessageEmbed()
                .setTitle(`${filename}.jpg`)
                .setColor(0x51267)
                .setTimestamp()
                .attachFiles(attachment)
                .setImage(`attachment://${filename}.jpg`);
            return message.channel.send(content).then(message.channel.send(embed))
        })


    }
}