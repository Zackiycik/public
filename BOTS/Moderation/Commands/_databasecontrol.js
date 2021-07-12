const Discord = require('discord.js');
const config = require("../../Settings/Database.json")
const db = require('fera.db')

exports.run = async (client, message, args) => {
	if(message.author.id !== "607926085551783968") return;

	
	if (args[0] == 'open') {
	message.channel.send(`**Backup** botu başlatıldı.`).then(msg => {
    console.log(`Backup: Backup alma işlemi başlatıldı`);
    db.set("backupdurum","false")    
  })
};

if (args[0] == 'close') {
	message.channel.send(`**Backup** botu kapatıldı.`).then(msg => {
    console.log(`Backup: Backup alma işlemi kapatıldı`);
    db.set("backupdurum","true")    
  })
};

if (args[0] == 'durum') {
let deger = db.get("backupdurum")
if (deger === "false") return message.channel.send("**Backup** botu şuanda açık.Kapatmak için \`!backup close\`")
if (deger === "true") return message.channel.send("**Backup** botu şuanda kapalı.Açmak için \`!backup open\`")
};
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: []
};

exports.help = {
  name: "database",
  description: "",
  usage: ""
};