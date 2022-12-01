const Discord = require("discord.js");
const bot = new Discord.Client();
const prefix = "/";
var fs = require("fs");
var lineReader = require("line-reader");
var async = require("async");
const firstline = require("firstline");
const generated = new Set();
var os = require("os");

var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

//For avoidong Heroku $PORT error
app.get('/', function (request, response) {
    var result = 'BOT ON'
    response.send(result);
}).listen(app.get('port'), function () {
    console.log('Bot ON, server is listening on port ', app.get('port'));
});
bot.on("ready", () => {
    console.log(`Logged in as ${bot.user.tag}!`);
});

bot.on("message", message => {
    if (message.channel.id === "1047946500723974194") { //This will make the bot work only in that channel
        if (message.author.bot) return;
        var command = message.content
            .toLowerCase()
            .slice(prefix.length)
            .split(" ")[0];

        if (command === "test") {
            message.channel.send("Test effectué, le bot fonctionne");
        }

        if (command === "gen") {
            if (generated.has(message.author.id)) {
                message.channel.send(
                    "Attendez 15 minutes avant de générer un autre compte !. -" +
                    message.author
                );
            } else {
                let messageArray = message.content.split(" ");
                let args = messageArray.slice(1);
                if (!args[0])
                    return message.reply("S'il vous plaît, précisez le service que vous souhaitez!");
                var fs = require("fs");
                const filePath = __dirname + "/" + args[0] + ".txt";

                fs.readFile(filePath, function (err, data) {
                    if (!err) {
                        data = data.toString();
                        var position = data.toString().indexOf("\n");
                        var firstLine = data.split("\n")[0];
                        message.author.send(firstLine);
                        if (position != -1) {
                            data = data.substr(position + 1);
                            fs.writeFile(filePath, data, function (err) {
                                const embed = {
                                    title: "Compte généré !",
                                    description: "Vérifiez vos dm pour les informations du compte !",
                                    color: 8519796,
                                    timestamp: "2019-04-04T14:16:26.398Z",
                                    footer: {
                                        icon_url:
                                            "https://cdn.discordapp.com/avatars/530778425540083723/7a05e4dd16825d47b6cdfb02b92d26a5.png",
                                        text: "Buy discord accounts from Mental#8106"
                                    },
                                    thumbnail: {
                                        url:
                                            "http://www.compartosanita.it/wp-content/uploads/2019/02/right.png"
                                    },
                                    author: {
                                        name: "Générateur de compte",
                                        url: "https://discordapp.com",
                                        icon_url: bot.displayAvatarURL
                                    },
                                    fields: []
                                };
                                message.channel.send({ embed });
                                generated.add(message.author.id);
                                setTimeout(() => {
                                    // Removes the user from the set after a minute
                                    generated.delete(message.author.id);
                                }, 150000);
                                if (err) {
                                    console.log(err);
                                }
                            });
                        } else {
                            message.channel.send(
                                "Désolé, aucun compte n'est disponible pour ce service !"
                            );
                        }
                    } else {
                        message.channel.send(
                            "Désolé, ce service n'existe pas dans notre base de données"
                        );
                    }
                });
            }
        }
        else
            if (command === "stats") {

                message.channel.send(`nombre total d'utilisateurs: ${bot.users.size}`)
            }

        if (command === "add") {
            if (!message.member.hasPermission("ADMINISTRATOR"))
                return message.reply("Désolé, vous ne pouvez pas le faire, vous n'êtes pas un administrateur !");
            var fs = require("fs");
            let messageArray = message.content.split(" ");
            let args = messageArray.slice(1);
            var account = args[0]
            var service = args[1]
            const filePath = __dirname + "/" + args[1] + ".txt";
            fs.appendFile(filePath, os.EOL + args[0], function (err) {
                if (err) return console.log(err);
                message.channel.send("Done!")
            });


        }
        if (command === "create") {
            if (!message.member.hasPermission("ADMINISTRATOR"))
                return message.reply("Désolé, vous ne pouvez pas le faire, vous n'êtes pas un administrateur !");
            var fs = require("fs");
            let messageArray = message.content.split(" ");
            let args = messageArray.slice(1);
            const filePath = __dirname + "/" + args[0] + ".txt";
            fs.writeFile(filePath, 'first:first', function (err) {
                if (err) throw err;
                message.channel.send("Done!")
            });
        }
        if (command === "restock") {
            let messageArray = message.content.split(" ");
            let args = messageArray.slice(1);
            if (!message.member.hasPermission("ADMINISTRATOR"))
                return message.reply("Désolé, vous ne pouvez pas le faire, vous n'êtes pas un administrateur !");
            if (!args[0])
                return message.reply(
                    "Merci de préciser le service que vous souhaitez réapprovisionner !"
                );
            message.channel.send(
                "@everyone " +
                "**" +
                args[0] +
                "**" +
                "a été réapprovisionné par" +
                "<@" +
                message.author.id +
                ">"
            );
        }
    }
});

bot.login("Token");