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
        if (find.length) {
            return message.channel.send('You Are Already Participating')
        }
        

        const results = await wgeSchema.find()
        var tickets = 0
        for (var result of results) {
            tickets += result.tickets
        }
        var random = 1
        if (results.length) {
            tickets += Math.floor(Math.random * tickets)
        }
        //random tickets for the start, max alltickets, min 1

        await wgeSchema.findOneAndUpdate({
            _id: user.id
        }, {
            _id: user.id,
            tickets: random,
        }, {
            upsert: true
        })

        if (user.id != message.author.id) {
            return message.channel.send(`<${user.username}> Has Been Added To WGE, Have Fun!`)
        } else {
            return message.channel.send('You Have Been Added To WGE, Have Fun!')
        }
    }
}