const { getUserFromMention } = require("../..")
const wgeSchema = require("../../models/wge-schema")

module.exports = {
    description: 'shows your current tickets and random chance',
    expectedArgs: '<user>',
    minArgs: 0,
    maxArgs: 1,
    category: 'WGE',
    callback: async ({ message, args }) => {
        var user = getUserFromMention(args[0])
        if (!user) {
            user = message.author
        }
        const results = await wgeSchema.find()
        var tickets
        var totaltickets

        for (var result of results) {
            if (result._id === user.id) { tickets = result.tickets }
            totaltickets = totaltickets ? totaltickets + result.tickets : result.tickets
        }
        if (!results.length) {
            return message.channel.send('You Are Not In The Database Yet!')
        }
        if (user.id === message.author.id) {
            return message.channel.send(`You Have **${tickets}** ${tickets  === 1 ? `Ticket`:`Tickets`}`)
            .then(message.channel.send(`Your Chance is Approximatly ${Math.round((tickets / totaltickets) * 100)}%`))
        } else {
            return message.channel.send(`${user.username} Has **${tickets}** ${tickets  === 1 ? `Ticket`:`Tickets`}`)
            .then(message.channel.send(`${user.username} Has A Chance Of Approximatly ${Math.round((tickets / totaltickets) * 100)}%`))
        }
    }
}