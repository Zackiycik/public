const Discord = require('discord.js');

const { MessageEmbed } = require("discord.js");
const db = require("quick.db");

const ms = require("ms");
const moment = require("moment");
const ayar = require("../Settings/Settings.json");
const Other = require("../Settings/Other.json")
exports.run = async (client, message, args) => {
    let executor = message.member

    if (!message.member.roles.cache.has(ayar.punishment.MuteHammer) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(embed.setDescription(`Bu komudu kullanmak için gerekli izinlere sahip değilsin.`)).then(x => x.delete({timeout: 10000}));
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    let embed = new MessageEmbed().setAuthor(executor.user.tag, executor.user.displayAvatarURL({dynamic: true})).setColor("RED").setTimestamp();

   // if (member.hasPermission("BAN_MEMBERS")) return message.channel.send(`Hata! ${member} isimli kullanıcı bu sunucuda yetkili.`)

    let time = args[1]
    let reason = args.splice(2).join(" ");
    if (!member || !time || !ms(time) || reason.length < 1) return message.channel.send(embed.setDescription(`Komutu doğru kullanmalısın! \`Örnek: ${ayar.prefix || ""}mute @üye [süre (1s/1d/1m/1h) ] [sebep]\``)).then(x => x.delete({timeout: 10000}));
    if (member.user.bot) return message.channel.send(embed.setDescription(`Bu komutu botlar üzerinde kullanamazsın!`)).then(x => x.delete({timeout: 10000}));
    if (message.member.roles.highest.position <= member.roles.highest.position) return message.channel.send(embed.setDescription(`Bu üyenin yetkileri senden yüksek veya aynı yetkide olduğunuz için işlemi gerçekleştiremiyorum.`)).then(x => x.delete({timeout: 10000}));

    
    yaziSure = time.replace(/y/, ' yıl').replace(/d/, ' gün').replace(/s/, ' saniye').replace(/m/, ' dakika').replace(/h/, ' saat')
    let atilanAy = moment(Date.now()).format("MM");
    let atilanSaat = moment(Date.now()).format("HH:mm:ss");
    let atilanGün = moment(Date.now()).format("DD");
    let bitişAy = moment(Date.now()+ms(time)).format("MM");
    let bitişSaat = moment(Date.now()+ms(time)).format("HH:mm:ss");
    let bitişGün = moment(Date.now()+ms(time)).format("DD");

    let muteAtılma = `${atilanGün} ${atilanAy.replace("01", "Ocak").replace("02", "Şubat").replace("03", "Mart").replace("04", "Nisan").replace("05", "Mayıs").replace("06", "Haziran").replace("07", "Temmuz").replace("08", "Ağustos").replace("09", "Eylül").replace("10", "Ekim").replace("11", "Kasım").replace("12", "Aralık")} ${atilanSaat}`;
    let muteBitiş = `${bitişGün} ${bitişAy.replace("01", "Ocak").replace("02", "Şubat").replace("03", "Mart").replace("04", "Nisan").replace("05", "Mayıs").replace("06", "Haziran").replace("07", "Temmuz").replace("08", "Ağustos").replace("09", "Eylül").replace("10", "Ekim").replace("11", "Kasım").replace("12", "Aralık")} ${bitişSaat}`;

    let cezaID = db.get(`cezaid.${message.guild.id}`)+1
    db.add(`cezaid.${message.guild.id}`, +1);
    db.push("tempmute", { id: member.id, bitis: Date.now()+ms(time) });
    db.set(`punishments.${cezaID}.${message.guild.id}`, { mod: message.member.displayName, modid: message.author.id, sebep: reason, kisi: member.id, id: cezaID, zaman: Date.now(), komut: "Mute" });
    db.set(`mstatus.${member.id}.${message.guild.id}`, "true");
    db.push(`sicil.${member.id}.${message.guild.id}`, { mod: message.member.displayName, modid: message.author.id, sebep: reason, id: cezaID, zaman: Date.now(), komut: "Mute", Bitis: yaziSure });
    db.add(`cezapuan.${member.id}.${message.guild.id}`, +4);
    db.add(`cmuteCez.${message.author.id}.${message.guild.id}`, +1);
    db.add(`cmute.${member.id}.${message.guild.id}`, +1);
    let cpuan = db.get(`cezapuan.${member.id}.${message.guild.id}`);
    message.channel.send(`${Other.General.yes} ${member} ${yaziSure} boyunca metin kanallarında susturuldu. (\`#${cezaID}\`)`)
    message.react(Other.General.yes)
    setTimeout(() => {
    member.roles.add(ayar.punishment.Muted).catch();
    }, 3000)

    setTimeout(() => {
if (message.guild.channels.cache.has(ayar.punishment.MuteLog)) message.guild.channels.cache.get(ayar.punishment.MuteLog).send(embed.setDescription(`${member} (\`${member.user.username}\` - \`${member.id}\`) adlı üye ${yaziSure} boyunca metin kanallarında susturuldu. (\`#${cezaID}\`) \n \n\`•\` Yetkili: ${message.author} (\`${message.author.id}\`) \n\`•\` Metin kanalında susturulma: ${muteAtılma} \n\`•\` Metin kanalında susturulma bitiş: ${muteBitiş} \n\`•\` Sebep: ${reason}`));
}, 10000)
setTimeout(() => {
if (ayar.punishment.CezapuanLog && client.channels.cache.has(ayar.punishment.CezapuanLog)) client.channels.cache.get(ayar.punishment.CezapuanLog).send(`${member} - (\`${member.id}\`) aldığı "Mute" (\`Ceza ID #${cezaID}\`) cezası ile **${cpuan || '0'}** ceza puanına ulaştı.`).catch();
}, 6000)

setTimeout(() => {
  let mutedurum = db.get(`mstatus.${member.id}.${message.guild.id}`)
  if (mutedurum  === "false") return;
  if(mutedurum == "true") {
    message.guild.channels.cache.get(ayar.punishment.MuteLog).send(`${Other.General.UnMuted} ${member} kullanıcısnın aktif olan mute cezası bitti. (Ceza ID: \`#${cezaID}\`)`) 
    member.roles.remove(ayar.punishment.Muted);
    db.set(`mstatus.${member.id}.${message.guild.id}`, "false")
}
}, ms(time))

}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["mute"]
  };
  
  exports.help = {
    name: "chatmute",
    description: "",
    usage: ""
  };