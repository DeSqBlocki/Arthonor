const { getUserFromMention } = require('../..')
const honorsSchema = require('../../models/honors-schema')

const cache = new Map()

const loadData = async () => {
    const results = await honorsSchema.find()
    for (const result of results) {
        cache.set(result._id, result.honors, result.reasons)
    }
}
loadData()
module.exports = {
    description: 'checks someones honor level',
    expectedArgs: '<user>',
    minArgs: 0,
    maxArgs: 1,
    category: 'Honor',
    callback: async ({ message, args }) => {
        var user = getUserFromMention(args[0])
        if (!user) {
            user = message.author
        }

        const results = await honorsSchema.find({ _id: user.id })
        var content
        if (!results.length) {
            content = 'Choose a goddamn side!'
        } else {
            if (results[0].honors === 0) {
                content = 'Choose a goddamn side!'
            } else if (results[0].honors === -20) {
                content = 'They are is at max Dishonor Level! <:lowhonor:748176295132790786> <:lowhonor:748176295132790786> <:lowhonor:748176295132790786>\n```' + `You don't get to live a bad life and have good things happen to you. - Arthur M.` + '```'
            } else if (results[0].honors === 20) {
                content = 'They are at max Honor Level! <:highhonor:748176295535443968> <:highhonor:748176295535443968> <:highhonor:748176295535443968>'
            } else if (results[0].honors > 0) {
                content = 'real good, boah, REAL GOOD! <:highhonor:748176295535443968>'
            } else if (results[0].honors < 0) {
                content = 'What happened to Loyalty?! <:lowhonor:748176295132790786>'
            }
        }
        return message.channel.send(`${user.username} received **${!results.length ? 0 : results[0].honors}** Honors in total!`)
            .then(message.channel.send(content))
        //send message of total honor value
    }
}