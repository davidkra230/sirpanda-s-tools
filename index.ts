//a bot for discord written in typescript using the discordx library with a web... nah, not much at least.
//dotenv is used to store the token in a .env file
//the bot uses lowdb to store the data

//import the discordx library
import * as Discord from "discordx";
//import message and intents from discord.js
import { Message, Intents, Client, Interaction } from "discord.js";
//require dotenv
require("dotenv").config();
//fs
import * as fs from "fs";
//rest with discord.js
var { REST } = require("@discordjs/rest");
var rest = new REST({ version: "9" }).setToken(process.env.TOKEN);
//routes
var { Routes } = require('discord-api-types/v9');
//lowdb
import { LowSync, JSONFileSync } from 'lowdb'
//create the db
var db:any = new LowSync(new JSONFileSync("./data.json"));
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
bot.on(`ready`, async () => {
    console.log(`Ready as: ` + bot.user.tag + `!`);
    //start web interface
    require("./webserver/server.js").server(bot);
    //no db?
    db.read();
    if (db.data == null) {
        //create.
        db.data = {"botconfig": {}, "servers": {}};
        db.write();
    };
        
    //sets the prefix to "!"
    db.read();
    if (db.data.botconfig.prefix == undefined) {
        db.data.botconfig.prefix = "!";
        db.write();
    };
    //set the activity and activity type to the one in the db or default to playing and "bots be like:" if there is no activity in the db
        db.read();
        if (db.data.botconfig.activity == undefined || db.data.botconfig.activityType == undefined) {
        db.data.botconfig.activity = "bots be like:";
        db.data.botconfig.activityType = "PLAYING";
        db.write();
        bot.user.setActivity(db.data.botconfig.activity, { type: db.data.botconfig.activityType});
        }
        //maintainers
        if (db.data.botconfig.maintainers == undefined) {
            db.data.botconfig.maintainers = [];
            db.data.botconfig.maintainers.push("652699312631054356");
            db.write();
        };
        //register slash commands with discord
        console.log(bot.user.id);
        console.log("registering slash commands...");
        var cmds = [];
        fs.readdirSync(__dirname + "/commands/").forEach(function(file:any) {
            if (!file.endsWith(".js")) {return};
            cmds.push(require(`./commands/${file}`).data.toJSON());
        });
        // cmds = []
        // db.read();
        // for (var [key, value] of Object.entries(db.data.servers)) {
        //     bot.application.commands.set(cmds, key)
        // };
        // console.log("done.");
        console.log("doing global commands...");
        bot.application.commands.set(cmds)
        console.log("done.");
});

bot.on(`interactionCreate`, interaction => {
    if (interaction.isCommand()) {
        require(`./commands/${interaction.command.name}.js`).run(bot, interaction, db, true);
    }
});

//when a message is received it checks if the message is a command
bot.on(`messageCreate`, (message: Message) => {
    //print the message
    console.log(`something happened: ${message.content}`);
        //get the prefix from the db
        //var prefix = data[message.guild.id].prefix;
        db.read();
        if (db.data.servers[message.guild.id] == undefined) {
                db.data.servers[message.guild.id] = {};
                db.write();
        };
        db.read();
        if (db.data.servers[message.guild.id].prefix == undefined) {
                db.data.servers[message.guild.id].prefix = db.data.botconfig.prefix;
                db.write();
            };
                db.read();
                //get the prefix from the db
                var prefix = db.data.servers[message.guild.id].prefix;
    //if the message starts with the prefix specific to the one for the guild id or the ping of the bot 
    if (message.content.startsWith(prefix) || message.content.startsWith(`<@${bot.user.id}>`)) {
            //if the prefix is same as the ping of the bot
            if (message.content.startsWith(prefix)) {var cprefix = `${prefix}`;}
            if (message.content.startsWith(`<@${bot.user.id}>`)) {var cprefix = `<@${bot.user.id}>`;}
        //check if the command exists in the commands folder by trying to require it
        //and if the user has the permission to use the command or is a maintainer then run the command
        try {

            //check if the command is in the commands folder
            var command = require(`./commands/${message.content.split(" ")[0].slice(`${cprefix}`.length).toLowerCase()}.js`);
            //check if the command has maintener required permissions
             if (message.member.permissions.toArray().includes(command.permissions.join()) || command.permissions.includes("ALL") || db.data.botconfig.maintainers.join().includes(message.author.id.toString())) {
                //run the command
                command.run(bot, message, db, false);
            
            } else {
                //send a message to the channel that the user does not have the permission to use the command
                message.channel.send(`You do not have the permission to use this command!\nYou need the following permissions: ${command.permissions.join(", ")}`);
            }
        } catch (error:any) {
            //send a message to the channel that the command does not exist
          if (error.toString().startsWith(`Error: Cannot find module './commands/${message.content.split(" ")[0].slice(cprefix.length)}.js'`) == true) {console.log(error); return};
            message.channel.send(`error:\n${error}\n(report this to david!)`);
        }

    }
});
//this logs the bot in
bot.login(process.env['token'] || process.env.TOKEN);
