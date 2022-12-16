module.exports = {
    slash: false,
    description: 'shows you an image of an emoji',
    minArgs: 1,
    category: 'Misc.',
    expectedArgs: '<:EmojiName:EmojiID>',
    callback: async ({ message, args }) => {
        const Discord = require('discord.js')
        const getEmoji = async (emoji) => {
            //emojis are built like this: <:NAME:ID>
            var e = emoji
                .join()
                .split(':')
            //Create Array seperated by ':'
            //expected output: '<', 'NAME', 'ID>'
            var output = {}
            output.name = e[1]
            //NAME therefore is at INDEX 1
            
            output.id = e[2].slice(0, e[2].length - 1)
            //ID therefore is at INDEX 2, plus '>', so slice the last bit off
            if(e[0] === '<a'){
                output.url = `https://cdn.discordapp.com/emojis/${output.id}.gif?v=1`
            } else {
                output.url = `https://cdn.discordapp.com/emojis/${output.id}.png?v=1`
            }
            //if it's animated, add .gif to the end, otherwise add .png to the end
            return output
            //return object
        }
        try {
            var Emoji = await getEmoji(args)
        } catch (error) {
            return message.channel.send('Invalid ID used!')
        }
        if(!Emoji.id){
            return message.channel.send('Could not get Emoji ID!')
        }
        //try to catch any false or invalid IDs
        const embed = new Discord.MessageEmbed()
            .setColor('#0ca0e1')
            .setTitle(`This is '${Emoji.name}' !`)
            .setURL(Emoji.url)
            .setImage(Emoji.url)
            .setFooter(`ID: ${Emoji.id}`)
        return message.channel.send(embed)
        //send embedded emoji
    }
}