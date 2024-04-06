import { APIApplicationCommandInteraction, APIApplicationCommandInteractionDataOption, APIApplicationCommandInteractionDataStringOption, APIBaseInteraction, ApplicationCommandOptionType, ApplicationCommandType, InteractionResponseType, InteractionType, MessageFlags } from "discord-api-types/v10";
import { DiscordResponse } from "./response";
import { DiscordClient } from "client";

class InteractionOptions
{
	options: APIApplicationCommandInteractionDataOption[] | undefined;

	constructor(options: APIApplicationCommandInteractionDataOption[] | undefined)
	{
		this.options = options;
	}

	getStringOption(name: string)
	{
		if(!this.options)
		{
			return undefined;
		}

		const option = this.options.find(option => option.name == name && option.type == ApplicationCommandOptionType.String);
		
		if(!option)
		{
			return undefined;
		}

		return option as APIApplicationCommandInteractionDataStringOption;
	}

	getString(name: string)
	{
		const option = this.getStringOption(name);

		if(!option)
		{
			return undefined;
		}
		return option.value;
	}
}

type DeferOptions = {
	hidden: boolean;
}

export class SlashCommandInteraction
{
	interaction: APIApplicationCommandInteraction;
	options: InteractionOptions;
	deferred: boolean = false;

	constructor(interaction: APIBaseInteraction<InteractionType, any>)
	{
		if(interaction.type != InteractionType.ApplicationCommand)
		{
			throw new Error("Invalid interaction type. Expected ApplicationCommand")
		}

		this.interaction = interaction as APIApplicationCommandInteraction;

		if(this.interaction.data.type != ApplicationCommandType.ChatInput)
		{
			throw new Error("Invalid application command type. Expected ChatInput")
		}

		this.options = new InteractionOptions(this.interaction.data.options);

		this.interaction.data.options
	}

	deferReply(options?: DeferOptions, promise?: () => Promise<any>): DiscordResponse
	{
		this.deferred = true;

		if(promise)
		{
			DiscordClient.client.ctx.waitUntil(promise())
		}

		let data: any = {};

		if(options?.hidden)
		{
			data.flags = MessageFlags.Ephemeral;
		}

		return new DiscordResponse(InteractionResponseType.DeferredChannelMessageWithSource, data);
	}

	reply(data: any)
	{
		return new DiscordResponse(InteractionResponseType.ChannelMessageWithSource, data);
	}

	error(error: string)
	{
		const message = `An internal error occured: \"${error}\"\n\nIf this issues keeps occuring, please contact us.`;

		return this.reply({content: message, flags: MessageFlags.Ephemeral});
	}

	warning(warning: string)
	{
		const message = `The provided options resulted in the following warning: "${warning}". If you believe this to be an error, please contact us.`;

		return this.reply({content: message, flags: MessageFlags.Ephemeral});
	}
	
}