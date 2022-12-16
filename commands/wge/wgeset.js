const { getUserFromMention } = require('../..')
const wgeSchema = require('../../models/wge-schema')
const cache = new Map()

const loadData = async () => {
    const results = await wgeSchema.find()
    for (const result of results) {
        cache.set(result._id)
    }
}
const reCache = async () => {
    cache.clear()
    loadData()
}
loadData()
module.exports = {
    description: 'give a specific person a WGE theme!',
    category: 'WGE',
    minArgs: 2,
    expectedArgs: '<user> <theme>',
    callback: async ({ message, args }) => {
        await reCache()
        const user = getUserFromMention(args[0])
        if (!user) {
            return message.channel.send('Invalid User!')
        }

        var theme = args.join(' ').slice(args[0].length)
        theme = theme.trimStart()
        const time = Date.now() + 604800000

        if (await wgeSchema.find({_id: user.id})) {
            message.channel.send(`<@${user.id}>, du wurdest ausgewählt! Du hast nun 7 Tage Zeit, um deine Expertise zum Thema "${theme}" zur Schau zu stellen`)
        } else {
            return message.channel.send(`<@${user.id}> nimmt nicht an WGE teil! Bitte wähle eine andere Person`)
        }

        await wgeSchema.updateMany([
            { $unset: ["time", "theme"] }
            //removes time and theme for everyone
        ])
        await wgeSchema.updateMany({
            $inc: { tickets: +1 }
        })
        await wgeSchema.findOneAndUpdate({
            _id: user.id
        }, {
            _id: user.id,
            tickets: 0,
            time: time,
            theme: theme,
        }, {
            upsert: true
        })
        //adds new wge to database
    }
}
