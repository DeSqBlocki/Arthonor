module.exports = (client) => {
    client.on('guildMemberRemove', (member) => {
        console.log(member.user.username + ' left');
      });
}