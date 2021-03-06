const request = require('request')
const _cheerio = require('cheerio')
const fs = require('fs')

const env = process.env
const CONFIG = JSON.parse(fs.readFileSync('config.json'))



function commandEdt(msg)
{
    let channel = msg.channel

    request(env.CNAM_PLANNING_URI || CONFIG.URL, function(err, res, body){
        if(err) {
            console.error(err)
        }
        else {
            // console.log(body)

            var $ = _cheerio.load(body)
            let planningInfos = `:calendar: ${$('#ctl00_MainContent_lblNavRange').text()}`
            // console.log($('title').text())
            // channel.send($('title').text())
            // console.log(`PLANNING INFOS: ${planningInfos.toString()}`)

            // console.log($('div#ctl00_MainContent_pnlNoEvt').length)

            if($('#ctl00_MainContent_pnlNoEvt').length) {
                trySendToChannel(planningInfos, channel)
                trySendToChannel('`Aucune données pour cette semaine.`', channel)
                return
            }


            let infos = $('span')
            // console.log(matieres.toArray())
            // console.log(infos)
            //reduce
            let message = "```\n"
            let first = true
            infos.each(function (index, span) {

                let $span = $(span)
                let strId =  $span.attr('id').toString()
                
                // console.log(this)
                // console.log($span.attr('id'))
                
                if(strId.includes('Day')||strId.includes('EvtRange')||strId.includes('EvtType')||strId.includes('EvtExamen')||strId.includes('EvtSalle')) {
                    if(strId.includes('Day')) {
                        if(first == true) {
                            message += "Horaire".padEnd(19) + "| Cours".padEnd(60) + "| Salle".padEnd(10)+"\n"
                            first = false
                        } else {
                            message+="\n\n"
                        }
                        message+=`${$span.text()}\n`.padStart(0)
                    }else {
                        if(strId.includes('EvtRange')) {

                            message+=`* ${$span.text()}`.padEnd(20)
                        }
                        if(strId.includes('EvtType')) {
                            let matiereID = " "
                            let possibleLink = $span.siblings('a').toArray()
                            if(possibleLink.length > 0) {
                                matiereID = $(possibleLink).text()
                                // console.log(matiereID)
                            }

                            let possibleExamen = $span.siblings('span').toArray()
                            if(possibleExamen.length > 0) {
                                if($(possibleExamen).attr('id').toString().includes('EvtExamen')) {
                                    // console.log("has sibling exam")

                                    message+=`EXAMEN | ${CONFIG['UE'][matiereID]}`.padEnd(60)
                                }
                            } else {
                                message+=`${CONFIG['UE'][matiereID]}`.padEnd(60)
                            }
                        }
                        if(strId.includes('EvtSalle')) {
                            message+=`${$span.text()}`.padEnd(10)
                            message+="\n"
                        }
                    }
                }
            })
            message+="```"
            // console.log(message)
            msg.channel.send(planningInfos)
            msg.channel.send(message)
        }
    })
    msg.delete({timeout: 5})
        .then(msg => console.log(`Deleted message from ${msg.author.username} after 5 seconds`))
        .catch(console.error)
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
		commandEdt(message);
	},
};