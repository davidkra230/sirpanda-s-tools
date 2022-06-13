//description
exports.description = "testing hidden commands";
//perms
exports.permissions = ["ALL"];
//hidden
exports.hidden = true;
//embeds
var { MessageEmbed } = require("discord.js");
//slash command profile
var { SlashCommandBuilder } = require("discord.js")
exports.data = new SlashCommandBuilder()
.setName("hiddencommandtest")
.setDescription(exports.description)

//main run
exports.run = async (bot, message, db, isSlashCommand) => {
    var embed = new MessageEmbed()
    embed.setTitle("this is a hidden command")
    embed.addFields({ name: "you can make it do anything you want", value: "you could even remove the original message to keep the command a secret." })
    message.reply({ embeds: [embed] })
};