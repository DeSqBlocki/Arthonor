const { getUserFromMention } = require('../..')
const wgeBlacklistSchema = require('../../models/wge-blacklist-schema')
const wgeSchema = require('../../models/wge-schema')
const cache = new Map()
const loadData = async () => {
    const results = await wgeSchema.find()
    for (const result of results) {
        cache.set(result._id, result.tickets)
    }
}

const reCache = async () => {
    cache.clear()
    await loadData()
}

loadData()
module.exports = {
    description: 'start a new wge with a random person',
    expectedArgs: '<theme>',
    minArgs: 1,
    category: 'WGE',
    callback: async ({ message, args }) => {
        await reCache()
        const theme = args.join(' ')
        const time = Date.now() + 604800000
        const old = await wgeSchema.find({ time: { $exists: true } })
        const oldUser = old[0]._id
        cache.delete(oldUser)
        
        const random = Math.floor(Math.random() * cache.size)
        const participants = Array.from(cache)
        const userID = participants[random][0]

        const results = await wgeBlacklistSchema.find()
        for(var result of results){
            await wgeSchema.findOneAndUpdate({
                _id: result._id
            },{
                _id: result._id,
                tickets: result.tickets
            },{
                upsert:true
            })
            await wgeBlacklistSchema.deleteOne({
                _id: result._id
            })
        }
        
        await wgeSchema.updateMany([
            { $unset: ["time", "theme"] }
        ])

        await wgeSchema.updateMany({
            $inc: { tickets: +1 }
        })

        await wgeSchema.findOneAndUpdate({
            _id: userID
        }, {
            tickets: 0,
            time: time,
            theme: theme
        }, {
            upsert: true
        })
        //add theme and time to chosen one, set tickets to 0
        return message.channel.send(`<@${userID}>, du wurdest ausgewählt! Du hast nun 7 Tage Zeit, um deine Expertise zum Thema "${theme}" zur Schau zu stellen`)
    }

}