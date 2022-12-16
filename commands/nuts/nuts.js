const nutSchema = require('../../models/nuts-schema')
const nutStatsSchema = require('../../models/nuts-stats-schema')

const cache = new Map()

const loadData = async () => {
    const results = await nutSchema.find()
    for(const result of results){
      cache.set(result._id, result.nuts) 
    }
}
loadData()
module.exports = {
    slash: false,
    cooldown: '3h',
    description: 'deus nuts!',
    maxArgs: 0,
    aliases: ['nut','n'],
    category: 'Nuts',
    callback: async ({ message }) => {
        await loadData()
        var value = Math.floor(Math.random() * 10)
        const user = message.author

        if(!cache.has(user.id)){
            message.channel.send('Deus Nut! Du bekommst eine Bonus Nuss zum ersten Mal. <:DeusNut:829395908067328031>') 
            value++
        }
        await nutSchema.findOneAndUpdate({
            _id: user.id
        },{
            _id: user.id,
            $inc: { nuts: +value }
        }, {
            upsert:true
        })
        await nutStatsSchema.findOneAndUpdate({
            _id: value
        },{
            _id: value,
            $inc: { nutCase: +1 }
        }, {
            upsert:true
        })

        if (value == 1) {
            //Singular
            message.reply('Du hast eine Nuss bekommen! <:chestnut:829906666551902238>')
        } else if (value > 0) {
            //Plural
            message.reply(`Du hast ${value} Nüsse bekommen! <:chestnut:829906666551902238>`)
        } else {
            //Nichts
            message.reply('Du hast keine Nuss bekommen! <:shooketh_yeesh:808577698271199272>')
        }
    }
}