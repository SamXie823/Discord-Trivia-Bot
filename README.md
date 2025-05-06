# Discord Trivia Bot

This is a simple Discord bot built using the [discord.js](https://discord.js.org/) library and [the-trivia-api](https://the-trivia-api.com/), which allows users to play a quick trivia game by typing `!trivia` in a Discord channel.

---

 ## Features

- Retrieves a random trivia question via API.
- Shuffles answer choices randomly.
- Accepts user answers through messages.
- Informs the user whether their answer was correct or incorrect.

---

## Setup

### 1. Clone the repository

git clone https://github.com/SamXie823/discord-trivia-bot.git
cd discord-trivia-bot

### 2. Install Dependencies

- Install [node.js](https://nodejs.org/en)
- npm init in main folder
- Install discord.js and axios in main directory - `npm install discord.js axios`

### 3. Create Bot

You can create a bot from the [Discord Developer Portal](https://discord.com/developers/). 
You can get your bot token from the [Discord Developer Portal](https://discord.com/developers/). 
In the root directory, create a file named config.json and add your bot token:

```
{
  "token": "YOUR_DISCORD_BOT_TOKEN"
}
```

Then add the bot to a server of your choosing from the [Discord Developer Portal](https://discord.com/developers/)

### 3. Start Bot
In the main directory - `node main.js`

