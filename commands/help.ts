//define fs
import * as fs from 'fs';
//define discord.js
import { MessageEmbed } from 'discord.js';
//set description
export var description = "get help";
//set permissions
export var permissions = ["ALL"];

//run function
export function run(bot, message, db) {
    //define embed
    var embed = new MessageEmbed();
    //syncronously read the files in the commands folder and push them to the array
    //console.log(fs.readdirSync(`./`));
    fs.readdirSync("./build/commands")
    .forEach(async function(file:any) {
        //if the file does not end with .js then return
        if (!file.endsWith(".js")) {return};
        import(`./${file}`).then(file => {var description = file.description});
        //compute.
        console.log(`${file.split(".")[0]}\n${description}`);
        embed.addFields({ name: file.split(".")[0], value: description});
    });

    //set the embed title as "Help"
    embed.setTitle("Help");
    //reply with the embed
    message.reply({embeds: [embed]});
};