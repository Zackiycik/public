const Discord = require('discord.js');
const config = require("../../Settings/Database.json")
const db = require('fera.db')
const whitelist = require('../../Settings/Whitelist.json')

exports.run = async (client, message, args) => {
    client.botroles = whitelist.BotRoles

    if (whitelist.Owners.includes(message.author.id)){

        let yetkiler = ["ADMINISTRATOR", "BAN_MEMBERS", "KICK_MEMBERS", "MANAGE_ROLES", "MANAGE_CHANNELS", "MANAGE_GUILD", "VIEW_AUDIT_LOG"]
        message.guild.roles.cache.filter(a => yetkiler.some(x => a.permissions.has(x)) == true && message.guild.members.cache.get(client.user.id).roles.highest.rawPosition > a.rawPosition && !client.botroles.includes(a.id)).map(yetkiliroller => {
          
            db.push("rols", {
              rolid: yetkiliroller.id,
              rolPermission: yetkiliroller.permissions.bitfield
            })

           yetkiliroller.setPermissions(0)

           db.set("guarddurum","false")    
           db.set("backupdurum","true")    

           message.channel.send("Bütün yetkiler kapatıldı , Backup işlemi durduruldu , Guardlar aktif edildi.");
           console.log(`CMD: Bütün yetkiler kapatıldı , Backup işlemi durduruldu , Guardlar aktif edildi.`);

        })


    }     
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["ohal"]
};

exports.help = {
  name: "koruma",
  description: "",
  usage: ""
};