const { MessageEmbed } = require("discord.js");
const cfg = require("../Settings/Settings.json");
const Other = require("../Settings/Other.json")

exports.run = async(client, message, args, emoji) => {
  
  const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) 
  let member = message.guild.member(user)
  if (!member) return message.channel.send(new MessageEmbed().setDescription(`Lütfen bir üyeyi etiketle ve tekrar dene!`).setAuthor(message.author.tag, message.member.user.avatarURL({dynamic: true})).setColor('RANDOM')).then(msg => msg.delete({timeout: 5000}), message.react(Other.General.no))
  message.channel.send(new MessageEmbed().setColor('RANDOM').setAuthor(message.author.tag, message.author.avatarURL({dynamic: true})).setDescription(`${member} bu sunucuya **${(message.guild.members.cache.filter(a => a.joinedTimestamp <= member.joinedTimestamp).size).toLocaleString()}.** sırada katılmış!`));

};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: []
};

exports.help = {
  name: "katılımsırası",
  description: "",
  usage: ""
};
