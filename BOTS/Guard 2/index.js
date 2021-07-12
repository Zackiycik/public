const Discord = require("discord.js");
const fs = require("fs")
const db = require("fera.db")
const Bots = require("../../BOTS/Settings/Bots.json")
const Settings = require("../../BOTS/Settings/Guards.json")
const GuardSetting = require("../../BOTS/Settings/Guards.json")
const whitelist = require("../../BOTS/Settings/Whitelist.json")
const Other = require("../../BOTS/Settings/Other.json")
const client = new Discord.Client();
const ms = require("ms")
client.rolLimit = new Map();
client.kanalKoruma = new Map();
client.rolName = new Map()
client.owner = whitelist.Owners
client.imwhite = whitelist.Whitelist
client.evulate = []
client.channelLimit = new Map()
client.channelName = new Map()
client.blackList = []
client.banLimit = new Map()
client.roleBackup = new Map()
client.roleCreate = new Map()
client.botAccounts = whitelist.Bots
client.botroles = whitelist.BotRoles
let kanal = GuardSetting.GuardLog2
let ustKanal = GuardSetting.NoPermissionLog 
let token = Bots.Guard2

let guarddurum = db.get("guarddurum")

client.on('ready', async () => {
    client.user.setPresence({ activity: { name: Bots.Bot_Type }, status: Bots.Bot_Status });
  
      let sesKanal = client.channels.cache.get(Bots.Bot_Voice_Channel);
      if(sesKanal) sesKanal.join().catch();
      console.log(`${client.user.username} İsmi ile giriş yapıldı! Guard II Online`)

  })


client.commands = new Discord.Collection();//
client.aliases = new Discord.Collection();//
fs.readdir('./BOTS/Guard 2/Commands', (err, files) => {//
    if (err) console.error(err);//
    files.forEach(f => {//
        let props = require(`./Commands/${f}`);//
        client.commands.set(props.help.name, props);//
        props.conf.aliases.forEach(alias => {//
            client.aliases.set(alias, props.help.name);//
        });
    });
});




client.reload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./Commands/${command}`)];
            let cmd = require(`./Commands/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

client.load = command => {
    return new Promise((resolve, reject) => {
        try {
            let cmd = require(`./Commands/${command}`);
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};



client.unload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./Commands/${command}`)];
            let cmd = require(`./Commands/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

client.elevation = message => {
    if (!message.guild) {
        return;
    }

    let permlvl = 0;
    if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
    if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
    if (message.author.id === Settings.BotSettings.Owner) permlvl = 4;
    return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
// client.on('debug', e => {
//   console.log(chalk.bgBlue.green(e.replace(regToken, 'that was redacted')));
// });
client.on('warn', e => {
    console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));
});
client.on('error', e => {
    console.log(chalk.bgRed(e.replace(regToken, 'that was redacted')));
});





client.on("roleDelete", async (role) => {
    if(guarddurum === "true") return;
  await role.guild.fetchAuditLogs({
      type: "ROLE_DELETE"
  }).then(async (audit) => {
      let ayar = audit.entries.first()
      let yapan = ayar.executor 
      if (Date.now() - ayar.createdTimestamp > 5000) return;
      if (client.imwhite.includes(yapan.id)) return;
      whitelistmap = db.fetch("whitelist") ? db.fetch("whitelist") : [] 
      let guvenliler = whitelistmap
      if  (guvenliler.some(g => g.güvenli.includes(yapan.id))) return;
      client.channels.cache.get(kanal).send(`  <@${yapan.id}> | (\`${yapan.id}\`) kişisi bir rol sildi ve yasaklandı!`)
      let arr = ["ADMINISTRATOR", "BAN_MEMBERS", "KICK_MEMBERS", "MANAGE_ROLES", "MANAGE_CHANNELS", "MANAGE_GUILD", "VIEW_AUDIT_LOG"]
      role.guild.roles.cache.filter(a => arr.some(x => a.permissions.has(x)) == true && role.guild.members.cache.get(client.user.id).roles.highest.rawPosition > a.rawPosition && !client.botroles.includes(a.id)).map(huh => {
          huh.setPermissions(0)
      })
      await role.guild.members.ban(yapan.id, {
          reason: "Rol silmek"
      }).catch(e => client.channels.cache.get(ustKanal).send(":no_entry_sign:  <@" + yapan.id + "> rol sildi fakat yetkim yetmediği için kullanıcıyı banlayamadım"))
      client.blackList.push(yapan.id)
  })
});

client.on("roleUpdate", async (oldRole, newRole) => {
    if(guarddurum === "true") return;
  await newRole.guild.fetchAuditLogs({
      type: "ROLE_UPDATE"
  }).then(async (audit) => {
      let ayar = audit.entries.first()
      let hedef = ayar.target
      let yapan = ayar.executor
      if (Date.now() - ayar.createdTimestamp > 5000) return;
      if (yapan.id == client.user.id) return;
      if (client.imwhite.includes(yapan.id)) return;
      whitelistmap = db.fetch("whitelist") ? db.fetch("whitelist") : [] 
      let guvenliler = whitelistmap
      if  (guvenliler.some(g => g.güvenli.includes(yapan.id))) return;
      if (oldRole.permissions !== newRole.permissions) {
          let arr = ["ADMINISTRATOR", "BAN_MEMBERS", "VIEW_AUDIT_LOG", "KICK_MEMBERS", "MANAGE_ROLES", "MANAGE_CHANNELS", "MANAGE_GUILD"]
          if (arr.some(x => newRole.permissions.has(x)) == true) {
              client.channels.cache.get(kanal).send(` <@${yapan.id}> | (\`${yapan.id}\`) kişisi rollere yasaklı izin tanıdığı için yasaklandı!`)
          //    newRole.setPermissions(0);
          }
          newRole.guild.roles.cache.filter(a => arr.some(x => a.permissions.has(x)) == true && newRole.guild.members.cache.get(client.user.id).roles.highest.rawPosition > a.rawPosition && !client.botroles.includes(a.id)).map(huh => {
              // client.backup.set(huh.id, huh.permissions.bitfield)
           //   huh.setPermissions(0)
          })
          await newRole.guild.members.ban(yapan.id, {
              reason: "Rollere gereksiz izin tanımak"
          }).catch(e => client.channels.cache.get(ustKanal).send(":no_entry_sign:  <@" + yapan.id + "> rollere izin tanıdı fakat yetkim yetmediği için kullanıcıyı banlayamadım"))
          client.blackList.push(yapan.id)
      }

  })
});


client.on("roleUpdate", async (oldRole, newRole) => {
    if(guarddurum === "true") return;
  await newRole.guild.fetchAuditLogs({
      type: "ROLE_UPDATE"
  }).then(async (audit) => {
      let ayar = audit.entries.first()
      let hedef = ayar.target
      let yapan = ayar.executor
      if (Date.now() - ayar.createdTimestamp > 5000) return;
      if (yapan.id == client.user.id) return
      if (client.imwhite.includes(yapan.id)) return;
      whitelistmap = db.fetch("whitelist") ? db.fetch("whitelist") : [] 
      let guvenliler = whitelistmap
      if  (guvenliler.some(g => g.güvenli.includes(yapan.id))) return;
      if (oldRole.name !== newRole.name) {
          client.channels.cache.get(kanal).send(` (\`${yapan.id}\`) | <@${yapan.id}> kişisi ${oldRole.name} rolün ismini değiştirdiği için sunucudan yasaklandı.`)
          newRole.guild.members.ban(yapan.id, {
              reason: "Rol isimlerini değiştirmek."
          }).catch(e => client.channels.cache.get(ustKanal).send(":no_entry_sign:  <@" + yapan.id + "> rol ismi değişti fakat yetkim yetmediği için kullanıcıyı banlayamadım"))
          await newRole.setName(oldRole.name)
          client.blackList.push(yapan.id)
          let arr = ["ADMINISTRATOR", "BAN_MEMBERS", "KICK_MEMBERS", "MANAGE_ROLES", "MANAGE_CHANNELS", "MANAGE_GUILD", "VIEW_AUDIT_LOG"]
          newRole.guild.roles.cache.filter(a => arr.some(x => a.permissions.has(x)) == true && newRole.guild.members.cache.get(client.user.id).roles.highest.rawPosition > a.rawPosition && !client.botroles.includes(a.id)).map(huh => {
              //client.roleBackup.set(huh.id, huh.permissions.bitfield)
          //    huh.setPermissions(0)
          })
      }

  })
});


client.on("roleCreate", async role => {
    await role.guild.fetchAuditLogs({
        type: "ROLE_CREATE"
    }).then(async (audit) => {
        let ayar = audit.entries.first()
        let hedef = ayar.target
        let yapan = ayar.executor
        if (Date.now() - ayar.createdTimestamp > 5000) return;
        if (yapan.id == client.user.id) return;
        if (client.imwhite.includes(yapan.id)) return;
        whitelistmap = db.fetch("whitelist") ? db.fetch("whitelist") : [] 
        let guvenliler = whitelistmap
        if  (guvenliler.some(g => g.güvenli.includes(yapan.id))) return;
            client.channels.cache.get(kanal).send(` (\`${yapan.id}\`) | <@${yapan.id}> kişisi ${role.name} rolünü açtı rolü sildim kullanıcıyı banladım.`)
            role.guild.members.ban(yapan.id, {
                reason: "Rol Açmak."
            }).catch(e => client.channels.cache.get(ustKanal).send(":no_entry_sign:  <@" + yapan.id + "> rol ismi değişti fakat yetkim yetmediği için kullanıcıyı banlayamadım"))
            role.delete({ reason: "İzinsiz Rol Açmak" }).catch(e => { })	
            client.blackList.push(yapan.id)
            let arr = ["ADMINISTRATOR", "BAN_MEMBERS", "KICK_MEMBERS", "MANAGE_ROLES", "MANAGE_CHANNELS", "MANAGE_GUILD", "VIEW_AUDIT_LOG"]
            role.guild.roles.cache.filter(a => arr.some(x => a.permissions.has(x)) == true && role.guild.members.cache.get(client.user.id).roles.highest.rawPosition > a.rawPosition && !client.botroles.includes(a.id)).map(huh => {
                //client.roleBackup.set(huh.id, huh.permissions.bitfield)
            //    huh.setPermissions(0)
            })
        
  
    })
  });





client.on("message", async message => {
    if(guarddurum === "true") return;
  if (message.author.bot) return;
  if (message.author.id !== GuardSetting.Weka) return
  if (message.channel.type !== "text") return;
  if (!message.guild) return;
  let prefikslerim = ["."];
  let wekacim = false;
  for (const içindeki of prefikslerim) {
      if (message.content.startsWith(içindeki)) wekacim = içindeki;
  }
  if (!wekacim) return;
  const args = message.content.slice(wekacim.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  const event = message.content.toLower;
  const split = message.content.split('"');
  switch (command) {
      case "eval":
          if (args.join(" ").toLowerCase().includes('token')) return message.channel.send("Wow, you're smart.")
          const clean = text => {
              if (typeof (text) === "string") return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
              else return text;
          }
          try {
              const code = args.join(" ");
              let evaled = await eval(code);
              if (typeof evaled !== "string")
                  evaled = require("util").inspect(evaled);
              message.channel.send(clean(evaled), {
                  code: "xl"
              });
          } catch (err) {
              message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
          }
          break

  }
});

client.on("disconnect", () => console.log("Bot bağlantısı kesildi"))
client.on("reconnecting", () => console.log("Bot tekrar bağlanıyor..."))
client.on("error", e => console.log(e))
client.on("warn", info => console.log(info));

process.on("uncaughtException", err => {
  const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
  console.error("Beklenmedik Hata: ", errorMsg);
  process.exit(1);
});

process.on("unhandledRejection", err => {
  console.error("Yakalanamayan Hata: ", err);
});

client.login(token)


//" Yattım Allah Kaldır Beni Nur İçinde Daldır Beni Can Bedenden Ayrılırken İmanımla Gönder Beni " gece patlamamak için 
// "Allahümme ente rabbi la ilahe illa ente aleyke tevekkeltü ve ente rabb'ül-arş'il-azim, maşallahü kane ve ma lem yeşe lem yekün ve la havle ve la kuvvete illa billah'il Aliyy'il Azim." Tam Koruma 
//اللهم احرص على ألا تنفجر جزمة الثأر وأحذية الغار الأخرى يا إلهي هذه الجزمة هي الأفضل إن شاء الله آمين.
