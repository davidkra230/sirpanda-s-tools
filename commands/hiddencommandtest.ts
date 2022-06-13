//description
exports.description = "testing hidden commands";
//perms
exports.permissions = ["ALL"];
//hidden
exports.hidden = true;
//embeds
var { MessageEmbed } = require("discord.js");
//slash command profile
var { SlashCommandBuilder } = require("@discordjs/builders")
exports.data = new SlashCommandBuilder()
.setName("hiddencommandtest")
.setDescription(exports.description)

//main run
exports.run = async (bot, message, db, isSlashCommand) => {
    var embed = new MessageEmbed()
    //the title
    embed.setTitle("this is a hidden command")
    //the "main nody"
    embed.addFields({ name: "you can make it do anything you want, it is hidden from the slash commands and help command", value: "you could even remove the original message to keep the command a secret." })
    //smol footer that includes a "requested by" section
    embed.footer = { text: `Requested by: <@!${message.author.id}>`, iconURL: message.author.avatarURL() };
    message.reply({ embeds: [embed] })
};