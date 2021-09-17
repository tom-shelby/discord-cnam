const CONFIG = require('../../config.json')
const fs = require('fs')

module.exports = {
    name: 'planning',
    description: '',
    usage: '',

    /**
     * Execute la commande
     * @param {*} message 
     * @param {*} args 
     * @returns 
     */
    execute(message, args = "") {
        const privateName = "planning"
        message.guild.channels.create(privateName, {
            type: "text",
        })
        .then(informationMessage => {
            informationMessage.send("Planning initialisé...").then(msg => {
                msg.react('🔄')
                CONFIG.channels[privateName] = informationMessage.id
                fs.writeFileSync("config.json", JSON.stringify(CONFIG, null, 2))
            })
        })
        .catch(error => {
            console.log(error)
        })
    }
}