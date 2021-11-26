# Ashal Market Bot

A discord bot for [Ashal's Market](https://www.ashal.eu/market/search.php) built using [Discord.js](https://discord.js.org/#/) and [lunr](https://lunrjs.com/)

## Usage

The bot has two search commands:

`searchitem` and `searchtear`

use `searchitem` to search for normal items and use `searchtear` to search for el tears

### Basic Search

For basic searching, simply type: `searchitem <search term one> <search term two> ...`

This will search the market for posts that contain any of the search terms

##### Examples:
- `searchitem elsword top` will return all posts that contain either elsword or top

### Advanced Search

The search indexer uses the lunr engine. it supports a few advanced search features.

#### AND operations

To search for posts that include more than one terms, add a `+` in front of each term.

##### Examples:
- to search for posts that has both elsword **AND** top `searchitem +elsword +top`
- to search for posts that has both elsword **AND** buy `searchitem +elsword +buy`

#### Wildcards

You can search for partial words by appending or prepending the search terms with `*`

##### Examples:
 - to search for posts that includes words beginning with `nere`, use: `searchitem nere*`
 - to search for posts that include words beginning with `n` and end with `d`, use: `searchitem n*d`

#### Category Searching

You can also search specific categories.

For items, the available categories are: `name` (item name), `character`, `slot` (item slot), `user` (name of seller/buyer), `type` (buy or sell), `discord` (discord name of seller/buyer), `rarity`, `category`

For el tears, the available categories are: `name` (tear name), `character`, `slot` (tear slot), `shape` (shape of tear), `color` (color of tear), `user` (name of seller/buyer), `type` (buy or sell), `discord` (discord name of seller/buyer), `rarity`

##### Examples:
- to search for all top items for Elsword: `searchitem +character:elsword +slot:top`
- to search for all purple shoe tears: `searchtear +color:purple +slot:shoes`


**For all search combinations, please see [lunr docs](https://lunrjs.com/guides/searching.html)**

## Running locally
#### Prerequisites
- [Docker](https://docs.docker.com/install/)
- [Docker compose](https://docs.docker.com/compose/)
- [Discord bot token](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot)
- Ashal's market API password - Please contact Ashal for password

#### Steps
1. Create an environment file named `config.env` in the root directory
```dotenv
APPLICATION_ID=<bot application id - MANDATORY>
DISCORD_TOKEN=<your discord bot token - MANDATORY>
API_PASSWORD=<api password to ashal's market - MANDATORY>
SEARCH_CHANNEL_ID=<channel id of search channel - MANDATORY>
AUTO_POST_BUY_CHANNEL_ID=<channel id of autopost buy channel - MANDATORY>
AUTO_POST_SELL_CHANNEL_ID=<channel id of autopost sell channel - MANDATORY>
BOTS_CHANNEL_ID=<channel id of bots channel - MANDATORY>
OWNER_USER_ID=<user id of the bot owner - MANDATORY>
SERVER_ID=<id of server - MANDATORY>
ITEM_API_URL=<api endpoint for item posts - OPTIONAL>
TEAR_API_URL=<api endpoint for el tear posts - OPTIONAL>
CACHE_REFRESH_RATE=<refresh rate of cache - crontab - OPTIONAL>
AUTO_POST_RATE=<autopost check rate - crontab - OPTIONAL>
AUTO_POST_REFRESH_RATE=<autopost refresh rate - crontab - OPTIONAL>
ITEM_USER_API_URL=<api endpoint for user item posts - OPTIONAL>
TEAR_USER_API_URL=<api endpoint for user tear posts - OPTIONAL>
```
2. run `docker-compose build`
3. run `docker-compose up`
