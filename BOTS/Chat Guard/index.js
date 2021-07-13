const Discord = require("discord.js")
const client = new Discord.Client();
const db = require("quick.db")
const weka = require("../Settings/Moderation.json")
const Bots = require('../Settings/Bots.json')

client.on("ready", () => {
    client.user.setPresence({ activity: { name: Bots.Bot_Type }, status: Bots.Bot_Status })
    console.log(`${client.user.username} İsmi ile giriş yapıldı! Chat Guard Online`)
    client.channels.cache.get(Bots.Bot_Voice_Channel).join()
})

client.login(Bots.ChatGuard).catch(err => {
    console.error("Bot Giriş Yapamadı!")
    console.error("Token Girilmemiş!")
})

client.on('message', async (msg, member) => {



    if (msg.content === 'sa') {

        msg.reply('Aleyküm selam, hoş geldin!');
    }

    if (msg.content === 'sea') {

        msg.reply('Aleyküm selam, hoş geldin!');
    }

    if (msg.content === 'hi') {

        msg.reply('Hi welcome ');
    }


});

client.on('message', async message => {

    let reklamlar = ["discord.app", "discord.gg", "discordapp", "discordgg", ".com", ".net", ".xyz", ".tk", ".pw", ".io", ".me", ".gg", "www.", "https", "http", ".gl", ".org", ".com.tr", ".biz", ".party", ".rf.gd", ".az", ".cf", ".me", ".in"]
    let kelimeler = message.content.slice(" ").split(/ +/g)

    if (reklamlar.some(word => message.content.toLowerCase().includes(word))) {

        if (message.member.hasPermission("ADMINISTRATOR")) return; message.delete()

        msg.reply('**Bu sunucuda reklamları engellenmekte.**').then(wekaxd => wekaxd.delete(5000))
    }
});

client.on("messageUpdate", async (oldMsg, newMsg) => {

    let reklamlar = ["discord.app", "discord.gg", "discordapp", "discordgg", ".com", ".net", ".xyz", ".tk", ".pw", ".io", ".me", ".gg", "www.", "https", "http", ".gl", ".org", ".com.tr", ".biz", ".party", ".rf.gd", ".az", ".cf", ".me", ".in"]
    let kelimeler = newMsg.content.slice(" ").split(/ +/g)

    if (reklamlar.some(word => newMsg.content.toLowerCase().includes(word))) {

        if (newMsg.member.hasPermission("ADMINISTRATOR")) return; newMsg.delete()

        oldMsg.reply('**Bu sunucuda reklamları engellenmekte.**').then(wekaxd => wekaxd.delete(5000))
    }
});

client.on("message", async msg => {

    const kufur = ["oç", "amk", "ananı sikiyim", "ananıskm", "piç", "amk", "amsk", "sikim", "sikiyim", "orospu çocuğu", "piç kurusu", "kahpe", "orospu", "mal", "sik", "yarrak", "am", "amcık", "amık", "yarram", "sikimi ye", "mk", "mq", "aq", "ak", "amq",];
    if (kufur.some(word => msg.content.includes(word))) {
        try {
            if (!msg.member.permissions.has("ADMINISTRATOR")) {
                msg.delete();

                return msg.reply('Bu sunucuda argo kelime kullanmak yasak.').then(wekaxd => wekaxd.delete({ timeout: 5000 }))
            }
        } catch (err) {
            console.log(err);
        }
    }


});

client.on("message", async msg => {
    if (msg.channel.type === "dm") return;
    if (msg.author.bot) return;
    if (msg.content.length > 1) {
        let caps = msg.content.toUpperCase();
        if (msg.content == caps) {
          if (!msg.member.permissions.has("ADMINISTRATOR")) {
            if (!msg.mentions.users.first()) {
              msg.delete();
              return msg.channel.send(`${msg.member}, Bu sunucuda fazla büyük harf (caps lock) kullanmak yasak.`).then(wekaxd => wekaxd.delete({timeout: 5000}))
                
            }
          }
        }
    }
  });

client.on("messageUpdate", async msg => {


    const kufur = ["oç", "amk", "ananı sikiyim", "ananıskm", "piç", "amk", "amsk", "sikim", "sikiyim", "orospu çocuğu", "piç kurusu", "kahpe", "orospu", "mal", "sik", "yarrak", "am", "amcık", "amık", "yarram", "sikimi ye", "mk", "mq", "aq", "ak", "amq",];
    if (kufur.some(word => msg.content.includes(word))) {
        try {
            if (!msg.member.permissions.has("ADMINISTRATOR")) {
                msg.delete();

                return msg.reply('Bu sunucuda argo kelime kullanmak yasak.').then(wekaxd => wekaxd.delete({ timeout: 5000 }))
            }
        } catch (err) {
            console.log(err);
        }
    }
});

const usersMap = new Map();
const LIMIT = 5;
const TIME = 10000;
const DIFF = 2000;


client.on('message', async message => {
    if (message.author.bot) return;
    if (message.member.hasPermission("ADMINISTRATOR")) return;
    if (message.member.roles.cache.get(weka.mutedrole)) return;
    if (usersMap.has(message.author.id)) {
        const userData = usersMap.get(message.author.id);
        const { lastMessage, timer } = userData;
        const difference = message.createdTimestamp - lastMessage.createdTimestamp;
        let msgCount = userData.msgCount;

        if (difference > DIFF) {
            clearTimeout(timer);
            userData.msgCount = 1;
            userData.lastMessage = message;
            userData.timer = setTimeout(() => {
                usersMap.delete(message.author.id);
            }, TIME);
            usersMap.set(message.author.id, userData)
        }
        else {
            msgCount++;
            if (parseInt(msgCount) === LIMIT) {
                const mutedrole = message.guild.roles.cache.get(weka.Mute)
                message.member.roles.add(mutedrole);
                message.channel.send("Spam yaptığından dolayı 15 dakika boyunca susturuldun.").then(wekaxd => wekaxd.delete({ timeout: 5000 }))

                setTimeout(() => {
                    if (!message.member.roles.cache.get(weka.Mute)) return;
                    message.member.roles.remove(mutedrole);
                    message.channel.send("Muten açıldı lütfen tekrar spam yapmamaya dikkat et.").then(wekaxd => wekaxd.delete({ timeout: 5000 }))
                }, 900000);//9000000
            } else {
                userData.msgCount = msgCount;
                usersMap.set(message.author.id, userData)
            }
        }
    }
    else {
        let fn = setTimeout(() => {
            usersMap.delete(message.author.id)
        }, TIME);
        usersMap.set(message.author.id, {
            msgCount: 1,
            lastMessage: message,
            timer: fn
        })
    }
});

client.on("message", async message => {
    if (message.author.bot) return;
    if (message.member.hasPermission('ADMINISTRATOR')) return;

    if (message.mentions.users.size >= 3) {
        const mutedrole = message.guild.roles.cache.get(weka.Mute)
        message.member.roles.add(weka.Mute);
        message.channel.send("Birden çok kişiyi etiketlediğin için 15 dakika boyunca susturuldun.");
        setTimeout(() => {
            message.member.roles.remove(weka.Mute);
            message.channel.send("Muten açıldı lütfen tekrar insanları birden fazla etiketleme.")
        }, 900000);//9000000
        if (message.deletable) message.delete({ timeout: 5000 }).catch(console.error);
    }
});


client.on('message', async message => {
    if(message.author.bot) return;
    if(message.member.hasPermission("ADMINISTRATOR")) return;
    if(message.content.length > "500") {
      if(message.deletable)  message.delete({timeout: 0050}).catch(console.error) 
      return message.channel.send(`${message.member}, Lütfen mesajınızı 500 karakterden az yazınız`).then(a => a.delete({timeout: 5000}))
    }
});
  
