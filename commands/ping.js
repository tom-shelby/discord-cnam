const Discord = require('discord.js')




function message() {
    return "Pong !"
}



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
        message.channel.send(message())
            .then(() => {
                message.delete({timeout: 10})
            })
	},
};