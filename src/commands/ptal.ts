import { Command } from "types";
import {EmbedBuilder, SlashCommandBuilder} from "@discordjs/builders";
import { Octokit } from "@octokit/rest";

const command = {
	data: new SlashCommandBuilder()
		.setName("ptal")
		.setDescription('Open a Please Take a Look (PTAL) request')
		.addStringOption((option) =>
			option.setName('github').setDescription('A link to a GitHub pull request').setRequired(true)
		)
		.addStringOption((option) =>
			option.setName('description').setDescription('A short description of the PTAL request').setRequired(true)
		)
		.addStringOption((option) =>
			option.setName('deployment').setDescription('A link to a (preview) deployment related to the PTAL').setRequired(false)
		)
		.addStringOption((option) =>
			option.setName('other').setDescription('Other links related to the PTAL, comma seperated').setRequired(false)
		),
	async execute(interaction) {

		const github = interaction.options.getString("github");
		if(!github)
		{
			return interaction.error("github option required, but not found");
		}
		const description = interaction.options.getString("description");
		if(!description)
		{
			return interaction.error("github option required, but not found");
		}
		const deployment = interaction.options.getString("deployment");
		let deploymentURL: URL | undefined;
		if(deployment)
		{
			try
			{
				deploymentURL = new URL(deployment);
			}
			catch
			{
				return interaction.warning("Failed to parse the deployment url. Are you sure it was in the correct format? Please sure they start with a valid protocol.");
			}
		}
		const other = interaction.options.getString("other");
		let otherURLs: URL[] = [];
		if(other)
		{
			let urls = other.split(",");

			urls.forEach(url => {
				try
				{
					const parsedURL = new URL(url.trim());

					otherURLs.push(parsedURL);
				}
				catch
				{
					return interaction.warning(`Failed to parse the other urls (specifically: ${url}). Are you sure it they were all in the correct format? Please sure they start with a valid protocol.`);
				}
			})
		}

		const octokit: Octokit = new Octokit();

		const githubRE =
			/((https:\/\/)?github\.com\/)?(?<ORGANISATION>[^\/]+)\/(?<REPOSITORY>[^\/]+)\/pull\/(?<NUMBER>\d+)/;
		const otherRE = /((?<ORGANISATION>[^\/]+)\/)?(?<REPOSITORY>[^(#|\s|\/)]+)(#)(?<NUMBER>\d+)/;

		const match = github.match(githubRE) || github.match(otherRE);
		if (!match) {
			return interaction.warning("The github PR entered wasn't in a supported format. For help with the format, use /help");
		}

		let groups = match.groups!;

		const pr_info = {
			owner: groups['ORGANISATION'],
			repo: groups['REPOSITORY'],
			pull_number: parseInt(groups['NUMBER']),
		};

		let pr: Awaited<ReturnType<typeof octokit.rest.pulls.get>>;

		try
		{
			pr = await octokit.rest.pulls.get(pr_info);
		}
		catch(err)
		{
			interaction.error("Failed to request pull request from the github api");
		}

		return interaction.reply({content: "not yet implemented"});

		// return interaction.deferReply({hidden: false}, async () => {


		// });
	},
} satisfies Command;

export default command;