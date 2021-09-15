const axios = require('axios')

const env = process.env


const { EDTHandler } = require('../src/edtHandler')

function commandEdt() {

}


module.exports = {
    name: 'edt',
    usage: "",
    description:  `Affiche l'emploi du temps pour la semaine en cours. (Bientôt + inch)`,
    /**
     * 
     * @param {Discord.Message} message 
     * @param {String} args 
     */
	execute(message, args = "") {
        const channel = message.channel
        console.log("-- Receiving command EDT -- ")
        axios({
            url: env.CNAM_PLANNING_URI,
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                'Accept': 'application/json'
            }
        })
        .then(response => {
            // console.log(response)
            const htmlDocument = response.data

            const cookieStr = response.headers['set-cookie'][0]
            const sep_index = cookieStr.indexOf(';')
            const tokenCookie = cookieStr.substr(0, sep_index).replace('QR_SID=', '')
            console.log("Token Cookie (useless?)",tokenCookie, cookieStr)

            const handler = new EDTHandler(env.CNAM_PLANNING_URL, tokenCookie)
            const data = handler.handle(htmlDocument, args)
            console.log("Parsing Result", data)
            this.sendMessage(channel, data)
        })
        .catch(error => {
            console.log(error)
        })
        console.log("-- Handled command EDT -- ")
	},
    
    sendMessage(channel, infosPlanning = {}) {
        const informations = "> :calendar_spiral: " + infosPlanning.semaine + "\n> *" + infosPlanning.semaine_details+"*"
        
        let message = informations
        Object.entries(infosPlanning.planning).forEach(([day, arrSchedule]) => {
            message+= "\n :pushpin: __**"+ day +"**__: \n"
            for(cours of arrSchedule) {
                let iconType =  cours.type.includes("EXAMEN") ? ":warning:" : ":notebook:"
                message+= iconType + " " + cours.range + " " + cours.type + " " + cours.ue + " " + cours.salle+"\n"
            }
        })
        message+=""
        channel.send(message)
    }
};
