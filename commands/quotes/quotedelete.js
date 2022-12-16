const quoteSchema = require('../../models/quote-schema')

const cache = new Map()

const loadData = async () => {
    const results = await quoteSchema.find()
    for (const result of results) {
        cache.set(result._id, result.channel, result.user)
    }
}
loadData()
module.exports = {
    description: 'removes a quote from the database',
    expectedArgs: '<ID>',
    minArgs: 1,
    maxArgs: 1,
    category: 'Quotes',
    aliases: ['qdel', 'qdelete'],
    requiredPermissions: ['VIEW_AUDIT_LOG'],
    callback: async ({ client, message, args }) => {
        const ID = args[0]
        if(isNaN(ID)){
            return message.channel.send('Invalid ID!')
        }
        if(await quoteSchema.countDocuments({_id: ID})){
            return message.channel.send('This Quote Is Not In My Database!')
        }
        await quoteSchema.deleteOne({
            _id: ID
        })
        return message.channel.send('Quote Successfully Deleted!')
    }
}