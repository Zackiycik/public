const { MessageEmbed } = require("discord.js");
const db = require("quick.db");
const moment = require("moment");
const Settings = require('../../Settings/Moderation.json');
const Other = require("../../Settings/Other.json")

exports.run = async(client, message, args) => {

    if(!message.member.roles.cache.has(Settings.RegisterHammer) && !message.member.hasPermission(8)); 

    let embed = new MessageEmbed().setColor('RANDOM').setTimestamp()

    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if (!member) return message.channel.send(`${message.author}, Bir member Etiketlemelisin.`).then(m => m.delete({ timeout: 7000 }))
    
    if (member.id === client.user.id) return message.channel.send(`Beni Kayıt Edemezsin!`).then(m => m.delete({ timeout: 7000 }))
    if (member.id === message.author.id) return message.channel.send(`Kendini Kayıt Edemezsin!`).then(m => m.delete({ timeout: 7000 }))
    let data = await db.fetch(`isimler.${member.id}`)

        
    message.react(Other.yes)
    message.channel.send(embed.setDescription(`${member} kullanıcıya <@&${Settings.WomanRole}> rolleri verildi.`)).then(m => m.delete({ timeout: 12000 }))

    setTimeout(function(){  
member.roles.add(Settings.WomanRole).catch(err => console.log(err))
member.roles.add(Settings.WomanRoles).catch(err => console.log(err))
}, 5000);
setTimeout(function(){  
  member.roles.remove(Settings.Unregister).catch(err => console.log(err));
}, 3000)

 let cinsiyet = `(<@&${Settings.WomanRole}>)`
 let name = `${member.displayName}`
 db.push(`kayıtdata.${member.id}`, { 
  kayıtlı: "true"
})
setTimeout(function(){  
member.setNickname(name)
}, 2000);
    await db.add(`kayıt.${message.author.id}.e`, 1)
    await db.add(`kayıt.${message.author.id}.t`, 1)
    db.push(`isimler.${member.id}`, { 
    isim: name,
    kayıtsekil: cinsiyet
  })
}
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["e","man"]
};

exports.help = {
  name: "erkek",
  description: "",
  usage: ""
};
  