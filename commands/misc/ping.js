module.exports = {
    slash: false,
    category: 'Misc.',
    description: 'A Simple ping pong command!!!',
    callback: ({ message }) => {
        message.channel.send("Pinging...").then(m => {
            var ping = m.createdTimestamp - message.createdTimestamp;
            message.channel.send('Pong! `' + `${ping}` + 'ms!`')
        })
    }
}
