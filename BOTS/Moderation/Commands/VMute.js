const { MessageEmbed } = require("discord.js");
const db = require("quick.db");
const ms = require("ms");
const Other = require("../Settings/Other.json")
const moment = require("moment");
const ayar = require("../Settings/Settings.json");

exports.run = async (client, message, args) => {
  let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true})).setFooter(ayar.conf).setColor(`RANDOM`).setTimestamp();
    if (!message.member.roles.cache.has(ayar.punishment.VmuteHammer) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(embed.setDescription(`Bu komudu kullanmak için gerekli izinlere sahip değilsin.`)).then(x => x.delete({timeout: 10000}));
  let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  if(!member) return message.channel.send(embed.setDescription("Geçerli bir üye belirtmelisin!")).then(x => x.delete({timeout: 5000}));
  if (message.member.roles.highest.position <= member.roles.highest.position) return message.channel.send(embed.setDescription(`Belirttiğin kişi senden üstün veya onunla aynı yetkidesin!`)).then(x => x.delete({timeout: 5000}));
  let muteler = db.get(`tempsmute`) || [];
  let sure = args[1];
  let reason = args.splice(2).join(" ");
  if(!sure || !ms(sure) || !reason) return message.channel.send(embed.setDescription("Geçerli bir süre (1s/1m/1h/1d) ve sebep belirtmelisin!")).then(x => x.delete({timeout: 5000}));
  yaziSure = sure.replace(/y/, ' yıl').replace(/d/, ' gün').replace(/s/, ' saniye').replace(/m/, ' dakika').replace(/h/, ' saat')
  let vmutedurum = db.get(`vstatus.${member.id}.${message.guild.id}`)
  if(vmutedurum == "true") return message.channel.send(`${Other.General.no} Belirtilen kullanıcının aktif \`Ses Mute\` Cezası bulunduğu için tekrardan mute atılamaz.`)
  if(member.voice.channel) member.voice.setMute(true).catch();
  if (!muteler.some(j => j.id == member.id)) {
    db.push(`tempsmute`, {id: member.id, kalkmaZamani: Date.now()+ms(sure)})

  }
  let cezaID = db.get(`cezaid.${message.guild.id}`)+1
  db.add(`cezaid.${message.guild.id}`, +1);
  db.set(`punishments.${cezaID}.${message.guild.id}`, { mod: message.author.id, sebep: reason, kisi: member.id, id: cezaID, zaman: Date.now(), komut: "V.Mute" });
  db.push(`sicil.${member.id}.${message.guild.id}`, { modid: message.author.id, sebep: reason, id: cezaID, zaman: Date.now(), komut: "V.Mute" });
  db.add(`cezapuan.${member.id}.${message.guild.id}`, +10);
  db.add(`vmuteCez.${message.author.id}.${message.guild.id}`, +1);
  db.add(`vmute.${member.id}.${message.guild.id}`, +1);
  db.set(`vstatus.${member.id}.${message.guild.id}`, "true");
  let cpuan = db.get(`cezapuan.${member.id}.${message.guild.id}`);
  setTimeout(() => {
  member.roles.add(ayar.punishment.VMuted)
  }, 3000)
  message.channel.send(`${Other.General.yes} ${member} ${yaziSure} boyunca  boyunca ses kanallarında susturuldu. (\`#${cezaID}\`)`).catch();
  message.react(Other.General.yes)
  setTimeout(() => {
  if(ayar.punishment.VmuteLog && client.channels.cache.has(ayar.punishment.VmuteLog)) client.channels.cache.get(ayar.punishment.VmuteLog).send(embed.setDescription(`${member} üyesi, ${message.author} tarafından **${yaziSure}** boyunca **${reason}** nedeniyle seste mutelendi!`)).catch();
  }, 10000)
  setTimeout(() => {
  if (ayar.punishment.CezapuanLog && client.channels.cache.has(ayar.punishment.CezapuanLog)) client.channels.cache.get(ayar.punishment.CezapuanLog).send(`${member} - (\`${member.id}\`) aldığı "V.Mute" (\`Ceza ID #${cezaID}\`) cezası ile **${cpuan || '0'}** ceza puanına ulaştı.`).catch();
  }, 6000)
  setTimeout(() => {
    let vmutedurum = db.get(`vstatus.${member.id}.${message.guild.id}`)
    if (vmutedurum  === "false") return;
    if(vmutedurum == "true") {
      message.guild.channels.cache.get(ayar.punishment.VmuteLog).send(`${Other.General.UnMuted} ${member} kullanıcısnın aktif olan mute cezası bitti. (Ceza ID: \`#${cezaID}\`)`) 
      member.roles.remove(ayar.punishment.Muted);
      member.roles.remove(ayar.punishment.VMuted)
      db.set(`vstatus.${member.id}.${message.guild.id}`, "false")
  }
  }, ms(sure))
  
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: []
};

exports.help = {
  name: "vmute",
  description: "",
  usage: ""
};