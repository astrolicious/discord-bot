import { Command } from "types";
import {SlashCommandBuilder} from "@discordjs/builders";


const command = {
	data: new SlashCommandBuilder()
		.setName("help")
		.setDescription("help me!")
} satisfies Command;

export default command;