import { Command } from "types";
import {EmbedBuilder, SlashCommandBuilder} from "@discordjs/builders";
import { DiscordResponse } from "client";
import { InteractionResponseType } from "discord-api-types/v10";


const command = {
	data: new SlashCommandBuilder()
		.setName("help")
		.setDescription("help me!"),
	execute(interaction) {

		const embed = new EmbedBuilder()
			.setTitle("L skillissue")
			.setDescription("git good lmao");

		return interaction.reply({embeds: [embed]});
	},
} satisfies Command;

export default command;