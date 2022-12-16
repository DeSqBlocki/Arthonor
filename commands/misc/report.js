const feedbackSchema = require('../../models/feedback-schema')

const cache = new Map()

const loadData = async () => {
    const results = await feedbackSchema.find()

    for (const result of results) {
        cache.set(result._id, result.feedback, result.user)
    }
}
loadData()
module.exports = {
    slash: false,
    description: 'sends a feedback or bugreport to the developement inbox',
    expectedArgs: '<text>',
    minArgs: 1,
    maxArgs: -1,
    aliases: ['feedback'],
    category: 'Misc.',
    callback: async ({ message, args }) => {
        const Discord = require('discord.js')
        const feedback = args.join(' ')

        await feedbackSchema.findOneAndUpdate({
            _id: message.id
        }, {
            _id: message.id,
            feedback: feedback,
            user: message.author.id
        }, {
            upsert: true
        })
        cache.set(message.id, feedback, message.author.id)

        const embed = new Discord.MessageEmbed()
            .setTitle(`-Message Sent!-`)
            .setColor(0x51267)
            .setThumbnail(message.guild.iconURL())
            .addFields(
                { name: 'message:', value: feedback }
            )
            .setFooter(`#${message.id}`)
            .setTimestamp()
        return message.channel.send(embed)

    }
}