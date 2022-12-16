const afkChannelSchema = require('../../models/afkChannel-schema')

const cache = new Map()

const loadData = async () => {
    const results = await afkChannelSchema.find()

    for(const result of results){
      cache.set(result._id, result.channelID) 
    }
}
loadData()

module.exports = {
    slash: false,
    description: 'sets afk channel',
    maxArgs: 0,
    requiredPermissions: ['VIEW_AUDIT_LOG'],

    category: 'Admin',
    callback: async ({message}) => {
        if(!message.member.voice.channel){
            return message.reply('you are not in a voice channel!')
        }
        // console.log(message.member.voice.channel.id)
        message.delete()
        const { guild, channel } = message
        await afkChannelSchema.findOneAndUpdate({
            _id: guild.id
        },{
            _id: guild.id,
            channelID: message.member.voice.channel.id
        }, {
            upsert:true
        })
        cache.set(guild.id, channel.id)

        message.reply('AFK Channel set!')
        .then(message => {
            setTimeout(() => message.delete(), 5000)
        })
    }
}
module.exports.getChannelID = (guildID) => {
    return cache.get(guildID)
}
