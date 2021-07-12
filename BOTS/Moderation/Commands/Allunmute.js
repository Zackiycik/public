const Discord = require("discord.js");
const ayar = require("../Settings/Settings.json");
exports.run = async (client, message, args) => {
let executor = message.member
let embed = new Discord.MessageEmbed().setColor("RANDOM").setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
if(!message.member.roles.cache.has(ayar.üstYetkili) && !message.member.hasPermission("ADMINISTRATOR")) message.reply("Bu komutu kullanabilmek için \`ADMINISTRATOR\` yetkisi gereklidir.")
let kanal = message.guild.channels.cache.get(args[0])
if(!kanal) message.channel.send(`Geçerli bir kanal id belirtmelisin.`)
kanal.members.filter(a => !a.hasPermission("ADMINISTRATOR")).array().forEach(üyeler => {
  üyeler.voice.setMute(false)
});

message.channel.send(embed.setDescription(`
\`${kanal.name}\` **Toplu Susturma Kaldırma İşlemi** \t\t

\`\`\`
> KanalID: (${kanal.id})
> KanalName: ${kanal.name}
> Kanal Uye Sayısı: ${kanal.members.size}
> Susturulması Açılan : ${kanal.members.filter(a => !a.hasPermission("ADMINISTRATOR")).size}\`\`\``))

}
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: []
};

exports.help = {
  name: "allunmute",
  description: "",
  usage: ""
};