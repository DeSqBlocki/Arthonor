const Discord = require('discord.js')
require('dotenv').config()
module.exports = {
    description: 'explains you what WGE is',
    category: 'WGE',
    callback: ({message}) => {
        const embed = new Discord.MessageEmbed()
        .setTitle("-World's Greatest Expert-")
        .setDescription("Someone thinks you're the **World's Greatest Expert©**  and you have to prove your expertise in the given topic")
        .setColor(0x51267)
        .setTimestamp()
        .setFooter(`Check Out ${process.env.PREFIX}help => WGE For More`)
        .setThumbnail(message.guild.iconURL())

      return message.channel.send(embed);
    }
}