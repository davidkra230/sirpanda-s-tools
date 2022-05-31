//a bot for discord written in typescript using the discordx library with a web... nah, not much at least.
//dotenv is used to store the token in a .env file
//the bot uses simple-json-db to store the data

//import the discordx library
import * as Discord from "discordx";
//import message and intents from discord.js
import { Message, Intents, Client } from "discord.js";
//require dotenv
require("dotenv").config();
//require the json db
var jsondb = require("simple-json-db");
//create the db
var db = new jsondb("./data.json");
//import reflect-metadata
import "reflect-metadata";
//import the discordx library
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
    //start web interface
    require("./webserver/server.js").server(bot);
    //no botconfig?
    if (!db.has("botconfig")) {
        //create.
        db.set("botconfig", {})
    }
        
    //sets the prefix to "!"
    if (!db.has("botconfig").prefix) {
        db.set("botconfig", {"prefix": "!"});
    }
    //set the activity and activity type to the one in the db or default to playing and "bots be like:" if there is no activity in the db
        if (db.has("botconfig").activity == undefined || db.get("botconfig").activityType == undefined) {
        var data = db.JSON()
        data.botconfig.activity = "bots be like:";
        data.botconfig.activityType = "PLAYING";
        db.JSON(data);
        db.sync();
        bot.user.setActivity(db.get("botconfig").activity, { type: db.get("botconfig").activityType});
        }
        //maintainers
        if (!db.get("botconfig").maintainers == undefined) {return}
            var data = db.JSON();
            data.botconfig.maintainers = [];
            data.botconfig.maintainers.push("652699312631054356");
            db.JSON(data);
            db.sync();
}
);

//when a message is received it checks if the message is a command
bot.on(`messageCreate`, (message: Message) => {
    //print the message
    console.log(`something happened: ${message.content}`);
        var data = db.JSON();
        //get the prefix from the db
        //var prefix = data[message.guild.id].prefix;
        if (db.get("servers").message.guild.id == undefined) {
            data = db.JSON();
            data.servers[message.guild.id] = {};
            db.JSON(data);
            db.sync();
        }

        console.log(db.get("servers")[message.guild.id].prefix);
        if (db.get("servers")[message.guild.id].prefix == undefined) {
                console.log("prefix is undefined");
                //if there is an error set the prefix to "!"
                if (!db.has("servers")[message.guild.id]) {
                    db.set("servers", {[message.guild.id]: {}});
                }
            }
                db.set("servers", {[message.guild.id]: {"prefix": db.get("botconfig").prefix}}) 
                //get the prefix from the db
                var prefix = db.get("servers")[message.guild.id].prefix;
    //if the message starts with the prefix specific to the one for the guild id or the ping of the bot 
    if (message.content.startsWith(prefix) || message.content.startsWith(`<@${bot.user.id}>`)) {
            //if the prefix is same as the ping of the bot
            if (message.content.startsWith(prefix)) {var cprefix = `${prefix}`;}
            if (message.content.startsWith(`<@${bot.user.id}>`)) {var cprefix = `<@${bot.user.id}>`;}
        console.log(`prefix: ${cprefix}`);
        //check if the command exists in the commands folder by trying to require it
        //and if the user has the permission to use the command or is a maintainer then run the command
        try {

            //check if the command is in the commands folder
            var command = require(`./commands/${message.content.split(" ")[0].slice(`${cprefix}`.length).toLowerCase()}.js`);
            //check if the command has maintener required permissions
             if (message.member.permissions.toArray().includes(command.permissions.join()) || command.permissions.includes("ALL") || db.get("botconfig").maintainers.join().includes(message.author.id.toString())) {
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