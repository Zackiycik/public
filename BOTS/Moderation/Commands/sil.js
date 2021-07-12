const Discord = require('discord.js');
const Other = require ('../Settings/Other.json')

exports.run = async (client, message, args) => {
let executor = message.member
if(!message.member.permissions.has('ADMINISTRATOR')) return message.channel.send(new Discord.MessageEmbed().setTitle('Bu komutu kullanabilmek için `ADMINISTRATOR` gereklidir.'));
if(!args[0]) return message.channel.send(new Discord.MessageEmbed().setTitle('Silinecek miktar giriniz.'));
if(args[0] > 100) return message.channel.send('Mesaj silme limiti 1-100 arasındadır.');
message.channel.bulkDelete(args[0]);
setTimeout(function(){  
return message.channel.send('Kanaldan '+`${args[0]}`+' adet mesaj silindi.').then(m => m.delete({ timeout: 7000 }))
}, 2000);
message.react(Other.General.yes)
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: []
  };
  
  exports.help = {
    name: "sil",
    description: "",
    usage: ""
  };