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
let token = Bots.Guard3

let guarddurum = db.get("guarddurum")

client.on('ready', async () => {
    client.user.setPresence({ activity: { name: Bots.Bot_Type }, status: Bots.Bot_Status });
  
      let sesKanal = client.channels.cache.get(Bots.Bot_Voice_Channel);
      if(sesKanal) sesKanal.join().catch();
      console.log(`${client.user.username} İsmi ile giriş yapıldı! Guard III Online`)

  })


client.commands = new Discord.Collection();//
client.aliases = new Discord.Collection();//
fs.readdir('./BOTS/Guard 3/Commands', (err, files) => {//
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

    let Options = {
        "Vanity_URL": GuardSetting.VanityURL,
        "Log_Channel": GuardSetting.GuardLog2
    };
    
    client.on('guildUpdate', async (oldGuild, newGuild) => {
        if (oldGuild.vanityURLCode === newGuild.vanityURLCode) return;
        let entry = await newGuild.fetchAuditLogs({
            type: 'GUILD_UPDATE'
        }).then(audit => audit.entries.first());
        if (!entry.executor || entry.executor.id === client.user.id) return;
        let channel = client.channels.cache.get(Options.Log_Channel);
        if (channel) channel.send(`${entry.executor} adlı kişi url'yi çalmaya çalıştığı için banlandı ve url eski haline getirildi.`)
        if (!channel) newGuild.owner.send(`${entry.executor} adlı kişi url'yi çalmaya çalıştığı için banlandı ve url eski haline getirildi.`)
        newGuild.members.ban(entry.executor.id, {
            reason: `${entry.executor.tag} adlı kişi url'yi çalmaya çalıştığı için koruma tarafından banlandı.`
        });
        const settings = {
            url: `https://discord.com/api/v6/guilds/${newGuild.id}/vanity-url`,
            body: {
                code: Options.Vanity_URL
            },
            json: true,
            method: 'PATCH',
            headers: {
                "Authorization": `Bot ${Options.Bot_Token}`
            }
        };
        request(settings, (err, res, body) => {
            if (err) {
                return console.log(err);
            }
        });
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
