const { getUserFromMention } = require('../..')
const honorsSchema = require('../../models/honors-schema')
module.exports = {
    description: 'dishonor someone for their evil deeds',
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
        reason = "[-] " + reason

        const lowExtreme = await honorsSchema.find({ honors: { $lte: -20 } }) //eigentlich wichtig fuer dishonor!
        const documentCount = await honorsSchema.countDocuments()
        if (lowExtreme.length) {
            for (var i = 0; i < lowExtreme.length; i++) {
                if (lowExtreme[i]._id === user.id) {
                    return message.channel.send(`<@${message.author.id}> tried to dishonor <@${user.id}>, but they are at Max Dishonor Level! <:lowhonor:748176295132790786><:lowhonor:748176295132790786><:lowhonor:748176295132790786>`)
                        .then(message.channel.send("You don't get to live a bad life and have good things happen to you."))
                }
            }
        }
        await honorsSchema.findOneAndUpdate(
            {
                _id: user.id
            },
            {
                _id: user.id,
                $inc: { honors: -1 },
                $push: { reasons: reason }
            },
            {
                upsert: true
            })
        const hcheck = await honorsSchema.find({ _id: user.id })
        if (hcheck[0].honors === -20) {
            return message.channel.send(`<@${message.author.id}> has dishonored <@${user.id}> <:lowhonor:748176295132790786>`)
                .then(message.channel.send(`<@${user.id}> You Have Reached Max Dishonor Level! <:lowhonor:748176295132790786> <:lowhonor:748176295132790786> <:lowhonor:748176295132790786>`))
                .then(message.channel.send("You don't get to live a bad life and have good things happen to you."))
        } else {
            return message.channel.send(`<@${message.author.id}> has dishonored <@${user.id}> <:lowhonor:748176295132790786>`)

        }

    }
}
