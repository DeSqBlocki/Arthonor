const quoteSchema = require('../../models/quote-schema')

const cache = new Map()

const Discord = require('discord.js')

const loadData = async () => {
    const results = await quoteSchema.find()
    for (const result of results) {
        cache.set(result._id, result.channel, result.user)
    }
}
loadData()
module.exports = {
    description: 'returns a random quote from a user or the whole database',
    expectedArgs: '<user>',
    minArgs: 0,
    category: 'Quotes',
    aliases: ['qrandom', 'qr'],
    callback: async ({ client, message, args }) => {
        const { getUserFromMention } = require('../../index')
        const user = getUserFromMention(args[0])
        const results = await quoteSchema.find()
        const documentCount = await quoteSchema.countDocuments()
        if (!documentCount) {
            return message.channel.send('No Quotes Saved in Database!')
        }
        if (!user) {
            //get random quote from whole database
            var i = 0
            const random = Math.floor(Math.random() * results.length)
            for (const result of results) {
                if (i == random) {
                    const guild = message.guild
                    const channel = guild.channels.cache.get(result.channel)
                    const fetchMessage = async (MessageID) => {
                        return channel.messages.fetch(MessageID)
                    }
                    const msgResult = await fetchMessage(result._id)
                    var msgContent = msgResult.content
                    if (msgResult.reference) {
                        var msgReferenceID = msgResult.reference.messageID
                        var msgReference = await fetchMessage(msgReferenceID)
                        msgContent = `> ${msgReference}\n ${msgContent}`
                    }
                    const embed = new Discord.MessageEmbed()
                        .setTitle(`-Random Quote-`)
                        .setColor(0x51267)
                        .setThumbnail(message.guild.iconURL())
                        .addFields(
                            { name: 'Author:', value: `<@${result.user}>` },
                            { name: 'Channel:', value: `<#${result.channel}>` },
                            { name: 'Inhalt:', value: msgContent },
                        )
                        .setFooter(`#${result._id}`)
                    return message.channel.send(embed)
                }
                i++
            }
        } else {
            const entryCount = await quoteSchema.countDocuments({ user: user.id })
            if (entryCount === 0) {
                return message.channel.send('No Quotes Saved For This User!')
            }
            //get random quote from user 
            var i = 0
            const random = Math.floor(Math.random() * entryCount)
            for (const result of results) {
                if (result.user === user.id) {
                    //counts number of documents with the filter user: user.id
                    if (i == random) {
                        const guild = message.guild
                        const channel = guild.channels.cache.get(result.channel)
                        const fetchMessage = async (MessageID) => {
                            return channel.messages.fetch(MessageID)
                        }
                        const msgResult = await fetchMessage(result._id)
                        var msgContent = msgResult.content
                        if (msgResult.reference) {
                            var msgReferenceID = msgResult.reference.messageID
                            var msgReference = await fetchMessage(msgReferenceID)
                            msgContent = `> ${msgReference}\n ${msgContent}`
                        }

                        const embed = new Discord.MessageEmbed()
                            .setTitle(`-Random Quote-`)
                            .setColor(0x51267)
                            .setThumbnail(message.guild.iconURL())
                            .addFields(
                                { name: 'Author:', value: `<@${result.user}>` },
                                { name: 'Channel:', value: `<#${result.channel}>` },
                                { name: 'Inhalt:', value: msgContent },
                            )
                            .setFooter(`#${result._id}`)
                        return message.channel.send(embed)
                    }
                    i++
                }
            }
        }
    }
}
