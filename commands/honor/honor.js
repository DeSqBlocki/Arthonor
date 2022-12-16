const { getUserFromMention } = require('../..')
const honorsSchema = require('../../models/honors-schema')
module.exports = {
    description: 'honor someone for their noble deeds',
    expectedArgs: '<user> <reason>',
    minArgs: 2,
    category: 'Honor',
    requiredPermissions: ['VIEW_AUDIT_LOG'],
    callback: async ({ message, args }) => {
        const user = getUserFromMention(args[0])
        if (!user) {
            return message.channel.send('Invalid User!')
        }
        var reason = args.join(' ').slice(args[0].length)
        reason = reason.trimStart()
        reason = "[+] " + reason

        const highExtreme = await honorsSchema.find({ honors: { $gte: 20 } })
        if (highExtreme.length) {
            for (var i = 0; i < highExtreme.length; i++) {
                if (highExtreme[i]._id === user.id) {
                    return message.channel.send(`<@${message.author.id}> tried to honor <@${user.id}>, but they are at Max Honor Level! <:highhonor:748176295535443968> <:highhonor:748176295535443968> <:highhonor:748176295535443968>`)
                }

            }
        }
        await honorsSchema.findOneAndUpdate(
            {
                _id: user.id
            },
            {
                _id: user.id,
                $inc: { honors: +1 },
                $push: { reasons: reason }
            },
            {
                upsert: true
            })
            const hcheck = await honorsSchema.find({ _id: user.id })
            if (hcheck[0].honors === 20) {
                return message.channel.send(`<@${message.author.id}> has honored <@${user.id}> <:highhonor:748176295535443968>`)
                    .then(message.channel.send(`<@${user.id}> You Have Reached Max Honor Level! <:highhonor:748176295535443968> <:highhonor:748176295535443968> <:highhonor:748176295535443968>`))
            } else {
                return message.channel.send(`<@${message.author.id}> has honored <@${user.id}> <:highhonor:748176295535443968>`)
            }
    }
}
