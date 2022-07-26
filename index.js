const keepAlive = require("./server.js")
const chalk = require('chalk');
const dotenv = require('dotenv');
const { Client } = require('discord.js-selfbot-v11')
const fs = require('fs');
const client = new Client();

const events = fs.readdirSync('./events/');
events.forEach(file => {
	const eventname = file.split('.')[0];
	const event = require(`./events/${file}`);
	client.on(eventname, event.bind(null, client));
});

const request = require("request");
const config = require("./run.json");
const STATUS_URL = "https://discordapp.com/api/v8/users/@me/settings";

async function loop() {
	for (let anim of config.animation) {
		await doRequest(anim.text, anim.emojiID, anim.emojiName).catch(console.error);
		await new Promise(p => setTimeout(p, anim.timeout));
	}

	loop();
}
loop();

function doRequest(text, emojiID = null, emojiName = null) {
	return new Promise((resolve, reject) => {
		request({
			method: "PATCH",
			uri: STATUS_URL,
			headers: {
				Authorization: process.env.TOKEN
			},
			json: {
				custom_status: {
					text: text,
					emoji_id: emojiID,
					emoji_name: emojiName
				}
			}
		}, (err, res, body) => {
			if (err) {
				reject(err);
				return;
			}

			if (res.statusCode !== 200) {
				reject(new Error("Invalid Status Code: " + res.statusCode));
				return;
			}

			resolve(true);
		});
	});
}

client.on('ready', () => { 
   console.log(chalk.hex("#00FF53")`✓ Enabled online forever ${client.user.username}`)
})

keepAlive();
client.login(process.env.TOKEN);
