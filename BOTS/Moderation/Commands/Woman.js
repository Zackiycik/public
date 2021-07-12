const { MessageEmbed } = require("discord.js");
const db = require("quick.db");
const moment = require("moment");
const Settings = require('../../Settings/Moderation.json');
const Other = require("../../Settings/Other.json")

exports.run = async(client, message, args) => {

    if(!message.member.roles.cache.has(Settings.RegisterHammer) && !message.member.hasPermission(8));

    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    let embed = new MessageEmbed().setColor('RANDOM').setTimestamp()
    if (!uye) return message.channel.send(embed.setDescription(`${message.author}, Bir Kullanıcı Etiketlemelisin.`)).then(m => m.delete({ timeout: 7000 }))

    args = args.filter(a => a !== "" && a !== " ").splice(1)
    if (uye.id === client.user.id) return message.channel.send(embed.setDescription(`Beni Kayıt Edemezsin!`)).then(m => m.delete({ timeout: 7000 }))
    if (uye.id === message.author.id) return message.channel.send(embed.setDescription(`Kendini Kayıt Edemezsin!`)).then(m => m.delete({ timeout: 7000 }))
    if (uye.roles.cache.has(Settings.WomanRole)) return message.channel.send(embed.setDescription(`Bu Kullanıcı Zaten Kayıtlı,tekrar kayıt edilemez.`)).then(m => m.delete({ timeout: 7000 }))

        message.react(Other.yes)
        message.channel.send(embed.setDescription(`${uye} kullanıcı başarıyla <@&${Settings.WomanRole}> olarak değiştirildi.`)).then(m => m.delete({ timeout: 12000 }))

    setTimeout(function(){  
    uye.roles.add(Settings.WomanRole).catch(err => console.log(err))
    uye.roles.add(Settings.WomanRoles).catch(err => console.log(err))
}, 1000);
    uye.roles.remove(Settings.Unregister).catch(err => console.log(err))
    setTimeout(function(){  
    uye.setNickname(name)
}, 2000);

let cinsiyet = `(<@&${Settings.WomanRole}>)`
 let name = `${uye.displayName}`
setTimeout(function(){  
uye.setNickname(name)
}, 2000);
    await db.add(`kayıt.${message.author.id}.k`, 1)
    await db.add(`kayıt.${message.author.id}.t`, 1)
    db.push(`isimler.${uye.id}`, { 
    isim: name,
    kayıtsekil: cinsiyet
  })
}
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["k","kadın","woman"]
  };
  
  exports.help = {
    name: "kız",
    description: "",
    usage: ""
  };
    
