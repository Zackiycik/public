const Discord = require('discord.js')
const RoleData = require('../models/Role.js');
const db = require('fera.db')
const config = require("../../Settings/Database.json")
const whitelist = require("../../Settings/Whitelist.json")

exports.run = async (client, message, args) => {

    if(whitelist.Owners.includes(message.author.id) === false) return;

    if (!args[0] || isNaN(args[0])) return message.channel.send(`Geçerli bir Rol ID'si belirtmelisin.`);

    RoleData.findOne({guildID: config.guild, roleID: args[0]}, async (err, roleData) => {
      if (!roleData) return message.channel.send("Belirtilen Rol ID'si ile ilgili veri tabanında veri bulunamadı!");
      const sEmbed = new Discord.MessageEmbed()
      .setColor("RED")
      .setFooter(config.footer)
      .setTimestamp()
      .setDescription(`${roleData.name} rolün backup'ını kullanılacak onaylıyor musunuz ?`)

      await message.channel.send({ embed: sEmbed }).then(msg => {
        msg.react("✅");

        const onay = (reaction, user) => reaction.emoji.name === "✅" && user.id === message.author.id;

        const collect = msg.createReactionCollector(onay, { time: 60000 });

        collect.on("collect", async r => {
          setTimeout(async function(){

            msg.delete().catch(err => console.log(`Backup mesajı silinemedi.`));

            let yeniRol = await message.guild.roles.create({
              data: {
                name: roleData.name,
                color: roleData.color,
                hoist: roleData.hoist,
                permissions: roleData.permissions,
                position: roleData.position,
                mentionable: roleData.mentionable
              },
            });
      
            setTimeout(() => {
              let kanalPermVeri = roleData.channelOverwrites;
              if (kanalPermVeri) kanalPermVeri.forEach((perm, index) => {
                let kanal = message.guild.channels.cache.get(perm.id);
                if (!kanal) return;
                setTimeout(() => {
                  let yeniKanalPermVeri = {};
                  perm.allow.forEach(p => {
                    yeniKanalPermVeri[p] = true;
                  });
                  perm.deny.forEach(p => {
                    yeniKanalPermVeri[p] = false;
                  });
                  kanal.createOverwrite(yeniRol, yeniKanalPermVeri).catch(console.error);
                }, index*5000);
              });
            }, 5000);
      
            let roleMembers = roleData.members;
            roleMembers.forEach((member, index) => {
              let uye = message.guild.members.cache.get(member);
              if (!uye || uye.roles.cache.has(yeniRol.id)) return;
              setTimeout(() => {
                uye.roles.add(yeniRol.id).catch(console.error);
              }, index*3000);
            });
    
          
          }, 450)
        })
      })
      });

}


exports.conf ={
   enabled: true,
    guildOnly: true,
    aliases: ['rolesetup', 'rolsetup', 'rol-kur', 'role-kur', 'role-setup'],
    permLevel: 0
}

exports.help = {
    name: 'rolkur',
    description: 'Silinen bir rolü aynı izinleri ile kurar.',
    usage: 'rolkur <id>'
}
