module.exports = {
    slash: false,
    description: 'Cry at or for someone :c',
    expectedArgs: '<user>',
    minArgs: 0,
    maxArgs: 1,
    category: 'GIFs',
    callback: ({ message, args }) => {
        const { getUserFromMention } = require('../../index')
        const Discord = require('discord.js')
        const user = getUserFromMention(args[0]);
        //get user from mentions
        var crygifs = [
            'https://media.giphy.com/media/3o6wrvdHFbwBrUFenu/giphy.gif',
            'https://media.giphy.com/media/L95W4wv8nnb9K/giphy.gif',
            'https://media.giphy.com/media/OPU6wzx8JrHna/giphy.gif',
            'https://media.giphy.com/media/26ufcVAp3AiJJsrIs/giphy.gif',
            'https://media.giphy.com/media/j0qSbeNFuzjhXKFVSP/giphy.gif',
            'https://media.giphy.com/media/d2lcHJTG5Tscg/giphy.gif',
            'https://media.giphy.com/media/2WxWfiavndgcM/giphy.gif',
            'https://media.giphy.com/media/KDRv3QggAjyo/giphy.gif',
            'https://media.giphy.com/media/qQdL532ZANbjy/giphy.gif',
            'https://media.giphy.com/media/3fmRTfVIKMRiM/giphy.gif',
            'https://media.giphy.com/media/3ohs4t2IT01ev5F4jK/giphy.gif',
            'https://media.giphy.com/media/3o7qEciAHeStgj1idG/giphy.gif',
            'https://media.giphy.com/media/qscdhWs5o3yb6/giphy.gif',
            'https://media.giphy.com/media/ROF8OQvDmxytW/giphy.gif',
            'https://media.giphy.com/media/P53TSsopKicrm/giphy.gif',
            'https://media.giphy.com/media/3ov9jUBdDA5FFFITOU/giphy.gif',
            'https://media.giphy.com/media/3oz8xtjqF9RCTxnlKg/giphy.gif'
        ];
        //static gif links in array
        const gif = crygifs[Math.floor(Math.random() * crygifs.length)];
        //creates random number for gif index
        var content
        if (!user) {
            return message.reply(`Ich sehe, dass du cry'en willst, aber mit wem denn genau? :c`);
            //returns message if no one was mentioned
        } else if (user.id != message.author.id) {
            content = `<@${message.author.id}> weint mit <@${user.id}>`
            //returns message and sends gif image
        } else {
            content = `<@${user.id}> weint alleine T-T`
        }
        const embed = new Discord.MessageEmbed()
            .setColor(1752220)
            .setTimestamp()
            .setAuthor(`CRY!`)
            .setFooter(`gesendet von ${message.author.username}`)
            .setImage(gif);
        return message.channel.send(content).then(message.channel.send(embed))
    }
}
