module.exports = {
    slash: false,
    description: 'simulates join event',
    maxArgs: 0,
    requiredPermissions: ['VIEW_AUDIT_LOG'],
    category: 'Admin',
    callback: ({ message, args, text, client }) => {
        message.delete()
        client.emit('guildMemberAdd', message.member);
    }
}