//express
import express from 'express';
var app = express();
var port = process.env.PORT || 3000;

//body parser
import bodyParser from 'body-parser';
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//the server function
export function server(bot) {
    //the single route
    app.get('/*', (req, res) => {
        //send the response
        res.send(`running as: ${bot.user.tag}<br><a href="https://discord.com/api/oauth2/authorize?client_id=727368613144821802&permissions=8&scope=bot%20applications.commands">add to server<\a>`);
    }
);
    //start the server
    app.listen(port, () => {
        console.log(`listening on port ${port}`);
    });
};