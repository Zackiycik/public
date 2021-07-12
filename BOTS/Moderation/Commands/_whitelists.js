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
    whitelistgostre = guvenliler.map(g => `<@!${g.güvenli}>`)
      
    message.channel.send(`${whitelistgostre}`)
  }



exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["güvenliler"]
};

exports.help = {
  name: "whitelists",
  description: "",
  usage: ""
};