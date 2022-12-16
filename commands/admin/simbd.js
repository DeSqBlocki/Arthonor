module.exports = {
    slash: false,
    description: 'simulates bd event',
    maxArgs: 1,
    requiredPermissions: ['VIEW_AUDIT_LOG'],
    category: 'Admin',
    callback: ({ message, args, text, client }) => {
        const MyModule = require('../../index')
        const EventEmitter = MyModule.event
        var user = MyModule.getUserFromMention(args[0])
        if(!user){
            user = message.author
        }
        message.delete()
        EventEmitter.emit('a_birthday', user);
    }
}