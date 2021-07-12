const Discord = require('discord.js');
const ChannelData = require('../models/Channel.js');
const db = require('fera.db');
const config = require("../../Settings/Database.json")
const whitelist = require("../../Settings/Whitelist.json")

exports.run = async (client, message, args) => {

    if(whitelist.Owners.includes(message.author.id) === false) return;

    if (!args[0] || isNaN(args[0])) return message.channel.send(`Geçerli bir Kanal ID'si belirtmelisin.`);
  
      ChannelData.findOne({guildID: config.guild, channelID: args[0]}, async (err, channelData) => {
        if (!channelData) return message.channel.send("Belirtilen Kanal ID'si ile ilgili veri tabanında veri bulunamadı!");
        const kEmbed = new Discord.MessageEmbed()
        .setColor("")
        .setFooter(config.footer, message.author.avatarURL({dynamic:true}))
        .setTimestamp()
        .setDescription(`${channelData.name} Kanalının backup'ını kullanmayı onaylıyor musunuz ?`)
  
        await message.channel.send({ embed: kEmbed }).then(msg => {
          msg.react("✅");
  
          const onay = (reaction, user) => reaction.emoji.name === "✅" && user.id === message.author.id;
  
          const collect = msg.createReactionCollector(onay, { time: 60000 });
  
          collect.on("collect", async r => {
            setTimeout(async function(){
  
              msg.delete().catch(err => console.log(`Backup mesajı silinemedi.`));
  
              message.guild.channels.create(channelData.name, {type: channelData.type}).then(channel => {
                if(channel.type === "voice"){
                  channel.setBitrate(channelData.bitrate);
                  channel.setUserLimit(channelData.userLimit);
                  channel.setParent(channelData.parentID);
                  channel.setPosition(channelData.position);

                  if(Object.keys(channelData.permissionOverwrites[0]).length > 0) {
                    for (let i = 0; i < Object.keys(channelData.permissionOverwrites[0]).length; i++) {
                      channel.createOverwrite(channelData.permissionOverwrites[0][i].permission, channelData.permissionOverwrites[0][i].thisPermOverwrites);
                    };
                  };

                }else if(channel.type === "category"){
                  if(Object.keys(channelData.permissionOverwrites[0]).length > 0) {
                    for (let i = 0; i < Object.keys(channelData.permissionOverwrites[0]).length; i++) {
                      channel.createOverwrite(channelData.permissionOverwrites[0][i].permission, channelData.permissionOverwrites[0][i].thisPermOverwrites);
                    };
                  };
                }else {
                  channel.setRateLimitPerUser(channelData.setRateLimitPerUser);
                  channel.setTopic(channelData.topic);
                  channel.setParent(channelData.parentID);
                  channel.setPosition(channelData.position);

                  if(Object.keys(channelData.permissionOverwrites[0]).length > 0) {
                    for (let i = 0; i < Object.keys(channelData.permissionOverwrites[0]).length; i++) {
                      channel.createOverwrite(channelData.permissionOverwrites[0][i].permission, channelData.permissionOverwrites[0][i].thisPermOverwrites);
                    };
                  };

                };
              });

            
            }, 450)
          })
        })
        });
    
}


exports.conf ={
   enabled: true,
    guildOnly: true,
    aliases: ['channelsetup', 'kanalsetup', 'kanal-kur', 'channel-kur', 'channel-setup'],
    permLevel: 0
}

exports.help = {
    name: 'kanalkur',
    description: 'Silinen bir kanalı aynı izinleri ile kurar.',
    usage: 'kanalkur <id>'
}
