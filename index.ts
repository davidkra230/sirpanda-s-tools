//a bot for discord written in typescript using the discordx library with a web... nah, not much at least.
//dotenv is used to store the token in a .env file
//the bot uses simple-json-db to store the data

//import the discordx library
import * as Discord from "discordx";
//import message and intents from discord.js
import { Message, Intents, Client } from "discord.js";
//require dotenv
import * as dotenv from "dotenv";
dotenv.config();
//import lowdb because simple-json-db is a pain in the ass
import { JSONFileSync, LowSync } from "lowdb";
//make the database
const db = new LowSync(new JSONFileSync<any>("./data.json"));
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
    import("./webserver/server.js").then(server => {
        server.server(bot);
    });
    //no botconfig?
    db.read();
    if (db.data.botconfig == null || db.data.botconfig == undefined) {
        //create.
        db.data.botconfig = {};
        db.write();
    }
    
    //sets the prefix to "!"
    db.read();
    if (db.data.botconfig.prefix == null || db.data.botconfig.prefix == undefined) {
        db.data.botconfig.push({"prefix": "!"});
        db.write();
    }
    //set the activity and activity type to the one in the db or default to playing and "bots be like:" if there is no activity in the db
        db.read();
        if (db.data.botconfig.activity == undefined || db.data.botconfig.activityType == undefined) {
        db.data.botconfig.activity = "bots be like:";
        db.data.botconfig.activityType = "PLAYING";
        db.write();
        bot.user.setActivity(db.data.botconfig.activity, { type: db.data.botconfig.activityType});
        }
        //maintainers
        db.read();
        if (!db.data.botconfig.maintainers == undefined) {return}
            db.data.botconfig.maintainers = [];
            db.data.botconfig.maintainers.push("652699312631054356");
            db.write();
}
);

//when a message is received it checks if the message is a command
bot.on(`messageCreate`, async (message: Message) => {
    //print the message
    console.log(`something happened: ${message.content}`);
        db.read();
        //get the prefix from the db
        //var prefix = data[message.guild.id].prefix;
        if (db.data.servers[message.guild.id] == undefined || db.data.servers[message.guild.id] == null) {
            db.data.servers[message.guild.id] = {};
            db.write();
        };
        db.read();
        console.log(db.data.servers[message.guild.id].prefix);
        if (db.data.servers[message.guild.id].prefix == undefined || db.data.servers[message.guild.id].prefix == null) {
                console.log("prefix is undefined");
                //if there is an error set the prefix to "!"
                db.read();
                if (!db.data.servers[message.guild.id]) {
                    db.data.servers.push({[message.guild.id]: {}});
                    db.write();
                }
            }
                db.read();
                db.data.servers[message.guild.id].prefix = db.data.botconfig.prefix
                db.write();
                //get the prefix from the db
                var prefix = db.data.servers[message.guild.id].prefix;
    //if the message starts with the prefix specific to the one for the guild id or the ping of the bot 
    if (message.content.startsWith(prefix) || message.content.startsWith(`<@${bot.user.id}>`)) {
            //if the prefix is same as the ping of the bot
            if (message.content.startsWith(prefix)) {var cprefix = `${prefix}`};
            if (message.content.startsWith(`<@${bot.user.id}>`)) {var cprefix = `<@${bot.user.id}>`};
        console.log(`prefix: ${cprefix}`);
        //check if the command exists in the commands folder by trying to require it
        //and if the user has the permission to use the command or is a maintainer then run the command
        try {

            //check if the command is in the commands folder
            var command = await import(`./commands/${message.content.split(" ")[0].slice(`${cprefix}`.length).toLowerCase()}.js`)
            //check if the command has maintener required permissions
             if (message.member.permissions.toArray().includes(command.permissions.join()) || command.permissions.includes("ALL") || db.data.botconfig.maintainers.join().includes(message.author.id.toString())) {
                //run the command
                command.run(bot, message, db);
            
            } else {
                //send a message to the channel that the user does not have the permission to use the command
                message.channel.send(`You do not have the permission to use this command!\nYou need the following permissions: ${command.permissions.join(", ")}`);
            }
        } catch (error:any) {
            //send a message to the channel that the command does not exist
          if (error.toString().startsWith("Error: Cannot find module") == true) {console.log(error.stack); return};
            message.channel.send(`error:\n${error.stack}\n(report this to david!)`);
        }

    }
});
//this logs the bot in
bot.login(process.env['token'] || process.env.TOKEN);