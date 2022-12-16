const nutSchema = require('../../models/nuts-schema')

const cache = new Map()

const loadData = async () => {
    const results = await nutSchema.find()
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
    description: 'check deez nuts, yo!',
    expectedArgs: '<user>',
    minArgs: 0,
    maxArgs: 1,
    aliases: ['checkn', 'chn'],
    category: 'Nuts',
    callback: async({ message , args}) => {
        await reCache()
        const Discord = require('discord.js')
        const { getUserFromMention } = require('../../index')

        var user = getUserFromMention(args[0])
        if(!user){
            user = message.author
        }
        var nuts = cache.get(user.id)

        var content
        if(!nuts){
            content = `${user} hat noch keine Nüsse gesammelt! >:(`
        } else {
            content = `${user} hat bereits **${nuts}** Nüsse gesammelt! <:surprised_yeesh:808577706073260053>`
        }

        const embed = new Discord.MessageEmbed()
            .setColor(0x51267)
            .setThumbnail(message.author.displayAvatarURL({ dynamic: true, size: 256 }))
            .addFields({name: "Checknuts!", value: content})
        return message.channel.send(embed);
    }
}