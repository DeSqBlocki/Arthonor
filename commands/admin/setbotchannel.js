const botChannelSchema = require('../../models/botChannel-schema')

const cache = new Map()

const loadData = async () => {
    const results = await botChannelSchema.find()

    for(const result of results){
      cache.set(result._id, result.channelID) 
    }
}
loadData()

module.exports = {
    slash: false,
    description: 'sets bot channel',
    maxArgs: 0,
    requiredPermissions: ['VIEW_AUDIT_LOG'],

    category: 'Admin',
    callback: async ({message}) => {
        message.delete()
        const { guild, channel } = message
        await botChannelSchema.findOneAndUpdate({
            _id: guild.id
        },{
            _id: guild.id,
            channelID: channel.id
        }, {
            upsert:true
        })
        cache.set(guild.id, channel.id)

        message.reply('Bot Channel set!')
        .then(message => {
            setTimeout(() => message.delete(), 5000)
        })
    }
}
module.exports.getBotChannelID = (guildID) => {
    return cache.get(guildID)
}
