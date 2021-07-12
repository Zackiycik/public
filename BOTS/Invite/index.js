const { Collection, MessageEmbed, Client } = require('discord.js');
const Mongoose = require('mongoose');
const moment = require('moment')
require('moment-duration-format');
const Bot = new Client();
const Settings = require("../../BOTS/Settings/Invite.json")
const Bots = require("../../BOTS/Settings/Bots.json")
const Other = require("../../BOTS/Settings/Other.json")
const invites = {};
const queue = require('util').promisify(setTimeout);


Mongoose.connect(Bots.Mongo_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

// 

const MiafSchema = Mongoose.Schema({
    memberID: { type: String, default: null },
    inviterID: { type: String, default: null },
    Total: { type: Number, default: 0 },
    basarili: { type: Number, default: 0 },
    basarisiz: { type: Number, default: 0 },
    Fake: { type: Boolean, default: false }
});
const ShinoaMiafData = Mongoose.model('MiafShinoaData', MiafSchema);
const Invites = new Collection();

Bot.on("ready", () => {

    Bot.user.setPresence({ activity: { name: Bots.Bot_Type }, status: Bots.Bot_Status });
    Bot.channels.cache.get(Bots.Bot_Voice_Channel).join();
    Bot.guilds.cache.get(Bots.GuildID).fetchInvites().then(x => Invites.set(x.first().guild.id, x));
    console.log(`${Bot.user.tag} İsmi ile giriş yapıldı! Voucher Online`)
    })



Bot.on('inviteCreate', (invite) => {
    const Set = Invites.get(invite.guild.id);
    Set.set(invite.code, invite);
    Invites.set(invite.guild.id, Set);
});

Bot.on('inviteDelete', (invite) => {
    const Set = Invites.get(invite.guild.id);
    Set.delete(invite.code);
    Invites.set(invite.guild.id, Set);
});

Bot.on('guildMemberAdd', async (member) => {
    if (member.user.bot) return;
    const Set = (Invites.get(member.guild.id) || new Collection()).clone();
    const Sunucu = member.guild
    const Fake = Date.now() - member.user.createdTimestamp < 15 ? true : false;
    const IC = Sunucu.channels.cache.get(Settings.invite_channel);


    let kurulus = member.user.createdTimestamp
    let süphe;
    if (Date.now() - kurulus < 1000 * 60 * 60 * 24 * 10 ? süphe = "Şüpheli" : süphe = "Güvenli");
    let isim = member.user.username.replace(/[^a-z^0-9^ü^ç^ğ^ö^ı]/ig, "");

    let olusturma = `${moment.duration(Date.now() - kurulus).format('Y [yıl], M [Ay], D [Gün]')}`
    let channel = member.guild.channels.cache.get(Settings.register_channel);


    if (süphe === "Güvenli") {
        if (channel) channel.send(`
:tada: Woney'e hoş geldin ${member} !

Hesabın ${moment(kurulus).locale('tr').format('LLL')} tarihinde (${olusturma} önce) oluşturulmuş.

Sunucu kurallarımız <#${Settings.rules_channel}> kanalında belirtilmiştir.Unutma sunucu içerisinde ki ceza işlemlerin kuralları okuduğunu varsayarak gerçekleştirilecek.

Seninle birlikte ${member.guild.memberCount} kişi olduk! Sol tarafta bulunan **V. Confirmed** odalarından birine girerek kayıt işlemini gerçekleştirebilirsin.`)
} else {
    setTimeout(function(){  
 member.setNickname(Settings.Register.supheliName).catch(e => {});
}, 10000);


if(channel) channel.send(`
${member} (\`${member.id}\`), Adlı kullanıcı sunucuya katıldı fakat hesabı yeni olduğu için şüpheli hesap rolünü verdim. ${olusturma}`);
}



    Sunucu.fetchInvites().then(async invites => {
        const invite = invites.find(index => Set.has(index.code) && Set.get(index.code).uses < index.uses) || Set.find(values => !invites.has(values.code)) || Sunucu.vanityURLCode;
        Invites.set(Sunucu.id, invites);
        let basarili = 0
        let mesajIcerik = `${member} sunucuya giriş yaptı.`;

        if (invite.inviter && invite.inviter.id !== member.id) {
            const Database = await ShinoaMiafData.findOne({ memberID: invite.inviter.id }) || new ShinoaMiafData({ memberID: invite.inviter.id });
            if (Fake) Database.basarisiz += 1;
            else basarili = Database.basarili += 1;
            Database.Total += 1;
            Database.save();
            ShinoaMiafData.findOneAndUpdate({ memberID: member.id }, { $set: { inviterID: invite.inviter.id, Fake: Fake } }, { upsert: true, setDefaultsOnInsert: true }).exec();
        }

        if (IC) {
            if (invite === Sunucu.vanityURLCode) mesajIcerik = `${member} sunucuya \`Özel URl\` kullanarak girdi!`;
            else if (invite.inviter.id === member.id) mesajIcerik = `${member} kendi daveti ile sunucuya giriş yaptı.`
            else mesajIcerik = `${member} katıldı! **Davet eden**: ${invite.inviter.tag} \`(${basarili} davet)\` ${Fake ? '' : `${Other.yes}`}`;
            IC.send(mesajIcerik);
        }

    }).catch(console.error);
});

Bot.on('guildMemberRemove', async (member) => {
    if (member.user.bot) return;
    let basarili = 0 
    let mesajIcerik = `${member} sunucudan ayrıldı.`;
    const MemberData = await ShinoaMiafData.findOne({ memberID: member.id }) || {}
    let IC = member.guild.channels.cache.get(Settings.invite_channel);

    if (!MemberData && IC) return Channel.send(mesajIcerik);

    const Database = await ShinoaMiafData.findOne({ memberID: MemberData.inviterID }) || new ShinoaMiafData({ memberID: MemberData.inviterID });

    if (MemberData.Fake === true && data.inviterID && Database.basarisiz > 0) Database.basarisiz -= 1;
    else if (MemberData.inviterID && Database.basarili > 0) Database.basarili -= 1;
    basarili = Database.basarili
    Database.Total -= 1;
    Database.save();

    const InviterMember = member.guild.member(MemberData.inviterID);

    if (IC) {
        mesajIcerik = `${member} sunucudan ayrıldı. ${InviterMember ? `**Davet eden**: ${InviterMember.user.tag} \`(${basarili} davet)\`` : 'Davetçi bulunamadı!'}`;
        IC.send(mesajIcerik);
    }
});

Bot.on('message', async (message) => {
    if (message.author.bot || (message.channel.type === 'dm' && !message.guild) || !message.content.startsWith("!")) return;

    const embed = new MessageEmbed().setColor(message.member.displayHexColor);
    const args = message.content.slice("!").trim().split(/ +/);

    const command = args.shift().toLowerCase();

    if (command === 'invite' || command === 'invites' || command === 'davetler' || command === 'davet') {
        const Member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        const Database = await ShinoaMiafData.findOne({ memberID: Member.id }) || { Total: 0, basarili: 0, basarisiz: 0 };
        if (Database.Total) {
            embed.setDescription(`${Member.id === message.author.id ? 'Senin' : `**${Member.user.tag}** sahip olduğun`} \`${Database.Total}\` davetin var. (\`${Database.basarili}\` Başarılı Davet, \`${Database.basarisiz}\` Başarısız Davet)`);
        } else {
            embed.setDescription(`Kullanıcının verilerini bulamadım.`);
        }
        embed.setAuthor(Member.user.tag, Member.user.avatarURL({ dynamic: true }), `https://discord.com/users/${Member.id}`);
        message.channel.send(embed);
    }  else if (command === 'ASDKAOISDKASĞJDIASOJDASOIJĞASIOHDASDASUDASDOASHĞUDASUODASDASDASASDASD' || command === 'ASDKAOISDKASĞJDIASOJDASOIJĞASIOHDASDASUDASDOASHĞUDASUODASDASDASASDASDASDKAOISDKASĞJDIASOJDASOIJĞASIOHDASDASUDASDOASHĞUDASUODASDASDASASDASD' || command === 'ASDKAOISDKASĞJDIASOJDASOIJĞASIOHDASDASUDASDOASHĞUDASUODASDASDASASDASDASDKAOISDKASĞJDIASOJDASOIJĞASIOHDASDASUDASDOASHĞUDASUODASDASDASASDASDASDKAOISDKASĞJDIASOJDASOIJĞASIOHDASDASUDASDOASHĞUDASUODASDASDASASDASDASDKAOISDKASĞJDIASOJDASOIJĞASIOHDASDASUDASDOASHĞUDASUODASDASDASASDASDASDKAOISDKASĞJDIASOJDASOIJĞASIOHDASDASUDASDOASHĞUDASUODASDASDASASDASDASDKAOISDKASĞJDIASOJDASOIJĞASIOHDASDASUDASDOASHĞUDASUODASDASDASASDASD' || command === 'ASDKAOISDKASĞJDIASOJDASOIJĞASIOHDASDASUDASDOASHĞUDASUODASDASDASASDASDASDKAOISDKASĞJDIASOJDASOIJĞASIOHDASDASUDASDOASHĞUDASUODASDASDASASDASDASDKAOISDKASĞJDIASOJDASOIJĞASIOHDASDASUDASDOASHĞUDASUODASDASDASASDASDASDKAOISDKASĞJDIASOJDASOIJĞASIOHDASDASUDASDOASHĞUDASUODASDASDASASDASD' || command === 'ASDKAOISDKASĞJDIASOJDASOIJĞASIOHDASDASUDASDOASHĞUDASUODASDASDASASDASDASDKAOISDKASĞJDIASOJDASOIJĞASIOHDASDASUDASDOASHĞUDASUODASDASDASASDASD') {
        const InviteTop = await ShinoaMiafData.find({}).exec();
        if (!InviteTop || !InviteTop.length) return message.channel.send(embed.setDescription('Sunucunuzda davet yapan hiç üye yok.'));
        const toplms = InviteTop.filter(x => x.Total !== 0 && x.Id).sort((x,y) => y.Total - x.Total).map((value,index)=> `**${index+1}.** <@${value.Id}> • \`${value.Total}\` davet (\`${value.Unsuccessful}\` başarısız, \`${value.Successful}\` başarılı)`).slice(0, 10)

        await message.channel.send(embed.setDescription(`${toplms.join('\n')}`).setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true })));
    }
});

Bot.login(Bots.Voucher).then(() => console.log(`${Bot.user.tag} İsmi ile giriş yapıldı! Voucher Online`)).catch(err => console.error('Bot bağlanırken sorun yaşandı!'));