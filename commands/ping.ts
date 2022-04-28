//permissions required to use the command
exports.permissions = ["ALL"];
//the description of the command
exports.description = "get a pong with latency";
//the run function
exports.run = (bot:any, message:any, db:any) => {
    //send a message to the channel that the bot is pinging with the latency
    message.reply(`Pong! Latency is ${Math.round(bot.ws.ping)}ms.`);
};