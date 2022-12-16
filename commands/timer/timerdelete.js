// const timerSchema = require('../../models/timer-schema')

// const cache = new Map()

// const loadData = async () => {
//     const results = await timerSchema.find()
//     for (const result of results) {
//         cache.set(result._id, result.user, result.reminder)
//     }
// }
// const reCache = async () => {
//     cache.clear()
//     await loadData()
// }
// loadData()
// module.exports = {
//     description: 'deletes a current timer',
//     expectedArgs: '<index>',
//     minArgs: 1,
//     category: 'Timer',
//     aliases: ['timerdel', 'tdel', 'tdelete', 'td'],
//     callback: async ({ message, args }) => {
//         const MyModule = require('../../index')
//         const EventEmitter = MyModule.event
//         await reCache()

//         const user = message.author
//         const index = args[0]
//         if (!index || isNaN(index)) {
//             return message.channel.send('Invalid Index Used!')
//         }
//         const results = await timerSchema.find({ user: user.id })
//         if (!results.length) {
//             return message.channel.send('No active timer set!')
//         }
//         var i = 0
//         for (var result of results) {
//             if (i === index) {
//                 await timerSchema.deleteOne({ _id: result._id })
//                 EventEmitter.emit('stop_timer', result)
//             }
//             i++
//         }
//         return message.channel.send('Timer was deleted!')
        
//     }
// }