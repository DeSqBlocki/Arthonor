const nutStatsSchema = require('../../models/nuts-stats-schema')

const cache = new Map()

const loadData = async () => {
    const results = await nutStatsSchema.find().sort({
        _id: 1
    })
    for (const result of results) {
        cache.set(result._id, result.nutCase)
    }
}
loadData()
const reCache = async() => {
    cache.clear()
    await loadData()
}
module.exports = {
    slash: false,
    description: 'check the current statistic of all nuts',
    maxArgs: 0,
    aliases: ['nstats', 'nstats', 'ns'],
    category: 'Nuts',
    callback: async({ message }) => {
        await reCache()
        const Discord = require('discord.js')

        var z = Array.from(cache, ([_id, nutCase]) => ([_id, nutCase]))

        var totalNuts = 0
        var totalCount = 0
        for(var i = 0; i < z.length;i++){
            totalNuts += z[i][1] * z[i][0]
            totalCount += z[i][1]
        }
        var nutAvg = totalNuts / totalCount

        const embed = new Discord.MessageEmbed()
            .setTitle("-Nut Statistic-")
            .setDescription(`Total Nut Actions: **${totalCount}** | Total Nuts nutted: **${totalNuts}** | Nut Average: **${nutAvg.toFixed(3)}**`)
            .addFields(
                { name: '[0]', value: `x${z[0][1]}`, inline: true },
                { name: '[1]', value: `x${z[1][1]}`, inline: true },
                { name: '[2]', value: `x${z[2][1]}`, inline: true },
                { name: '[3]', value: `x${z[3][1]}`, inline: true },
                { name: '[4]', value: `x${z[4][1]}`, inline: true },
                { name: '[5]', value: `x${z[5][1]}`, inline: true },
                { name: '[6]', value: `x${z[6][1]}`, inline: true },
                { name: '[7]', value: `x${z[7][1]}`, inline: true },
                { name: '[8]', value: `x${z[8][1]}`, inline: true },
                { name: '[9]', value: `x${z[9][1]}`, inline: true }
            )
            .setColor(0x51267)
            .setTimestamp()
            .setThumbnail(message.guild.iconURL())
            .setFooter("please notify my creator for further help")
        return message.channel.send(embed);
    }
}