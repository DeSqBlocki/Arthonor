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
    description: 'deletes feedback / bugreports in inbox',
    minArgs: 1,
    category: 'Admin',
    requiredPermissions: ['VIEW_AUDIT_LOG'],
    callback: async ({ message, args }) => {
        await reCache()
        const Discord = require('discord.js')
        const index = args[0]
        if(isNaN(index)){
            return message.channel.send('Invalid Index ID!')
        }
        
        if(!cache.size){
            return message.channel.send('No Messages To Delete!')
        }
        const iterator = cache.keys()
        for(var i = 0; i < cache.size; i++){
            var temp = iterator.next().value
            if(i == index){
                await feedbackSchema.deleteOne({
                    _id: temp
                })
                cache.delete(temp)
            }
        }
        message.delete()
        return message.channel.send(`Feedback / Report Deleted!`).then(message => {
            setTimeout(() => message.delete(), 5000)
        })
    }
}