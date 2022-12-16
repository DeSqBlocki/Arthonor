const Discord = require('discord.js')
const wgeSchema = require('../../models/wge-schema')

const cache = new Map()

const loadData = async () => {
    const results = await wgeSchema.find()
    for (const result of results) {
        cache.set(result._id, result.tickets)
    }
}
const clearCache = async () => {
    cache.clear()
}
loadData()
module.exports = {
    description: 'get list of all wge participants',
    category: 'WGE',
    callback: async ({ message }) => {
        await clearCache() //clears old cache
        await loadData() //reastablishes cache

        const list = Array.from(cache, ([_id, tickets]) => ([`<@${_id}> [${tickets}]`]))
        
        if(!list.length){
            return message.channel.send('No Participants Yet!')
        }

        const embed = new Discord.MessageEmbed()
            .setAuthor(`Worlds Greatest Expert!`)
            .setColor(0x51267)
            .setThumbnail(message.guild.iconURL())
            .addFields(
                { name: `Aktive Teilnehmer:`, value: list },
            )
        return message.channel.send(embed);
    }
}