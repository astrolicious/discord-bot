import { DiscordClient } from "client";
import { Env } from "env";
import {Router} from "itty-router";
import commands from "commands";

const router = Router();

router.get("/", async () => {
	return new Response("Hello world!");
});

router.post("/", async (request: Request, env: Env, ctx: ExecutionContext) => {

	const client = new DiscordClient(commands, env, ctx);
		
	return await client.handle(request);
});

export default {
	fetch: router.fetch
} satisfies ExportedHandler;