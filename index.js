const { Client, Events, GatewayIntentBits } = require('discord.js');
const config = require('./config.pii');
const fs = require('fs');
const readline = require('readline');
const process = require('process');

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds
	]
});

client.login(config.token);

client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);

	pollBrightness();
	main();
});

let lightsOn = false;

function pollBrightness() {
	const file = fs.createReadStream(config.device);
	const reader = readline.createInterface({
		input: file,
		terminal: false
	});
	
	reader.on('line', line => {
		if(line.length === 0) return;
		const brightness = Number(line);
		if(brightness >= config.threshold) {
			lightsOn = true;
		}
		else {
			lightsOn = false;
		}
	});

	process.on('SIGTERM', () => {
		process.exit('SIGKILL');
	});
}

function main() {
	let prevStatus = null;
	
	client.on('rateLimit', e => {
		console.log(e);
	});

	setInterval(function() {
		const status = lightsOn ? 'open ✅' : 'closed ❌';
		if(status !== prevStatus) {
			prevStatus = status;

			const servers = client.guilds.cache;
			for(const [_sId, server] of servers) {
				const channels = server.channels.cache;
				
				//server.members.cache.get(client.user.id).setNickname(status);

				for(const [_cId, channel] of channels) {
					if(channel.name.indexOf('office-is') >= 0) {
						channel.setName(`office-is-${status}`);
					}
				}
			}
		}
	}, 60 * 1000);
}
