const timerSchema = require('../../models/timer-schema')

const cache = new Map()

const loadData = async () => {
    const results = await timerSchema.find()
    for (const result of results) {
        cache.set(result._id, result.user, result.reminder)
    }
}
loadData()
var timerTimeOut
module.exports = {
    description: 'sets a timer',
    expectedArgs: '<HH:MM:SS> <reminder>',
    aliases: ['settimer', 'tset', 'ts'],
    minArgs: 1,

    category: 'Timer',
    callback: async ({ message, args }) => {
        const ms = require('ms')
        const Discord = require('discord.js')
        const user = message.author
        var time = args[0]
        var reminder = args.join(' ').slice(args[0].length)
        var hours, minutes, seconds, mstime
        time = time.split(':')
        const createTime = () => {
            switch (time.length) {
                case 3:
                    hours = time[0]
                    minutes = time[1]
                    seconds = time[2]
                    mstime = (hours * 60 * 60 * 1000) + (minutes * 60 * 1000) + (seconds * 1000)
                    break;
                case 2:
                    minutes = time[0]
                    seconds = time[1]
                    mstime = (minutes * 60 * 1000) + (seconds * 1000)
                    break;
                case 1:
                    seconds = time[0]
                    mstime = (seconds * 1000)
                    break;
                default:
                    return message.reply('I cannot comprehend this time variable!')
            }
        }
        createTime()
        try {
            var test = ms(mstime)
        } catch (error) {
            return message.channel.send('Please use time properly!')
        }
        const funfact = [
            `The average woman uses her height in lipstick every 5 years`,
            `An average person's yearly fast food intake contains 12 pubic hairs`,
            `Ithyphallophobia is the fear of erections`,
            `The tapir has the longest penis to body ratio of any animal`,
            `A duck and a rooster were the first passengers in a hot air balloon`,
            `Arab women can't can initiate a divorce if their husbands don't pour coffee for them`,
            `Upon losing battles apes will tend to masturbate`,
            `Most lipstick contains fish scales`,
            `In Japan it is perfectly acceptable to name your child "buttocks" or "prostitute"`,
            `In France it is legal to marry a dead person`,
            `It's against the law to have a pet dog in Iceland`,
            `A group of 12 or more cows is called a "flink"`,
            `The 57 on Heinz Ketchup Bottles represents the variety of pickle the company once had`,
            `You can tell the sex of a horse by it's teeth, most males have 40 whereas females have 36`,
            `In 1386 a pig in France was executed by public hanging for the murder of a child`,
            `Sloths take two weeks to digest their food`,
            `Slugs have four noses`,
            `Los Angeles' full name is El Pueblo de Nuestra Señora la Reina de la Los Angeles de Porciúncula`,
            `The skeleton of Jeremy Bentham is present at all important meetings at the University of London`,
            `It is physically impossible for pigs to look up into the sky`,
            `Catfish are the only animals to have an odd number of whiskers`,
            `The French language has 17 different words for surrender`,
            `Birds don't urinate`
        ]

        const rdmfunfact = Math.floor(Math.random() * funfact.length)
        if (!reminder) {
            const rdmReminder = [
                `Dein Timer von ~${ms(mstime)} ist um. Erinnere mich nochmal, woran ich dich erinnern sollte...`,
                `Dein Timer von ~${ms(mstime)} ist um! Fun Fact des Tages: "${funfact[rdmfunfact]}"`,
                `Dein Timer von ~${ms(mstime)} ist um!`
            ]
            const rdm = Math.floor(Math.random() * rdmReminder.length)
            reminder = rdmReminder[rdm]
        }

        const now = new Date()
        const then = new Date(now.getTime() + mstime)
        const desttime = `**${(then.getHours() < 10 ? '0' : '') + then.getHours()}:${(then.getMinutes() < 10 ? '0' : '') + then.getMinutes()}:${(then.getSeconds() < 10 ? '0' : '') + then.getSeconds()}**`
        const embed = new Discord.MessageEmbed()
            .setAuthor(`${ms(mstime)} Timer set!`)
            .setColor(0x51267)
            .addFields(
                { name: `Will remind you at:`, value: desttime },
                { name: `Reminder: `, value: "```" + "Hidden. . ." + "```" }
            )
            .setFooter(`Timer of ${user.username}`)
            .setThumbnail(message.guild.iconURL())
        message.delete()
        message.channel.send(embed).then(message => {
            setTimeout(() => message.delete(), mstime)
        })

        await timerSchema.findOneAndUpdate({
            _id: then.getTime()
        }, {
            _id: then.getTime(),
            user: user.id,
            reminder: reminder
        }, {
            upsert: true
        })
        cache.set(then.getTime(), user.id, reminder)

        timerTimeOut = setTimeout(async () => {
            await loadData()
            if (cache.has(then.getTime())) {
                const embed = new Discord.MessageEmbed()
                    .setAuthor(`Timer is up!`)
                    .setColor(0x51267)
                    .addFields(
                        { name: `Reminder: `, value: reminder }
                    )
                    .setFooter(`Timer of ${user.username}`)
                    .setThumbnail(message.guild.iconURL())

                message.channel.send(`<@${user.id}>`).then(message.channel.send(embed))
                await timerSchema.deleteOne({
                    _id: then.getTime()
                })
            }
        }, mstime);
    }
}
module.exports.timerTimeOut = timerTimeOut