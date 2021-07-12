const { MessageEmbed } = require("discord.js");
const ayar = require("../Settings/Settings.json");
exports.run = async(client, message, args) => {
    let embed = new MessageEmbed().setColor('RANDOM').setAuthor(message.author.username, message.author.avatarURL({ dynamic: true }))
    let tag = "Schwartz"
    let kayıtsız = "856544351843516426"
    let etiket = "1870"
    let rol = "854752138680467478"
    let taglilar = message.guild.members.cache.filter(s => s.user.username.includes(tag) && !s.roles.cache.has(rol))
    let etiketliler = message.guild.members.cache.filter(s => s.user.discriminator.includes(etiket) && !s.roles.cache.has(rol))
    let tagsizlar = message.guild.members.cache.filter(s => !s.user.username.includes(tag) && !s.user.discriminator.includes(etiket) && s.roles.cache.has(rol))

    taglilar.array().forEach(async(member, index) => {
        setTimeout(async() => {
            await member.roles.add(rol)
        }, index * 1000)
    })
    
    etiketliler.array().forEach(async(member, index) => {
        setTimeout(async() => {
            await member.roles.add(rol)
        }, index * 1000)
    })
    tagsizlar.array().forEach(async(member, index) => {
        setTimeout(async() => {
            await member.roles.remove(rol)
        }, index * 1000)
    })
    embed.setDescription(`
**${taglilar.size + etiketliler.size}** Adet kullanıcıya taglı rolü verilecek
**${tagsizlar.size}** Adet kullanıcıdan taglı rolü alınacak.
`)
    message.channel.send(embed)
}
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: []
  };
  
  exports.help = {
    name: "tag-tara",
    description: "",
    usage: ""
  };