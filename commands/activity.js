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
        let activity = args.join(" ")
        message.client.user.setActivity(activity)
            .then(() => {
                message.channel.send(`${message.author} vient de changer l'activité actuelle sur: ${activity}`)
                .then(() => {
                    message.delete({timeout: 10})
                })
            });

        
	},
};