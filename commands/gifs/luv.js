module.exports = {
    slash: false,
    description: 'Somebody to love~',
    expectedArgs: '<user>',
    minArgs: 0,
    maxArgs: 1,
    category: 'GIFs',
    callback: ({ message, args}) => {
        const { getUserFromMention } = require('../../index')
        const Discord = require('discord.js')
        const user = getUserFromMention(args[0]);
    //get user from mentions
    var luvgifs = [
      "https://media.giphy.com/media/M90mJvfWfd5mbUuULX/giphy.gif",
      "https://media.giphy.com/media/hVle3v01CScLyGRe0i/giphy.gif",
      "https://media.giphy.com/media/hVle3v01CScLyGRe0i/giphy.gif",
      "https://media.giphy.com/media/eiRpSPB8OSGVcbkOIJ/giphy.gif",
      "https://media.giphy.com/media/ifB1v1W3Db0GIW7uTA/giphy.gif",
      "https://media.giphy.com/media/yc2pHdAoxVOrJ2m5Ha/giphy.gif",
      "https://media.giphy.com/media/Tia2InBEWaQgckP3UG/giphy.gif",
      "https://media.giphy.com/media/l41JWw65TcBGjPpRK/giphy.gif",
      "https://media.giphy.com/media/M8o1MOwcwsWOmueqN4/giphy.gif",
      "https://media.giphy.com/media/L4UOYLu2quhaRqrTDI/giphy.gif",
      "https://media.giphy.com/media/4N1wOi78ZGzSB6H7vK/giphy.gif",
      "https://media.giphy.com/media/RkbLjHIVtiJYyHnHvB/giphy.gif",
      "https://media.giphy.com/media/l4pTdcifPZLpDjL1e/giphy.gif",
      "https://media.giphy.com/media/WOrZJR85BBDyhahWsX/giphy.gif",
    ];
    //static gif links in array
    const gif = luvgifs[Math.floor(Math.random() * luvgifs.length)];
    var content
    //creates random number for gif index
    if (!user) {
      return message.channel.send('Ich sehe, dass du Liebe vergeben willst, aber wen willst du den lieb haben?')
      //returns message if no one was mentioned
    } else if (user.id != message.author.id) {
      content = `<@${message.author.id}> gibt luv an <@${user.id}>`
      //returns message and sends gif image
    } else {
      content = `<@${user.id}> luv'ed sich selbst ;3`
    }
    const embed = new Discord.MessageEmbed()
      .setColor(15277667)
      .setTimestamp()
      .setAuthor(`LUV!`)
      .setFooter(`gesendet von ${message.author.username}`)
      .setImage(gif);
    return message.channel.send(content).then(message.channel.send(embed))
    }
}