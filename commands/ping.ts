//permissions required to use the command
exports.permissions = ["ALL"];
//the description of the command
exports.description = "get a pong with latency";
//define slash command builder
const { SlashCommandBuilder } = require('@discordjs/builders');
//the data of the command
exports.data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription(exports.description)
//message embed
var { MessageEmbed } = require('discord.js');
var embed = new MessageEmbed();

//the run function
export function run(bot, message, db, isSlashCommand) {
    //send a message to the channel that the bot is pinging with the latency
    embed.setTitle("Pong! :ping_pong:");
    embed.setDescription(`Latency: ${bot.ws.ping}ms`);
    if (isSlashCommand) {
        embed.footer = { text: `Requested by <@!${message.user.id}>`, iconURL: message.user.avatarURL() };
    } else {
        embed.footer = { text: `Requested by <@!${message.author.id}>`, iconURL: message.author.avatarURL() };
    };
    message.reply({embeds: [embed]});
};