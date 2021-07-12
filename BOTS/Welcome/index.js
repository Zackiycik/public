const Discord = require('discord.js');

const tokens = [
    "ODQ1OTYzMzIxNDM3MTkyMjMy.YKomvQ.CCxlvOIf9kI427-0CX27opFNxPw",
    "ODQ1OTYzNDc5NTkyNDY4NDgw.YKom4g.OURDelaTbxYqsJDJxmROHucb_dk",
    "ODQ1OTkzNjA0MjI0Nzc4Mjcx.YKpC8Q.lQPOhhMijMghNlEyCilfm-LLtyw",
    "ODQ1OTk0Njk4MDEwNzg3ODQw.YKpD9Q.2KDxXnCVOiF34df2DUxYHuRMHmk"
];

const chnls = [
    "861524612236312587",
    "861524613225250837",
    "861524614869942292",
    "861524616400207893"
];
const selamlı = [];
for (let index = 0; index < tokens.length; index++) {
    const token = tokens[index];
    const client = new Discord.Client();
    client.login(token);
    let concon;
    client.on('ready', async () => {
        console.log(client.user.username);
        concon = await client.channels.cache.get(chnls[index]).join();
        await client.user.setPresence({
            status: "online",
            activity: {
                type: "LISTENING",
                name: "Bot Yaptırmak&Ses sistemi yaptırmak için; Vallens#1909 (607925451364499477)'e ulaşın"
            }
        });
    });
    let ses;
    const options = {
        quality: 'highestaudio',
        volume: 0.3,
        bitrate: 'auto'
    }
    client.on('voiceStateUpdate', async (prev, cur) => {
        if (cur.member.user.bot) return;
        if (cur.channel && (cur.channel.id === chnls[index])) {
            if (cur.channelID === prev.channelID) return;
            if (selamlı.includes(cur.member.id) && (cur.member.roles.highest.rawPosition <= cur.guild.roles.cache.get("861524553218129930").rawPosition)) {
                ses = await concon.play('./ses_tekrardan.mp3', options);
                return;
            }
            if ((cur.member.roles.highest.rawPosition <= cur.guild.roles.cache.get("861524553218129930").rawPosition)) {
                ses = await concon.play('./ses_merhaba.mp3', options);
                selamlı.push(cur.member.user.id);
            } else if ((cur.member.roles.highest.rawPosition >= cur.guild.roles.cache.get('861524543427444756').rawPosition) && cur.channel.members.filter(m => m.roles.highest.rawPosition >= prev.guild.roles.cache.get('861524543427444756').rawPosition).size === 2) {
                ses = await concon.play('./ses_yetkili.mp3', options);
                selamlı.push(cur.member.user.id);
            }
        }
        if (prev.channel && (prev.channel.id === chnls[index]) && (prev.channel.members.size === 1) && ses) ses.end();
    });
    client.on('guildMemberUpdate', async (prev, cur) => {
        if (concon.channel.members.some(biri => biri.user.id === cur.user.id)) {
            if ((prev.roles.highest.rawPosition < cur.roles.highest.rawPosition)) {
                ses = await concon.play('./ses_elveda.mp3', options);
            }
        } else return;
    });
    client.on('voiceStateUpdate', async (prev, cur) => {
        if (cur.member.id === client.user.id) concon = await client.channels.cache.get(chnls[index]).join();
    })
}