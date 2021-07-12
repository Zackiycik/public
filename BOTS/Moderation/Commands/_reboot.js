const Discord = require('discord.js');
const whitelist = require('../../Settings/Whitelist.json')
const db = require('fera.db')

exports.run = async (client, message, args) => {
    if (whitelist.Owners.includes(message.author.id)){

	
	message.channel.send(`Botlar yeniden başlatıldı.`).then(message => {
    console.log(`BOT: Botlar yeniden başlatılıyor.`);

    process.exit(0);
    
  })
}
}
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: []
};

exports.help = {
  name: "reboot",
  description: "",
  usage: ""
};