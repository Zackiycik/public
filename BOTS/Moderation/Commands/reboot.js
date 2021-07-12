const Discord = require('discord.js');

exports.run = async (client, message, args) => {
	if(message.author.id !== "607925451364499477")
  return message.channel.send('Bu komudu kullanman için yetkin yok.')

	
	if (args[0] == 'moderation') {
	message.channel.send(`**Moderation** botuna ${message.author} (\`${message.author.id}\`) tarafından restart atıldı.`)

 message.channel.send(`Bot yeniden başlatılıyor...`).then(msg => {
    console.log(`BOT: Bot yeniden başlatılıyor...`);

    process.exit(0);
    
  })
};
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