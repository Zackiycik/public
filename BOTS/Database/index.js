const Discord = require('discord.js');
const mongoose = require('mongoose');
const db = require('fera.db')

const fs = require('fs');
const client = global.client = new Discord.Client({fetchAllMembers: true});
client.moment = global.moment = require('moment');

client.moment.locale("tr");
global.moment.locale("tr");

const RoleData = require('./models/Role.js');
const ChannelData = require('./models/Channel.js');
const config = require("../../BOTS/Settings/Database.json")
const Bots = require("../../BOTS/Settings/Bots.json")
const whitelist = require("../Settings/Whitelist.json")

////////////-------------------////////////

mongoose.connect( Bots.Mongo_URL , { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
});

////////////////////

client.on("ready", () => {
  const log = message => {
  };
  
  client.commands = new Discord.Collection();
  client.aliases = new Discord.Collection();
  
    fs.readdir("./BOTS/Database/commands/", (err, files) => {
      if (err) console.error(err);
      files.forEach(f => {
        let props = require(`./commands/${f}`);
        client.commands.set(props.help.name, props);
        props.conf.aliases.forEach(alias => {
          client.aliases.set(alias, props.help.name);
        });
      });
    });
  
  client.elevation = message => {
    if (!message.guild) return;
    let permlvl = 0;
    if (whitelist.Owners.includes(message.author.id)) permlvl = 5;
    return permlvl;
  };
})

client.on("message", async (message) => {
  let client = message.client;
  let prefix = config.prefix;
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;
  let command = message.content.split(' ')[0].slice(prefix.length);
  let params = message.content.split(' ').slice(1);
  let perms = client.elevation(message);
  let cmd;
  if (client.commands.has(command)) {
    cmd = client.commands.get(command);
  } else if (client.aliases.has(command)) {
    cmd = client.commands.get(client.aliases.get(command));
  }
  if (cmd) {
    if (perms < cmd.conf.permLevel) return;
    cmd.run(client, message, params, perms);
  }
})

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

client.on("roleDelete", async (role) => {
  let backupdurum = db.fetch("backupdurum")
  if (backupdurum  == "true") return;
  let entry = await role.guild.fetchAuditLogs({type: 'ROLE_DELETE'}).then(audit => audit.entries.first());
  if(!entry || !entry.executor || whitelist.Owners.includes(entry.executor.id) || whitelist.Whitelist.includes(entry.executor.id) || Date.now()-entry.createdTimestamp > 10000) return;
  let logKanali = client.channels.cache.get(config.logChannel);
  logKanali.send("Güvenlide Olmayan Biri Tarafından \`Rol Silindiği\` İçin Backuplandıma işlemi durduruldu Backuplandırma işlemini açmak için \`!backup open\` yazmanız yeterli.")
  db.set("backupdurum","true")
})


client.on("channelDelete", async (channel) => {
  let backupdurum = db.fetch("backupdurum")
  if (backupdurum  == "true") return;
  let entry = await channel.guild.fetchAuditLogs({type: 'CHANNEL_DELETE'}).then(audit => audit.entries.first());
  if(!entry || !entry.executor || whitelist.Owners.includes(entry.executor.id) || whitelist.Whitelist.includes(entry.executor.id) || Date.now()-entry.createdTimestamp > 10000) return;
  let logKanali = client.channels.cache.get(config.logChannel);
  logKanali.send("Güvenlide Olmayan Biri Tarafından \`Kanal Silindiği\` İçin Backuplandıma işlemi durduruldu Backuplandırma işlemini açmak için \`!backup open\` yazmanız yeterli.")
  db.set("backupdurum","true")
})


client.on("roleUpdate", async (oldRole, newRole) => {
  let backupdurum = db.fetch("backupdurum")
  if (backupdurum  == "true") return;
  let entry = await newRole.guild.fetchAuditLogs({type: 'ROLE_UPDATE'}).then(audit => audit.entries.first());
    if(!entry || !entry.executor || whitelist.Owners.includes(entry.executor.id) || whitelist.Whitelist.includes(entry.executor.id) || Date.now()-entry.createdTimestamp > 10000) return;

  let logKanali = client.channels.cache.get(config.logChannel);
  logKanali.send("Güvenlide Olmayan Biri Tarafından \`Rol Güncellendiği\` İçin Backuplandıma işlemi durduruldu Backuplandırma işlemini açmak için \`!backup open\` yazmanız yeterli.")
  db.set("backupdurum","true")
})

client.on("channelUpdate", async (oldChannel, newChannel) => {
  let backupdurum = db.fetch("backupdurum")
  if (backupdurum  == "true") return;
  let entry = await newChannel.guild.fetchAuditLogs({type: 'CHANNEL_UPDATE'}).then(audit => audit.entries.first());
    if(!entry || !entry.executor || whitelist.Owners.includes(entry.executor.id) || whitelist.Whitelist.includes(entry.executor.id) || Date.now()-entry.createdTimestamp > 10000) return;

  let logKanali = client.channels.cache.get(config.logChannel);
  logKanali.send("Güvenlide Olmayan Biri Tarafından \`Kanal Güncellendiği\` İçin Backuplandıma işlemi durduruldu Backuplandırma işlemini açmak için \`!backup open\` yazmanız yeterli.")
  db.set("backupdurum","true")
})


client.on("channelCreate", async channel => {
  let backupdurum = db.fetch("backupdurum")
  if (backupdurum  == "true") return;
  let entry = await channel.guild.fetchAuditLogs({type: 'CHANNEL_CREATE'}).then(audit => audit.entries.first());
    if(!entry || !entry.executor || whitelist.Owners.includes(entry.executor.id) || whitelist.Whitelist.includes(entry.executor.id) || Date.now()-entry.createdTimestamp > 10000) return;

  let logKanali = client.channels.cache.get(config.logChannel);
  logKanali.send("Güvenlide Olmayan Biri Tarafından \`Kanal Oluşturulduğu\` İçin Backuplandıma işlemi durduruldu Backuplandırma işlemini açmak için \`!backup open\` yazmanız yeterli.")
  db.set("backupdurum","true")
})

client.on("roleCreate", async role => {
  let backupdurum = db.fetch("backupdurum")
  if (backupdurum  == "true") return;
  let entry = await role.guild.fetchAuditLogs({type: 'ROLE_CREATE'}).then(audit => audit.entries.first());
    if(!entry || !entry.executor || whitelist.Owners.includes(entry.executor.id) || whitelist.Whitelist.includes(entry.executor.id) || Date.now()-entry.createdTimestamp > 10000) return;

  let logKanali = client.channels.cache.get(config.logChannel);
  logKanali.send("Güvenlide Olmayan Biri Tarafından \`Rol Oluşturulduğu\` İçin Backuplandıma işlemi durduruldu Backuplandırma işlemini açmak için \`!backup open\` yazmanız yeterli.")
  db.set("backupdurum","true")
})

function setRoleBackup() {
  let guild = client.guilds.cache.get(Bots.GuildID);
  if (guild) {
    guild.roles.cache.filter(r => r.name !== "@everyone" && !r.managed).forEach(role => {
      let roleChannelOverwrites = [];
      guild.channels.cache.filter(c => c.permissionOverwrites.has(role.id)).forEach(c => {
        let channelPerm = c.permissionOverwrites.get(role.id);
        let pushlanacak = { id: c.id, allow: channelPerm.allow.toArray(), deny: channelPerm.deny.toArray() };
        roleChannelOverwrites.push(pushlanacak);
      });

      RoleData.findOne({guildID: Bots.GuildID, roleID: role.id}, async (err, savedRole) => {
        if (!savedRole) {
          let newRoleSchema = new RoleData({
            _id: new mongoose.Types.ObjectId(),
            guildID: config.guild,
            roleID: role.id,
            name: role.name,
            color: role.hexColor,
            hoist: role.hoist,
            position: role.position,
            permissions: role.permissions,
            mentionable: role.mentionable,
            time: Date.now(),
            members: role.members.map(m => m.id),
            channelOverwrites: roleChannelOverwrites
          });
          newRoleSchema.save();
        } else {
          savedRole.name = role.name;
          savedRole.color = role.hexColor;
          savedRole.hoist = role.hoist;
          savedRole.position = role.position;
          savedRole.permissions = role.permissions;
          savedRole.mentionable = role.mentionable;
          savedRole.time = Date.now();
          savedRole.members = role.members.map(m => m.id);
          savedRole.channelOverwrites = roleChannelOverwrites;
          savedRole.save();
        };
      });
    }); //1000*60*60*24*3

    RoleData.find({guildID: config.guild}).sort().exec((err, roles) => {
      roles.filter(r => !guild.roles.cache.has(r.roleID) && Date.now()-r.time > 1000*60*60).forEach(r => {
        RoleData.findOneAndDelete({roleID: r.roleID});
      });
    });
    console.log(`[${client.moment(Date.now()).format("L")}] Rol veri tabanı düzenlendi!`);
  };
};

function setChannelBackup() {
  let guild = client.guilds.cache.get(Bots.GuildID);
  if (guild) {
    guild.channels.cache.filter(kanal => kanal.deleted !== true).forEach(channel => {
      let permissionss = {};
      let sayi = Number(0);
      channel.permissionOverwrites.forEach((perm) => {
        let thisPermOverwrites = {};
        perm.allow.toArray().forEach(p => {
          thisPermOverwrites[p] = true;
        });
        perm.deny.toArray().forEach(p => {
          thisPermOverwrites[p] = false;
        });
        permissionss[sayi] = {permission: perm.id == null ? guild.id : perm.id, thisPermOverwrites};
        sayi++;
      })

      ChannelData.findOne({guildID: Bots.GuildID, channelID: channel.id}, async (err, savedChannel) => {
        if (!savedChannel) {
          if(channel.type === "voice"){
            let newChannelSchema = new ChannelData({
              _id: new mongoose.Types.ObjectId(),
              guildID: config.guild,
              channelID: channel.id,
              name: channel.name,
              parentID: channel.parentID,
              position: channel.position,
              time: Date.now(),
              type: channel.type,
              permissionOverwrites: permissionss,
              userLimit: channel.userLimit,
              bitrate: channel.bitrate
            });
            newChannelSchema.save();
          }else if(channel.type === "category"){
            let newChannelSchema = new ChannelData({
              _id: new mongoose.Types.ObjectId(),
              guildID: config.guild,
              channelID: channel.id,
              name: channel.name,
              position: channel.position,
              time: Date.now(),
              type: channel.type,
              permissionOverwrites: permissionss,
            });
            newChannelSchema.save();
          }else {
            let newChannelSchema = new ChannelData({
              _id: new mongoose.Types.ObjectId(),
              guildID: config.guild,
              channelID: channel.id,
              name: channel.name,
              parentID: channel.parentID,
              position: channel.position,
              time: Date.now(),
              nsfw: channel.nsfw,
              rateLimitPerUser: channel.rateLimitPerUser,
              type: channel.type,
              topic: channel.topic ? channel.topic : "Bu kanal Backup botu tarafından kurtarıldı!",
              permissionOverwrites: permissionss,
            });
            newChannelSchema.save();
          }
        } else {
          if(channel.type === "voice"){
            savedChannel.name = channel.name;
            savedChannel.parentID = channel.parentID;
            savedChannel.position = channel.position;
            savedChannel.type = channel.type;
            savedChannel.time = Date.now();
            savedChannel.permissionOverwrites = permissionss;
            savedChannel.userLimit = channel.userLimit;
            savedChannel.bitrate = channel.bitrate;
            savedChannel.save();
          }else if(channel.type === "category"){
            savedChannel.name = channel.name;
            savedChannel.position = channel.position;
            savedChannel.type = channel.type;
            savedChannel.time = Date.now();
            savedChannel.permissionOverwrites = permissionss;
            savedChannel.save();
          }else {
            savedChannel.name = channel.name;
            savedChannel.parentID = channel.parentID;
            savedChannel.position = channel.position;
            savedChannel.nsfw = channel.nsfw;
            savedChannel.rateLimitPerUser = channel.rateLimitPerUser;
            savedChannel.type = channel.type;
            savedChannel.time = Date.now();
            savedChannel.topic = channel.topic ? channel.topic : "Bu kanal Backup botu tarafından kurtarıldı!";
            savedChannel.permissionOverwrites = permissionss;
            savedChannel.save();
          }
        };
      });
    })

    ChannelData.find({guildID: config.guild}).sort().exec((err, channels) => {
      channels.filter(r => !guild.channels.cache.has(r.channelID) && Date.now()-r.time > 1000*60*60).forEach(r => {
        ChannelData.findOneAndDelete({channelID: r.channelID});
      });
    });
    console.log(`[${client.moment(Date.now()).format("L")}] Kanal veri tabanı düzenlendi!`);
  };
};

////////////-------------------////////////

client.on('ready', async () => {
  client.user.setPresence({ activity: { name: Bots.Bot_Type }, status: Bots.Bot_Status });

    let sesKanal = client.channels.cache.get(Bots.Bot_Voice_Channel);
    if(sesKanal) sesKanal.join().catch();

    let backupdurum = db.fetch("backupdurum")

    setInterval(() => {
      if (backupdurum  == "true") return;
        setRoleBackup();
        setChannelBackup();
    }, 1000*60*60);
})

client.login(Bots.Database).then(awoken => console.log(`${client.user.username} İsmi ile giriş yapıldı! Database Online`)).catch(err => console.log("Database giriş yapamadı!"));

////////////-------------------////////////
