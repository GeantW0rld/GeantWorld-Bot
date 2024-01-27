const { Client, Partials, Collection } = require("discord.js");
const { Channel, GuildMember, Message, Reaction, ThreadMember, User, GuildScheduledEvent } = Partials;
const { loadCommands } = require("./handlers/commandsHandlers")
const { loadEvents }  = require("./handlers/eventHandlers")
require("dotenv").config();


const client = new Client({
    intents: 131071,
    partials: [Channel, GuildMember, Message, Reaction, ThreadMember, User, GuildScheduledEvent]
});

client.commands = new Collection();

client.login(process.env.token).then(async (r) => {
    loadEvents(client)
    loadCommands(client)
});