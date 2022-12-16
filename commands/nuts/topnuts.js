const nutSchema = require('../../models/nuts-schema')

const cache = new Map()

const loadData = async () => {
    const results = await nutSchema.find().sort({
        nuts: -1
    })
    for (const result of results) {
        cache.set(result._id, result.nuts)
    }
}
loadData()
const reCache = async() => {
    cache.clear()
    await loadData()
}
module.exports = {
    
    slash: false,
    description: 'browse through the nuts leaderboard',
    expectedArgs: '<page>',
    maxArgs: 1,
    aliases: ['tnuts', 'tn', 'topn'],
    category: 'Nuts',
    callback: async ({ message, args }) => {
        await reCache()
        const Discord = require('discord.js')

        var page = args[0]
        if (!page) {
            page = 1
        }
        for (var j = 0; j < cache.size; j++) {
            if (j % 5 === 0) {
                j++
            }
        }
        var pages = Math.ceil(j / 5)
        var z = Array.from(cache, ([_id, nuts]) => ([`<@${_id}>`, `${nuts} Nuts`]))
        var index = page * 5 - 5
        z = z.slice(index, index + 5)
        for (var zi = 0; zi != z.length; zi++) {
            z[zi] = `${z[zi][0]} : ${z[zi][1]}`
        }
        const embed = new Discord.MessageEmbed()
            .setAuthor(`Nuts Leaderboard!`)
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

