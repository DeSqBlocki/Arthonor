const feedbackSchema = require('../../models/feedback-schema')

const cache = new Map()

const loadData = async () => {
    const results = await feedbackSchema.find()

    for(const result of results){
      cache.set(result._id, result.feedback, result.user) 
    }
}
loadData()
const reCache = async () => {
    cache.clear()
    await loadData()
}
module.exports = {
    slash: false,
    description: 'shows feedback / bugreports inbox',
    maxArgs: 0,
    category: 'Admin',
    requiredPermissions: ['VIEW_AUDIT_LOG'],
    callback: async ({ message }) => {
        await reCache()
        const Discord = require('discord.js')
        
        if(!cache.size){
            return message.channel.send('No Messages For You!')
        }
        var content = []
        const iterator = cache.values()
        for(var i = 0; i < cache.size; i++){
            var temp = iterator.next().value
            content[i] = `○ [${i}]: ${temp} `
        }

        const embed = new Discord.MessageEmbed()
            .setTitle(`-Feedback Inbox-`)
            .setColor(0x51267)
            .setThumbnail(message.guild.iconURL())
            .addFields({ name: 'Feedback:', value: content, inline: true });
        return message.channel.send(embed);
    }
}
