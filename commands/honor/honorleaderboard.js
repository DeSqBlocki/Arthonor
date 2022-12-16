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
    description: 'shows you the honor leaderboard',
    expectedArgs: '',
    aliases: ['hlb', 'honorlb','hleaderboard'],
    minArgs: 0,
    maxArgs: 1,
    category: 'Honor',
    callback: async ({ message, args }) => {
        await loadData()

        var user = getUserFromMention(args[0])
        if (!user) {
            user = message.author
        }
        for (var j = 0; j < cache.size; j++) {
            if (j % 5 === 0) {
                j++
            }
        }

        var pages = Math.ceil(j / 5)
        var z = Array.from(cache, ([_id, honors]) => ([`<@${_id}>`, `${honors} Honors`]))
        for (var i = 0; i != z.length; i++) {
            if (z[i][0] === `<@${user.id}>`) {
                var uid = i
            }
        }
        var page = Math.floor(uid / 5 + 1)
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
            .setFooter(`User found: *${user.username}*`)
        return message.channel.send(embed);
    }
}