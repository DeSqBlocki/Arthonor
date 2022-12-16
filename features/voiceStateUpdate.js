const queue = []
const durations = []
const musictitle = []
const thumbnail = []
const ytdl = require('ytdl-core');
const ytpl = require('ytpl');
const { guildID } = require('..');
const { getChannelID } = require('../commands/admin/setafkchannel')
var userCountInChannel = 0
var dispatcher
var loopCheck = false
var songIndex
var playlist
const getPlaylistInfo = async () => { //function for the first user joining the afk channel
    var i = 0
    playlist = await ytpl('PLjSh2s1ASTgsSdjCgFbpo18RAYF_dHf46') //fetches playlist infos from YT
    for (var property in playlist.items) { // goes through every item in playlist.items
        queue[i] = playlist.items[property].shortUrl //saves url at index i
        durations[i] = playlist.items[property].durationSec //saves durations in seconds at index i
        musictitle[i] = playlist.items[property].title //saves title at index i
        thumbnail[i] = playlist.items[property].bestThumbnail.url
        i++
    }
}
getPlaylistInfo()
var lock = false
module.exports = (client) => {
    client.on('voiceStateUpdate', async (oldMember, newMember) => {
        const guild = client.guilds.cache.get(guildID) //caches guild by id
        const voiceChannel = guild.channels.cache.get(getChannelID(guild.id)) //caches voicechannel by id
        const streamOptions = `{ filter: 'audioonly',quality: 'highestaudio', highWaterMark: 1 << 25 }` //iterates streamOptions for Opus
        var connection //iterates playlist for inter-functional use
        const delay = ms => new Promise(res => setTimeout(res, ms)); //function used for await in while loop
        if (userCountInChannel < 0) { //known bug: users inside afk channel were not registered an count towards userCountInChannel-- upon leaving. 
            userCountInChannel = 0 //This fixes the bot to stay!
        }

        //join event
        if (newMember.channelID === voiceChannel.id && oldMember.channelID != newMember.channelID) {
            if (newMember.id === '848610126612398110') {
                return console.log('Bot joined Tartaros!')
            }
            //checks channelID and where the user came from/went to
            userCountInChannel++ // add count to userCount so that the bot plays music as long as at least 1 person is in the channel
            if (userCountInChannel === 1) {
                console.log(userCountInChannel + ` User ist im ${voiceChannel.name}`)
            } else {
                console.log(userCountInChannel + ` User sind im ${voiceChannel.name}`)
            }
            if (!lock) {
                lock = true
                const streaming = async (random) => {
                    const currentdate = new Date() //gets current date
                    const now = `${(currentdate.getHours() < 10 ? '0' : '') + currentdate.getHours()}:${(currentdate.getMinutes() < 10 ? '0' : '') + currentdate.getMinutes()}:${(currentdate.getSeconds() < 10 ? '0' : '') + currentdate.getSeconds()}`
                    //creates current time string
                    const newdate = new Date(currentdate.getTime() + (durations[random] * 1000)) //gets date by adding current date and song duration in ms
                    const then = `${(newdate.getHours() < 10 ? '0' : '') + newdate.getHours()}:${(newdate.getMinutes() < 10 ? '0' : '') + newdate.getMinutes()}:${(newdate.getSeconds() < 10 ? '0' : '') + newdate.getSeconds()}`
                    //creates target time string
                    const stream = ytdl(queue[random], { seek: 0, volume: 0.5 }) //iterates stream from ytdl-core(url, options)
                    dispatcher = await connection.play(stream, streamOptions) //defines StreamDispatcher from .play(stream, streamOptions)
                    console.log('\x1b[32m', `[${now}] - Now Playing: ${musictitle[random]} - ETA: ${durations[random]}s = ${then} [${random + 1}/${queue.length}]\x1b[0m`)//logs [time] - [title] - [duration in s] = [target time] - [songposition/totalsongs]

                    client.user.setActivity(`${musictitle[random]}`, {
                        type: 'PLAYING',
                        url: `${queue[random]}`
                    })
                        .then(presence => console.log(`Activity Set To ${presence.activities[0].name} - ${queue[random]}`))
                        .catch(console.error);

                    dispatcher.on('error', console.error) //error log
                }
                loopCheck = true
                if (userCountInChannel > 0 && loopCheck === true) {
                    await delay(3000)
                    connection = await voiceChannel.join()
                    await voiceChannel.guild.me.edit({ mute: false })
                    while (loopCheck === true) {
                        const random = Math.floor(Math.random() * queue.length)
                        songIndex = random
                        streaming(random)
                        await delay(durations[random] * 1000)
                    }
                }
            }
        }
        //leave event
        if (oldMember.channelID === voiceChannel.id && oldMember.channelID != newMember.channelID) {
            //checks channelID and where the user came from/went to
            userCountInChannel--
            const leaving = async () => {
                if (dispatcher) {
                    await dispatcher.destroy()
                    await delay(3000)
                    await voiceChannel.leave()
                } else {
                    await delay(3000)
                    await voiceChannel.leave()
                }
                client.user.setActivity("Red Dead Depression", {
                    type: "STREAMING",
                    url: "https://www.twitch.tv/desq_blocki",
                })
                    .then(presence => console.log(`Activity Set To ${presence.activities[0].name}`))
                    .catch(console.error);

            }
            if (oldMember.id === '848610126612398110') {
                return console.log('Bot left Tartaros!')
            } else {
                if (userCountInChannel === 1) {
                    console.log(userCountInChannel + ` User ist im ${voiceChannel.name}`)
                } else {
                    console.log(userCountInChannel + ` User sind im ${voiceChannel.name}`)
                }
            }

            if (userCountInChannel <= 1) {
                await leaving()
                loopCheck = false
                lock = false
            }

        }
    })
    client.on('message', (message) => {
        if (!message.content.startsWith(process.env.PREFIX) || message.author.bot) return;
        const args = message.content.slice(process.env.PREFIX.length).split(/ +/);
        //iterate args array by splitting each space into its own entry
        const command = args.shift().toLowerCase();
        const Discord = require('discord.js')

        if (command === 'np' || command === 'nowplaying') {
            if (!dispatcher) {
                return message.channel.send('Could Not Get Playlist Information, Please Make Sure The Bot Played Music At Least Once!')
            } else {

                function msToMinAndS(millis) {
                    var minutes = Math.floor(millis / 60000);
                    var seconds = ((millis % 60000) / 1000).toFixed(0);
                    return (
                        seconds == 60 ?
                            (minutes + 1) + ":00" :
                            minutes + ":" + (seconds < 10 ? "0" : "") + seconds
                    );
                }
                const embed = new Discord.MessageEmbed()
                    .setAuthor(`-Now Playing-`, "https://cdn.discordapp.com/avatars/748205832918925363/014bcb936cf8a88818dc3b73130698ba.webp")
                    .setTitle(musictitle[songIndex], queue[songIndex])
                    .setURL(queue[songIndex])
                    .setDescription(`[${msToMinAndS(dispatcher.streamTime)} / ${msToMinAndS(durations[songIndex] * 1000)}]`)
                    .setColor(0x51267)
                    .setThumbnail(thumbnail[songIndex])
                return message.channel.send(embed)
            }
        }
    })
}