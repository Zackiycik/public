const { Discord, MessageEmbed } = require('discord.js');
const moment = require("moment");
const Settings = require("../../Settings/Async.json");
const Tag = require("../../Settings/Moderation.json")
const db = require("quick.db");


module.exports = (member,client) => {

    if (member.user.bot) return;

    let durum = Date.now()-member.createdTimestamp < 1000 * 60 * 60 * 24 * 7;

    if (durum) {
        member.roles.set([Settings.Settings.newacc_role]).catch();
        member.setNickname(Settings.newacc_name)
        if (member.guild.channels.cache.has(Settings.newacc_channel)) member.guild.channels.cache.get(Settings.newacc_channel).send(`${member} (\`${member.id}\`) adlı üye sunucuya giriş yaptı ancak hesabı yeni açıldığı için cezalıya atıldı.`);
    }else{
        let jailStatus = db.get(`jstatus.${member.id}.${member.guild.id}`);
        let muteStatus = db.get(`mstatus.${member.id}.${member.guild.id}`);
        let voiceStatus = db.get(`vstatus.${member.id}.${member.guild.id}`);       
        let jail = db.get(`jail.${member.id}.${member.guild.id}`);
        let cpuan = db.get(`cezapuan.${member.id}.${member.guild.id}`);

        setTimeout(function(){  
            member.roles.add(Settings.unregister_role)
                }, 1500)


      const taglılar = member.guild.members.cache.filter(m => m.user.username.includes(Tag.tag)).size
                if(member.user.username.includes(Tag.tag)){
        
                setTimeout(function(){  
                member.guild.channels.cache.get(Tag.tag_log).send(`────────────────────────────────────────────────────────────────\nSunucumuza katıldı. ${member} isminde tagımız olduğu için taglı rolünü verdim (Toplam Taglı: **${taglılar}**)`)
              }, 1000);
              
              setTimeout(function(){  
                  member.roles.add(Tag.tag_rol)
            }, 3000);
        }
        if (jailStatus === "true") {
            setTimeout(function(){  
            member.roles.set([Settings.cezali_role]).catch();
        }, 10000)

        setTimeout(function(){  
        member.setNickname("• Cezalı")
        }, 2000)
        setTimeout(function(){  
            if (member.guild.channels.cache.has(Settings.cezali_channel)) member.guild.channels.cache.get(Settings.cezali_channel).send(`${member} Merhabalar, sunucuya katıldın fakat database üzerinde cezalı olarak gözüküyorsun.Buraya gereksiz bi şekilde düştüysen yetkililere ulaş! \n\nVeritabanı üzerinde verilen cezalı sayısı: **${jail}** (Cezalı Komutu)\nCeza Puanı: **${cpuan}**`);

        }, 15000)

        setTimeout(function(){  
            if (member.guild.channels.cache.has(Settings.register_channel)) member.guild.channels.cache.get(Settings.register_channel).send(`${member} (\`${member.id}\`) adlı üye sunucuya giriş yaptı ancak database üzerinde cezalı olarak görüldüğü için \`${Settings.cezali_role}\` rolünü verdim.`);
        }, 2000)
        }

        if (voiceStatus === "true") {
        setTimeout(function(){  
            member.roles.add(Settings.unregister_role)
                }, 1500)
        setTimeout(function(){  
            member.roles.add(Settings.vmute_role)
        }, 15000)
            return;
        }

        if (muteStatus === "true") {
            setTimeout(function(){  
            member.roles.add(Settings.mute_role).catch();
        }, 5000)
        setTimeout(function(){  
            member.roles.add(Settings.unregister_role)
                }, 1500)
            return;
        }

    }
}

module.exports.config = {
    Event: "guildMemberAdd"
}