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

//print something when the bot is ready and sets the status and status type to the one in the db
bot.on(`ready`, () => {
    console.log(`Ready as: ` + bot.user.tag + `!`);
    bot.user.setActivity(db.get(`status`));
    bot.user.setStatus(db.get(`statusType`));
});

//when a message is received it checks if the message is a command
bot.on(`message`, (message: Message) => {
    //if the message starts with the prefix specific to the one for the guild id 
    if (message.content.startsWith(db.get(message.guild.id).prefix)) {
        //try to require the command file and pass everything as arguments
        try {
            require(`./commands/` + message.content.split(` `)[0].slice(1) + `.js`)(bot, message, db);
        } catch (error) {
            //if the command file doesn't exist send an error message in the channel that the command was sent in informing the user that the command doesn't exist
            message.channel.send(`The command doesn't exist, try ${db.get(message.guild.id).prefix}help`);
        }}});
//this logs the bot in
bot.login(process.env.TOKEN);