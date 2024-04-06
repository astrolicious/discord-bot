import {SlashCommandBuilder} from "@discordjs/builders";
import { DiscordResponse, SlashCommandInteraction } from "client";

declare type Command = {
	data: SlashCommandBuilder,
	execute(interaction: SlashCommandInteraction): DiscordResponse
};