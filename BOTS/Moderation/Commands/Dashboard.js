exports.run = async(client, message, args) => {
    const Discord = require("discord.js")
    const config = require("../Settings/Settings.json");
    const Other = require("../Settings/Other.json")
    message.channel.send(new Discord.MessageEmbed().setColor("RED").setDescription(`
    \`\`\`Sunucuda toplam > ${message.guild.memberCount} Üye\nSon 1 Saatte Giren Üyeler > ${message.guild.members.cache.filter(a => (new Date().getTime() - a.joinedTimestamp) < 3600000).size}\nSon 1 Günde Giren Üyeler > ${message.guild.members.cache.filter(a => (new Date().getTime() - a.joinedTimestamp) < 86400000).size}\nSon 1 Haftada Giren Üyeler > ${message.guild.members.cache.filter(a => (new Date().getTime() - a.joinedTimestamp) < 604800000).size}\nSon 1 Ayda Giren Üyeler > ${message.guild.members.cache.filter(a => (new Date().getTime() - a.joinedTimestamp) < 2629800000).size}\`\`\``)
    .setFooter(message.guild.name, message.guild.iconURL())
    .setTimestamp()).then(x => x.delete({ timeout: 5000 }))
    message.react(Other.General.yes)
  };
  
  exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: []
  };
  
  exports.help = {
    name: "dashboard",
    description: "",
    usage: ""
  };
