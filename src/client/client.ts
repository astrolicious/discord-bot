import { verifyKey } from "discord-interactions";
import { Env } from "env";
import { Command } from "types";
import { DiscordResponse } from "./response";
import { APIBaseInteraction, InteractionResponseType, InteractionType } from "discord-api-types/v10";

export class DiscordClient {
	
	commands: Command[];
	env: Env;
	ctx: ExecutionContext;

	constructor(commands: Command[], env: Env, ctx: ExecutionContext)
	{
		this.commands = commands;
		this.env = env;
		this.ctx = ctx;
	}

	async handle(request: Request): Promise<DiscordResponse>
	{
		const {body, valid} = await this.isRequestValid(request);
		if(!valid)
		{
			return new DiscordResponse("Invalid request signature", { status: 401 });
		}

		const interaction = JSON.parse(body) as APIBaseInteraction<InteractionType, any>
		
		if (interaction.type == InteractionType.Ping) {
			return new DiscordResponse({ type: InteractionResponseType.Pong });
		}
		
		return new DiscordResponse("Not Found", {status: 404});
	}

	async isRequestValid(request: Request): Promise<{body: string, valid: boolean}>
	{
		const signature = request.headers.get('x-signature-ed25519');
		const timestamp = request.headers.get('x-signature-timestamp');
		const body = await request.text();

		const valid = signature && timestamp && verifyKey(body, signature, timestamp, this.env.DISCORD_PUBLIC_KEY)

		if(valid)
		{
			return {body, valid: true};
		}

		return {body, valid: false};
	}

}