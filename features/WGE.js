const { getWGEChannelID } = require('../commands/admin/setwgechannel')
const wgeBlacklistSchema = require('../models/wge-blacklist-schema')
const wgeSchema = require('../models/wge-schema')

module.exports = async (client) => {
    const MyModule = require('../index')
    const EventEmitter = MyModule.event
    const guildID = MyModule.guildID

    EventEmitter.on('wge_start', async () => {
        //Start new WGE
        const guild = client.guilds.cache.get(guildID)
        const channel = guild.channels.cache.get(await getWGEChannelID(guildID))
        console.log('There Is Currently No WGE Running!')
    })
    EventEmitter.on('wge_end', async (result) => {
        //WGE ended without the expert answering
        const userID = result._id
        const theme = result.theme
	console.log(theme)
        const guild = client.guilds.cache.get(guildID)
        const channel = guild.channels.cache.get(await getWGEChannelID(guildID))

        await wgeSchema.updateMany([
            { $unset: ["time", "theme"] }
        ])
        //delete old wge

        await wgeSchema.updateMany({
            $inc: { tickets: -1 }
        })
        //reset tickets earned from last wge

        await wgeBlacklistSchema.findOneAndUpdate({
            _id: userID
        },{
            _id: userID,
            tickets: 0
        },{
            upsert: true
        })
        //add expert to blacklist for now

        const results = await wgeSchema.find()
        const time = Date.now() + 604800000
        const cache = new Map()
        for(var result of results){
            cache.set(result._id, result.tickets)
        }
        const random = Math.floor(Math.random() * cache.size)
        const participants = Array.from(cache)
        const winnerID = participants[random][0]

        await wgeSchema.findOneAndUpdate({
            _id: winnerID
        }, {
            tickets: 0,
            time: time,
            theme: theme
        }, {
            upsert: true
        })
        //create new wge from random participant and old theme

        channel.send(`Der vorherige Experte konnte leider nicht rechtzeitig antworten! <@${winnerID}>, Du hast nun 7 Tage Zeit um deine Expertise zum Thema "${theme}" zur Schau zu stellen. Viel Erfolg!`)
    })
    EventEmitter.on('wge_reminder', async (result) => {
        //Remind Current Expert Of Remaining Time
        const guild = client.guilds.cache.get(guildID)
        const channel = guild.channels.cache.get(await getWGEChannelID(guildID))
        function msToTime(duration) {
            var seconds = Math.floor((duration / 1000) % 60),
                minutes = Math.floor((duration / (1000 * 60)) % 60),
                hours = Math.floor((duration / (1000 * 60 * 60)) % 24),
                days = Math.floor((duration / (1000 * 60 * 60 * 24) % 7))

            days = (days < 10) ? "0" + days : days;
            hours = (hours < 10) ? "0" + hours : hours;
            minutes = (minutes < 10) ? "0" + minutes : minutes;
            seconds = (seconds < 10) ? "0" + seconds : seconds;

            return days + "d " + hours + "h " + minutes + "m " + seconds + "s";
        }

        const date = new Date(result.time)

        channel.send(`<@${result._id}>, Du hast noch ${msToTime(date.getTime() - Date.now())} Zeit für dein Thema: [${result.theme}]!`)
    })
}
