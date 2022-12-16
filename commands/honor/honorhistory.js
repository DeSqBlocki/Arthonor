const Discord = require('discord.js')
const { getUserFromMention } = require('../..')
const honorsSchema = require('../../models/honors-schema')

const cache = new Map()

const loadData = async () => {
    const results = await honorsSchema.find()
    for (const result of results) {
        cache.set(result._id, result.honors, result.reasons)
    }
}
loadData()
module.exports = {
    description: 'shows someones honor history',
    expectedArgs: '<user>',
    minArgs: 0,
    maxArgs: 1,
    category: 'Honor',
    callback: async ({ message, args }) => {
        var user = getUserFromMention(args[0])
        if (!user) {
            user = message.author
        }

        const results = await honorsSchema.find({ _id: user.id })
        if (!results.length) {
            return message.channel.send('This User Does Not Have Any Honor Reasons!')
        }
        const reasons = Array.from(results[0].reasons)
        const embed = new Discord.MessageEmbed()
            .setAuthor(`Honor History!`)
            .setColor(0x51267)
            .addFields({ name: 'reasons:', value: reasons, inline: true })
            .setFooter(`Honor History of User: ${user.username}#${user.discriminator}`, user.displayAvatarURL())
            .setThumbnail(message.guild.iconURL())
        return message.channel.send(embed)
    }
}