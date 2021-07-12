const { MessageEmbed } = require("discord.js");
const db = require("quick.db");

const ayar = require("../Settings/Settings.json");
exports.run = async (client, message, args) => {
   
    let embed = new MessageEmbed().setTitle(message.member.displayName, message.author.avatarURL({dynamic: true})).setColor("RANDOM").setTimestamp();


    let victim = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;

    let cpuan = db.get(`cezapuan.${victim.id}.${message.guild.id}`);



    message.channel.send(embed.setDescription(`\`\`\`${victim.username.replace("`", "")} adlı üyenin toplam ceza puanı; ${cpuan || '0'}\`\`\``).setColor("RED"))

};
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: []
  };
  
  exports.help = {
    name: "cezapuan",
    description: "",
    usage: ""
  };
