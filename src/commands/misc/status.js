const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, ChatInputCommandInteraction, Client, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js") 
const { connection } = require("mongoose")
const Monitor = require("ping-monitor")
const axios = require("axios")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("status")
    .setDescription("Get bot status"),
    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction, client) {
        await interaction.deferReply({})

        const reply = await interaction.fetchReply()
        const ping = reply.createdTimestamp - interaction.createdTimestamp
        let currentip = null
        let botPing = 0
        let GeantbotAPI = 0

        axios({
            url: "http://ip-api.com/json",
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => {
            currentip = res.data.query
            const myMonitor = new Monitor({
                address: currentip,
                port: 8080,
                interval: 15,
                protocol: "udp"
            })
            myMonitor.on("up", async function (res, state) {
                myMonitor.stop()
                botPing = res.responseTime

                
            const embed = new EmbedBuilder()
            .setTitle(`Status du bot`)
            .setDescription("Bots stats")
            .addFields(
                {
                    name: `websocket discord`,
                    value: `${client.ws.ping} ms`,
                    inline: true
                },
                {
                    name: `Client`,
                    value: `${botPing} ms`,
                    inline: true
                },
            )
            .addFields(
                {
                    name: `Database`,
                    value: `\`${switchTo(connection.readyState)}\``,
                    inline: true,
                },
                {
                    name: `En ligne depuis`,
                    value: `<t:${parseInt(client.readyTimestamp / 1000)}:R>`,
                    inline: true
                }
            )
            .setColor("Blue")
            .setFooter({text: `GeantWorld Protector`})
            .setTimestamp()


            function switchTo(val) {
                var status = " ";
                switch(val) {
                    case 0: status = `🔴 Déconnecter`
                    break;
                    case 1: status = `🟢 Connecter`
                    break;
                    case 2: status = `🟠 Connecting...`
                    break;
                    case 3: status = `🟣 Disconnection in progress`
                    break;
                }
                return status
            }

                return interaction.editReply({embeds: [embed]})
            })

            myMonitor.start()
        })
    }
}