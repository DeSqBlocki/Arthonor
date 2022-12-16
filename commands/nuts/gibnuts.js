const nutSchema = require('../../models/nuts-schema')

const cache = new Map()

const loadData = async () => {
    const results = await nutSchema.find()
    for (const result of results) {
        cache.set(result._id, result.nuts)
    }
}
loadData()
module.exports = {
    slash: false,
    description: 'Gib nuts!',
    expectedArgs: '<user> <amount>',
    minArgs: 2,
    aliases: ['gn', 'gibn'],
    category: 'Nuts',
    callback: async ({ message, args }) => {
        await loadData()
        const { getUserFromMention } = require('../../index')
        const Discord = require('discord.js')

        const user = getUserFromMention(args[0])
        const author = message.author
        if (user.id === author.id) {
            return message.channel.send('Du kannst dir nicht selber Nuts geben!')
        }
        const transfer = parseInt(args[1])
        if (transfer < 0) {
            const result = await nutSchema.find({_id: author.id})
            return message.channel.send(`Versuchst du gerade Nuts zu klauen? >:( \nDas gibt **${result[0].nuts}** Nuts Abzug!`)
        }

        if (!cache.has(author.id) || cache.get(author.id) < transfer) {
            return message.channel.send('Du hast nicht genug Nuts!')
        }
        if (!cache.has(user.id)) {
            return message.channel.send('Ich kenne diese Person leider nicht :(')
        }
        await nutSchema.findOneAndUpdate({
            _id: author.id
        }, {
            _id: author.id,
            $inc: { nuts: -transfer }
        }, {
            upsert: true
        })
        await nutSchema.findOneAndUpdate({
            _id: user.id
        }, {
            _id: user.id,
            $inc: { nuts: +transfer }
        }, {
            upsert: true
        })
        var nvalue = cache.get(author.id) - transfer
        cache.set(author.id, nvalue)
        //update cache
        var nvalue = cache.get(user.id) + transfer
        cache.set(user.id, nvalue)
        //update cache
        content = `<@${author.id}> hat <@${user.id}> **${transfer}** Nuts gesendet     <:chestnut:829906666551902238>➕➕`
        const embed = new Discord.MessageEmbed()
            .setColor(0x51267)
            .setThumbnail(message.author.displayAvatarURL({ dynamic: true, size: 256 }))
            .addFields({ name: "Transfer Complete!", value: content })
        return message.channel.send(embed);
    }
}
