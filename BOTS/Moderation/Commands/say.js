const { MessageEmbed } = require("discord.js");
const Settings = require("../Settings/Settings.json")
const Other = require("../Settings/Other.json")
exports.run = (client, message, args) => { 
  

  let botcommands = Settings.Register.RegisterHammer
  if(!message.member.roles.cache.get(botcommands) && !message.member.hasPermission('ADMINISTRATOR'))
  return message.channel.send(new MessageEmbed().setDescription(`Bu komutu kullanabilmen için <@&${botcommands}> rolüne sahip olman gerekiyor.`).setColor("BLUE")).then(x => x.delete({ timeout: 6500 }));

  const taggg = message.guild.members.cache.filter(m => m.user.username.includes(Settings.OtherWorks.Tag)).size
  const etiketlikrl =  message.guild.members.cache.filter(s => !s.bot).filter(member => member.user.discriminator == Settings.OtherWorks.Etiket).size;
  const swtop = message.guild.memberCount
  const online = message.guild.members.cache.filter(off => off.presence.status !== 'offline').size
  const ses = message.guild.channels.cache.filter(channel => channel.type == "voice").map(channel => channel.members.size).reduce((a, b) => a + b) 

  const vallens = new MessageEmbed()
  .setTimestamp()
  .setColor('RANDOM')
  .setFooter("Vallenscimmm")
  message.react(Other.General.yes) // Onay veya tag emoji ID
  message.channel.send(vallens.setDescription(`\`•\` Sunucumuzda Toplam \`${swtop}\` üye bulunmakta (\`${online}\`) Aktif!
  \`•\` İsim tagımızda toplam \`${taggg}\` üye bulunmakta.
  \`•\` Etiketimizde toplam \`${etiketlikrl}\` üye bulunmakta.
  \`•\` Etiketimizde ve isim tagımızda \`${etiketlikrl+taggg}\` üye bulunmakta.
  \`•\` Ses kanallarında \`${ses}\` üye bulunmakta.`).setColor("RANDOM"));
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: []
};

exports.help = {
  name: "say",
  description: "",
  usage: ""
};