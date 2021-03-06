const Discord = require('discord.js');
const config = require('./config.json');
const client = new Discord.Client({ partials: ['MESSAGE', 'REACTION'] });
const prefix = '$';

const fs = require('fs');
const { waitForDebugger } = require('inspector');
const { exit } = require('process');
const { Console } = require('console');
const { isNull } = require('util');
const userData = JSON.parse(fs.readFileSync('Storage/userData.json', 'utf8'));
const birthdays = JSON.parse(fs.readFileSync('Storage/birthdays.json', 'utf8'));
const wgelist = JSON.parse(fs.readFileSync('Storage/wge.json', 'utf8'))
const nutCooldown = new Set();
const ms = require('ms')


client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);

  client.commands.set(command.name, command);
}

client.on('ready', () => {
  console.log('Starting Bot. . .\r\n');
  client.user.setActivity("Red Dead Depression", {
    type: "STREAMING",
    url: "https://www.twitch.tv/desq_blocki",
  });
  nutCooldown.clear();
  var currentdate = new Date();
  var bdaycheck = currentdate.getDate() + '.' + (currentdate.getMonth() + 1) + '.';
  var key, count = 0;
  for (key in birthdays.geburtstage) {
    count++;
  };
  var i = 0;
  var chek = 0;
  var bdid = 0;
  do {
    if (birthdays.geburtstage[i].bday === bdaycheck) {
      chek = 1;
      bdid = i;
    }
    i++;
  } while (i != count);
  if (chek == 1) {
    console.log('Heute ist ein Geburtstag! ' + bdaycheck);
    // const guild = client.guilds.cache.get("353902391021535242");
    // const role = guild.roles.cache.get('400722216028733444');
    // const bduser = birthdays.geburtstage[bdid].id
    // const member = guild.members.fetch(`${bduser}`)
    //   .then(console.log)
    //   .catch(console.error);
    const channel = client.channels.cache.find(channel => channel.name === 'hermeskammer')
    channel.send(`<@${birthdays.geburtstage[bdid].id}> hat heute Geburtstag`);
  } else {
    console.log('Heute ist kein Geburtstag! ' + bdaycheck);
  }
  console.log(`Es ist ${(currentdate.getHours() < 10 ? '0' : '') + currentdate.getHours()}:${(currentdate.getMinutes() < 10 ? '0' : '') + currentdate.getMinutes()}:${(currentdate.getSeconds() < 10 ? '0' : '') + currentdate.getSeconds()}`)
  //BDAYCHECKER
  i = 0
  var uid = 0
  while (i != userData.Honor.length) {
    if (!userData.Honor[i].time) {
    } else {
      uid = i
      var dtarr = userData.Honor[uid].time
      var d = dtarr.split(",")
      var f = 0

      while (f != d.length) {
        if (d[f] < currentdate.getTime()) {
          console.log(d[f] + ' was deleted from ' + userData.Honor[uid].id)
          d.splice(f, 1)
        } else {
          console.log(`Timer with ${d[f] - currentdate.getTime()} ms remaining was restarted for ${userData.Honor[uid].id}`)
          setTimeout(() => {
            const channel = client.channels.cache.find(channel => channel.name === 'schmiede-der-bots')
            channel.send(`<@${userData.Honor[uid].id}> Dein Timer ist abgelaufen!`)
            console.log(d[f] + ' was deleted from ' + userData.Honor[uid].id)
            d.splice(f, 1)
          }, d[f] - currentdate.getTime());
          f++
        }

      }
      userData.Honor[uid].time = d.join(",")
      fs.writeFile('Storage/userData.json', JSON.stringify(userData), (err) => {
        if (err) console.error(err)
      });
    }


    i++
  }
  var i2 = 0
  while (i2 != wgelist.teilnahme.length) {
    if (!wgelist.teilnahme[i2].time) {
    } else {
      console.log(`WGE Thema:${wgelist.teilnahme[i2].theme} restarted! ${wgelist.teilnahme[i2].time - currentdate.getTime()}ms remaining`)
      setTimeout(() => {
        message.channel.send(`<${wgelist.teilnahme[i2].id}>, deine Zeit ist um!`)
        delete wgelist.teilnahme[i2].time
        fs.writeFile('Storage/wge.json', JSON.stringify(wgelist), (err) => {
          if (err) console.error(err)
        });
      }, wgelist.teilnahme[i2].time - currentdate.getTime());
    }
    i2++
  }


  console.log('');
  console.log('HonorCounter is ready!');
  //Confirms if ready

});
//CLIENT ON/OFF

client.on('guildMemberAdd', member => {
  const channel = client.channels.cache.find(channel => channel.name === 'hermeskammer')
  channel.send('Willkommen auf dem Olymp, <@' + member.user + '>! Bitte werf einen Blick auf <#455023824791011338>')
  console.log(member.user.username + ' joined');
  member.roles.add('400722216028733444')

});

client.on('guildMemberRemove', guildMemberRemove => {
  console.log(guildMemberRemove.user.username + ' left');
});
client.on('message', message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();
  function getUserFromMention(mention) {
    if (!mention) return;

    if (mention.startsWith('<@') && mention.endsWith('>')) {
      mention = mention.slice(2, -1);

      if (mention.startsWith('!')) {
        mention = mention.slice(1);
      }

      return client.users.cache.get(mention);
    }
  }
  if (command == 'wgetest') {
    console.log(wgelist.teilnahme[0].time)
    delete wgelist.teilnahme[0].time
    fs.writeFile('Storage/wge.json', JSON.stringify(wgelist), (err) => {
      if (err) console.error(err)
    });
  }
  //COMMAND: WGE
  if (command === 'wge') {
    var user = getUserFromMention(args[0])
    if (!user || !args[1]) {
      return message.channel.send('Bitte gib einen Nutzer und ein Thema an!')
    }
    var theme = args.join(' ').slice(args[0].length)
    theme = theme.trimStart()

    var uid = 0
    var i = 0
    var search = 0

    while (search != wgelist.teilnahme.length) {
      if (wgelist.teilnahme[search].time) {
        delete wgelist.teilnahme[search].time
        delete wgelist.teilnahme[search].theme
        fs.writeFile('Storage/wge.json', JSON.stringify(wgelist), (err) => {
          if (err) console.error(err)
        });
      }
      search++
    }
    while (i != wgelist.teilnahme.length) {
      if (wgelist.teilnahme[i].id === user.id) {
        check = 1
        uid = i
      }
      i++
    }

    if (!wgelist.teilnahme[uid]) {
      return message.channel.send(`${user} ist noch nicht in der Teilnehmerliste!`)
    } else if (wgelist.teilnahme[uid].yn === "n") {
      message.channel.send(`${user} nimmt nicht an WGE teil! Bitte w??hle eine andere Person`)
    } else if (wgelist.teilnahme[uid].yn === "y") {
      message.channel.send(`${user}, du wurdest ausgew??hlt! Du hast nun 7 Tage Zeit, um deine Expertise zum Thema "${theme}" zur Schau zu stellen`)


      var time = new Date()
      wgelist.teilnahme[uid].time = time.getTime() + 604800000
      wgelist.teilnahme[uid].theme = theme
      fs.writeFile('Storage/wge.json', JSON.stringify(wgelist), (err) => {
        if (err) console.error(err)
      });
    }
  }
  //COMMAND: WGEADD
  if (command === 'wgeadd') {
    var user = getUserFromMention(args[0])
    if (!user) {
      user = message.author
    }
    var uid = 0
    var i = 0
    var check = 0

    while (i != wgelist.teilnahme.length) {
      if (wgelist.teilnahme[i].id === user.id) {
        check = 1
        uid = i
      }
      i++
    }
    if (check == 0) {
      const input = {
        id: user.id,
        yn: 'y',
      }
      wgelist.teilnahme.push(input)
      message.channel.send(`${user} ist jetzt in der Teilnehmerliste und **nimmt** teil`)
      fs.writeFile('Storage/wge.json', JSON.stringify(wgelist), (err) => {
        if (err) console.error(err)
      });
    } else {
      if (wgelist.teilnahme[uid].yn === "y") {
        message.channel.send(`${user} ist bereits in der Teilnehmerliste als **nimmt** teil eingetragen`)
      } else {
        message.channel.send(`${user} **nimmt** jetzt teil`)
        wgelist.teilnahme[uid].yn = "y"
        fs.writeFile('Storage/wge.json', JSON.stringify(wgelist), (err) => {
          if (err) console.error(err)
        });
      }
    }
    console.log(`${user} wurde zur WGE Teilnehmerliste hinzugef??gt`)
  }
  //COMMAND: WGEREMOVE
  if (command === 'wgeremove') {
    var user = getUserFromMention(args[0])
    if (!user) {
      user = message.author
    }
    var uid = 0
    var i = 0
    var check = 0

    while (i != wgelist.teilnahme.length) {
      if (wgelist.teilnahme[i].id === user.id) {
        check = 1
        uid = i
      }
      i++
    }
    if (check == 0) {
      const input = {
        id: user.id,
        yn: 'n',
      }
      wgelist.teilnahme.push(input)
      console.log(input)
      message.channel.send(`${user} ist jetzt in der Teilnehmerliste und **nimmt nicht** teil`)
      fs.writeFile('Storage/wge.json', JSON.stringify(wgelist), (err) => {
        if (err) console.error(err)
      });
    } else {
      if (wgelist.teilnahme[uid].yn === "n") {
        message.channel.send(`${user} ist bereits in der Teilnehmerliste als **nimmt nicht** teil eingetragen`)
      } else {
        message.channel.send(`${user} **nimmt nicht** mehr teil`)
        wgelist.teilnahme[uid].yn = "n"
        fs.writeFile('Storage/wge.json', JSON.stringify(wgelist), (err) => {
          if (err) console.error(err)
        });
      }
    }
    console.log(`${user} wurde von der WGE Teilnehmerliste entfernt`)
  }
  //COMMAND: UPDATEPROFILES
  if (command === 'pfupdate') {
    if (message.author.id == '140508899064283136') {
      var a = 0;
      var profarr = []
      var counter = 0
      var backup = JSON.parse(fs.readFileSync('Storage/userData.json'))
      fs.open('Storage/userData.json', 'w', (err) => {
        if (err) console.error(err)
      })
      fs.writeFileSync('Storage/userData.json.bak', JSON.stringify(backup), (err) => {
        if (err) console.error(err)
      });
      console.log('Backup created!')

      while (a != userData.Honor.length) {
        //create new entries
        if (!userData.Honor[a].honors) {
          userData.Honor[a].honors = 0
          counter++
        }
        if (!userData.Honor[a].nuts) {
          userData.Honor[a].nuts = 0
          counter++
        }
        if (!userData.Honor[a].reason) {
          userData.Honor[a].reason = ""
          counter++
        }
        if (!userData.Honor[a].time) {
          userData.Honor[a].time = 0
          counter++
        }
        a++;
      }
      fs.writeFile('Storage/userData.json', JSON.stringify(userData), (err) => {
        if (err) console.error(err)
      });

      var profarr = []
      profarr[0] = 'New Profile Structure:'
      profarr[1] = '{"id":"<id>","honors":<honors>,"nuts":<nuts>,"reason":<reason>,"time":<time>}'
      profarr[2] = ''
      profarr[3] = `**${counter}** Entries in **${a}** Total Profiles Have Been Updated`

      const profembed = new Discord.MessageEmbed()
        .setColor(0x51267)
        .addFields({ name: 'Updating All Profiles . . .', value: profarr, inline: true });
      message.channel.send(profembed);
    } else {
      message.channel.send('You do not have the required permissions to use this command')
    }
  }
  //COMMAND: NUTSLB
  if (command === 'nutslb') {
    var i = 0;
    var sorter = [];
    var element

    while (i != userData.Honor.length) {
      element = userData.Honor[i].nuts
      sorter.push(element);
      sorter.sort(function (a, b) {
        return b - a;
      });
      i++;
    }
    var i = 0;
    var a = 0;
    var z = [];

    while (i < 5) {
      //Top 5 Werte
      while (a != userData.Honor.length) {
        if (!userData.Honor[a].nuts) {
          userData.Honor[a].nuts = 0
          fs.writeFile('Storage/userData.json', JSON.stringify(userData), (err) => {
            if (err) console.error(err)
          });
        }
        //DB durchsuchen
        if (userData.Honor[a].nuts === sorter[i]) {
          //ID merken, erstmal in console
          if (!z.includes(`<@${userData.Honor[a].id}> : ${userData.Honor[a].nuts} Nuts`, 0)) {
            //Duplicates suchen
            z[i] = `<@${userData.Honor[a].id}> : ${userData.Honor[a].nuts} Nuts`;
          }
        }
        a++;
      }
      a = 0;
      i++;
    }
    const embed = new Discord.MessageEmbed()
      .setAuthor(`Nuts Leaderboard!`)
      .setColor(0x51267)
      .addFields({ name: 'Top 5:', value: z, inline: true });
    message.channel.send(embed);
  }
  //COMMAND: activetimer
  if (command === 'activetimer') {
    var newUser = message.author
    var currentdate = new Date()

    var uid = 0
    var i = 0

    do {
      if (userData.Honor[i].id === newUser.id) {
        check = 1
        uid = i
      }
      i++
    } while (i != userData.Honor.length)

    var saved = userData.Honor[uid].time

    if (!saved) {
      return message.channel.send('Keine aktiven Timer gesetzt!')
    } else {
      var saved2 = saved.split(",")
      var converted = []
      var x = 0
      var skips = 0
      while (x != saved2.length) {
        if (saved2[x] < currentdate.getTime()) {
          x++
          skips++
        } else {
          var miliseconds = JSON.parse(saved2[x])
          var date = new Date(miliseconds)
          converted[x - skips] = `${(date.getHours() < 10 ? '0' : '') + date.getHours()}:${(date.getMinutes() < 10 ? '0' : '') + date.getMinutes()}:${(date.getSeconds() < 10 ? '0' : '') + date.getSeconds()}`
          skips = 0
          x++
        }
      }

      const embed = new Discord.MessageEmbed()
        .setAuthor(`Active Timers!`)
        .setColor(0x51267)
        .addFields({ name: 'timer ends at:', value: converted, inline: true });
      message.channel.send(embed);
    }
  }
  //COMMAND: TIMER
  if (command === 'timer') {
    var newUser = message.author
    var time = args[0]
    if (!time) {
      return message.channel.send('Wann soll ich dich denn erinnern?')
    }
    var currentdate = new Date();
    var newdate = new Date();
    var param = args.join(' ').slice(args[0].length)
    param = param.trimStart()
    var rdmarr = [`Dein Timer von ${time} ist um. Erinnere mich nochmal, woran ich dich erinnern sollte...`, `Dein Timer von ${time} ist um! Oh guck mal, da war eine Nuss im Timer :0`, `Dein Timer von ${time} ist um!`]


    var rdm = Math.floor(Math.random() * rdmarr.length)

    if (!param) {
      param = rdmarr[rdm]
    }
    newdate.setTime(currentdate.getTime() + ms(time))
    var desttime = `**${(newdate.getHours() < 10 ? '0' : '') + newdate.getHours()}:${(newdate.getMinutes() < 10 ? '0' : '') + newdate.getMinutes()}:${(newdate.getSeconds() < 10 ? '0' : '') + newdate.getSeconds()}**`

    var check = 0
    var uid = 0
    var i = 0

    do {
      if (userData.Honor[i].id === newUser.id) {
        check = 1
        uid = i
      }
      i++
    } while (i != userData.Honor.length)
    if (!userData.Honor[uid].id) {
      const input = {
        id: newUser.id,
        honors: 0,
        reason: "",
        nuts: 0,
        time: newdate.getTime()
      }
      userData.Honor.push(input)
    } else {
      userData.Honor[uid].time += ',' + newdate.getTime()
    }
    fs.writeFile('Storage/userData.json', JSON.stringify(userData), (err) => {
      if (err) console.error(err)
    });

    if (rdm == 1) {

      userData.Honor[uid].nuts++
      fs.writeFile('Storage/userData.json', JSON.stringify(userData), (err) => {
        if (err) console.error(err)
      });
    }
    var deltime = userData.Honor[uid].time
    var d = deltime.split(",")

    message.channel.send(`Timer set! Ich erinnere dich in ${time} um ${desttime}`)
    setTimeout(() => {
      message.reply(param)
      userData.Honor[uid].time = d.join(",")
      fs.writeFile('Storage/userData.json', JSON.stringify(userData), (err) => {
        if (err) console.error(err)
      });
    }, ms(time));




  }
  //COMMAND: CHECKNUTS
  if (command === 'checknuts') {
    var newUser = getUserFromMention(args[0])
    if (!newUser) {
      newUser = message.author
    }

    var check = 0
    var uid = 0
    var i = 0

    do {
      if (userData.Honor[i].id === newUser.id) {
        check = 1;
        uid = i;
      }
      i++;
    } while (i != userData.Honor.length)

    if (check == 1) {
      //data does exist
      if (!userData.Honor[uid].nuts) {
        //data exists, but not updated yet
        userData.Honor[uid].nuts = 0;
        fs.writeFile('Storage/userData.json', JSON.stringify(userData), (err) => {
          if (err) console.error(err)
        });
      }

      if (userData.Honor[uid].nuts > 0) {
        message.channel.send(`${newUser} hat bereits **${userData.Honor[uid].nuts}** N??sse gesammelt! <:surprised_yeesh:808577706073260053>`);
      } else {
        message.channel.send(`${newUser} hat noch keine N??sse gesammelt! >:(`);
      }

    } else {
      //data does not exist
      message.channel.send(`${newUser} hat noch keine N??sse gesammelt! >:(`);

      const input = {
        id: newUser.id,
        honors: 0,
        reason: "",
        nuts: 0,
        time: ""
      }
      userData.Honor.push(input);
      fs.writeFile('Storage/userData.json', JSON.stringify(userData), (err) => {
        if (err) console.error(err)
      });
    }
  }
  //COMMAND: NUTS
  if (command === 'nuts') {
    var newUser = message.author
    if (nutCooldown.has(newUser.id)) {
      message.channel.send('Du hast zu schnell genutted! >:(')
    } else {
      var check = 0
      var uid = 0
      var i = 0


      do {
        if (userData.Honor[i].id === newUser.id) {
          check = 1;
          uid = i;
        }
        i++;
      } while (i != userData.Honor.length)

      var value = Math.floor(Math.random() * 10)

      if (value == 1) {
        //Singular
        message.reply('Du hast eine Nuss bekommen! <:chestnut:829906666551902238>')
      } else if (value > 0) {
        //Plural
        message.reply(`Du hast ${value} N??sse bekommen! <:chestnut:829906666551902238>`)
      } else {
        //Nichts
        message.reply('Du hast keine Nuss bekommen! <:shooketh_yeesh:808577698271199272>')
      }

      if (check == 1) {
        //data does exist
        if (!userData.Honor[uid].nuts) {
          message.channel.send('Deus Nut! Du bekommst eine Bonus Nuss zum ersten Mal. <:DeusNut:829395908067328031>')
          value++;
          userData.Honor[uid].nuts = value
        } else {
          userData.Honor[uid].nuts += value
        }
        fs.writeFile('Storage/userData.json', JSON.stringify(userData), (err) => {
          if (err) console.error(err)
        });

      } else {
        //data does not exist
        message.channel.send('Deus Nut! Du bekommst eine Bonus Nuss zum ersten Mal. <:DeusNut:829395908067328031>') //<:Honor2:748242575701311530>
        value++;

        const input = {
          id: newUser.id,
          honors: 0,
          reason: "",
          nuts: 0 + value,
          time: ""
        }
        userData.Honor.push(input);
        fs.writeFile('Storage/userData.json', JSON.stringify(userData), (err) => {
          if (err) console.error(err)
        });
      }

      nutCooldown.add(newUser.id);
      setTimeout(() => {
        nutCooldown.delete(newUser.id);
      }, 3600000)
    }
  }
  //COMMAND: LEADERBOARD
  if (command === 'lb') {
    var i = 0;
    var sorter = [];
    var element

    while (i != userData.Honor.length) {
      element = userData.Honor[i].honors
      sorter.push(element);
      sorter.sort(function (a, b) {
        return b - a;
      });
      i++;
    }

    var i = 0;
    var a = 0;
    var z = [];

    while (i < 5) {
      //Top 5 Werte
      while (a != userData.Honor.length) {
        //DB durchsuchen
        if (userData.Honor[a].honors === sorter[i]) {
          //ID merken, erstmal in console
          if (!z.includes(`<@${userData.Honor[a].id}> : ${userData.Honor[a].honors} Honors`, 0)) {
            //Duplicates suchen
            z[i] = `<@${userData.Honor[a].id}> : ${userData.Honor[a].honors} Honors`;
          }
        }
        a++;
      }
      a = 0;
      i++;
    }
    const embed = new Discord.MessageEmbed()
      .setAuthor(`Honor Leaderboard!`)
      .setColor(0x51267)
      .addFields({ name: 'Top 5:', value: z, inline: true });
    message.channel.send(embed);
  }
  //COMMAND: SETBDAY
  if (command == 'setbday') {
    if (message.author.id === '140508899064283136') {
      var user = getUserFromMention(args[0]);
      var date = args[1];
      if (!user || !date) {
        return message.channel.send(`missing argument(s), please refer to [$help ${command}]`)
      } else {
        var key, count = 0;
        for (key in birthdays.geburtstage) {
          count++;
        };

        var i = 0;
        var checker = 0;
        do {
          if (user.id == birthdays.geburtstage[i].id) {
            checker = 1;
          }
          i++;
        } while (i != count);
        if (checker == 0) {
          const input = {
            id: user.id,
            bday: args[1],
          }

          birthdays.geburtstage.push(input);
          fs.writeFile('Storage/birthdays.json', JSON.stringify(birthdays), (err) => {
            if (err) console.error(err)
          });
        } else {
          return message.channel.send(`${user} is already in my database!`);
        }
      }
    } else {
      return message.reply('You are not authorized to use this command! >:(');
    }
  }
  //COMMAND: LUV
  if (command == 'luv') {
    const user = getUserFromMention(args[0]);
    var luvgifs = [
      "https://giphy.com/embed/M90mJvfWfd5mbUuULX",
      "https://giphy.com/embed/hVle3v01CScLyGRe0i",
      "https://giphy.com/embed/TdL0bbk08WP2S0RMnX",
      "https://giphy.com/embed/eiRpSPB8OSGVcbkOIJ",
      "https://giphy.com/embed/ifB1v1W3Db0GIW7uTA",
      "https://giphy.com/embed/yc2pHdAoxVOrJ2m5Ha",
      "https://giphy.com/embed/Tia2InBEWaQgckP3UG",
      "https://giphy.com/embed/l41JWw65TcBGjPpRK",
      "https://giphy.com/embed/M8o1MOwcwsWOmueqN4",
      "https://giphy.com/embed/L4UOYLu2quhaRqrTDI",
      "https://giphy.com/embed/4N1wOi78ZGzSB6H7vK",
      "https://giphy.com/embed/RkbLjHIVtiJYyHnHvB",
      "https://giphy.com/embed/l4pTdcifPZLpDjL1e",
      "https://giphy.com/embed/WOrZJR85BBDyhahWsX",

    ];
    const gif = luvgifs[Math.floor(Math.random() * luvgifs.length)];
    if (!user) {
      return message.reply('Ich sehe, dass du Liebe vergeben willst, aber wen willst du den lieb haben?');
    } else {
      message.channel.send(`<@${message.author.id}> gibt luv an <@${message.mentions.users.first().id}>`);

      return message.channel.send(gif);

    }

  }
  //COMMAND: 8BALL
  if (command == '8ball') {
    if (args == '') {
      return message.channel.send('Stell mir doch bitte eine Frage, ich kann immerhin keine Gedanken lesen...unless? ;)');
    } else {
      const random = Math.floor(Math.random() * 20);

      if (random == 0) {
        //Positive Antworten
        return message.channel.send('Absolut, so wie die Authorit??t unserer G??ttin!');
      } else if (random == 1) {
        return message.channel.send('Untersch??tze es nicht, genauso wie Roberts sexual frustration');
      } else if (random == 2) {
        return message.channel.send('Ich zedaz so');
      } else if (random == 3) {
        return message.channel.send('Ohne Zweifel');
      } else if (random == 4) {
        return message.channel.send('Definitiv, Alter');
      } else if (random == 5) {
        return message.channel.send('Microsoft Outlook gut');
      } else if (random == 6) {
        return message.channel.send('Das Sternzeichen von Yeesh leuchtet heute stark daf??r');
      } else if (random == 7) {
        return message.channel.send('Mit "Support-Desk am Freitagabend" - Wahrscheinlichkeit');
      } else if (random == 8) {
        return message.channel.send('Ist die Nase von Julius wundersch??n und lang?');
      } else if (random == 9) {
        return message.channel.send('So wahr wie Laviis Zeichnk??nste');
        //Neutrale Antworten
      } else if (random == 10) {
        return message.channel.send('nein...ja... vielleicht?');
      } else if (random == 11) {
        return message.channel.send('Frag mich nachher nochmal');
      } else if (random == 12) {
        return message.channel.send('Die Kalkulationen sind leicht off, ich aber nicht ;)');
      } else if (random == 13) {
        return message.channel.send('Ich sag es dir ein ander Mal');
      } else if (random == 14) {
        return message.channel.send('Ohne schwere Zeiten, w??rden wir die guten Zeiten nie sch??tzen');
        //Negative Antworten
      } else if (random == 15) {
        return message.channel.send('Genauso schlecht wie eine Ketzerei gegen den Olymp');
      } else if (random == 16) {
        return message.channel.send('Hat der Fuchs uns jemals verraten?...**hust**');
      } else if (random == 17) {
        return message.channel.send('Mein Outlook ist abgeschmiert, mist');
      } else if (random == 18) {
        return message.channel.send('Ich bezweifle es. A propos, zweifel nicht an den G??tter und ihren Priester!');
      } else if (random == 19) {
        return message.channel.send('Meine Quellen sagen.... WARNUNG! Artikel 17: Die betroffene Person hat das Recht, von dem Verantwortlichen zu verlangen, dass sie betreffende personenbezogene Daten unverz??glich gel??scht werden, und der Verantwortliche ist verpflichtet, personenbezogene Daten unverz??glich zu l??schen, sofern einer der folgenden Gr??nde zutrifft **ERROR ERROR ERROR**?');
      } else {
        return;
      }
    }
  }
  //COMMAND: DOGGO
  if (command == 'doggo') {
    if (message.author.id == '353902552888377346') {
      const attachment = new Discord.MessageAttachment('assets/doggo.jpg', 'doggo.jpg');


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
      var text = [
        'Ich habe dich vermisst, woof!',
        'Lass uns spielen!',
        'Denk dran, ich werde immer hier sein.',
        'Du hast gerufen, Herrchen?',
        'Depression, WO?! Ich belle sie weg.',
      ]
      let myText = text[Math.floor(Math.random() * text.length)]
      message.channel.send(myText);
    } else {
      return message.reply('Du bist nicht mein Herrchen! >:(')
    }
  }
  //COMMAND: PET
  if (command == 'pet') {
    if (message.author.id == '353902552888377346') {
      const attachment = new Discord.MessageAttachment('assets/doggo.jpg', 'doggo.jpg');


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
      var petText = [
        '*loving growl*',
        'Danke, das habe ich gebraucht.',
        'Ein bisschen tiefer.',
        'Ja, genau dort!'
      ]
      let myPetText = petText[Math.floor(Math.random() * petText.length)]
      message.channel.send(myPetText);
    } else {
      return message.reply('Du bist nicht mein Herrchen! >:(')
    }
  }
  //COMMAND: STATUS
  if (command == 'status') {
    if (message.author.id == '140508899064283136') {
      return message.channel.send('I am alive, father :D');
    } else {
      return message.channel.send("I am online");
    }

  }
  //COMMAND: AVATAR
  if (command == 'avatar') {
    if (args[0]) {
      const user = getUserFromMention(args[0]);
      if (!user) {
        return message.reply('Please use a proper mention if you want to see someone else\'s avatar.');
      }//Should return a text, when you don't mention someone

      return message.channel.send(`${user.username}'s avatar: ${user.displayAvatarURL({ dynamic: true })}`);
    }

    return message.channel.send(`${message.author.username}, your avatar: ${message.author.displayAvatarURL({ dynamic: true })}`);
  }
  //COMMAND: PING
  if (command === 'ping') {
    client.commands.get('ping').execute(message, args);
    //ping - pong, easy as that
  }
  //COMMAND: AUTHOR
  if (command === 'author') {
    client.commands.get('author').execute(message, args);
    //gives credit to author
  }
  //COMMAND: HELP
  if (command === 'help') {
    client.commands.get('help').execute(message, args);
    //help menu with a list of all commands
  }
  //COMMAND: TEST [REDACTED]
  if (command === 'test') {
    client.commands.get('test').execute(message, args);
    //test command, please ignore
  }
  //COMMAND: HONORHISTORY
  if (command === 'honorhistory') {
    if (message.member.hasPermission("VIEW_AUDIT_LOG")) {
      var newUser = getUserFromMention(args[0])
      if (!newUser) {
        newUser = message.author
      }

      var check = 0;
      var uid = 0
      var i = 0

      do {
        if (userData.Honor[i].id === newUser.id) {
          uid = i;
          check = 1;
        }
        i++;
      } while (i != userData.Honor.length)

      if (check == 1) {
        if (!userData.Honor[uid].reason) {
          return message.channel.send('This User has no Honor History!')
        }
        var str = userData.Honor[uid].reason
        var strarr = str.split(',')
        const embed = new Discord.MessageEmbed()
          .setAuthor(`Honor History!`)
          .setColor(0x51267)
          .addFields({ name: 'reasons:', value: strarr, inline: true });
        message.channel.send(embed)

      } else {
        userData.Honor[uid].reason = ""
        fs.writeFile('Storage/userData.json', JSON.stringify(userData), (err) => {
          if (err) console.error(err)
        });
      }

    } else {
      message.channel.send('You do not have the required permissions to use this command')
    }
  }
  //COMMAND: DISHONOR
  if (command === 'dishonor') {
    if (message.member.hasPermission("VIEW_AUDIT_LOG")) {
      const newUser = getUserFromMention(args[0])
      if (!newUser) {
        return message.channel.send(`missing argument(s), please refer to [$help ${command}]`)
      }
      var reason = args.join(' ').slice(args[0].length)
      reason = reason.trimStart()

      var check = 0
      var uid = 0
      var i = 0

      do {
        if (userData.Honor[i].id === message.mentions.users.first().id) {
          check = 1;
          uid = i;
        }
        i++;
      } while (i != userData.Honor.length)

      if (check == 1) {
        //data does exist
        if (userData.Honor[uid].honors > -20) {
          userData.Honor[uid].honors--
          userData.Honor[uid].reason += ', ' + reason

          fs.writeFile('Storage/userData.json', JSON.stringify(userData), (err) => {
            if (err) console.error(err)
          });
        } else {
          return message.channel.send(`<@${message.author.id}> tried to dishonor <@${message.mentions.users.first().id}>, but they are at Max Dishonor Level! <:Honor2:748242575701311530><:Honor2:748242575701311530><:Honor2:748242575701311530>`)
        }
      } else {
        //data does not exist
        const input = {
          id: newUser.id,
          honors: -1,
          reason: reason,
          nuts: 0,
          time: ""
        }
        userData.Honor.push(input);
        fs.writeFile('Storage/userData.json', JSON.stringify(userData), (err) => {
          if (err) console.error(err)
        });
      }
      return message.channel.send(`<@${message.author.id}> has dishonored <@${message.mentions.users.first().id}> <:Honor2:748242575701311530>`);
    } else {
      message.channel.send('You do not have the required permissions to use this command')
    }
  }
  //COMMAND: HONOR
  if (command === 'honor') {
    if (message.member.hasPermission("VIEW_AUDIT_LOG")) {
      const newUser = getUserFromMention(args[0])
      if (!newUser) {
        return message.channel.send(`missing argument(s), please refer to [$help ${command}]`)
      }
      var reason = args.join(' ').slice(args[0].length)
      reason = reason.trimStart()

      var check = 0
      var uid = 0
      var i = 0

      do {
        if (userData.Honor[i].id === message.mentions.users.first().id) {
          check = 1;
          uid = i;
        }
        i++;
      } while (i != userData.Honor.length)

      if (check == 1) {
        //data does exist
        if (userData.Honor[uid].honors < 20) {
          userData.Honor[uid].honors++
          if (userData.Honor[uid].reason === '') {
            userData.Honor[uid].reason = reason
          } else {
            userData.Honor[uid].reason += ', ' + reason
          }

          fs.writeFile('Storage/userData.json', JSON.stringify(userData), (err) => {
            if (err) console.error(err)
          });
        } else {
          message.channel.send(`<@${message.author.id}> tried to honor <@${message.mentions.users.first().id}>, but they are at Max Honor Level! <:Honor1:748242575873278115> <:Honor1:748242575873278115> <:Honor1:748242575873278115>`)
        }
      } else {
        //data does not exist
        const input = {
          id: newUser.id,
          honors: 1,
          reason: reason,
          nuts: 0,
          time: ""
        }
        userData.Honor.push(input);
        fs.writeFile('Storage/userData.json', JSON.stringify(userData), (err) => {
          if (err) console.error(err)
        });
      }
      return message.channel.send(`<@${message.author.id}> has honored <@${message.mentions.users.first().id}> <:Honor1:748242575873278115>`);
    } else {
      message.channel.send('You do not have the required permissions to use this command')
    }
  }
  //COMMAND: CHECKHONOR
  if (command === 'checkhonor') {
    var newUser = getUserFromMention(args[0])
    if (!newUser) {
      newUser = message.author
    }

    var check = 0
    var uid = 0
    var i = 0

    do {
      if (userData.Honor[i].id === newUser.id) {
        check = 1;
        uid = i;
      }
      i++;
    } while (i != userData.Honor.length)

    if (check == 1) {
      //data does exist
      message.channel.send('You received **' + userData.Honor[uid].honors + '** Honors in total!');

      if (userData.Honor[uid].honors < 0) {
        message.channel.send('What happened to Loyalty?! <:Honor2:748242575701311530>')
      } else if (userData.Honor[uid].honors > 0) {
        message.channel.send('real good, boah, REAL GOOD! <:Honor1:748242575873278115>')
      } else if (userData.Honor[uid].honors === 0) {
        message.channel.send('Choose a goddamn side!')
      } else if (userData.Honor[uid].honors === 20) {
        message.channel.send('This User is at max Honor Level! <:Honor1:748242575873278115> <:Honor1:748242575873278115> <:Honor1:748242575873278115>')
      } else if (userData.Honor[uid].honors === -20) {
        message.channel.send('This User is at max Dishonor Level! <:Honor2:748242575701311530> <:Honor2:748242575701311530> <:Honor2:748242575701311530>')
      }
    } else {
      //data does not exist
      message.channel.send('You received **0** Honors in total!');
      message.channel.send('Choose a goddamn side!');

      const input = {
        id: newUser.id,
        honors: 0,
        reason: "",
        nuts: 0,
        time: ""
      }
      userData.Honor.push(input);
      fs.writeFile('Storage/userData.json', JSON.stringify(userData), (err) => {
        if (err) console.error(err)
      });
    }
  }
});


client.login(config.token);

//CODE WRITTEN BY DESQBLOCKI
//ADD ME ON DISCORD "DeSqBlocki#2568"
