const weatherJs = require('weather-js')
const Discord = require('discord.js')
module.exports = {
    description: 'solltest du sterben oder schwitzen?',
    minArgs: 0,
    expectedArgs: '<zip code>',
    category: 'Misc.',
    callback: async ({ message, args }) => {
        var place = args.join(" ")
        if (!place) {
            place = '38176, Germany'
        }
        await weatherJs.find({
            search: place,
            degreeType: 'C'
        }, function (error, result) {
            if (error) {
                return message.channel.send(error)
            }
            if (result === undefined || result.length === 0) {
                return message.channel.send(`Couldn't find location!`)
            }

            var current = result[0].current
            var location = result[0].location
            var forecast = result[0].forecast

            var description
            const weekday = new Date().toString().slice(0, 3)
            for (var i = 0; i < result[0].forecast.length; i++) {
                if (result[0].forecast[i].shortday === weekday) {
                    break;
                }
            }
            if (forecast[i].high > 25) { //zu warm
                description = `Ich würde ja lieber sterben als rauszugehen. . .`
            } else if (forecast[i].high < 15) { //zu kalt}
                description = `Ich ging rein als Mann, und kam wieder als Frau :/`
            } else { //perfekt
                description = `Vielleicht gehe ich ja heute laufen :D`
            }
            
            const embed = new Discord.MessageEmbed()
                .setColor(0x51267)
                .setThumbnail(message.guild.iconURL())
                .setDescription(description)
                .setAuthor(`Wetter Vorschau für ${current.observationpoint}`)
                .setFooter(`${current.skytext}`, current.imageUrl)
                .addFields(
                    { name: `Zeitzone`, value: `GMT +${location.timezone}`, inline: true },
                    { name: `Aktuell`, value: `**${current.temperature}°C**`, inline: true },
                    { name: `Windstärke`, value: `${current.windspeed}`, inline: true },
                    { name: `Tiefst Temp.`, value: `${forecast[i].low}°C`, inline: true },
                    { name: `Höchst Temp.`, value: `${forecast[i].high}°C`, inline: true },
                    { name: `Luftfeuchtigkeit`, value: `${current.humidity}%`, inline: true },
                )
            return message.channel.send(embed);

        })
    }
}