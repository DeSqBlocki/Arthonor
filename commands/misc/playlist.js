module.exports = {
    slash: false,
    category: 'Misc.',
    description: 'get tartaros playlist',
    callback: ({ message }) => {
        return message.channel.send('https://www.youtube.com/playlist?list=PLjSh2s1ASTgsSdjCgFbpo18RAYF_dHf46')
    }
}
