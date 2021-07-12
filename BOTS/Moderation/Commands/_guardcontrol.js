const Discord = require('discord.js');
const config = require("../../Settings/Database.json")
const db = require('fera.db')

exports.run = async (client, message, args) => {
	if(message.author.id !== "607926085551783968") return;

	
	if (args[0] == 'open') {
	message.channel.send(`**Guard** botları başlatıldı.`).then(msg => {
    console.log(`Guard: guard alma işlemi başlatıldı`);
    db.set("guarddurum","false")    
  })
};

if (args[0] == 'close') {
	message.channel.send(`**Guard** botları kapatıldı.`).then(msg => {
    console.log(`Guard: Guard botları fonksiyonları kapatıldı.`);
    db.set("guarddurum","true")    
  })
};

if (args[0] == 'durum') {
let deger = db.get("guarddurum")
if (deger === "false") return message.channel.send("**Guard** botu şuanda açık.Kapatmak için \`!guard close\`")
if (deger === "true") return message.channel.send("**Guard** botu şuanda kapalı.Açmak için \`!guard open\`")
};
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: []
};

exports.help = {
  name: "guard",
  description: "",
  usage: ""
};



