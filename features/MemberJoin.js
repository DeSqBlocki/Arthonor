const Canvas = require('canvas')
const Discord = require('discord.js')
const path = require('path')
const { getChannelID } = require('../commands/admin/setwelcome')
module.exports = (client) => {
  client.on('guildMemberAdd', async (member) => {
    console.log(member.user.username + ' joined')
    const { guild } = member
    const channelID = getChannelID(guild.id)
    if (!channelID) {
      return console.log('no channel set')
    }
    const channel = guild.channels.cache.get(channelID)
    if (!channel) {
      return console.log('no channel cached')
    }
    member.roles.add('983384874134147163')
    const canvas = Canvas.createCanvas(700, 250)
    const ctx = canvas.getContext('2d')
    const background = await Canvas.loadImage(
      path.join(__dirname, '../background.png')
    )
    let x = 0
    let y = 0
    ctx.drawImage(background, x, y)

    const pfp = await Canvas.loadImage(
      member.user.displayAvatarURL({
        format: 'png',
        size: 64,
      })
    )

    x = canvas.width / 2 - pfp.width / 2
    y = 25
    ctx.drawImage(pfp, x, y)

    // const gradiant = ctx.createRadialGradient(75, 50, 5, 90, 60, 100)
    // gradiant.addColorStop(0, "gold")
    // gradiant.addColorStop(1, "brown")
    // ctx.fillStyle = gradiant
    // ctx.fillRect(10, 10, 150, 80);

    ctx.fillStyle = '#ffffff'
    ctx.strokeStyle = '#000000'
    ctx.font = '35px sans-serif'
    let text = `Willkommen, ${member.user.username}!`
    x = canvas.width / 2 - ctx.measureText(text).width / 2
    ctx.fillText(text, x, 60 + pfp.height)
    ctx.strokeText(text, x, 60 + pfp.height)

    ctx.font = '30px sans-serif'
    text = `auf dem ✨Olymp✨`
    x = canvas.width / 2 - ctx.measureText(text).width / 2
    ctx.fillText(text, x, 100 + pfp.height)
    ctx.strokeText(text, x, 100 + pfp.height)

    const attachement = new Discord.MessageAttachment(canvas.toBuffer())
    channel.send(`<@${member.user.id}> Bitte guck einmal in die <#455023824791011338>`, attachement)
  });
}
