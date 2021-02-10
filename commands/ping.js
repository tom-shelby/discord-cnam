const Discord = require('discord.js')


module.exports = {
    name: 'ping',
    description: "Ping me i'm famous",
    usage: 'Ping!',
    /**
     * 
     * @param {Discord.Message} message 
     * @param {*} args 
     */
	execute(message, args = "") {
        message.channel.send("Pong")
            .then(() => {
                message.delete({timeout: 10})
            })
	},
};