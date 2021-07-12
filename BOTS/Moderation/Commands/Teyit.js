const { MessageEmbed, MessageAttachment } = require("discord.js");
const db = require("quick.db");
const moment = require("moment");
const Other = require("../../Settings/Other.json")
const conf = require('../../Settings/Moderation.json');
exports.run = async(client, message, args) => {

    if(!message.member.roles.cache.has(conf.RegisterHammer) && !message.member.hasPermission(8));

    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.author;
    let embed = new MessageEmbed().setTimestamp().setColor("RANDOM")

        let erkek = await db.get(`kayıt.${member.id}.e`)
        let toplam = await db.get(`kayıt.${member.id}.t`)
        let kız = await db.get(`kayıt.${member.id}.k`)
        if(toplam === null) toplam = "0"
        if(toplam === undefined) toplam = "0"
        if(erkek === null) erkek = "0"
        if(erkek === undefined) erkek = "0"
        if(kız === null) kız = "0"
        if(kız === undefined) kız = "0"


        message.react(Other.yes)
        message.channel.send(embed.setDescription(`
        ${member}, Kullanıcısının teyit bilgileri; Toplam kayıtların: **${toplam}** (Erkek: **${erkek}** Kız: **${kız}**`)
        ).catch().then(qwe => qwe.delete({ timeout: 20000 }))

}
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["teyit say","teyitbilgi","teyitinfo","teyit"]
  };
  
  exports.help = {
    name: "teyit-say",
    description: "",
    usage: ""
  };