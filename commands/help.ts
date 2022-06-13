//define fs
var fs = require('fs');
//define discord.js
var { MessageEmbed } = require('discord.js');
//define slash command builder
var { SlashCommandBuilder } = require('@discordjs/builders');
//set description
exports.description = "get help";
//set permissions
exports.permissions = ["ALL"];
//is the command hidden?
exports.hidden = false
//set data
exports.data = new SlashCommandBuilder()
	.setName('help')
	.setDescription(exports.description)

//run function
exports.run = async (bot, message, db, isSlashCommand) => {
    //define embed
    var embed = new MessageEmbed();
    //array to hold the commands
    let cmds:any = [];
    //syncronously read the files in the commands folder and push them to the array
    fs.readdirSync(__dirname)
    .forEach(function(file:any) {
        //if the file does not end with .js then return
        if (!file.endsWith(".js")) {return};
        //check if the command is hidden and if it is, return.
        if (require(`${__dirname}/${file}`).hidden == true) {return};
        //push the file split by "." to the array
        cmds.push(file.split(".")[0]);
    });

    //set the embed title as "Help"
    embed.setTitle("Help");
    //and for all the commands
    for (let cmd of cmds) {
        //add fields to the embed
        embed.addFields({ name: cmd, value: require(`${__dirname}/${cmd}.js`).description });
    };
    //add a lil "requested by" footer
    if (isSlashCommand) {
        embed.footer = { text: `Requested by: <@!${message.user.id}>`, iconURL: message.user.avatarURL() };
    } else {
        embed.footer = { text: `Requested by: <@!${message.author.id}>`, iconURL: message.author.avatarURL() };
    };
    //reply with the embed
    message.reply({embeds: [embed]});
};