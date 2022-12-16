const timerSchema = require('../../models/timer-schema')

const cache = new Map()

const loadData = async () => {
    const results = await timerSchema.find()
    for (const result of results) {
        cache.set(result._id, result.user, result.reminder)
    }
}
const reCache = async () => {
    cache.clear()
    await loadData()
}
loadData()
module.exports = {
    description: 'lists all your current timers',
    maxArgs: 0,
    category: 'Timer',
    aliases: ['tl','tlist'],
    callback: async ({ message }) => {
        await reCache()
        const ms = require('ms')
        const Discord = require('discord.js')
        const user = message.author
        var timers = []
        var t = 0
        function msToTime(duration) {
            var seconds = Math.floor((duration / 1000) % 60),
              minutes = Math.floor((duration / (1000 * 60)) % 60),
              hours = Math.floor((duration / (1000 * 60 * 60)) % 24),
    
            hours = (hours < 10) ? "0" + hours : hours;
            minutes = (minutes < 10) ? "0" + minutes : minutes;
            seconds = (seconds < 10) ? "0" + seconds : seconds;
    
    
            return hours + "h " + minutes + "m " + seconds + "s";
          }
        const getData = async () => {
            loadData()
            const viterator = cache.values()
            const kiterator = cache.keys()

            for (var i = 0; i < cache.size; i++) {
                var temp = kiterator.next().value
                if (viterator.next().value == user.id) {
                    if (temp > Date.now()){
                        timers[t] = `○ ${msToTime(temp - Date.now())}   [${t}]`
                        t++
                    }
                    
                }
            }
        }
        getData()
        if(!timers.length){
            return message.channel.send(`No active timer set!`)
        }
        const embed = new Discord.MessageEmbed()
            .setAuthor(`-Active Timers-`)
            .setThumbnail(message.guild.iconURL())
            .setColor(0x51267)
            .addFields({ name: 'time remaining:', value: timers, inline: true })
            .setFooter(`Timers of ${user.username}`)
        message.channel.send(embed)
    }
}