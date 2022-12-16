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
    description: 'get quote by ID',
    expectedArgs: '<ID>',
    minArgs: 1,
    category: 'Quotes',
    aliases: ['qget', 'qg'],
    callback: async ({ client, message, args }) => {
        var ID = args[0]
        if (isNaN(ID)) {
            return message.channel.send('Invalid ID!')
        }

        const results = await quoteSchema.find({
            _id: ID
        })
        if (!results.length) {
            return message.channel.send('ID not found!')
        }


        const guild = message.guild
        const channel = guild.channels.cache.get(results[0].channel)
        const fetchMessage = async (MessageID) => {
            return channel.messages.fetch(MessageID)
        }
        const msgResult = await fetchMessage(results[0]._id)
        var msgContent = msgResult.content
        if(msgResult.reference){
            var msgReferenceID = msgResult.reference.messageID
            var msgReference = await fetchMessage(msgReferenceID)
            msgContent = `> ${msgReference}\n ${msgContent}`
        }

        const embed = new Discord.MessageEmbed()
            .setTitle(`-Your Quote!-`)
            .setColor(0x51267)
            .setThumbnail(message.guild.iconURL())
            .addFields(
                { name: 'Author:', value: `<@${results[0].user}>` },
                { name: 'Channel:', value: `<#${results[0].channel}>` },
                { name: 'Inhalt:', value: msgContent },
            )
            .setFooter(`#${results[0]._id}`)
        if (embed) {
            return message.channel.send(embed)
        } else {
            return message.channel.send('ID not found!')
        }
    }
}