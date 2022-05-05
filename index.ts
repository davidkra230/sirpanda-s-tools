//a bot for discord written in typescript using the discordx library with a web interface
//dotenv is used to store the token in a .env file
//the bot uses simple-json-db to store the data

//import the discordx library
import * as Discord from "discordx";
//import message and intents from discord.js
import { Message, Intents } from "discord.js";
//require dotenv
require("dotenv").config();
//require the json db
var jsondb = require("simple-json-db");
//create the db
var db = new jsondb("./data.json");
//import reflect-metadata
import "reflect-metadata";

//create the bot and pass the options
const bot = new Discord.Client({
    //set all the intents with bitfield
    intents: new Intents(32767),
    //makes the bot not silent
    silent: false,
    //allow mentions to none
    allowedMentions: {
        users: []
    }
});

//print something when the bot is ready and sets the activity and activity type to the one in the db
bot.on(`ready`, () => {
    console.log(`Ready as: ` + bot.user.tag + `!`);
    //set the activity and activity type to the one in the db or default to playing and "bots be like:" if there is no activity in the db
    bot.user.setActivity(db.get("activity") || "bots be like:", { type: db.get("activityType") || "PLAYING" });
    //also sets the prefix to "!"
    db.set("prefix", "!");
});

//when a message is received it checks if the message is a command
bot.on(`messageCreate`, (message: Message) => {
    //print the message
    console.log(`something happened: ${message.content}`);
    //calculate prefix within a try catch block
    try {
        //get the prefix from the db
        var prefix = db.get(message.guild.id).prefix;
    } catch (error) {
        //if there is an error set the prefix to "!"
        db.set(message.guild.id, {prefix: db.get("prefix")});
        //get the prefix from the db
        var prefix = db.get(message.guild.id).prefix;
    }
    //if the message starts with the prefix specific to the one for the guild id or the ping of the bot 
    if (message.content.startsWith(prefix || `<@${bot.user.id}>`)) {
        //check if the command exists in the commands folder by trying to require it
        //and if the user has the permission to use the command or is a maintainer then run the command
        try {

            //check if the command is in the commands folder
            var command = require(`./commands/${message.content.split(" ")[0].slice(prefix.length).toLowerCase()}.js`);
            //check if the command has maintener required permissions
            if (command.permissions.includes("MAINTAINERS")) {
                //if the user is not a maintainer then return
                if (db.get("maintainers").includes(message.member.id)) return;
                return;
            }
            //check if the user has the permission to use the command
            if (message.member.permissions.toArray().includes(command.permissions.join()) || command.permissions.includes("ALL") || db.get("maintainers").includes(message.author.id)) {
                //run the command
                command.run(bot, message, db);
            
            } else {
                //send a message to the channel that the user does not have the permission to use the command
                message.channel.send(`You do not have the permission to use this command!\nYou need the following permissions: ${command.permissions.join(", ")}`);
            }
        } catch (error:any) {
            //send a message to the channel that the command does not exist
          if (error.toString().startsWith("Error: Cannot find module") == true) {console.log(error); return};
            message.channel.send(`error:\n${error}\n(report this to david!)`);
        }

    }
});

//this logs the bot in
bot.login(process.env['token'] || process.env.TOKEN);