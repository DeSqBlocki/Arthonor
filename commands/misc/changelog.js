module.exports = {
    description: 'look at the latest changelogs',
    minArgs: 1,
    expectedArgs: '<version, latest, all, or list>',
    category: 'Misc.',
    aliases: ['changelogs'],
    callback: ({ client, message, args }) => {
        const Discord = require('discord.js')
        const fs = require('fs')
        const changelog = fs.readFileSync('changelog.md', 'utf8')
        //iterate sources

        const splitLog = changelog.split('## v') //divided changelog into version logs
        var versions = splitLog.slice(1, splitLog.length) //removed Changelog Title at the start
        for (var i = 0; i != versions.length; i++) {
            versions[i] = versions[i].split(' - ')[0]
            //get each version number and store them
        }
        const version = args.join(' ')
        //get user input with spaces

        if (version) {
            var content
            var index = 1
            const sendEmbed = (content) => {
                const embed = new Discord.MessageEmbed()
                    .setColor(0x51267)
                    .setDescription(content)
                    .setThumbnail(message.guild.iconURL())
                    .setFooter(`latest version: ${process.env.VERSION}`, client.user.displayAvatarURL())
                    .setTimestamp()
                message.channel.send(embed)
            }
            if (version === 'list') {
                content = versions
                //returns list of all versions
            } else if (version === 'all') {
                for (;index < version.length; index++) {
                    content = "```md\n" + "## v" + splitLog[index] + "```"
                    sendEmbed(content)
                }
            } else if (version === 'latest') {
                index = versions.indexOf(process.env.VERSION) + 1
                content = "```md\n" + "## v" + splitLog[index] + "```"
                //returns changelog of dynamic latest version
            } else if (versions.includes(version)) {
                index = versions.indexOf(version) + 1
                content = "```md\n" + "## v" + splitLog[index] + "```"
                //returns specific versions changelog
            } else {
                return message.channel.send('Invalid Version!')
            }
            return sendEmbed(content)
        }
    }
}