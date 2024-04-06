import { InteractionResponseType } from "discord-api-types/v10";

export class DiscordResponse extends Response {
	constructor(type: InteractionResponseType, data?: any, init?: ResponseInit) {
		const jsonBody = JSON.stringify({type, data});
		init = init || {
			headers: {
				'content-type': 'application/json;charset=UTF-8',
			},
		};
		super(jsonBody, init);
	}
}