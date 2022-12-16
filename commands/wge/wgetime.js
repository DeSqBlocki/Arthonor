const wgeSchema = require('../../models/wge-schema')
const Discord = require('discord.js')
module.exports = {
    description: 'shows remaining time of current wge game',
    category: 'WGE',
    callback: async ({ message }) => {
        const results = await wgeSchema.find({ time: { $exists: true}})
        if(!results.length){
            return message.channel.send('No WGE Set Currently!')
        }
        const guild = message.guild
        const user = guild.members.cache.get(results[0]._id)
        const theme = results[0].theme
        const date = new Date(results[0].time)
        const HHMMSS = date.toTimeString().substring(0,8)
        const DDMMYYYY = date.toDateString()

        const embed = new Discord.MessageEmbed()
        .setTitle("-World's Greatest Expert-")
        .setDescription("Someone thinks you're the **World's Greatest Expert©** at. . . ")
        .addFields({
            name: `Theme: `,
            value: theme,
        },{
            name: `Time until: `,
            value: `${DDMMYYYY} - ${HHMMSS}`,
        })
        .setColor(0x51267)
        .setTimestamp()
        .setFooter(`Expert: ${user.user.username}    |`, user.user.displayAvatarURL())
        .setThumbnail(message.guild.iconURL())

      return message.channel.send(embed);
    }
}