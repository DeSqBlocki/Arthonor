const quoteSchema = require('../../models/quote-schema')
const Discord = require('discord.js')

const cache = new Map()

const loadData = async () => {
    const results = await quoteSchema.find()
    for (const result of results) {
        cache.set(result._id, result.user, result.reminder)
    }
}
loadData()
module.exports = {
    description: 'adds a quote to the database by replying to the message',
    category: 'Quotes',
    aliases: ['qadd'],
    requiredPermissions: ['VIEW_AUDIT_LOG'],
    callback: async ({ client, message, args }) => {
        const reference = message.reference
        if (!reference) {
            return message.channel.send('Please Reply To A Message!')
        }
        const guild = client.guilds.cache.get(reference.guildID)
        const channel = guild.channels.cache.get(reference.channelID)
        const ID = reference.messageID
        const fetchMessage = async (MessageID) => {
            return channel.messages.fetch(MessageID)
        }
        const result = await fetchMessage(ID)
        if(!result){
            return message.channel.send('Please use this command in the channel that the quote was sent in!')
        }
        var msgUserID = result.author.id
        var msgCacheID = result.id
        var msgChannelID = result.channel.id
        var msgContent = result.content
        //to be quoted - message
        if (result.reference) {
            var msgReferenceID = result.reference.messageID
            var msgReference = await fetchMessage(msgReferenceID)
            msgContent = `> ${msgReference}\n ${msgContent}`
        }
        //original message, if exists
        try {
            const embed = new Discord.MessageEmbed()
                .setTitle(`-New Quote Added!-`)
                .setColor(0x51267)
                .setThumbnail(message.guild.iconURL())
                .addFields(
                    { name: 'Author:', value: `<@${msgUserID}>` },
                    { name: 'Channel:', value: `<#${msgChannelID}>` },
                    { name: 'Inhalt:', value: msgContent },
                )
                .setFooter(`#${msgCacheID}`)
            message.channel.send(embed)
        } catch (error) {
            return message.channel.send('Could not replicate message! Remember that I cannot save embeds.')
        }

        const res = await quoteSchema.find({ _id: { $in: msgCacheID } })
        if (res.length) {
            return message.channel.send('I already know that one ;)')
        }
        await quoteSchema.findOneAndUpdate({
            _id: msgCacheID
        }, {
            _id: msgCacheID,
            channel: msgChannelID,
            user: msgUserID,
        }, {
            upsert: true
        })
        cache.set(msgCacheID, msgChannelID, msgUserID)
    }
}
