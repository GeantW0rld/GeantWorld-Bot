const { CommandInteraction, Events } = require("discord.js")
const axios = require("axios")

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction, client) {
        if (!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName)

        if (!command) {
            interaction.reply({content: '❌・Outdated command'})
        }

        if (command.premium == true) {
            const resp = await axios.get("https://discord.com/api/v10/applications/1135535911866740849/entitlements", {
                headers: {
                    "Authorization": `Bot ${process.env.token}`
                }
            })

            var server;
            await resp.data.forEach(async (data) => {
                let guildID = data.guild_id
                if (guildID == interaction.guild.id) {
                    server = "premium"
                }
            })

            if (server !== "premium") {
                const url = `https://discord.com/api/v10/interactions/${interaction.id}/${interaction.token}/callback`
                const json = {
                    type: 10,
                    data: {}
                }

                return await fetch(url, {
                    method: "POST",
                    body: JSON.stringify(json),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
            }
        }

        command.execute(interaction, client)
    }
}