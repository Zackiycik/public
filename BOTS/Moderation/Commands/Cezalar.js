const { MessageEmbed } = require("discord.js");
const db = require("quick.db");
const ayar = require("../Settings/Settings.json");
const moment = require("moment");
const { table } = require('table');
exports.run = async (client, message, args) => {


    let user = await message.mentions.members.first() || client.users.fetch(args[0])
    let data = db.get(`sicil.${user.id}.${message.guild.id}`) || [];

let siciltable = [
      ["ID", "Ceza", "Tarih", "Yetkili", "Sebep"]
];
    let config = {
      border: {
          topBody: ``, 
          topJoin: ``,
          topLeft: ``,
          topRight: ``,

          bottomBody: ``,
          bottomJoin: ``,
          bottomLeft: ``,
          bottomRight: ``,

          bodyLeft: `│`,
          bodyRight: `        │`,
          bodyJoin: `        │`,

          joinBody: ``,
          joinLeft: `  `,
          joinRight: `  `,
          joinJoin: ``
      }
  };
//
  data.map(x => {
    siciltable.push([x.id, x.komut, x.zaman, client.users.cache.get(x.modid).tag, x.sebep])
})
data = data.reverse();
let sonceza = data.lenght;
let sicildatas = table(siciltable.slice(sonceza , 15), config)

if(!data ||!data.length) return message.channel.send('Bu kullanıcının ceza verisini database üzerinde bulunamadı.')


message.channel.send(`:grey_question: | ${user} kişinin ceza verisi aşağıda belirtilmiştir.\n\nTekil bir cezayı görmek için \`!ceza\` komutunu kullanınız.\`\`\`Kullanıcının "${data.length}" Cezası bulundu.Son 15 cezası aşağıda sıralanmıştır.\n\n${sicildatas}\`\`\``)

};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["sicil"]
  };
  
  exports.help = {
    name: "cezalar",
    description: "",
    usage: ""
  };

