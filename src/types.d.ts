import {SlashCommandBuilder} from "@discordjs/builders";
import { DiscordResponse, SlashCommandInteraction } from "client";

declare type Command = {
	data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">,
	execute(interaction: SlashCommandInteraction): Promise<DiscordResponse>
};