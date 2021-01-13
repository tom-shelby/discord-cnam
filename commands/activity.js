const Discord = require('discord.js')

module.exports = {
    name: 'activity',
    usage: "url/message",
    description:  `Met à jour l'activité du BOT`,
    /**
     * 
     * @param {Discord.Message} message 
     * @param {String} args 
     */
	execute(message, args = "") {
        message.client.user.setActivity(args[0])
            .then(() => {
                message.channel.send(`${message.author} vient de changer l'activité actuelle sur: ${args[0]}`)
                .then(() => {
                    message.delete({timeout: 10})
                })
            });

        
	},
};