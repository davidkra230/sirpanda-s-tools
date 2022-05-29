//express
var express = require('express');
var app = express();
var port = process.env.PORT || 3000;

//body parser
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//the server function
export function server(bot) {
    //the single route
    app.get('/*', (req, res) => {
        //send the response
        res.send(`running as: ${bot.user.tag}`);
    }
);
    //start the server
    app.listen(port, () => {
        console.log(`listening on port ${port}`);
    });
};