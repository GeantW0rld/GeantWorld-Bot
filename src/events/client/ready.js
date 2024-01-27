const { Client, ActivityType, Status, Events } = require("discord.js")
const Parser = require("rss-parser")
const parser = new Parser()
const fs = require("fs")

module.exports = {
    name: Events.ClientReady,
    once: true,
    /**
     * @param {Client} client 
     */
    async execute(client) {
        console.log(`${client.user.tag} est en ligne`)

        client.user.setPresence({activities: [{name: "à surveiller le server", type: ActivityType.Playing}]})

        setTimeout(async () => {
            const data = await parser.parseURL("https://youtube.com/feeds/videos.xml?channel_id=UCHqYG6Oc2gS9cu_isivWCTA").catch(console.error)

            const rowData = fs.readFileSync(`${__dirname}/../../json/videos.json`)
            const JsonData = JSON.parse(rowData)

            if (JsonData.id !== data.items[0].id) {
                fs.writeFileSync(`${__dirname}/../../json/videos.json`, JSON.stringify({id: data.items[0].id}))
            }
        }, 5000);
    }
}