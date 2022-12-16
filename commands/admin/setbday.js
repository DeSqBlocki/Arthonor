const birthdaySchema = require('../../models/birthday-schema')

const BDcache = new Map()

const loadData = async () => {
    const results = await birthdaySchema.find()
    for(const result of results){
      BDcache.set(result._id, result.userid, result.birthday) 
    }
}
loadData()
module.exports = {
    slash: false,
    description: 'Test Command Please Ignore',
    minArgs: 1,
    maxArgs: 2,
    expectedArgs: '<user> <DD.MM.>',
    category: 'Admin',
    requiredPermissions: ['VIEW_AUDIT_LOG'],
    callback: async ({ message, args }) => {
        const { getUserFromMention } = require('../../index')
        var user = getUserFromMention(args[0])
        var bday = args[1]
        if(!user){
            user = message.author
            bday = args[0]
        }
        await birthdaySchema.findOneAndUpdate({
            _id: user.id
        },{
            _id: user.id,
            birthday: bday
        }, {
            upsert:true
        })
        BDcache.set(user.id, bday)

        message.delete()
        message.channel.send('Birthday set!')
        .then(message => {
            setTimeout(() => message.delete(), 5000)
        })
    }
}