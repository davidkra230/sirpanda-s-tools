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
    silent: false
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
    //calculate prefix within a try catch block
    try {
        //get the prefix from the db
        var prefix = db.get(message.guild.id).prefix;
    } catch (error) {
        //if there is an error set the prefix to "!"
        db.set(`${message.guild.id}."prefix"`, db.get("prefix"));
        //get the prefix from the db
        var prefix = db.get("prefix");
    }
    var prefix = db.get(message.guild.id).prefix || db.get("prefix");
    //if the message starts with the prefix specific to the one for the guild id or the ping of the bot 
    if (message.content.startsWith(db.get("prefix") || `<@${bot.user.id}>`)) {
        //try to require the command file and pass everything as arguments
        try {
            //check if the user does not have the required permissions to use the command
            if (!require(".\\commands\\" + message.content.split(" ")[0].substring(1) + ".js").permissions.includes(message.member.permissions.toArray()) || require(message.content.split(" ")[0].substring(1) + ".js").permissions !== "ALL" || !db.get("maintainers").includes(message.author.id)) {
                //send a message to the channel that the user does not have the required permissions
                message.channel.send(`You don't have the required permissions to use this command!`);
                //return to stop the rest of the code from running
                return;
            };
            //otherwise require the command file and pass everything as arguments
            require(".\\commands\\" + message.content.split(" ")[0].substring(1) + ".js").run(bot, message, db);
            
        } catch (error) {
            //if there is an error tell the user that the command is not found and tell them to use the help command
            message.channel.send(`Command not found. Use \`${prefix}help\` to see a list of commands.\nOriginal error: ${error}`);
        }}});
//this logs the bot in
bot.login(process.env.TOKEN);