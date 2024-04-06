import { Command } from "types";
import HelpCommand from "./help";
import PTALCommand from "./ptal";

const commands: Command[] = [
	HelpCommand,
	PTALCommand
];

export default commands;