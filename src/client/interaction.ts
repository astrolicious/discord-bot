import { APIApplicationCommandInteraction, APIBaseInteraction, InteractionResponseType, InteractionType } from "discord-api-types/v10";
import { DiscordResponse } from "./response";

export class SlashCommandInteraction
{
	interaction: APIApplicationCommandInteraction;

	constructor(interaction: APIBaseInteraction<InteractionType, any>)
	{
		if(interaction.type != InteractionType.ApplicationCommand)
		{
			throw new Error("Invalid interaction type. Expected ApplicationCommand")
		}

		this.interaction = interaction as APIApplicationCommandInteraction;
	}

	reply(data: any)
	{
		return new DiscordResponse(InteractionResponseType.ChannelMessageWithSource, data);
	}
	
}