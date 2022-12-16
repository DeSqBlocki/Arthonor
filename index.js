const DiscordJS = require('discord.js')
const mongoose = require('mongoose')
const WOKCommands = require('wokcommands')
const events = require('events')
const { getChannelID } = require('./commands/admin/setafkchannel')
const wgeSchema = require('./models/wge-schema')
const EventEmitter = new events.EventEmitter()
require('dotenv').config()

const client = new DiscordJS.Client({ intents: ["GUILDS", "GUILD_MESSAGES","GUILD_MEMBERS"], partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER'] })
const bdayroleID = '702877228857557002'
const guildID = '353902391021535242'

client.on('ready', async () => {
    console.log('Starting Bot. . .\r\n');
    const wok = new WOKCommands(client, {
	commandsDir: 'commands',
	featuresDir: 'features',
	messagesPath: 'messages.json',
	defaultLanguage: 'english'
})
        .setDefaultPrefix(process.env.ARTHONOR_PREFIX)
        .setBotOwner('140508899064283136')
        .setDisplayName('Arthonor')
        .setColor('0xff0000')
        .setCategorySettings([
            {
                name: 'Nuts',
                emoji: '🌰'
            },
            {
                name: 'Quotes',
                emoji: '💭'
            },
            {
                name: 'Admin',
                emoji: '🛑',
                hidden: true,
            },
            {
                name: 'WGE',
                emoji: '✨'
            },
            {
                name: 'Honor',
                emoji: '<:highhonor:748176295535443968>'
            },
            {
                name: 'Timer',
                emoji: '⏰'
            },
            {
                name: 'GIFs',
                emoji: '🖼️'
            },
            {
                name: 'Misc.',
                emoji: '🗑️'
            },
            {
                name: 'Development',
                emoji: '🚀'
            }


        ])
        .setMongoPath(process.env.ARTHONOR_MONGO_URL)
    wok.on('databaseConnected', async (connection, state) => {
        console.log(`\nMongoDB Status: ${state}\n`)
        const guild = client.guilds.cache.get(guildID)
        const delay = ms => new Promise(res => setTimeout(res, ms));
	console.log("\nWaiting for Features. . . ")
	await delay(3000)
	console.log("Done!")
	console.clear()

        const checkBirthday = async () => {
            const birthdaySchema = require('./models/birthday-schema')
            const currentdate = new Date();
            const bdaydate = `${(currentdate.getDate() < 10 ? '0' : '') + currentdate.getDate()}.${((currentdate.getMonth() + 1) < 10 ? '0' : '') + (currentdate.getMonth() + 1)}.`
            var bdcheck = false

            const results = await birthdaySchema.find()
            for (const result of results) {
                if (result.birthday === bdaydate) {
                    EventEmitter.emit('a_birthday', result)
                    bdcheck = true
                } else {
                    EventEmitter.emit('not_a_Birthday', result)
                }
            }

            if (bdcheck == true) {
                console.log(`\nHeute ist ein Geburtstag! ${bdaydate}\n`)
            } else {
                console.log(`\nHeute ist kein Geburtstag! ${bdaydate}\n`)
            }
        }
        checkBirthday()
        //function triggers birthday event handler

        const restartTimer = async () => {
            const timerSchema = require('./models/timer-schema')
            const results = await timerSchema.find()
            for (const result of results) {
                if (result) {
                    EventEmitter.emit('restart_timer', result)
                }
            }
        }
        restartTimer()
        // function triggers timer restart event handler

        const checkTemperatur = async () => {
            const weatherJS = require('weather-js')

            await weatherJS.find({
                search: 'Wendeburg, Germany',
                degreeType: 'C'
            }, function (error, result) {
                if (error) {
                    return console.log(error)
                }
                if (result === undefined || result.length === 0) {
                    return console.log(`Couldn't find location!`)
                }
                const weekday = new Date().toString().slice(0, 3)
                for (var i = 0; i < result[0].forecast.length; i++) {
                    if (result[0].forecast[i].shortday === weekday) {
                        if (result[0].forecast[1].high > 25) {
                            EventEmitter.emit('hot_weather', result)
                        } else if (result[0].forecast[1].high < 10) {
                            EventEmitter.emit('cold_weather', result)
                        } else {
                            EventEmitter.emit('good_weather', result)
                        }
                    }
                }
            })
        }
        checkTemperatur()
        //function triggers weather check event handler

        const restartWGETimer = async () => {
            const results = await wgeSchema.find()
            const check = await wgeSchema.find({ time: { $exists: true } })
            if (check.length) {
                //found wge time, therefore it is running
                for (var result of results) {
                    if (result.time) {
                        //time was found, check remaining time
                        const then = new Date(result.time)
                        const now = new Date()
                        if (now.getTime() + 86400000 > then.getTime()) {
                            //if wge finishes withing 24h, trigger wge_end event
                            EventEmitter.emit('wge_reminder', result)
                            wgeTimeOut = setTimeout(() => {
                                //emit wge_end event
                                EventEmitter.emit('wge_end', result)
                            }, then.getTime() - now.getTime());
                        }
                        //else, do nothing
                    }
                    //no time found, skip
                }
                //check all entries for active wge
            } else {
                //field "time" was not found, therefore wge is not running, restart
                EventEmitter.emit('wge_start')
            }


        }
        restartWGETimer()


    })

    client.user.setActivity("Red Dead Depression", {
        type: "STREAMING",
        url: "https://www.twitch.tv/desq_blocki",
    });
})

exports.event = EventEmitter
exports.guildID = guildID
exports.bdroleID = bdayroleID

exports.getUserFromMention = (mention) => {
    //creates function for mentions
    if (!mention) return;

    if (mention.startsWith('<@') && mention.endsWith('>')) {
        mention = mention.slice(2, -1);

        if (mention.startsWith('!') || mention.startsWith('&')) {
            mention = mention.slice(1);
        }
        return client.users.cache.get(mention);
        //returns valid user infos
    }
}
client.login(process.env.ARTHONOR_TOKEN)

