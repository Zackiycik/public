const Discord = require('discord.js');//
const client = new Discord.Client();//
const { MessageButton } = require('discord-buttons')(client)
const Settings = require('../Settings/Moderation.json');//
const Bots = require("../Settings/Bots.json")


const Other = require('./Settings/Other.json');//
const chalk = require('chalk');//
const moment = require('moment')//
var Jimp = require('jimp');//
const fs = require('fs');//
const db = require('quick.db');//
const express = require('express');//
require('./Util/eventLoader.js')(client);//
const path = require('path');//
const snekfetch = require('snekfetch');//
const mongoose = require('mongoose');
const { config } = require('process');
const message = require('./Events/message');
mongoose.connect('mongodb+srv://Lucretius:kayaalper2008@cluster0.agvc7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});// 

//
var prefix = Settings.prefix;//
//
const log = message => {//
    console.log(`${message}`);//
};

client.commands = new Discord.Collection();//
client.aliases = new Discord.Collection();//
fs.readdir('./BOTS/Moderation/Commands/', (err, files) => {//
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
    if (message.author.id === Settings.Owner) permlvl = 4;
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

client.login(Bots.Moderation);

Date.prototype.toTurkishFormatDate = function (format) {
  let date = this,
    day = date.getDate(),
    weekDay = date.getDay(),
    month = date.getMonth(),
    year = date.getFullYear(),
    hours = date.getHours(),
    minutes = date.getMinutes(),
    seconds = date.getSeconds();

  let monthNames = new Array("Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık");
  let dayNames = new Array("Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi");

  if (!format) {
    format = "dd MM yyyy | hh:ii:ss";
  };
  format = format.replace("mm", month.toString().padStart(2, "0"));
  format = format.replace("MM", monthNames[month]);
  
  if (format.indexOf("yyyy") > -1) {
    format = format.replace("yyyy", year.toString());
  } else if (format.indexOf("yy") > -1) {
    format = format.replace("yy", year.toString().substr(2, 2));
  };
  
  format = format.replace("dd", day.toString().padStart(2, "0"));
  format = format.replace("DD", dayNames[weekDay]);

  if (format.indexOf("HH") > -1) format = format.replace("HH", hours.toString().replace(/^(\d)$/, '0$1'));
  if (format.indexOf("hh") > -1) {
    if (hours > 12) hours -= 12;
    if (hours === 0) hours = 12;
    format = format.replace("hh", hours.toString().replace(/^(\d)$/, '0$1'));
  };
  if (format.indexOf("ii") > -1) format = format.replace("ii", minutes.toString().replace(/^(\d)$/, '0$1'));
  if (format.indexOf("ss") > -1) format = format.replace("ss", seconds.toString().replace(/^(\d)$/, '0$1'));
  return format;
};




client.on("message", async msg => {
  if (msg.content.toLowerCase() === 'tag') {
    msg.channel.send(`${Settings.tag}`);
  }
});

client.on("message", async msg => {
  if (msg.content.toLowerCase() === '!tag') {
    msg.channel.send(`${Settings.tag}`);
 }
});

client.on("message", async msg => {
  if (msg.content.toLowerCase() === '.tag') {
    msg.channel.send(`${Settings.tag}`);

 }
});

//    if (!("863723952421208064").includes(msg.channel.id)) return msg.lineReply("Oldu!")

function afkSil(message, afk, isim) {
  message.channel.send(`${message.author} Artık **AFK** değilsiniz.`);
  db.delete(`afkSebep_${afk.id}_${message.guild.id}`)
  db.delete(`afkid_${afk.id}_${message.guild.id}`)
  db.delete(`afkAd_${afk.id}_${message.guild.id}`)
  db.delete(`afk_süre_${afk.id}_${message.guild.id}`)
  message.member.setNickname(isim)
};

client.on("message" , async msg => {
  
  if(!msg.guild) return;
  if(msg.content.startsWith(Settings.prefix+"afk")) return; 
  
  let afk = msg.mentions.users.first()
 
  const kisi = db.fetch(`afkid_${msg.author.id}_${msg.guild.id}`)    
  
  const isim = db.fetch(`afkAd_${msg.author.id}_${msg.guild.id}`)
 if(afk){
   const sebep = db.fetch(`afkSebep_${afk.id}_${msg.guild.id}`)
   const kisi3 = db.fetch(`afkid_${afk.id}_${msg.guild.id}`)
   if(msg.content.includes(kisi3)){

       msg.channel.send(`<@`+ msg.author.id+`> Etiketlediğiniz Kişi Afk. Sebep : ${sebep}`)
   }
 }
  if(msg.author.id === kisi){
       msg.channel.send(`<@${kisi}> Başarıyla Afk Modundan Çıktınız`)
   db.delete(`afkSebep_${msg.author.id}_${msg.guild.id}`)
   db.delete(`afkid_${msg.author.id}_${msg.guild.id}`)
   db.delete(`afkAd_${msg.author.id}_${msg.guild.id}`)
    msg.member.setNickname(isim)
  }
  
});


//////////////////////////////    

       client.on("voiceStateUpdate",(oldMember, newMember) => {
       
         if(newMember.channelID != null) {
         db.set(`voiceTime_${oldMember.id}_${oldMember.guild.id}`, new Date());
         }
         
         if(newMember.channelID == null) {
         db.delete(`voiceTime_${oldMember.id}_${oldMember.guild.id}`)
         }
         
          if (oldMember.channelID  != newMember.channelID  ) {
         db.delete(`voiceTime_${oldMember.id}_${oldMember.guild.id}`)
         db.set(`voiceTime_${oldMember.id}_${oldMember.guild.id}`, new Date());
         }
         })
         
         client.tarihHesapla = (date) => {
           const startedAt = Date.parse(date);
           var msecs = Math.abs(new Date() - startedAt);
           const years = Math.floor(msecs / (1000 * 60 * 60 * 24 * 365));
           msecs -= years * 1000 * 60 * 60 * 24 * 365;
           const months = Math.floor(msecs / (1000 * 60 * 60 * 24 * 30));
           msecs -= months * 1000 * 60 * 60 * 24 * 30;
           const weeks = Math.floor(msecs / (1000 * 60 * 60 * 24 * 7));
           msecs -= weeks * 1000 * 60 * 60 * 24 * 7;
           const days = Math.floor(msecs / (1000 * 60 * 60 * 24));
           msecs -= days * 1000 * 60 * 60 * 24;
           const hours = Math.floor(msecs / (1000 * 60 * 60));
           msecs -= hours * 1000 * 60 * 60;
           const mins = Math.floor((msecs / (1000 * 60)));
           msecs -= mins * 1000 * 60;
           const secs = Math.floor(msecs / 1000);
           msecs -= secs * 1000;
         
           var string = "";
           if (years > 0) string += `${years} yıl ${months} ay`
           else if (months > 0) string += `${months} ay ${weeks > 0 ? weeks+" hafta" : ""}`
           else if (weeks > 0) string += `${weeks} hafta ${days > 0 ? days+" gün" : ""}`
           else if (days > 0) string += `${days} gün ${hours > 0 ? hours+" saat" : ""}`
           else if (hours > 0) string += `${hours} saat ${mins > 0 ? mins+" dakika" : ""}`
           else if (mins > 0) string += `${mins} dakika ${secs > 0 ? secs+" saniye" : ""}`
           else if (secs > 0) string += `${secs} saniye`
           else string += `saniyeler`;
         
           string = string.trim();
           return `\`${string} önce\``;
         };
       
//////////////////

client.on("userUpdate", async function(eskiii, yeniii) {

  const guildd22 = client.guilds.cache.get(Bots.GuildID)
  const role = guildd22.roles.cache.find(roleInfo => roleInfo.id === Settings.tag_rol)
  const member = guildd22.members.cache.get(yeniii.id)
  const taglılar = guildd22.members.cache.filter(m => m.user.username.includes(Settings.tag)).size
  if (yeniii.username !== eskiii.username) {
    
      if (eskiii.username.includes(Settings.tag) && !yeniii.username.includes(Settings.tag)) {
        member.roles.remove(Settings.tag_rol)
        setTimeout(function(){  
          client.channels.cache.get(Settings.tag_log).send(`────────────────────────────────────────────────────────────────\n${yeniii} isminden tagımızı çıkartarak ailemizden ayrıldı (Toplam Taglı: **${taglılar}**).`)
        }, 5000)
        } else if (!eskiii.username.includes(Settings.tag) && yeniii.username.includes(Settings.tag)) {
        member.roles.add(Settings.tag_rol)
        setTimeout(function(){  
        client.channels.cache.get(Settings.tag_log).send(`────────────────────────────────────────────────────────────────\n${yeniii} kullanıcısı ismine tagımızı aldığı için taglı rolü verildi (Toplam Taglı: **${taglılar}**) <&${Settings.tag_sorumlusu}>.`)
      }, 5000)
      }
  }
})
         
//////////////////


 client.on("message", (message) => {
          if (message.author.id !== Settings.Weka) return;
          if (message.content !== "!button") return;

          let ed = new MessageButton()
         .setStyle('red') 
         .setLabel('Etkinlik Duyuru') 
         .setID('etkinlikduyuru'); 
       
         let ck = new MessageButton()
         .setStyle('green') 
         .setLabel('Çekiliş Katılımıcısı') 
         .setID('cekiliskatılımcısı'); 

         if (message.content === "!button" || message.author.id === Settings.Weka || message.author.bot) return message.channel.send(`Sunucumuzda \`@everyone\` , \`@here\`   gibi seni rahatsız eden bildirimlerden uzak duruyoruz. Sunucumuza katıldığın andan itibaren <@&${Settings['Çekiliş Katılımcısı']}> ve <@&${Settings['Etkinlik Duyuru']}> rolü üzerine otomatik olarak verildi. Eğer bildirimlerden rahatsız oluyorsan butona basarak rolleri üzerinden kaldırabilirsin!`, { 
          buttons: [ ck, ed]
        });



      })

client.on('clickButton', async (button) => {

  if (button.id === 'etkinlikduyuru') {
    if (button.clicker.member.roles.cache.get(Settings['Etkinlik Duyuru'])) {
        await button.clicker.member.roles.remove(Settings['Etkinlik Duyuru'])
        await button.think(true);
        await button.reply.edit("Etkinlik Duyuru Rolü Üzerinizden Alındı!")
    } else {
        await button.clicker.member.roles.add(Settings['Etkinlik Duyuru'])
        await button.think(true);
        await button.reply.edit("Etkinlik Duyuru Rolü Üzerinize Verildi!")
    }
}


if (button.id === 'cekiliskatılımcısı') {
  if (button.clicker.member.roles.cache.get(Settings['Çekiliş Katılımcısı'])) {
      await button.clicker.member.roles.remove(Settings['Çekiliş Katılımcısı'])
      await button.think(true);
      await button.reply.edit("Çekiliş Katılımcısı Rolü Üzerinizden Alındı!")
  } else {
      await button.clicker.member.roles.add(Settings['Çekiliş Katılımcısı'])
      await button.think(true);
      await button.reply.edit("Çekiliş Katılımcısı Rolü Üzerinize Verildi!")
  }
}
})



//////////////////

  client.on('guildMemberRemove', async(member) => {
          let name = `${member.displayName}`
          let cinsiyet = (`(Sunucudan Ayrılma)`)   
          db.push(`isimler.${member.id}`, { 
          isim: name,
          kayıtsekil: cinsiyet
                 })       })
       




//////////////////

  client.on("messageDelete", async(message) => {
          if (message.author.bot) return;
          db.push(`snipe.${message.guild.id}`, { msg: message.content, tarih: Date.now(), admin: message.author, channel: message.channel.id })
      })
      

      



 //////////////////
     
  client.on('messageUpdate', async (oldMessage, newMessage) => {
    let vallensLog = oldMessage.guild.channels.cache.get(Settings.messageUptade)
   if(vallensLog) {
   const arxEmb = new Discord.MessageEmbed().setTimestamp()
       if (oldMessage.author.bot) return;
       if (!oldMessage.guild) return;
       if (oldMessage.content == newMessage.content) return;
   
   vallensLog.send(arxEmb.setAuthor(`${oldMessage.author.tag} | Mesaj Düzenlendi`, oldMessage.author.avatarURL()).setDescription(`  \`\`\`  ${oldMessage.channel.tag} kanalında ${oldMessage.author.tag} -  tarafından bir mesaj güncellendi.
   > Eski Mesaj: ${oldMessage.content}
   
   > Yeni Mesaj: ${newMessage.content}
   \`\`\`
   `).setColor("RED")
     
   );
   }})
   


//////////////////

  client.on('messageDelete', (message,client) => {
     
     if (!message.guild || message.author.bot || message.content.startsWith("prefix")) return;
     const embed = new Discord.MessageEmbed()
       .setAuthor("Mesaj Silindi", message.author.avatarURL({dynamic: true}))
       .setDescription(`\`\`\` ${message.channel.name} kanalında bir mesaj silindi. \n\n > Silinen mesaj: ${message.content.replace("`", "")} \n Mesaj Sahibi: ${message.author.tag} - (${message.author.id})\`\`\``)
       .setTimestamp()
       .setColor("RED")
     message.guild.channels.cache.get(Settings.messageDelete).send(embed)
   })




   





///////////////////////////////////



/*client.on("userUpdate", async function(eskiii, yeniii) {
  const guildID = "852973702483804181"
  const roleID = "860100155487289354"//taglı_rol
  const tag = "IW"
  const log2 = '860864987106902026'

  const guildd22 = client.guilds.cache.get(guildID)
  const role = guildd22.roles.cache.find(roleInfo => roleInfo.id === roleID)
  const member = guildd22.members.cache.get(yeniii.id)
  if (yeniii.username !== eskiii.username) {
    
      if (eskiii.username.includes(tag) && !yeniii.username.includes(tag)) {
        if (yeniii.discriminator === "1909") return;
    
          member.roles.remove(roleID)
          //member.roles.set([""])
      } else if (!eskiii.username.includes(tag) && yeniii.username.includes(tag)) {
          member.roles.add(roleID)
      }
  }

 if (yeniii.discriminator !== eskiii.discriminator) {
      if (eskiii.discriminator == "1909" && yeniii.discriminator !== "1909") {
        member.roles.remove(roleID)
          //member.roles.set([""])
      } else if (eskiii.discriminator !== "1909" && yeniii.discriminator == "1909") {
          member.roles.add(roleID)
      }
  }

})

client.on("userUpdate", async function(eskiii, yeniii) {
  const guildID = "861512488428503050"
  const roleID = "861524545026260993"//taglı_rol
  const tag = "Woney"
  const log2 = '861555254486368256'

  const guildd22 = client.guilds.cache.get(guildID)
  const role = guildd22.roles.cache.find(roleInfo => roleInfo.id === roleID)
  const member = guildd22.members.cache.get(yeniii.id)
  const embed = new Discord.MessageEmbed().setAuthor(member.displayName, member.user.avatarURL({ dynamic: true })).setColor('AQUA').setTimestamp().setFooter('VALLENS');
  if (yeniii.username !== eskiii.username) {
    
      if (eskiii.username.includes(tag) && !yeniii.username.includes(tag)) {
        if (yeniii.discriminator === "1909") return client.channels.cache.get(log2).send(embed.setDescription(`${yeniii} İsim tagımızı bıraktı ama hala üzerinde etiket olduğu için \`Tagges\` rolünü almadım`));
    
          //member.roles.set([""])
          client.channels.cache.get(log2).send(embed.setDescription(`${yeniii} isminden tagımızı çıkartarak ailemizden ayrıldı`))
      } else if (!eskiii.username.includes(tag) && yeniii.username.includes(tag)) {
          client.channels.cache.get(log2).send(embed.setDescription(` ${yeniii} ismine tagımızı alarak ailemize katıldı`))
      }
  }

 if (yeniii.discriminator !== eskiii.discriminator) {
      if (eskiii.discriminator == "1909" && yeniii.discriminator !== "1909") {
        if (yeniii.username.includes(tag)) return client.channels.cache.get(log2).send(embed.setDescription(`${yeniii} Etiketimizi tagımızı bıraktı ama hala üzerinde isim tagımızı olduğu için \`Tagges\` rolünü almadım`)); 
          //member.roles.set([""])
          client.channels.cache.get(log2).send(embed.setDescription(`${yeniii} etiketimizi çıkartarak ailemizden ayrıldı!`))
      } else if (eskiii.discriminator !== "1909" && yeniii.discriminator == "1909") {
          client.channels.cache.get(log2).send(embed.setDescription(`${yeniii} etiketimizi alarak ailemize katıldı`))
      }
  }

})


client.on("guildMemberAdd", member => {
  const guildID = "861512488428503050"
  const roleID = "861524545026260993"//taglı_rol
  const tag = "Woney"
  const log2 = '861555254486368256'
  const Disc = "1909"

  const guildd22 = client.guilds.cache.get(guildID)
  const role = guildd22.roles.cache.find(roleInfo => roleInfo.id === roleID)
if(member.user.username.includes(tag)){
  setTimeout(function(){  
  member.roles.add(role)
}, 5000);

}
})



client.on("guildMemberAdd", member => {
  const guildID = "861512488428503050"
  const roleID = "861524545026260993"//taglı_rol
  const tag = "Woney"
  const log2 = '861555254486368256'
  const Disc = "1909"

  const guildd22 = client.guilds.cache.get(guildID)
  const role = guildd22.roles.cache.find(roleInfo => roleInfo.id === roleID)
  const embed = new Discord.MessageEmbed().setAuthor(member.displayName, member.user.avatarURL({ dynamic: true })).setColor('AQUA').setTimestamp().setFooter('VALLENS');
if(member.user.username.includes(tag)){
  setTimeout(function(){  
  client.channels.cache.get(log2).send(embed.setDescription(`Sunucumuza katıldı. ${member} isminde tagımız olduğu için \`tagges\` rolü verdim`))
}, 2000);
}
})




client.on("guildMemberAdd", member => {
  const guildID = "861512488428503050"
  const roleID = "861524545026260993"//taglı_rol
  const tag = "Woney"
  const log2 = '861555254486368256'
  const Disc = "1909"

  const guildd22 = client.guilds.cache.get(guildID)
  const role = guildd22.roles.cache.find(roleInfo => roleInfo.id === roleID)
  const embed = new Discord.MessageEmbed().setAuthor(member.displayName, member.user.avatarURL({ dynamic: true })).setColor('AQUA').setTimestamp().setFooter('VALLENS');


  if (member.user.discriminator === "1909") {
    setTimeout(function(){  
   client.channels.cache.get(log2).send(embed.setDescription(`${member} sunucuya \`1909\` etiketiyle geldiği için \`tagges\` rolünü verdim.`))
  }, 2000);
  }
})



client.on("guildMemberAdd", member => {
  const guildID = "861512488428503050"
  const roleID = "861524545026260993"//taglı_rol
  const tag = "Woney"
  const log2 = '861555254486368256'
  const Disc = "1909"

  const guildd22 = client.guilds.cache.get(guildID)
  const role = guildd22.roles.cache.find(roleInfo => roleInfo.id === roleID)
  const embed = new Discord.MessageEmbed().setAuthor(member.displayName, member.user.avatarURL({ dynamic: true })).setColor('AQUA').setTimestamp().setFooter('VALLENS');

  db.push(`kayıtdata.${member.id}`, { 
    kayıtlı: "true"
  })

  if (member.user.discriminator === "1909") {
  setTimeout(function(){  
   member.roles.add(role)
  }, 5000);
  }
})*/
