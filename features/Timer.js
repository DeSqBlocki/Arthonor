const { getBotChannelID } = require('../commands/admin/setbotchannel')
const timerSchema = require('../models/timer-schema')
const Discord = require('discord.js')
const MyModule = require('../index')
const EventEmitter = MyModule.event
const guildID = MyModule.guildID

module.exports = async (client) => {
    var TimerTimeOut
    EventEmitter.on('start_timer', async (result) => {
        //should be the main start and restart handler instead of setting it in-command
        const guild = client.guilds.cache.get(guildID)
        const ChannelID = await getBotChannelID(guild.id)
        const Channel = guild.channels.cache.get(ChannelID)
        const now = Date.now()
        if (result._id < now) {
            Channel.send('An Old Timer Was Cleared')
            await timerSchema.deleteOne({
                _id: result.id
            })
            console.log('Old Timer Cleared!')
        } else {
            TimerTimeOut = setTimeout(async () => {
                const user = guild.members.cache.get(result.user)
                const embed = new Discord.MessageEmbed()
                    .setAuthor(`Timer is up!`)
                    .setColor(0x51267)
                    .addFields(
                        { name: `Reminder: `, value: result.reminder }
                    )
                    .setFooter(`Timer of ${user.user.usernam}`)
                    .setThumbnail(guild.iconURL())
                Channel.send(`<@${user.id}>`).then(Channel.send(embed))
                await timerSchema.deleteOne({
                    _id: result.id
                })
            }, result._id - now);
            console.log(`Timer started - ${result._id - now}ms left!`)
        }
        module.exports.TimerTimeOut = TimerTimeOut
    })
    EventEmitter.on('stop_timer', async (timer) => {
        //should clearTimeout(TimerTimeOut)
    })
}