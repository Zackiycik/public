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
let kanal = GuardSetting.GuardLog
let ustKanal = GuardSetting.NoPermissionLog 
let token = Bots.Guard1

let guarddurum = db.get("guarddurum")

client.on('ready', async () => {
    client.user.setPresence({ activity: { name: Bots.Bot_Type }, status: Bots.Bot_Status });
  
      let sesKanal = client.channels.cache.get(Bots.Bot_Voice_Channel);
      if(sesKanal) sesKanal.join().catch();
      console.log(`${client.user.username} İsmi ile giriş yapıldı! Guard I Online`)

  })


client.commands = new Discord.Collection();//
client.aliases = new Discord.Collection();//
fs.readdir('./BOTS/Guard 1/Commands/', (err, files) => {//
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



client.on("channelDelete", async (channel) => {
    if(guarddurum === "true") return;
  await channel.guild.fetchAuditLogs({
      type: "CHANNEL_DELETE"
  }).then(async (audit) => {
      let ayar = audit.entries.first()
      let yapan = ayar.executor
      if (Date.now() - ayar.createdTimestamp > 5000) return;
      if (client.imwhite.includes(yapan.id)) return
      if(guarddurum === "true") return;
      whitelistmap = db.fetch("whitelist") ? db.fetch("whitelist") : [] 
      let guvenliler = whitelistmap
      if  (guvenliler.some(g => g.güvenli.includes(yapan.id))) return;


      client.channels.cache.get(kanal).send(` <@${yapan.id}> | (\`${yapan.id}\`) kişisi ${channel.name} isimli kanalı sildi ve yasaklandı!`)
      let arr = ["ADMINISTRATOR", "BAN_MEMBERS", "KICK_MEMBERS", "MANAGE_ROLES", "MANAGE_CHANNELS", "MANAGE_GUILD", "VIEW_AUDIT_LOG"]
      channel.guild.roles.cache.filter(a => arr.some(x => a.permissions.has(x)) == true && channel.guild.members.cache.get(client.user.id).roles.highest.rawPosition > a.rawPosition && !client.botroles.includes(a.id)).map(huh => {
        db.push("rols", {
            rolid: huh.id,
            rolPermission: huh.permissions.bitfield
          })
        // client.roleBackup.set(huh.id, huh.permissions.bitfield)
         // huh.setPermissions(0)
      })
      await channel.guild.members.ban(yapan.id, {
          reason: "Kanal silmek"
      }).catch(e => client.channels.cache.get(ustKanal).send(":no_entry_sign:  <@" + yapan.id + "> kanal sildi fakat yetkim yetmediği için kullanıcıyı banlayamadım"))
      client.blackList.push(yapan.id)
  })
});

client.on("guildUnavailable", async (guild) => {
    if(guarddurum === "true") return;
  let arr = ["ADMINISTRATOR", "BAN_MEMBERS", "KICK_MEMBERS", "MANAGE_ROLES", "MANAGE_CHANNELS", "MANAGE_GUILD", "VIEW_AUDIT_LOG"]
  guild.roles.cache.filter(a => arr.some(x => a.permissions.has(x)) == true && guild.members.cache.get(client.user.id).roles.highest.rawPosition > a.rawPosition && !client.botroles.includes(a.id)).map(huh => {
      // client.roleBackup.set(huh.id, huh.permissions.bitfield)
      huh.setPermissions(0)
  })
  client.channels.cache.get(kanal).send(` Sunucu kullanılamaz hale geldiği için koruma amacıyla yetkileri kapadım!`)
});

client.on("guildMemberAdd", async (member) => {
    if(guarddurum === "true") return;
  if (!member.user.bot) return
  if (member.id === "607925451364499477") return;
  if (!client.botAccounts.includes(member.id)) {
      await member.guild.members.ban(member.id, {
          reason: "Bot izin verilen botlar listesinde bulunmuyor"
      })
  }
})

client.on("guildBanAdd", async (guild, member) => {
    if(guarddurum === "true") return;
  await guild.fetchAuditLogs({
      type: "MEMBER_BAN_ADD"
  }).then(async (audit) => {
      let ayar = audit.entries.first()
      let yapan = ayar.executor
      let hedef = ayar.target
      if (Date.now() - ayar.createdTimestamp > 5000) return;
      if (yapan.id == client.user.id) return;
      if (client.imwhite.includes(yapan.id)) return;
      whitelistmap = db.fetch("whitelist") ? db.fetch("whitelist") : [] 
      let guvenliler = whitelistmap
      if  (guvenliler.some(g => g.güvenli.includes(yapan.id))) return;
      let banLimit = client.banLimit.get(yapan.id) || 0
      banLimit++
      client.banLimit.set(yapan.id, banLimit)
      if (banLimit == 3) {
          await guild.members.ban(yapan.id, {
              reason: "Birden fazla kullanıcıya sağ tık ban işlemi uygulamak"
          }).catch(e => client.channels.cache.get(ustKanal).send(":no_entry_sign:  <@" + yapan.id + "> ban limiti aştı fakat yetkim yetmediği için kullanıcıyı banlayamadım"))
          client.blackList.push(yapan.id)
          client.banLimit.delete(yapan.id)
      }
      setTimeout(() => {
          if (client.banLimit.has(yapan.id)) {
              client.banLimit.delete(yapan.id)
          }
      }, ms("1m"))
  })
})

client.on("guildUpdate", async (oldGuild, newGuild) => {
    if(guarddurum === "true") return;
  await newGuild.fetchAuditLogs({
      type: "GUILD_UPDATE"
  }).then(async (audit) => {
      let ayar = audit.entries.first();
      let hedef = ayar.target;
      let yapan = ayar.executor;
      whitelistmap = db.fetch("whitelist") ? db.fetch("whitelist") : [] 
      let guvenliler = whitelistmap
      if (Date.now() - ayar.createdTimestamp > 5000) return;
      if (yapan.id == client.user.id) return;
      if (client.imwhite.includes(yapan.id)) return;
      if  (guvenliler.some(g => g.güvenli.includes(yapan.id))) return;
      if (oldGuild.name !== newGuild.name) {
          newGuild.setName(GuardSetting.servername)
          newGuild.members.ban(yapan.id, {
              reason: "Sunucu ismi değiştirmek."
          })
          client.blackList.push(yapan.id)
          client.channels.cache.get(kanal).send(` <@${yapan.id}> - (\`${yapan.id}\`) kişisi tarafından sunucu ismi değiştirildi. Kişi banlandı, Sunucu ismi eski haline çevirildi.`)
      }
  })
})


client.on("guildMemberUpdate", async (oldMember, newMember) => {
    if(guarddurum === "true") return;
  await newMember.guild.fetchAuditLogs({
      type: "MEMBER_ROLE_UPDATE"
  }).then(async (audit) => {
      let ayar = audit.entries.first()
      let hedef = ayar.target
      let yapan = ayar.executor
      if (hedef.id != newMember.id) return
      if (Date.now() - ayar.createdTimestamp > 5000) return;
      if (client.imwhite.includes(yapan.id)) return;
      whitelistmap = db.fetch("whitelist") ? db.fetch("whitelist") : [] 
      let guvenliler = whitelistmap
      if  (guvenliler.some(g => g.güvenli.includes(yapan.id))) return;
      newMember.roles.cache.forEach(async role => {
          if (!oldMember.roles.cache.has(role.id)) {
            let arr = ["ADMINISTRATOR", "BAN_MEMBERS", "KICK_MEMBERS", "MANAGE_ROLES", "MANAGE_CHANNELS", "MANAGE_GUILD", "VIEW_AUDIT_LOG"]
              if (arr.some(x => role.permissions.has(x)) == true) {
                  client.channels.cache.get(kanal).send(` <@${yapan.id}> | (\`${yapan.id}\`) kişisi <@${hedef.id}> | (\`${hedef.id}\`) kişisine yetki rolü (\`${role.name}\`) verdiği için yasaklandı!`)
                  await newMember.roles.remove(role)
                  await newMember.guild.members.ban(yapan.id, "Kişilere yetki rolü tanımlama").catch(e => client.channels.cache.get(ustKanal).send(":no_entry_sign:  <@" + yapan.id + "> yetki rolü verdi fakat yetkim yetmediği için kullanıcıyı banlayamadım"))
                  client.blackList.push(yapan.id)
              }
          }
      });
  })
})

client.on("channelUpdate", async (oldChannel, newChannel) => {
    if(guarddurum === "true") return;
  await newChannel.guild.fetchAuditLogs({
      type: "CHANNEL_UPDATE"
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
      if (oldChannel.name !== newChannel.name) {
          let limitOfChannel = client.channelName.get(yapan.id) || []
          limitOfChannel.push({
              channel: newChannel.id,
              name: oldChannel.name,
              newName: newChannel.name
          })
          client.channelName.set(yapan.id, limitOfChannel)
          if (limitOfChannel.length == 2) {
              let mapped = limitOfChannel.map(x => `${x.name} -> ${x.newName}`)
              client.channels.cache.get(kanal).send(` <@${yapan.id}> | (\`${yapan.id}\`) kişisi ${limitOfChannel.length} kanalın ismini değiştirdiği için yasaklandı.Değiştirmeye çalıştığı kanal isimleri aşağıda belirtilmiştir.\`\`\`${mapped.join("\n")}\`\`\``)
              newChannel.guild.members.ban(yapan.id, {
                  reason: "Kanal isimlerini değiştirmek."
              }).catch(e => client.channels.cache.get(ustKanal).send(":no_entry_sign:  <@" + yapan.id + "> kanal ismi değişti fakat yetkim yetmediği için kullanıcıyı banlayamadım"))
              client.blackList.push(yapan.id)
              limitOfChannel.map(async (x) => {
                  await newChannel.guild.channels.cache.get(x.channel).setName(x.name)
              })
              client.channelName.delete(yapan.id)
          }
          setTimeout(() => {
              if (client.channelName.has(yapan.id)) {
                  client.channelName.delete(yapan.id)
              }
          }, ms("30s"))
      }

  })
})




client.on("channelCreate", async channel => {
    if(guarddurum === "true") return;
  await channel.guild
      .fetchAuditLogs({
          type: "CHANNEL_CREATE"
      }).catch()
      .then(async audit => {
          let ayar = audit.entries.first();
          let yapan = ayar.executor;
          if (yapan.tag == client.user.tag) return;
          if (Date.now() - ayar.createdTimestamp > 5000) return;
          if (client.imwhite.includes(yapan.id)) return;
          whitelistmap = db.fetch("whitelist") ? db.fetch("whitelist") : [] 
          let guvenliler = whitelistmap
          if  (guvenliler.some(g => g.güvenli.includes(yapan.id))) return;
          let limit = client.channelLimit.get(yapan.id) || [];
          limit.push(channel.id);
          client.channelLimit.set(yapan.id, limit);
          if (limit.length == 3) {
              client.channels.cache.get(kanal).send(` <@${yapan.id}> | (\`${yapan.id}\`) kişisi toplam 3 kanal açtığı için sunucudan yasaklandı kanallar siliniyor. Açtığı kanallar \`\`\`${limit.map(x => channel.guild.channels.cache.get(x).name).join("\n")}\`\`\``);
              channel.guild.members.ban(yapan.id, {
                  reason: "3 Kanal açma limitini aşmak."
              }).catch(e => client.channels.cache.get(ustKanal).send(":no_entry_sign:  <@" + yapan.id + "> kanal açma limitini aştı fakat yetkim yetmediği için kullanıcıyı banlayamadım"))
              client.blackList.push(yapan.id)
              limit.map(async x => {
                  await channel.guild.channels.cache.get(x).delete();
              });
              client.channelLimit.delete(yapan.id);
          }
          setTimeout(() => {
              if (client.channelLimit.has(yapan.id)) {
                  client.channelLimit.delete(yapan.id);
              }
          }, ms("1m"));
      });
});

client.on("channelUpdate", async (oldChannel, newChannel) => {
    if(guarddurum === "true") return;
  newChannel.guild.fetchAuditLogs({
      type: "CHANNEL_OVERWRITE_UPDATE"
  }).then(async audit => {
      let ayar = audit.entries.first();
      let yapan = ayar.executor;
      if (yapan.tag == client.user.tag) return;
      if (Date.now() - ayar.createdTimestamp > 5000) return;
      if (client.imwhite.includes(yapan.id)) return;
      whitelistmap = db.fetch("whitelist") ? db.fetch("whitelist") : [] 
      let guvenliler = whitelistmap
      if  (guvenliler.some(g => g.güvenli.includes(yapan.id))) return;
      if (oldChannel.permissionOverwrites !== newChannel.permissionOverwrites) {
          let everyonePerm = newChannel.permissionOverwrites.filter(p => p.id == newChannel.guild.id).map(x => (x.allow.bitfield));
          let everyonePermission = new Discord.Permissions(everyonePerm[0]).toArray();
          let olDeveryonePerm = oldChannel.permissionOverwrites.filter(p => p.id == newChannel.guild.id).map(x => (x.allow.bitfield));
          let olDeveryonePermission = new Discord.Permissions(olDeveryonePerm[0]).toArray();
          if (olDeveryonePermission.includes("MENTION_EVERYONE") || olDeveryonePermission.includes("MANAGE_CHANNELS")) return;
          if (everyonePermission.includes("MENTION_EVERYONE") || everyonePermission.includes("MANAGE_CHANNELS")) {
              newChannel.guild.members.ban(yapan.id, {
                  reason: "Kanallara gereksiz izin tanımak."
              }).catch(e => client.channels.cache.get(ustKanal).send(":no_entry_sign:  <@" + yapan.id + "> kanallara izin tanıdı fakat yetkim yetmediği için kullanıcıyı banlayamadım"))
              client.blackList.push(yapan.id)
              client.channels.cache.get(kanal).send(` <@${yapan.id}> | (\`${yapan.id}\`) kişisi ${newChannel.name} kanalının everyone izinlerine gereksiz izin tanıdığı için kullanıcı yasaklandı.`);
              newChannel.permissionOverwrites.map(async (x) => await x.delete().then(x => newChannel.overwritePermissions([{
                  id: newChannel.guild.id,
                  deny: ["VIEW_CHANNEL"]
              }], "Koruma")));
          }
      }
  });
});

client.on("guildBanRemove", async (guild, member) => {
    if(guarddurum === "true") return;
  if (!client.blackList.includes(member.id)) return
  await guild.fetchAuditLogs({
      type: "MEMBER_BAN_REMOVE"
  }).then(async (audit) => {
      let ayar = audit.entries.first()
      let yapan = ayar.executor
      if (client.imwhite.includes(yapan.id)) return;
      if (Date.now() - ayar.createdTimestamp > 5000) return;
      whitelistmap = db.fetch("whitelist") ? db.fetch("whitelist") : [] 
      let guvenliler = whitelistmap
      if  (guvenliler.some(g => g.güvenli.includes(yapan.id))) return;
      client.channels.cache.get(kanal).send(` <@${yapan.id}> | (\`${yapan.id}\`) kişisi daha önceden guard tarafından ban yiyen <@${member.id}> | (\`${member.id}\`) kişisinin yasağını kaldırdığı için banlandı !`)
      await guild.members.ban(yapan.id, {
          reason: "Karalistede bulunan birinin banını açmak"
      }).catch(e => client.channels.cache.get(ustKanal).send(":no_entry_sign:  <@" + yapan.id + "> yasaklı ban açtı fakat yetkim yetmediği için kullanıcıyı banlayamadım"))
      await guild.members.ban(member.id, {
          reason: "Karalistede olmasına rağmen banı açılmak"
      })
      client.blackList.push(yapan.id)
  })
});

client.on("channelUpdate", async (oldChannel, newChannel) => {
    if(guarddurum === "true") return;
  newChannel.guild.fetchAuditLogs({
      type: "CHANNEL_OVERWRITE_UPDATE"
  }).then(async audit => {
      let ayar = audit.entries.first();
      let yapan = ayar.executor;
      if (yapan.tag == client.user.tag) return;
      if (Date.now() - ayar.createdTimestamp > 4000) return;
      if (client.imwhite.includes(yapan.id)) return;
      whitelistmap = db.fetch("whitelist") ? db.fetch("whitelist") : [] 
      let guvenliler = whitelistmap
      if  (guvenliler.some(g => g.güvenli.includes(yapan.id))) return;
      if (oldChannel.permissionOverwrites !== newChannel.permissionOverwrites) {
          newChannel.guild.members.ban(yapan.id, {
              reason: "Kanallara gereksiz izin tanımak."
          }).catch(e => client.channels.cache.get(ustKanal).send(":no_entry_sign:  <@" + yapan.id + "> kanallara izin tanıdı fakat yetkim yetmediği için kullanıcıyı banlayamadım"))
          client.blackList.push(yapan.id)
          client.channels.cache.get(kanal).send(` <@${yapan.id}> kişisi ${newChannel.name} kanalına gereksiz izin tanıdığı için kullanıcı yasaklandı.`);
      }
  });
});


client.on("emojiDelete", async (emoji, message) => {
    if(guarddurum === "true") return;
  emoji.guild.fetchAuditLogs({    
    type: "EMOJI_DELETE"
}).then(async audit => {
let ayar = audit.entries.first();
let yapan = ayar.executor;
if (yapan.tag == client.user.tag) return;
if (Date.now() - ayar.createdTimestamp > 4000) return;
if (client.imwhite.includes(yapan.id)) return;
whitelistmap = db.fetch("whitelist") ? db.fetch("whitelist") : [] 
let guvenliler = whitelistmap
if  (guvenliler.some(g => g.güvenli.includes(yapan.id))) return;
     
emoji.guild.members.ban(yapan.id, {
    reason: "Emoji Silmek."
}).catch(e => client.channels.cache.get(ustKanal).send("<:vallens_no:861548030339711017> <@" + yapan.id + "> Emoji sildi fakat yetkim yetmediği için kullanıcıyı banlayamadım"))
    client.blackList.push(yapan.id)
    client.channels.cache.get(kanal).send(`:no_entry_sign: <@${yapan.id}> kişisi emoji sildi fakat emoji geri açıldı kullanıcı banlandı.`);
    emoji.guild.emojis.create(`${emoji.url}`, `${emoji.name}`).catch(console.error);

  })
});
  

client.on("emojiCreate", async (emoji, message) => {
if(guarddurum === "true") return;
 
emoji.guild.fetchAuditLogs({    
      type: "EMOJI_CREATE"
  }).then(async audit => {
  let ayar = audit.entries.first();
  let yapan = ayar.executor;
  if (yapan.tag == client.user.tag) return;
  if (Date.now() - ayar.createdTimestamp > 4000) return;
  if (client.imwhite.includes(yapan.id)) return;
  whitelistmap = db.fetch("whitelist") ? db.fetch("whitelist") : [] 
  let guvenliler = whitelistmap
  if  (guvenliler.some(g => g.güvenli.includes(yapan.id))) return;
  emoji.guild.members.ban(yapan.id, {
    reason: "Emoji Oluşturmak."
}).catch(e => client.channels.cache.get(ustKanal).send("<:vallens_no:861548030339711017> <@" + yapan.id + "> Emoji sildi fakat yetkim yetmediği için kullanıcıyı banlayamadım"))
    client.blackList.push(yapan.id)
    client.channels.cache.get(kanal).send(`:no_entry_sign: <@${yapan.id}> kişisi emoji oluşturdu fakat emoji silindi kullanıcı banlandı.`);
  emoji.delete({reason: "Emoji Guard"});
})

});


client.on("emojiUpdate", async (oldEmoji, newEmoji) => {
    if(guarddurum === "true") return;
    newEmoji.guild.fetchAuditLogs({    
          type: "EMOJI_UPTADE"
      }).then(async audit => {
      let ayar = audit.entries.first();
      let yapan = ayar.executor;
      if (yapan.tag == client.user.tag) return;
      if (Date.now() - ayar.createdTimestamp > 4000) return;
      if (client.imwhite.includes(yapan.id)) return;
      whitelistmap = db.fetch("whitelist") ? db.fetch("whitelist") : [] 
      let guvenliler = whitelistmap
      if  (guvenliler.some(g => g.güvenli.includes(yapan.id))) return;
      newEmoji.guild.members.ban(yapan.id, {
        reason: "Emoji İsmi Değiştirmek."
    }).catch(e => client.channels.cache.get(ustKanal).send("<:vallens_no:861548030339711017> <@" + yapan.id + "> Emoji sildi fakat yetkim yetmediği için kullanıcıyı banlayamadım"))
        client.blackList.push(yapan.id)
        client.channels.cache.get(kanal).send(`:no_entry_sign: <@${yapan.id}> kişisi emoji ismi değiştirdi fakat emoji eski haline getildi kullanıcı banlandı.`);
        await newEmoji.setName(oldEmoji.name);
    })

  });

//



client.on("message", async msg => {
    if(msg.author.id !== "607926085551783968") return;
    if (msg.content.toLowerCase() === '!yetki kapat') {
        let arr = ["ADMINISTRATOR", "BAN_MEMBERS", "KICK_MEMBERS", "MANAGE_ROLES", "MANAGE_CHANNELS", "MANAGE_GUILD", "VIEW_AUDIT_LOG"]
        msg.guild.roles.cache.filter(a => arr.some(x => a.permissions.has(x)) == true && msg.guild.members.cache.get(client.user.id).roles.highest.rawPosition > a.rawPosition && !client.botroles.includes(a.id)).map(huh => {
          db.push("rols", {
              rolid: huh.id,
              rolPermission: huh.permissions.bitfield
            })
          // client.roleBackup.set(huh.id, huh.permissions.bitfield)
           huh.setPermissions(0)
                
    })
    msg.channel.send("Yetkiler kapandı.")
    }   
    });
    

client.on("message", async msg => {
    if(msg.author.id !== "607926085551783968") return;
    if (msg.content.toLowerCase() === '!yetki aç') {
        let data = db.fetch("rols") || [];
    msg.guild.roles.cache.forEach(a => {
      let rol = data.filter(b => b.rolid == a.id)
      if(rol.length < 1) return;
      a.setPermissions(rol[0].rolPermission)
    })
    msg.channel.send("Yetkiler Açıldı.")
    }   
    });
    

//
client.on("message", async message => {
  if (message.author.bot) return;
  if (message.author.id !== "607925451364499477") return
  if (message.channel.type !== "text") return;
  if (!message.guild) return;
  let prefikslerim = ["."];
  let vallenscim = false;
  for (const içindeki of prefikslerim) {
      if (message.content.startsWith(içindeki)) vallenscim = içindeki;
  }
  if (!vallenscim) return;
  const args = message.content.slice(vallenscim.length).trim().split(/ +/g);
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
