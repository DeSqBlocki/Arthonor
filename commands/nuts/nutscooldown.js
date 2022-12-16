const ms = require("ms")
const { getUserFromMention } = require("../..")
const cooldownSchema = require('../../node_modules/wokcommands/dist/models/cooldown')

module.exports = {
    slash: false,
    description: 'shows current nuts cooldown',
    expectedArgs: '<user>',
    minArgs: 0,
    aliases: ['ncd', 'nutcd', 'ncooldown'],
    category: 'Nuts',
    callback: async ({ message, args }) => {
        var user = getUserFromMention(args[0])
        if (!user) {
            user = message.author
        }
        const id = `nuts-${message.guild.id}-${user.id}`
        const result = await cooldownSchema.find({ _id: id })
        function msToTime(duration) {
            var seconds = Math.floor((duration / 1000) % 60),
                minutes = Math.floor((duration / (1000 * 60)) % 60),
                hours = Math.floor((duration / (1000 * 60 * 60)) % 24),

                hours = (hours < 10) ? "0" + hours : hours;
            minutes = (minutes < 10) ? "0" + minutes : minutes;
            seconds = (seconds < 10) ? "0" + seconds : seconds;


            return hours + "h " + minutes + "m " + seconds + "s";
        }
	if(!result.length){
		return message.channel.send("Nuts Available!")
    	} else {
		let time = await msToTime(Math.round(result[0].cooldown / 3)* 1000)
		return message.channel.send(`~${time}`)
	}
    }
}
