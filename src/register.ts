import {config} from "dotenv";
import {resolve} from 'node:path';

config({ path: resolve(process.cwd(), '.dev.vars') });

if (!process.env.DISCORD_TOKEN || !process.env.DISCORD_CLIENT_ID) {
	console.error('The required tokens to register commands were not present');
	process.exit(1);
}

import { REST } from '@discordjs/rest';
import CommandList from './commands';
import { Command } from './types';
import { RESTPostAPIApplicationCommandsJSONBody, Routes } from "discord-api-types/v10";

const rest: REST = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

let commands: RESTPostAPIApplicationCommandsJSONBody[] = [];
for (const commandName in CommandList) {
	const command: Command = CommandList[commandName];

	commands.push(command.data.toJSON());
}

console.log(`Started refreshing ${commands.length} commands.`);

const data: any = await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), { body: commands });

console.log(`Successfully reloaded ${data.length} commands.`);
