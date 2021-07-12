const Event = Load => require(`./Events/${Load}`);
const reqEvent = Load => require(`./Events/${Load}`);
module.exports = client => {
  client.on("message", Event("Message"));
  client.on("guildMemberAdd", Event("guildMemberAdd"));
  client.on("voiceStateUpdate", Event("voiceStateUpdate"));
};