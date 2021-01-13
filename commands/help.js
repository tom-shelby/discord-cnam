module.exports = {
    name: 'help',
    usage: "[command]",
    description: "Affiche la page d'aide relative aux commandes.",
    /**
     * @param {Discord.Message} message 
     * @param {*} args 
     */
	execute(message, args = "") {
        const data = []
        const prefix = process.env.BOT_COMMAND_PREFIX
        const { commands } = message.client;

        // On envoie la liste des commandes par MP
        if (!args.length) {
            if (message.channel.type === 'dm') return;
            data.push('Voici la liste des commandes disponible:');
            data.push(commands.map(command => `\`${command.name}\``).join(', '));
            data.push(`\nTu peux faire \`${prefix}help [commande]\` pour avoir une aide spécifique sur la commande!`);

            return message.channel.send(data, { split: true })
                .then(() => {
                    message.delete({timeout: 10, reason: "Commande confirmée"})
                })
                .catch(error => {
                    console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                    message.channel.send(`Je ne peux pas te DM ${message.author}, vérifies si ils sont activés`);
                });
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.channel.send(`Commande \`${command}\` inconnue. Merci quand même ${message.author}`)
        }
        
        data.push(`Aide relative à la commande \`${command.name}\``);
        // if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
        if (command.description) data.push(`Description:\n> ${command.description}`);
        if (command.usage) data.push(`Utilisation: \`${prefix}${command.name} ${command.usage}\``);
        
        message.channel.send(data, { split: true });

	},
};