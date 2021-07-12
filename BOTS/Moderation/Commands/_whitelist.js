const Discord = require('discord.js');
const db = require("fera.db")

exports.run = async (client, message, args) => {
    let hedef;
    let rol = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.find(r => r.name === args.join(" "));
    let uye = message.mentions.users.first() || message.guild.members.cache.get(args[0]);
    if (rol) hedef = rol;
    if (uye) hedef = uye;
    whitelistmap = db.fetch("whitelist") ? db.fetch("whitelist") : [] 
    let guvenliler = whitelistmap
    if (!hedef) return message.channel.send(`Güvenli listeye eklemek/kaldırmak için bir hedef (rol/üye) belirtmelisin!`)
    if (guvenliler.some(white => white.güvenli.includes(hedef.id))) {
        let map = guvenliler.filter(g => !g.güvenli.includes(hedef.id))
        message.channel.send(`${map}`)
        db.set("whitelist", map)
        message.channel.send(`${hedef}, ${message.author} tarafından güvenli listeden kaldırıldı!`);
    } else {

        db.push("whitelist", {
            güvenli: hedef.id,
          })
      message.channel.send(`${hedef}, ${message.author} tarafından güvenli listeye eklendi!`);
    };
  }



exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["güvenli"]
};

exports.help = {
  name: "whitelist",
  description: "",
  usage: ""
};
