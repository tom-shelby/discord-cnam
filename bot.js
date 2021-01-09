require('dotenv').config()
const request = require('request');
const _cheerio = require('cheerio');
const Discord = require('discord.js');

const fs = require('fs');

const client = new Discord.Client();

console.log('Loading config...')
const config = JSON.parse(fs.readFileSync('config.json'));
console.log('Config loaded !');

console.log(config);
function trySendToChannel(msg = String, channel = Discord.Channel )
{
    if (msg != null && channel != null && msg.length > 0) {
        channel.send(msg);
    } else {
        channel.send("Impossible d'envoyer le contenu demandé. Erreur interne.");
    }
}

function commandEdt(msg)
{
    let channel = msg.channel;

    request(process.env.CNAM_PLANNING_URI, function(err, res, body){
        if(err) {
            console.log("ERROR");
        }
        else {
            // console.log(body);

            var $ = _cheerio.load(body);
            
            let planningInfos = $('#ctl00_MainContent_lblNavRange').text();
            // console.log($('title').text());
            // channel.send($('title').text());
            console.log(`PLANNING INFOS: ${planningInfos.toString()}`);

           

            let infos = $('span');
            // console.log(matieres.toArray());
            // console.log(infos);
            //reduce
            let message = "```";
            
            insertLineBreakInd = 0;
            infos.each(function (index, span) {

                let $span = $(span);
                let strId =  $span.attr('id').toString();
                
                // console.log(this);
                console.log($span.attr('id'));
                
                if(strId.includes('Day')||strId.includes('EvtRange')||strId.includes('EvtType')||strId.includes('EvtExamen')||strId.includes('EvtSalle')) {
                    if(strId.includes('Day')) {
                        // insertLineBreakInd = 0;
                        message+=`\n${$span.text()}\n`.padStart(50);
                    }else {
                        if(strId.includes('EvtRange')) {
                            message+=`\n${$span.text()}`.padStart(30);
                        }
                        if(strId.includes('EvtType')) {
                            let matiereID = " ";
                            let possibleLink = $span.siblings('a').toArray();
                            if(possibleLink.length > 0) {
                                matiereID = $(possibleLink).text();
                                console.log(matiereID);
                            }

                            let possibleExamen = $span.siblings('span').toArray();
                            if(possibleExamen.length > 0) {
                                if($(possibleExamen).attr('id').toString().includes('EvtExamen')) {
                                    console.log("has sibling exam")

                                    message+=`EXAMEN | ${config['UE'][matiereID]}`.padEnd(60);
                                }
                            } else {
                                message+=`${config['UE'][matiereID]}`.padEnd(60);
                            }
                        }
                        if(strId.includes('EvtSalle')) {
                            message+=`${$span.text()}`.padStart(10);
                        }
                    }
                    


                //     if(!strId.includes('Day')) {
                //         // console.log("isHeader");

                //         if(strId.includes('EvtType')||strId.includes('EvtExamen')) {
                //             if(strId.includes('EvtType') && matiereID != null) {
                //                 message+=`${config['UE'][matiereID]}`;
                //             }
                //             if(strId.includes('EvtExamen')) {
                //                 message+=`| EXAMEN`.padStart(30);
                //             }
                //         } else {
                //             message += `${$span.text()}`.padStart(30);
                //         }

                //         if(insertLineBreakInd >= 2) {
                //             message+="\n";
                //             insertLineBreakInd = 0;
                //         } else {
                //             insertLineBreakInd++;
                //         }
                //     }else {
                //         message+=`\n${$span.text()}\n`.padStart(50);
                //     }
                }
            });
            message+="```";




            console.log(message);
            trySendToChannel(planningInfos, channel);
            trySendToChannel(message, channel);
        }
    }); 
}

// ------------


client.on('ready', () => {
    

    console.log(`Logged in as ${client.user.tag}!`);
  
});

client.on('message', msg => {
    if (msg.content === 'ping') {
        msg.reply(`Pong! I'm @${client.user.tag}`);
    }

    if (msg.content === 'edt') {
        commandEdt(msg);
    }

});

client.login(process.env.BOT_TOKEN);