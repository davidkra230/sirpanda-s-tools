//permissions required to use the command
export var permissions = ["ALL"];
//the description of the command
export var description = "get a pong with latency";
//message embed
var { MessageEmbed } = await import('discord.js');
var embed = new MessageEmbed();

//the run function
export function run(bot, message, db) {
    //send a message to the channel that the bot is pinging with the latency
    embed.setTitle("Pong! :ping_pong:");
    embed.setDescription(`Latency: ${bot.ws.ping}ms`);
    embed.footer = { text: `Requested by <@!${message.author.id}>`, iconURL: message.author.avatarURL() };
    message.reply({embeds: [embed]});
};