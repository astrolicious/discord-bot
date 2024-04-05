import { verifyKey } from "discord-interactions";
import { Env } from "env";
import { Command } from "types";
import { DiscordResponse } from "./response";

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
		if(!this.isRequestValid(request))
		{
			return new DiscordResponse("Invalid request signature", { status: 401 });
		}
		

		
		return new DiscordResponse("Not Found", {status: 404});
	}

	async isRequestValid(request: Request): Promise<boolean>
	{
		const signature = request.headers.get('x-signature-ed25519');
		const timestamp = request.headers.get('x-signature-timestamp');
		const body = await request.text();
		return (signature && timestamp && verifyKey(body, signature, timestamp, this.env.DISCORD_PUBLIC_KEY)) as boolean;
	}

}