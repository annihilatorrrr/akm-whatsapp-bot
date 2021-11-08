const axios = require("axios");
const { MessageType } = require("@adiwajshing/baileys");
const { text } = MessageType;
const path = require("path");
const fs = require('fs');
const mess = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../data/messages.json"))
);
const { help } = require(path.join(__dirname, "../utils/help"));
const urlregex =
    /^(?:(?:https?|http|www):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;

module.exports = {
    "name": "shorturl",
    "usage": "shorturl <link>",
    "desc": "Generates a short url of the given link using www.lenk.cf API.",
    "eg": [
        "shorturl https://www.hindustantimes.com/world-nes"
    ],
    handle (Infor, client) {
        new Promise((resolve, reject) => {
            const arg = Infor.arg
            const from = Infor.from;
            if (arg.length == 1) {
                Infor.arg = ["help", arg[0]]
                help(Infor, client, Infor.reply, 1);
                resolve()
                return
            }
            if (urlregex.test(arg[1]) === false) {
                client.sendMessage(from, mess.error.invalid, text, {
                    quoted: Infor.reply
                });
                resolve()
                return
            }
            axios({
                method: "POST",
                url: "https://lenk.cf/p/" + encodeURIComponent(arg[1])
            })
                .then((response) => {
                    if (response.data == 'Invalid URL') {
                        client.sendMessage(from, mess.error.invalid, text, {
                            quoted: Infor.reply
                        });
                        resolve()
                        return
                    }
                    const msg = "🤖 ```shortened url is:```" + "\n" +
                        "```https://lenk.cf/```" +
                        "```" +
                        response.data +
                        "```" +
                        "\n\n" +
                        "```API by lenk.cf```";
                    client.sendMessage(from, msg, text, {
                        quoted: Infor.reply,
                        detectLinks: false

                    })
                    resolve();

                })
                .catch(() => {
                    client.sendMessage(from, mess.error.error, text, {
                        quoted: Infor.reply,

                    });
                    reject(Infor)
                })
        })
}}