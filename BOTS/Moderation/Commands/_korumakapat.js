const Discord = require('discord.js');
const config = require("../../Settings/Database.json")
const db = require('fera.db')
const whitelist = require('../../Settings/Whitelist.json')

exports.run = async (client, message, args) => {
    client.botroles = whitelist.BotRoles

    if (whitelist.Owners.includes(message.author.id)){

    
    
        let data = db.fetch("rols") || [];
    message.guild.roles.cache.forEach(a => {
      let rol = data.filter(b => b.rolid == a.id)
      if(rol.length < 1) return;
      a.setPermissions(rol[0].rolPermission)
    })
           db.set("guarddurum","false")    
           db.set("backupdurum","false")    

           message.channel.send("Bütün yetkiler açıldı , Backup işlemi açıldı , Guardlar aktif edildi.");
           console.log(`CMD: Bütün yetkiler açıldı , Backup işlemi açıldı , Guardlar aktif edildi.`);


    }     
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["ohal-kapat","ohalkapat","korumakapat"]
};

exports.help = {
  name: "koruma-kapat",
  description: "",
  usage: ""
};