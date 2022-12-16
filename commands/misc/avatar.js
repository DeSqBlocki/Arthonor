module.exports = {
    description: 'shows someones avatar',
    expectedArgs: '<user>',
    minArgs: 0,
    category: 'Misc.',
    callback: ({ message, args }) => {
        const { getUserFromMention } = require('../../index')
        const Discord = require('discord.js')
        let user = getUserFromMention(args[0])
        var content
        if (!user) {
            user = message.author
        }
        if (user.id === message.author.id) {
            content = `-Your Avatar-`
        } else {
            content = `-${user.username}'s Avatar-`
        }
        const embed = new Discord.MessageEmbed()
            .setColor(2123412)
            .setAuthor(content)
            .setImage(user.displayAvatarURL({ dynamic: true, size: 256 }))
        return message.channel.send(embed);
    }
}