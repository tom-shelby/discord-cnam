
const CronJob = require('cron').CronJob;
const Discord = require('../bot').Discord;

const bot = require('../bot')
console.log(bot.client)
module.exports = {
    name: 'schedule',
    description: "Planifier un rappel",
    usage: 'Ne fonctionne pas encore',
    /**
     * 
     * @param {Discord.Message} message 
     * @param {*} args 
     */
	execute(message, args = []) {
        console.log(message.content)
        console.log(args)

        let type = args[0];

        if(type !== 'message' && type!== 'pause') {
            console.log(`Arguments invalides pour la commande ${this.name}`)
            return;
        }

        switch(type) {
            case 'message':
                break;
            case 'pause':
                break;
        }

        // var job = new CronJob(
        //   '* * * * * *',
        //   function() {
        //     console.log('You will see this message every second');
        //   },
        //   null,
        //   true
        //   // 'America/Los_Angeles
        // );

        // let a = {
        //   cronTime: '* * * * * *',
        //   onTick:  function() {
        //     console.log('You will see this message every second');
        //   },
        // }
        console.log("Started a task")
	},
};