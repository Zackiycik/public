const Discord = require("discord.js");
const fs = require("fs");

const client = new Discord.Client();
const Bots = require("../Settings/Bots.json")
require("./EventLoader")(client);
const db = require("quick.db")


client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./BOTS/Async/Commands/', (err, files) => {//
  if (err) console.error(err);//
  files.forEach(f => {//
      let props = require(`./Commands/${f}`);//
      client.commands.set(props.help.name, props);//
      props.conf.aliases.forEach(alias => {//
          client.aliases.set(alias, props.help.name);//
      });
  });
});



client.elevation = message => {
  if (!message.guild) {
    return;
  }
  let permlvl = 0;
  if (!message.member.permissions.has("MANAGE_MESSAGES")) permlvl = 1;
  if (!message.member.permissions.has("KICK_MEMBERS")) permlvl = 2;
  if (!message.member.permissions.has("BAN_MEMBERS")) permlvl = 3;
  if (!message.member.permissions.has("ADMINISTRATOR")) permlvl = 4;
  return permlvl;
};

client.login(Bots.Controller).then(
  function() {
    
  client.user.setPresence({ activity: { name: Bots.Bot_Type }, status: Bots.Bot_Status });

  let sesKanal = client.channels.cache.get(Bots.Bot_Voice_Channel);
  if(sesKanal) sesKanal.join().catch();
    console.log(`${client.user.username} İsmi ile giriş yapıldı! Controller Online`);
  },

  function() {
    
  client.user.setPresence({ activity: { name: Bots.Bot_Type }, status: Bots.Bot_Status });

  let sesKanal = client.channels.cache.get(Bots.Bot_Voice_Channel);
  if(sesKanal) sesKanal.join().catch();
    console.log("Token Hatalı. Bot Başlatılamadı!");
  }
);

client.on('ready', async () => {
  client.user.setPresence({ activity: { name: Bots.Bot_Type }, status: Bots.Bot_Status });

    let sesKanal = client.channels.cache.get(Bots.Bot_Voice_Channel);
    if(sesKanal) sesKanal.join().catch();
    setInterval(() => {
      checkGuildUserStatus();
        }, 25000);

    setInterval(() => {
  checkingAll();
    }, 10000);

      setInterval(() => {
        checkBanLimits();
      }, 10000);
    
})



const ayar = require("../Settings/Async.json")

function checkingAll() {
  let jail = db.get("jail") || [];
  let mute = db.get("tempmute") || [];

  let bans = db.get("bans") || [];
  let ban = db.get("ban") || [];
 let sesmuteler = db.get("tempsmute") || [];


  for (let jailUye of jail) {
      let kullanici = client.guilds.cache.get(Bots.GuildID).members.cache.get(jailUye.id);
      if (kullanici && !kullanici.roles.cache.has(ayar.cezali_role)) {
          kullanici.roles.cache.has(ayar.booster_role) ? kullanici.roles.set([ayar.booster_role, ayar.cezali_role]) : kullanici.roles.set([ayar.cezali_role]).catch();
          if (kullanici.voice.channel) kullanici.voice.kick();
      };
  };

  for (let muteUye of mute) {
      let kullanici = client.guilds.cache.get(Bots.GuildID).members.cache.get(muteUye.id);
      if (Date.now() >= muteUye.bitis) {
          if (kullanici && kullanici.roles.cache.has(ayar.mute_role)) kullanici.roles.remove(ayar.mute_role).catch();
          db.set("tempmute", mute.filter(x => x.id !== muteUye.id));
      }else{
          if (kullanici && !kullanici.roles.cache.has(ayar.mute_role)) kullanici.roles.add(ayar.mute_role).catch();
      };
  };

 
  for (let yasak of bans) {
      let kullanici = client.guilds.cache.get(Bots.GuildID).members.cache.get(yasak.id);
      if (kullanici) {
          kullanici.ban({reason: "Ban Kontrol"}).catch();
      };
  };





};


function checkGuildUserStatus() {
  let jail = db.get("jail") || [];
  let mute = db.get("tempmute") || [];
  let vmute = db.get("tempsmute") || [];

  let sunucu = client.guilds.cache.get(Bots.GuildID);
  client.guilds.cache.get(Bots.GuildID).members.cache.forEach(x => {
      if (db.has(`jstatus.${x.id}.${sunucu.id}`) && jail.some(y => y.id !== x.id)) {
          db.set(`jstatus.${x.id}.${sunucu.id}`, "false");
      };
      if (db.has(`mstatus.${x.id}.${sunucu.id}`) && mute.some(y => y.id !== x.id)) {
          db.set(`mstatus.${x.id}.${sunucu.id}`, "false");
      };
      if (db.has(`vstatus.${x.id}.${sunucu.id}`) && vmute.some(y => y.id !== x.id)) {
          db.set(`vstatus.${x.id}.${sunucu.id}`, "false");
      };
  });
};


function checkBanLimits() {
  db.delete("limitler");
};


function checkTagges() {

  let tag = ayar.tag
  let guild = client.guilds.cache.get(Bots.GuildID)
  let rol = ayar.tag_rol
  let taglilar = guild.members.cache.filter(s => s.user.username.includes(tag) && !s.roles.cache.has(rol))
  let tagsizlar = guild.members.cache.filter(s => !s.user.username.includes(tag) && s.roles.cache.has(rol))

  taglilar.array().forEach(async(member, index) => {
      setTimeout(async() => {
        if (member.user.bot) return;
          await member.roles.add(rol).catch();
      }, index * 1000)
  })

  tagsizlar.array().forEach(async(member, index) => {
      setTimeout(async() => {
        if (member.user.bot) return;
        await member.roles.remove(rol).catch();
      }, index * 3000)
  })

}