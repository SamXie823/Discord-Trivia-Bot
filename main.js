const { Client, GatewayIntentBits, Collection } = require("discord.js");
const { token } = require("./config.json");
const axios = require("axios");
const fs = require("fs");
const prefix = "!";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
  ],
});

client.commands = new Collection();
const commandFiles = fs
  .readdirSync("./commands/")
  .filter((file) => file.endsWith(".js"));  
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.on("ready", () => {
  console.log("Ready!");
});

client.on("messageCreate", (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === "trivia") {
    client.commands.get("trivia").execute(message, args);
  }
});

client.login(token);
