module.exports = {
    slash: false,
    description: 'shows you the current hit of Tartaros',
    aliases: ['np'],
    maxArgs: 0,
    category: 'Misc.',
    callback: ({ message }) => {
        return
        //actual command is in voiceStateUpdate.js because I cannot get it to work otherwise
    }
}