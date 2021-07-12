const { MessageEmbed } = require('discord.js');
const db = require('quick.db');
const moment = require("moment")
require('moment-duration-format');

module.exports.run = async(client, message, args) => {
    let embed = new MessageEmbed().setColor('RANDOM').setAuthor(message.author.username, message.author.avatarURL({ dynamic: true }))
    let data = await db.get(`snipe.${message.guild.id}`)
    if (!data) return message.channel.send(embed.setDescription(`Sunucuya ait son silinen mesaj bulunamadı.`)).then(m => m.delete({ timeout: 7000 }) && message.delete({ timeout: 7000 }))
    let x = data.filter(s => s.channel === message.channel.id)
    if (!x) return message.channel.send(embed.setDescription(`Kanala ait son silinen mesaj bulunamadı.`)).then(m => m.delete({ timeout: 7000 }) && message.delete({ timeout: 7000 }))
    let mapped = x.map((data, index) => `**${data.admin.tag} (${data.admin.id})** \n ${data.msg} -  ${moment.duration(Date.now() - data.tarih).format("D [gün], H [saat], m [dakika], s [saniye]")}`).slice(data.length > 5 ? data.length - 5 : 0, data.length)

    message.channel.send(embed.setDescription(`
    ${message.channel} kanalında silinen son **5** mesaj;

    ${mapped.join('\n\n')}`))
}
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: []
};

exports.help = {
  name: "snipe",
  description: "",
  usage: ""
};
