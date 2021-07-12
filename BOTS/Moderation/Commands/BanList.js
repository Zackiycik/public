const { MessageEmbed } = require("discord.js");
const Discord = require("discord.js");
const config = require("../Settings/Settings.json");
const Other = require("../../Settings/Moderation.json")

exports.run = async(client, message, args) => {
  
  let embed = new MessageEmbed().setColor(`RANDOM`).setAuthor(message.author.tag, message.member.user.avatarURL({dynamic:true}))
  let embed2 = new MessageEmbed().setColor(`RANDOM`).setAuthor(message.author.tag, message.member.user.avatarURL({dynamic:true})).setFooter(client.user.username,client.user.avatarURL({dynamic:true}))
  if (!message.member.roles.cache.has(config.punishment.BanHammer) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(`Bu komutu kullanmak için gerekli yetkiye sahip değilsin!`).then(msg => msg.delete({timeout: 5000}), message.react(Other.General.no))
  message.guild.fetchBans().then(bans => {
  if(bans.size > 30){
  message.channel.send(embed.setDescription(`\`\`\`Toplam ${bans.size} adet yasaklanmış kullanıcı bulunuyor.\n\n(Ban Sayısı 30 Ve Üstünde İse Gösteremiyorum.)\`\`\``));
  }
  if(bans.size < 30){
  message.channel.send(embed.setDescription(`Toplam "**${bans.size}**" adet yasaklanmış kullanıcı bulunuyor.\n\n ${bans.size > 0 ? bans.map(z => `${z.user.tag.replace("`", "")} - \`${z.user.id}\``).join("\n") : "Bu Sunucuda Mevcut Yasaklama Bulunmuyor."}`));
  }
  })
}
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["banlist"]
};

exports.help = {
  name: "ban-list",
  description: "",
  usage: ""
};