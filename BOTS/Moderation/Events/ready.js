const chalk = require("chalk");
const moment = require("moment");
const Discord = require("discord.js");
const Settings = require("../../Settings/Moderation.json");
const Bots = require("../../Settings/Bots.json")

var prefix = Settings.prefix;

module.exports = client => {
  console.log(`${client.user.tag} İsmi ile giriş yapıldı! Guard 2 Online`)
  client.user.setPresence({ activity: { name: Bots.Bot_Type }, status: Bots.Bot_Status });
  
  let sesKanal = client.channels.cache.get(Bots.Bot_Voice_Channel);
  if(sesKanal) sesKanal.join().catch();
  }