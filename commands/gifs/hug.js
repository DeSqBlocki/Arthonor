module.exports = {
    slash: false,
    description: 'Hug Someone really... fcking...HARD?!',
    expectedArgs: '<user>',
    minArgs: 0,
    maxArgs: 1,
    category: 'GIFs',
    callback: ({ message, args }) => {
        const { getUserFromMention } = require('../../index')
        const Discord = require('discord.js')
        const user = getUserFromMention(args[0]);
        //get user from mentions
        var huggifs = [
            'https://media.giphy.com/media/xT39CXg70nNS0MFNLy/giphy.gif',
            'https://media.giphy.com/media/3o6Zt4vkcksbhanNzW/giphy.gif',
            'https://media.giphy.com/media/yidUzriaAGJbsxt58k/giphy.gif',
            'https://media.giphy.com/media/U4LhzzpfTP7NZ4UlmH/giphy.gif',
            'https://media.giphy.com/media/3oEdv4hwWTzBhWvaU0/giphy.gif',
            'https://media.giphy.com/media/3M4NpbLCTxBqU/giphy.gif',
            'https://media.giphy.com/media/ZBQhoZC0nqknSviPqT/giphy.gif',
            'https://media.giphy.com/media/EvYHHSntaIl5m/giphy.gif',
            'https://media.giphy.com/media/3oEhnaf39dUjrk2Ag0/giphy.gif',
            'https://media.giphy.com/media/2GnS81AihShS8/giphy.gif',
            'https://media.giphy.com/media/13YrHUvPzUUmkM/giphy.gif',
            'https://media.giphy.com/media/3o6Zth3OnNv6qDGQ9y/giphy.gif',
            'https://media.giphy.com/media/jGRHaDpv4Y4mRU5hkF/giphy.gif',
            'https://media.giphy.com/media/ijoPIfKO0YQlW/giphy.gif',
            'https://media.giphy.com/media/52dOyY6pGuv1S/giphy.gif',
            'https://media.giphy.com/media/Vur30c2hOsnFm/giphy.gif',
            'https://media.giphy.com/media/wecXIPnE28m2c/giphy.gif',
            'https://media.giphy.com/media/o4m0lVqF2cuNa/giphy.gif',
            'https://media.giphy.com/media/1434tCcpb5B7EI/giphy.gif',
            'https://media.giphy.com/media/adTDFaG92ulxu/giphy.gif'
        ];
        //static gif links in array
        const gif = huggifs[Math.floor(Math.random() * huggifs.length)];
        //creates random number for gif index
        var content
        if (!user) {
            return message.reply(`Ich sehe, dass du jemanden hug'en willst, aber wen denn genau? :c`);
            //returns message if no one was mentioned
        } else if (user.id != message.author.id) {
            content = `<@${message.author.id}> gibt einen big hug an <@${user.id}>`

            //returns message and sends gif image
        } else {
            content = `<@${user.id}> hug'ed sich selbst ;}`
        }
        const embed = new Discord.MessageEmbed()
            .setColor(10181046)
            .setTimestamp()
            .setAuthor(`HUG!`)
            .setFooter(`gesendet von ${message.author.username}`)
            .setImage(gif);
        return message.channel.send(content).then(message.channel.send(embed))
    }
}