require('dotenv').config()
const { Discord, Intents, Client, Collection } = require('discord.js')
require('colors')

const CONFIG = require('../config.json')

const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
	partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
})
client.commands = new Collection()
client.jobs = new Collection()

const fs = require('fs')
const prefix = process.env.BOT_COMMAND_PREFIX

console.log('Loading commands...')
/**
 * @constant {}
 */
const commandFiles = fs.readdirSync('src/commands').filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
	const command = require(`./commands/${file}`)
	// Creation d'un nouvel index dynamiquement 
	client.commands.set(command.name, command)
}
console.log('Commands loaded...')

// ------------------------------------------------------------------------

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
    console.log(`Bot command prefix: ${process.env.BOT_COMMAND_PREFIX}`)

    // console.log(client.users)

    // console.log(client.commands)

    // client.user.setActivity(`🛠️ En maintenance 🛠️`)

    // client.user.setUsername("🛠️ En maintenance 🛠️")

})

client.on('message', message => {

    //On analyse uniquement les messages qui nous intéresse
    if(!message.content.startsWith(prefix) || message.author.bot) return
	const args = message.content.slice(prefix.length).trim().split(/ +/)
	const command = args.shift().toLowerCase()

    //Si on ne connaît pas la commande 
    if (!client.commands.has(command)) {
        message.delete({timeout: 10, reason: "Commande inconnue"})
        console.log(`${message.author.username}`.yellow + ` a executer une commande inconnue: ` + `${command}`.red)
        return message.channel.send(`Commande \`${command} ${args.toString().replace(',', ' ') || ""}\` inconnue. Merci quand même ${message.author}`)
    }
    
    try {
		client.commands.get(command).execute(message, args)
	} catch (error) {
        console.error(error)
        message.delete({timeout: 10, reason: "Erreur lors de l'éxecution de la commande"})
		message.channel.send(`Une erreur est survenue lors de l'éxecution de \`${command} ${args}\``)
	}
    
})

client.on('messageReactionAdd', (reaction, user) => {
    if(user.bot) { return }
    reaction.fetch().then(async r => {
        if(!user.bot && r.message.channel.id === CONFIG.channels['planning'] && r._emoji.name === '🔄') {
            const EDT = await client.commands.get('edt').execute(r.message)
            // console.log("EDT", EDT)
            r.message.edit(EDT)
            r.users.remove(user)
        }
    })
    console.log(reaction)
    
})

client.login(process.env.BOT_TOKEN)
