
//define fs
var fs = require('fs');
//define discord.js
var { MessageEmbed } = require('discord.js');
//set description
exports.description = "get help";
//set permissions
exports.permissions = ["ALL"];

//run function
exports.run = (bot, message, db) => {
    //define embed
    var embed = new MessageEmbed();
    //array to hold the commands
    let cmds:any = [];
    //syncronously read the files in the commands folder and push them to the array
    fs.readdirSync(__dirname)
    .forEach(function(file:any) {
        //if the file does not end with .js then return
        if (!file.endsWith(".js")) {return};
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
    //reply with the embed
    message.reply({embeds: [embed]});
};