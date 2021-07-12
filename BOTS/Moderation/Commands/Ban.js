const { MessageEmbed } = require("discord.js");
const Discord = require('discord.js');
const db = require("quick.db");
const Other = require("../Settings/Other.json")

const ayar = require("../Settings/Settings.json");
exports.run = async (client, message, args) => {

  let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true})).setColor("RANDOM").setTimestamp();
  if (!message.member.roles.cache.has(ayar.punishment.BanHammer) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(`Bu komudu kullanmak için gerekli izinlere sahip değilsin.`).then(x => x.delete({timeout: 10000}));



    let bandb = db.get(`bandb.${message.author.id}.${message.guild.id}`);
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])   
    let memberfetch = client.users.fetch(args[0]);
    let reason = args.splice(1).join(" ");
    if (!member) return message.channel.send(`Geçerli bir kullanıcı belirtmelisin.`).then(x => x.delete({timeout: 10000}));
    if (message.member.roles.highest.position <= member.roles.highest.position) return message.channel.send(`Bu üyenin yetkileri senden yüksek veya aynı yetkide olduğunuz için işlemi gerçekleştiremiyorum.`).then(x => x.delete({timeout: 10000}));
    if (!member || reason.length < 1) return message.channel.send(`Komutu doğru kullanmalısın! \`Örnek: ${ayar.BotSettings.prefix || ""}ban @member [sebep]\``).then(x => x.delete({timeout: 10000}));
    if(!reason) return message.channel.send(`${message.member} lütfen bir member belirtiniz.`)
    if (member.user.bot) return message.channel.send(`Bu komutu botlar üzerinde kullanamazsın!`)  .then(x => x.delete({timeout: 10000}));
    
    if (bandb >= 2) {
        if (message.guild.channels.cache.has(ayar.punishment.YetkiAsma)) message.guild.channels.cache.get(ayar.Channels.yetkiasma).send(embed.setDescription(`${message.author} (\`${message.author.id}\`) adlı yetkili 30 dakikada 2 tane ban attığı için ban yetkisi alındı.`)).catch();
        message.member.roles.remove(ayar.punishment.BanHammer).catch();
        db.delete(`bandb.${message.author.id}.${message.guild.id}`);
        return;
    }

    member.ban({reason: reason}).catch(err => console.log(err));
    member.send(embed.setDescription(`**${message.guild.name}** adlı sunucudan **${reason}** gerekçesiyle yasaklandın!`)).catch();
    let cezaID = db.get(`cezaid.${message.guild.id}`)+1
    db.push("bans", {id: member.id});
    db.add(`cezaid.${message.guild.id}`, +1);
    db.set(`punishments.${cezaID}.${message.guild.id}`, { mod: message.member.displayName, sebep: reason, kisi: member.id, id: cezaID, zaman: Date.now(), komut: "Yasaklanma" });
    db.push(`sicil.${member.id}.${message.guild.id}`, { modid: message.member.id, sebep: reason, id: cezaID, zaman: Date.now(), komut: "Yasaklama"});
    db.add(`cezapuan.${member.id}.${message.guild.id}`, +50);
    db.add(`banCez.${message.author.id}.${message.guild.id}`, +1);
    db.add(`ban.${member.id}.${message.guild.id}`, +1);
    db.add(`cezaid.${message.guild.id}`, +1);
    if (!message.member.hasPermission("ADMINISTRATOR")) { db.add(`bandb.${message.author.id}.${message.guild.id}`, +1)};
    let cpuan = db.get(`cezapuan.${member.id}.${message.guild.id}`);
  
    setTimeout(function(){
        if (ayar.punishment.CezapuanLog && client.channels.cache.has(ayar.punishment.CezapuanLog)) client.channels.cache.get(ayar.punishment.CezapuanLog).send(`${member} - (\`${member.id}\`) aldığı "Ban" (\`Ceza ID #${cezaID}\`) cezası ile **${cpuan || '0'}** ceza puanına ulaştı.`).catch();
      }, 15000);

    message.channel.send(embed.setDescription(`${member} (\`${member.id}\`) adlı üye ${reason} sebebi ile sunucudan yasaklandı. (\`#${cezaID}\`)`).setImage("https://media.discordapp.net/attachments/607927671720116292/855701936044638228/oobune.gif"));
    setTimeout(function(){   
    if (message.guild.channels.cache.has(ayar.punishment.BanLog)) message.guild.channels.cache.get(ayar.punishment.BanLog).send(`${Other.General.yes} ${member} (\`${member.id}\`) adlı üye ${reason} sebebi ile ${message.author} (\`${message.author.id}\`) tarafından sunucudan yasaklandı. (\`#${cezaID}\`)`)
  }, 10000);
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["yasakla","yargı"]
  };
  
  exports.help = {
    name: "ban",
    description: "",
    usage: ""
  };
