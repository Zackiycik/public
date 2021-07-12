const { MessageEmbed } = require("discord.js");
const db = require("quick.db");
const moment = require("moment");
const Other = require("../Settings/Other.json")
const conf = require('../Settings/Settings.json');

exports.run = async(client, message, args) => {

    if(!message.member.roles.cache.has(conf.Register.CCO) && !message.member.hasPermission(8));

    let embed = new MessageEmbed().setColor('RANDOM').setTimestamp()
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if (!uye) return message.channel.send(embed.setDescription(`${message.author}, Bir kullanıcı etiketlemelisin.`)).then(qwe => qwe.delete({ timeout: 5000 }))
    if (uye) {
        db.delete(`kayıt.${uye.id}.t`)
        db.delete(`kayıt.${uye.id}.k`)
        db.delete(`kayıt.${uye.id}.e`)
        message.react(Other.General.yes)
        message.channel.send(embed.setDescription(`${uye} Üyesinin Kayıt Verileri Sıfırlandı`)).catch().then(sj => sj.delete({ timeout: 15000 }))
    }
}
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["teyit-sil","teyit sil","teyitsıfırla"]
  };
  
  exports.help = {
    name: "teyit-sıfırla",
    description: "",
    usage: ""
  };
    