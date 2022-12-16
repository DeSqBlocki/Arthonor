module.exports = {
    slash: false,
    description: 'calls your trusty friend :3',
    maxArgs: 0,
    category: 'Admin',
    requiredPermissions: ['VIEW_AUDIT_LOG'],
    callback: ({ message }) => {
        const Discord = require('discord.js')
        const attachment = new Discord.MessageAttachment('./assets/doggo.jpg', 'doggo.jpg');
        //creates attachement from local doggo image
        message.channel.send({
            embed: {
                files: [
                    attachment
                ],
                image: {
                    url: 'attachment://doggo.jpg'
                }
            }
        });
        //creates embed from doggo image
        var petText = [
            '*loving growl*',
            'Danke, das habe ich gebraucht.',
            'Ein bisschen tiefer.',
            'Ja, genau dort!'
        ]
        //creates array with potential messages
        let myPetText = petText[Math.floor(Math.random() * petText.length)]
        //chooses random index
        return message.channel.send(myPetText);
        //sends random message
    }
}