const wgeSchema = require("../../models/wge-schema")

module.exports = {
    description: 'abruptly halts the current wge until a manual restart!',
    category: 'WGE',
    callback: async ({ message, args }) => {
        await wgeSchema.updateMany([
            { $unset: ["time", "theme"] }
        ])
        return message.channel.send('WGE Has Been Stopped! Please Start A New WGE Whenever You Want To Continue :D')
    }
}