const { MessageEmbed } = require("discord.js");
const db = require("quick.db");
const ayar = require("../Settings/Settings.json");
const Other = require("../Settings/Other.json")
exports.run = async (client, message, args) => {
    let executor = message.member
    let cezaID = db.get(`cezaid.${message.guild.id}`)+1
    let embed = new MessageEmbed().setColor("#992D22")
    if (!message.member.roles.cache.has(ayar.punishment.JailHammer) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(`Bu komudu kullanmak için gerekli izinlere sahip değilsin.`).then(x => x.delete({timeout: 10000}));
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    let reason = args.splice(1).join(" ");
    if (!member || reason.length < 1) return message.channel.send(`Komutu doğru kullanmalısın! \`Örnek: ${ayar.BotSettings.prefix || ""}jail @üye [sebep]\``).then(x => x.delete({timeout: 10000}));
    if (message.member.roles.highest.position <= member.roles.highest.position) return message.channel.send(embed.setDescription(`Bu üyenin yetkileri senden yüksek veya aynı yetkide olduğunuz için işlemi gerçekleştiremiyorum.`)).then(x => x.delete({timeout: 10000}));
    if (member.user.bot) return message.channel.send(`Bu komutu botlar üzerinde kullanamazsın!`).then(x => x.delete({timeout: 10000}));
    if (message.member.roles.cache.has(ayar.punishment.Cezali)) return message.channel.send(`Bu üyenin yetkileri senden yüksek veya aynı yetkide olduğunuz için işlemi gerçekleştiremiyorum.`).then(x => x.delete({timeout: 10000}));
    let jstatus = db.get(`jstatus.${member.id}.${message.guild.id}`)

    if (jstatus  === "true") return message.channel.send("Bu Kullanıcının aktif **JAIL** cezası bulunmaktadır.").then(x => x.delete({timeout: 10000})); 

    db.push("jails", { id: member.id });
    db.add(`cezaid.${message.guild.id}`, +1);
    db.set(`punishments.${cezaID}.${message.guild.id}`, { mod: message.author.id, sebep: reason, kisi: member.id, id: cezaID, zaman: Date.now(), komut: "Cezalı", Bitis:"Süresiz" });
    db.set(`jstatus.${member.id}.${message.guild.id}`, "true")
    db.push(`sicil.${member.id}.${message.guild.id}`, { modid: message.member.id, sebep: reason, id: cezaID, zaman: Date.now(), komut: "Cezalı", Bitis:"Süresiz" });
    db.add(`cezapuan.${member.id}.${message.guild.id}`, +35);
    db.add(`jailCez.${message.author.id}.${message.guild.id}`, +1);
    db.add(`jail.${member.id}.${message.guild.id}`, +1);
    let cezapuan = db.get(`cezapuan.${member.id}.${message.guild.id}`);

  


let booster = false;
if(member.roles.cache.has(ayar.punishment.BoosterRole)) booster = true;

    if (member.voice.channel) member.voice.kick();
    message.channel.send(embed.setDescription(`${member}, üyesine ${reason} Sebebiyle Cezalı verildi. (\`#${cezaID}\`)`).setColor("#992D22"))
    member.setNickname("• Cezalı")
    setTimeout(() => {
    if (message.guild.channels.cache.has(ayar.punishment.JailLog)) message.guild.channels.cache.get(ayar.punishment.JailLog).send(embed.setDescription(`${member}, üyesine <@&${ayar.punishment.Cezali}> rolü ${message.author} tarafından verildi.(\`#${cezaID}\`) \n Sebep: ${reason} `))
  }, 10000);
  setTimeout(() => {
  if (ayar.punishment.CezapuanLog && client.channels.cache.has(ayar.punishment.CezapuanLog)) client.channels.cache.get(ayar.punishment.CezapuanLog).send(`${member} - (\`${member.id}\`) aldığı "Jail" (\`Ceza ID #${cezaID}\`) cezası ile **${cezapuan || '0'}** ceza puanına ulaştı.`).catch();
}, 15000);
let jailrolu = ayar.punishment.Cezali 
let boosterrolu = ayar.punishment.BoosterRole

    setTimeout(() => {
      booster ? member.roles.set([boosterrolu, jailrolu]) : member.roles.set([jailrolu])
    }, 3000);


};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["jail"]
  };
  
  exports.help = {
    name: "cezalı",
    description: "",
    usage: ""
  };