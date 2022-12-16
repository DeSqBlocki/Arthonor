module.exports = async (client) => {
    const MyModule = require('../index')
    const EventEmitter = MyModule.event
    const guildID = MyModule.guildID
    const { getBotChannelID } = require('../commands/admin/setbotchannel')


    EventEmitter.on('cold_weather', async (result) => {
        const guild = client.guilds.cache.get(guildID)
        const ChannelID = await getBotChannelID(guild.id)
        const Channel = guild.channels.cache.get(ChannelID)
        //Channel.send(`**ALARM!** es werden heute ${result[0].forecast[1].high}°C !\nICH FRIER MIR MEINEN KÜNSTLICHEN ARSCH AB`)
    })

    EventEmitter.on('hot_weather', async (result) => {
        const guild = client.guilds.cache.get(guildID)
        const ChannelID = await getBotChannelID(guild.id)
        const Channel = guild.channels.cache.get(ChannelID)
        //Channel.send(`**ALARM!** es werden heute ${result[0].forecast[1].high}°C !\nWEHE MEINE EIS SCHMILZT`)
    })

    EventEmitter.on('good_weather', async (result) => {
      	const guild = client.guilds.cache.get(guildID)
	const channel = guild.channels.cache.get(await getBotChannelID(guildID))
        //channel.send(`Heute werden es nur ${result[0].forecast[1].high}°C !\nDas kann man sich geben :D`)
    })
}
