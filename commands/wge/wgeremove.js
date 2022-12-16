const { getUserFromMention } = require('../..')
const wgeBlacklistSchema = require('../../models/wge-blacklist-schema')
const wgeSchema = require('../../models/wge-schema')
module.exports = {
    description: 'adds someone to the participant list',
    category: 'WGE',
    minArgs: 0,
    maxArgs: 1,
    expectedArgs: '<user>',
    callback: async ({ message, args }) => {
        var user = getUserFromMention(args[0])
        if (!user) {
            user = message.author
        }
        const banned = await wgeBlacklistSchema.find({ _id: user.id})
        if (banned.length){
            return message.channel.send('You Are Currently Banned From WGE Due To Missing The Deadline!')
        }
        const find = await wgeSchema.find({ _id: user.id })
        if (!find.length) {
            return message.channel.send('You Are Not Participating Yet!')
        }
        

        await wgeSchema.deleteOne({
            _id: user.id
        })

        if (user.id != message.author.id) {
            return message.channel.send(`<${user.username}> Has Been Removed From WGE, Until Next Time!`)
        } else {
            return message.channel.send(`You Have Been Removed From WGE, Until Next Time!`)
        }
    }
}