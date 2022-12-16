module.exports = {
    slash: false,
    description: 'Slap someone, simple as that :D',
    expectedArgs: '<user>',
    minArgs: 0,
    maxArgs: 1,
    category: 'GIFs',
    callback: ({ message, args }) => {
        const { getUserFromMention } = require('../../index')
        const Discord = require('discord.js')
        const user = getUserFromMention(args[0]);
    //get user from mentions
    var slapgifs = [
      'https://media.giphy.com/media/xUNd9HZq1itMkiK652/giphy.gif',
      'https://media.giphy.com/media/xUO4t2gkWBxDi/giphy.gif',
      'https://media.giphy.com/media/m6etefcEsTANa/giphy.gif',
      'https://media.giphy.com/media/Gf3AUz3eBNbTW/giphy.gif',
      'https://media.giphy.com/media/9U5J7JpaYBr68/giphy.gif',
      'https://media.giphy.com/media/RrLbvyvatbi36/giphy.gif',
      'https://media.giphy.com/media/VTVkjiRwO4LgA/giphy.gif',
      'https://media.giphy.com/media/10DRaO76k9sgHC/giphy.gif',
      'https://media.giphy.com/media/j3iGKfXRKlLqw/giphy.gif',
      'https://media.giphy.com/media/4Nphcg0CCOfba/giphy.gif',
      'https://media.giphy.com/media/LD8TdEcyuJxu0/giphy.gif',
      'https://media.giphy.com/media/uqSU9IEYEKAbS/giphy.gif',
      'https://media.giphy.com/media/1zgOyLCRxCmV5G3GFZ/giphy.gif',
      'https://media.giphy.com/media/jt38YxwGTevEkFWWoY/giphy.gif',
      'https://media.giphy.com/media/s5zXKfeXaa6ZO/giphy.gif',
      'https://media.giphy.com/media/3ohfFOrOAW9GaczHc4/giphy.gif',
      'https://media.giphy.com/media/vi2ciYHi5u0FO/giphy.gif',
      'https://media.giphy.com/media/Qs0I2VdbIqNkk/giphy.gif',
      'https://media.giphy.com/media/WLXO8OZmq0JK8/giphy.gif',
      'https://media.giphy.com/media/UCyuDunJK0l6U/giphy.gif',
      'https://media.giphy.com/media/kTBjwh6IWbLPy/giphy.gif'
    ];
    //static gif links in array
    const gif = slapgifs[Math.floor(Math.random() * slapgifs.length)];
    //creates random number for gif index
    var content
    if (!user) {
      return message.reply(`Ich sehe, dass du slap'en willst, aber wen denn genau? :c`);
      //returns message if no one was mentioned
    } else if (user.id != message.author.id) {
      content = `<@${message.author.id}> slap'ed <@${user.id}>`
    } else {
      content = `<@${user.id}> slap'ed sich selbst 0-0`
    }
    const embed = new Discord.MessageEmbed()
      .setColor(10038562)
      .setTimestamp()
      .setAuthor(`SLAP!`)
      .setFooter(`gesendet von ${message.author.username}`)
      .setImage(gif);
    return message.channel.send(content).then(message.channel.send(embed))
    }
}