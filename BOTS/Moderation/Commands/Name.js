const { MessageEmbed } = require("discord.js");
const db = require("quick.db");
const moment = require("moment");
const Settings = require('../../Settings/Moderation.json');
const Other = require('../../Settings/Other.json')
exports.run = async(client, message, args) => {

    if(!message.member.roles.cache.has(Settings.RegisterHammer) && !message.member.hasPermission(8)); 

    let embed = new MessageEmbed().setColor('RANDOM')

    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if (!member) return message.channel.send(embed.setDescription(`${message.author}, Bir member Etiketlemelisin.`)).then(m => m.delete({ timeout: 7000 }))
    
    args = args.filter(a => a !== "" && a !== " ").splice(1)
    let isim = args.filter(arg => isNaN(arg)).map(arg => arg.charAt(0).replace('i', "İ").toUpperCase() + arg.slice(1)).join(" ");
    let yaş = args.filter(arg => !isNaN(arg))[0] || undefined;
    if (!isim | !yaş) return message.channel.send(`${message.author}, Bir isim ve yaş Belirtmelisin.`).then(m => m.delete({ timeout: 7000 }))
    let name = `${Settings.untag} ${isim} | ${yaş}`
    if (yaş < 15) return message.channel.send("Kullanıcı **15** yaşından küçük olduğu kayıt edilemedi.")
    if(member.user.username.includes(Settings.tag)) name = `${Settings.tag} ${isim} | ${yaş}` 

    if (member.id === client.user.id) return message.channel.send(embed.setDescription(`Beni Kayıt Edemezsin!`)).then(m => m.delete({ timeout: 7000 }))
    if (member.id === message.author.id) return message.channel.send(embed.setDescription(`Kendini Kayıt Edemezsin!`)).then(m => m.delete({ timeout: 7000 }))
    
    let isimveri = await db.get(`isimler.${member.id}`)
    
   if(isimveri) {   
        isimveri = isimveri.reverse();
        let isimson = isimveri.lenght;
        let isimler = isimveri.filter(member => member.userID === member.id).map((value, index) => `\`• ${value.isim}\`${value.kayıtsekil}`).slice(isimson , 10)

        message.react(Other.yes)
        message.channel.send(embed.setDescription(`
        ${member} kişisinin ismi başarıyla "${name}" olarak değiştirildi.bu üye daha önceden kayıt olmuş.\n\n${Other.no}**${isimler.length}** adet veri kaydı bulunda.membernın Son 10 ismi aşağıda Sıralanmıştır. Bütün Kayıtları İçin \`!isimler @üye\` \n
        ${isimler.join("\n") || "Bu member önceden kayıt olmadığı için isim geçmişini görüntüleyemedim."}\n\n Kişinin geçmiş isimlerine \`!isimler @üye\` komutuyla bakarak kayıt yapmanız önerilir.`)).then(m => m.delete({ timeout: 12000 }))
   }

   if(!isimveri) {
     message.react(Other.yes)
     message.channel.send(embed.setDescription(`${member} kişisinin ismi başarıyla \`${name}\` olarak değiştirildi.`)).then(m => m.delete({ timeout: 12000 }))
   }

member.setNickname(name)
db.push(`kayıtdata.${member.id}`, { 
  isimverildi: "true"
})
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["i"]
  };
  
  exports.help = {
    name: "isim",
    description: "",
    usage: ""
  };
    