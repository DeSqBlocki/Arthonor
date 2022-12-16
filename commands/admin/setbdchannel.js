const bdChannelSchema = require('../../models/bdChannel-schema')

const bdChCache = new Map()

const loadData = async () => {
    const results = await bdChannelSchema.find()

    for(const result of results){
      bdChCache.set(result._id, result.channelID) 
    }
}
loadData()

module.exports = {
    slash: false,
    description: 'sets birthday channel',
    maxArgs: 0,
    requiredPermissions: ['VIEW_AUDIT_LOG'],

    category: 'Admin',
    callback: async ({message}) => {
        message.delete()
        const { guild, channel } = message
        await bdChannelSchema.findOneAndUpdate({
            _id: guild.id
        },{
            _id: guild.id,
            channelID: channel.id
        }, {
            upsert:true
        })
        bdChCache.set(guild.id, channel.id)

        message.reply('Birthday Channel set!')
        .then(message => {
            setTimeout(() => message.delete(), 5000)
        })
    }
}

module.exports.getBDChannelID = (guildID) => {
    return bdChCache.get(guildID)
}
