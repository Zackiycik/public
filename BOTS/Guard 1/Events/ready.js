const chalk = require("chalk");
const moment = require("moment");
const Discord = require("discord.js");
const Settings = require("../Settings/Settings.json");

var prefix = "!";

module.exports = client => {
  console.log(
    `BOT: Aktif, Komutlar yüklendi!`
  );
  console.log(
    `BOT: ${
      client.user.username
    } ismi ile giriş yapıldı!`
  );


  }