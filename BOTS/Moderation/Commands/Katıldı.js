const { MessageEmbed, } = require("discord.js");
const ayar = require("../Settings/Settings.json")

exports.run = async (client, message, args) => {
    let executor = message.member
    let embed = new MessageEmbed().setColor('RANDOM').setTimestamp().setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
    if (message.author.id !== ayar.OtherWorks.Vallens) return;
    let toplantiChannel = ayar.OtherWorks.ToplantıChannel
    let katıldıRolü = ayar.OtherWorks.Katıldı
    let enaltyt = message.guild.roles.cache.get(ayar.OtherWorks.EnAltyt)

    let sestekiler = message.guild.members.cache.filter(x => x.roles.highest.position >= enaltyt.position).filter(s => s.voice.channelID === toplantiChannel)
    let sesteolmayanlar = message.guild.members.cache.filter(x => x.roles.highest.position >= enaltyt.position).filter(s => s.voice.channelID !== toplantiChannel).filter(a => a.roles.cache.has(katıldıRolü))

    sestekiler.array().forEach((uye, index) => {
        setTimeout(async() => {
            uye.roles.add(katıldıRolü)
        }, index * 750)
    })
    sesteolmayanlar.array().forEach((uye, index) => {
        setTimeout(async() => {
            uye.roles.remove(katıldıRolü)
        }, index * 750)
    })
    message.channel.send(embed.setDescription(`
    \`\`\`Katıldı rolü verilecek yetkili sayısı: ${sestekiler.size}\n\nKatıldı rolü alınacak yetkili sayısı: ${sesteolmayanlar.size}\`\`\`
    `))
};
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: []
  };
  
  exports.help = {
    name: "katıldı",
    description: "",
    usage: ""
  };