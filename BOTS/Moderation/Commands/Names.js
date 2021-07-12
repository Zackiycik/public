const { MessageEmbed } = require("discord.js");
const db = require("quick.db");
const moment = require("moment");
const conf = require('../../Settings/Moderation.json');
const Other = require('../../Settings/Other.json')
exports.run = async(client, message, args) => {

    if(!message.member.roles.cache.has(conf.RegisterHammer) && !message.member.hasPermission(8));

    let embed = new MessageEmbed().setColor('RANDOM').setTimestamp()
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    let data = await db.fetch(`isimler.${uye.id}`)
    
    if (!data) return message.channel.send(embed.setDescription(`Bu Kullanıcının geçmiş isimleri bulunamadı.`)).then((msg) => msg.delete({ timeout:5000 }))
    let isimler = data.map((value, index) => `\`• ${value.isim}\` ${value.kayıtsekil}`).splice(0, 30)
    if (!uye) return message.channel.send(embed.setDescription(`Bir Kullanıcı Belirtmelisin`)).then((msg) => msg.delete({ timeout:5000 }))

    message.react(Other.yes)
    message.channel.send(embed.setDescription(`${uye}, Kullanıcısının toplam "**${isimler.length}**" kayıtı bulundu.\n${isimler.join("\n")}`)
    )

}
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["isimler"]
  };
  
  exports.help = {
    name: "names",
    description: "",
    usage: ""
  };
    