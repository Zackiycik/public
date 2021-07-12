const { MessageEmbed } = require("discord.js");
const db = require("quick.db");
const ayar = require("../Settings/Settings.json");

exports.run = async (client, message, args) => {
    let executor = message.member
	
    let embed = new MessageEmbed().setAuthor(executor.user.tag, executor.user.displayAvatarURL({dynamic: true})).setFooter(ayar.BotSettings.Footer).setColor("RANDOM").setTimestamp();
    let cezaID = Number (args[0]);
    if (!cezaID) return message.channel.send(embed.setDescription("Geçerli bir ceza numarası belirtmelisin.")).then(x => x.delete({timeout: 5000}))
    let punishment = db.fetch(`punishments.${cezaID}.${message.guild.id}`) || {};
    if (!punishment) return message.channel.send(embed.setDescription(`Belirtilen ID ile bir ceza bulamadım \`!#${cezaID}\``)).then(x => x.delete({timeout: 10000}));
    let victim = client.users.fetch(punishment.kisi) || punishment.kisi;
    let mod = client.users.fetch(punishment.mod) || punishment.mod;
    let zaman = punishment.zaman;

    message.channel.send(embed.setDescription(`Ceza ID: \`#${cezaID}\`  \n\n\`\`\` Ceza Bilgisi: ${punishment.komut} \n Ceza Alan Üye:${victim.id || punishment.kisi} \n Yetkili:${mod.id || punishment.mod} \n\n Ceza Tarihi: ${new Date(zaman).toTurkishFormatDate()} \n Sebep: ${punishment.sebep}\`\`\``));

};
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["ceza"]
  };
  
  exports.help = {
    name: "cezainfo",
    description: "",
    usage: ""
  };
