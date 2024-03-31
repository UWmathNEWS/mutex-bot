const { Client, Events, GatewayIntentBits } = require('discord.js');
const config = require('./config.pii');
const process = require('process');

const die = (msg) => { console.error(msg); process.exit(1); }
const usage = `usage: ${process.argv[0]} ${process.argv[1]} [lock|unlock] [machine-code]`;
const action = process.argv[2];
const machine = process.argv[3];

if((action !== "lock" && action !== "unlock") || !machine) {
	die(usage);
}

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds
	]
});

client.login(config.token);

client.once(Events.ClientReady, c => {
	console.log(`Logged in as ${c.user.tag}`);
	main();
});

function main() {
	const emoji = {
		lock: '🔒',
		unlock: '🔓',
	}
	let updated = false;
	const servers = client.guilds.cache;
	for(const [_sId, server] of servers) {
		const channels = server.channels.cache;

		for(const [_cId, channel] of channels) {
			if(channel.name.indexOf(machine) >= 0) {
				channel.setName(`${machine}-${emoji[action]}`);
				console.log(`channel updated in ${server.name}`);
				updated = true;
			}
		}
	}
	if(!updated) {
		die('could not find channel');
	}
	process.exit(0);
}
