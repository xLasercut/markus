# Ashal Market Bot

A discord bot for [Ashal's Market](https://www.ashal.eu/market/search.php)
This bot is built using [Discord.js](https://discord.js.org/#/) and [lunr](https://lunrjs.com/)

## Usage

## Running locally
### Prerequisites
- [Docker](https://docs.docker.com/install/)
- [Docker compose](https://docs.docker.com/compose/)
- [Discord bot token](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot)
- Ashal's market API password - Please contact Ashal for password

### Steps
1. Create an environment file named `config.env` in the root of the project
```
DISCORD_TOKEN=<your discord bot token - MANDATORY>
API_PASSWORD=<api password to ashal's market - MANDATORY>
CACHE_REFRESH_RATE=<time in milliseconds - OPTIONAL>
ITEM_API_ENDPOINT=<api endpoint for item posts - OPTIONAL>
ELTEAR_API_ENDPOINT=<api endpoint for el tear posts - OPTIONAL>
```
2. run `docker-compose build`
3. run `docker-compose up`
