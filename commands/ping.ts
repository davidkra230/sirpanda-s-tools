//permissions required to use the command
exports.permissions = ["ALL"];
//the description of the command
exports.description = "get a pong with latency";
//message embed
var { MessageEmbed } = require('discord.js');
var embed = new MessageEmbed();

//the run function
exports.run = (bot, message, db) => {
    //send a message to the channel that the bot is pinging with the latency
    embed.setTitle("Pong! :ping_pong:");
    embed.setDescription(`Latency: ${bot.ws.ping}ms`);
    embed.footer = { text: `Requested by <@${message.author.id}>`, icon_url: message.author.avatarURL() };
    message.reply({embeds: [embed]});
};