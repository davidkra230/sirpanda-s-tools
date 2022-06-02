//define fs
var fs = await import('fs');
//define discord.js
const { MessageEmbed } = await import('discord.js');
//set description
export var description = "get help";
//set permissions
export var permissions = ["ALL"];

//run function
export function run(bot, message, db) {
    //define embed
    var embed = new MessageEmbed();
    //array to hold the commands
    let cmds:any = [];
    //syncronously read the files in the commands folder and push them to the array
    fs.readdirSync(`./build/commands`)
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
        import(`./${cmd}.js`).then(function(file) {
            embed.addFields({ name: cmd, value: file.description });
            console.log(`embed rn: `);
            console.log(embed);
        });
        console.log(`${cmd} added to embed`);
    };
    //reply with the embed
    message.reply({embeds: [embed]});
};