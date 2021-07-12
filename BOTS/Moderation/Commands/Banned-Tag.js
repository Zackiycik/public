const { MessageEmbed } = require('discord.js');
const ayar = require('../Settings/Settings.json')
const tagData = require('../models/yasaklıtag.js')
const moment = require('moment')
require('moment-duration-format')
exports.run = async(client, message, args) => {
        if (!message.member.roles.cache.has(ayar.yasaklıtag.Owner));
            let embed = new MessageEmbed().setColor('RANDOM').setTimestamp()
        let cmd = args[0]
        let data = await tagData.find({ guildID: message.guild.id })
        if (cmd === 'ekle') {
            let hedef = args[1]
            let reason = args.slice(2).join(' ')
            if (!hedef || !reason) return message.channel.send(embed.setDescription(`Geçerli bir tag ve sebep belirtmelisin.`))
            if (data && data.some(s => s.Tag === hedef)) return message.channel.send(embed.setDescription(`${message.member}, Bu tag zaten yasaklı listede mevcut.`))
            let x = new tagData({
                guildID: message.guild.id,
                adminID: message.member.id,
                Tag: hedef,
                Reason: reason,
                Date: Date.now()
            })
            x.save().then(s => {
                message.channel.send(`\`${hedef}\` tagı başarılı bir şekilde yasaklı listeye eklendi!`)
            })
        } else if (cmd === 'liste') {
            if (!data) return message.channel.send(embed.setDescription(`Sunucuya ait yasaklı tag verisi bulunamadı!`))
            let map = data.length > 0 ? data.map((value, index) => `\`\`\`${value.Tag} - ${message.guild.members.cache.get(value.adminID).id} - ${value.Reason} - ${moment(value.Date).locale('tr').format('LLL')}\`\`\``).join('\n\n') : "Sunucuya ait veri bulunamadı."
            message.channel.send(new MessageEmbed().setDescription(`
    ${map}
    `).setColor('RED'))
        } else if (cmd === 'sil') {
            if (!data && !data.length) return message.channel.send(embed.setDescription(`Sunucuya ait yasaklı tag verisi bulunmadığından silme işlemi yapılamaz!`))
            let hedef = args[1]
            if (!hedef) return;
            if (!data.some(s => s.Tag === hedef)) return message.channel.send(embed.setDescription(`Bu tag yasaklı listede zaten bulunmamakta!`))

            await tagData.deleteOne({ Tag: hedef }).catch(err => console.error('Silinemedi!'))
            message.channel.send(`\`${hedef}\` tagı yasaklı listeden kaldırıldı!`)
        } else if (cmd === 'bilgi') {
            let hedef = args[1]
            if (!hedef) return;
            if (!data.map(s => s.Tag).includes(hedef)) return message.channel.send(embed.setDescription(`Belirttiğiniz tag yasaklı listede bulunmamakta!`))
            message.channel.send(embed.setDescription(`
\`\`\`${hedef} tagı ile ilgili bilgiler;

Tagdaki üye sayısı: ${message.guild.members.cache.filter(s => s.user.username.includes(hedef) || s.user.discriminator.includes(hedef)).size}
Tagı ekleyen: ${data.filter(s => s.Tag === hedef).map(s => `${message.guild.members.cache.get(s.adminID).id}`)}
Eklenme sebebi: ${data.filter(s => s.Tag === hedef).map(s => `${s.Reason}`)}
Tag eklenme tarihi: ${data.filter(s => s.Tag === hedef).map(s => `${moment(s.Date).locale('tr').format('LLL')}`)}
\`\`\``))
    } else {
       
        message.channel.send(embed.setDescription(`
        Yasaklı tag işlemleri;

       \`•\` \`!yasaklıtag ekle [TAG]\` Belirttiğiniz tagı yasaklı listeye ekler.
       \`•\` \`!yasaklıtag sil [TAG]\` Belirttiğiniz tagı yasaklı listeden siler.
       \`•\` \`!yasaklıtag liste\` Sunucunun yasaklı taglarını listeler.
       \`•\` \`!yasaklıtag bilgi [TAG]\` Belirttiğiniz yasaklı tag ile ilgili bilgileri listeler.
        `))
    }

}
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["yasaklı-tag","yasaklıtag"]
  };
  
  exports.help = {
    name: "bannedtag",
    description: "",
    usage: ""
  };
