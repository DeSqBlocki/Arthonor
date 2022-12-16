const Discord = require('discord.js')
const { getUserFromMention } = require('../..')
const honorsSchema = require('../../models/honors-schema')

const cache = new Map()

const loadData = async () => {
    const results = await honorsSchema.find().sort({
        honors: -1
    })
    for (const result of results) {
        cache.set(result._id, result.honors)
    }
}
loadData()

module.exports = {
    description: 'browse the honor leaderboard with specific page index',
    expectedArgs: '<page>',
    minArgs: 0,
    maxArgs: 1,
    category: 'Honor',
    callback: async ({ message, args }) => {
        await loadData()
        var page = args[0]
        if(!page){
            page = 1
        }
        for (var j = 0; j < cache.size; j++) {
            if (j % 5 === 0) {
                j++
            }
        }
        var pages = Math.ceil(j / 5)
        if(isNaN(page) || page > pages){
            return message.channel.send('Invalid Page Index!')
        }
        var z = Array.from(cache, ([_id, honors]) => ([`<@${_id}>`, `${honors} Honors`]))
        var index = page * 5 - 5
        z = z.slice(index, index + 5)
        for (var zi = 0; zi != z.length; zi++) {
            z[zi] = `${z[zi][0]} : ${z[zi][1]}`
        }
        const embed = new Discord.MessageEmbed()
            .setAuthor(`Honor Leaderboard!`)
            .setColor(0x51267)
            .setThumbnail(message.guild.iconURL())
            .addFields(
                {
                    name: `Seite ${page}/${pages}`,
                    value: z,
                    inline: false
                },
            )
        return message.channel.send(embed);
    }
}
