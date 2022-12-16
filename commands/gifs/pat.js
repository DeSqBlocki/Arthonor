module.exports = {
    slash: false,
    description: 'Head Pat Someone! :33',
    expectedArgs: '<user>',
    minArgs: 0,
    maxArgs: 1,
    category: 'GIFs',
    callback: ({ message, args }) => {
        const { getUserFromMention } = require('../../index')
        const Discord = require('discord.js')
        const user = getUserFromMention(args[0]);
    //get user from mentions
    var petgifs = [
      'https://media.giphy.com/media/SQHZfImZYdz8AwUCMr/giphy.gif',
      'https://media.giphy.com/media/TA6Fq1irTioFO/giphy.gif',
      'https://media1.tenor.com/images/4f897d8b392005401a05b4b50576ecaa/tenor.gif?itemid=16037974',
      'https://media.giphy.com/media/3o7TKvargxFJiHyf6M/giphy.gif',
      'https://media.giphy.com/media/QxqqwXQuSWufNazWWU/giphy.gif',
      'https://media.giphy.com/media/Gx2vpQi2WPToc/giphy.gif',
      'https://media.giphy.com/media/ASsGSJEh0a63u/giphy.gif',
      'https://media.giphy.com/media/WaEDmi1vk4vFm/giphy.gif',
      'https://media.giphy.com/media/ARSp9T7wwxNcs/giphy.gif',
      'https://media.giphy.com/media/5tmRHwTlHAA9WkVxTU/giphy.gif',
      'https://media.giphy.com/media/lOaf0LBA2mluwm8cY8/giphy.gif',
      'https://media.giphy.com/media/l1LbUHrJb7GpuOHK0/giphy.gif',
      'https://media.giphy.com/media/3oFzmm13V0h44D61bi/giphy.gif',
      'https://media.giphy.com/media/M3a51DMeWvYUo/giphy.gif',
      'https://media.giphy.com/media/e7xQm1dtF9Zni/giphy.gif',
      'https://media.giphy.com/media/Lp6T9KxDEgsWA/giphy.gif',

    ];
    //static gif links in array
    const gif = petgifs[Math.floor(Math.random() * petgifs.length)];
    //creates random number for gif index
    var content
    if (!user) {
      return message.reply(`Ich sehe, dass du jemanden pat'en willst, aber wen denn genau? :c`);
      //returns message if no one was mentioned
    } else if (user.id != message.author.id) {
      content = `<@${message.author.id}> pat'ed an <@${user.id}>`
      //returns message and sends gif image
    } else {
      content = `<@${user.id}> pat'ed sich selbst @.@`
    }
    const embed = new Discord.MessageEmbed()
      .setColor(7419530)
      .setTimestamp()
      .setAuthor(`PAT!`)
      .setFooter(`gesendet von ${message.author.username}`)
      .setImage(gif);
    return message.channel.send(content).then(message.channel.send(embed))
    }
}