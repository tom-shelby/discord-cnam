const request = require("request")
const axios = require("axios")
const ENV = process.env
const { JSDOM } = require('jsdom')


const fs = require('fs')
const CONFIG = JSON.parse(fs.readFileSync('config.json'))

class EDTHandler {

    constructor(token = "") {
        // this.initialize()
        this.token = token
    }

    initialize(html = "")
    {
        this.document = (new JSDOM(html)).window.document;
    }

    get uiStringSemaine() {
        return this.document.querySelector(".lblNavSemaine")
    }

    get uiStringSemaineDetails() {
        return this.document.querySelector(".lblNavRange")
    }

    get uiPlanning() {
        return this.document.querySelector(".PlanningEvtContainer")
    }

    /**
     * @return {HTMLCollection}
     */
    get uiCours() {
        return this.document.querySelectorAll("table.PlanningEvtContainer > tbody > tr > td > div")
    }

    /**
     * Retourne un objet contenant les infos du planning
     * 
     * @param {} html 
     * @param {*} commandEdtArgs 
     * @returns 
     */
    handle(html, commandEdtArgs) {
        console.log("Handling command...")
        console.log("DOM Initialization...")
        this.initialize(html)
        console.log("Finished DOM Initialization")
        console.log("Started Parsing.")
        const infosPlanning = this.parse()
        console.log("Finished parsing and handling of request")
        
        // if(!infosPlanning.semaine_details.includes(commandEdtArgs)) {
        //     console.log("SENDING NEW REQUEST BC TARGET NOT REACHED")
        //     axios({
        //         method: 'POST',
        //         url: ENV.CNAM_PLANNING_URI,
        //         data: {
        //             '__VIEWSTATE': infosPlanning.viewstate,
        //             'ct100$MainContent$btnNavNext.x': '------WebKitFormBoundary7MA4YWxkTrZu0gW',
        //             'ctl00$MainContent$btnNavNext.y': '------WebKitFormBoundary7MA4YWxkTrZu0gW--'
        //         },
        //         headers: {
        //             'content-type': 'application/x-www-form-urlencoded',
        //         }
                
        //     })
        //     .then(response => {
        //         console.log(response)
        //         // this.handle(...........);
        //     })
        //     .catch(error => {
        //         console.log(error)
        //     })
        // }

        return infosPlanning
    }

    parse() {
        const planning = {}

        let lastDay = "";
        for(let divCours of this.uiCours) {
            if(divCours.classList.contains('PlanningDay')) {
                lastDay = divCours.textContent.trim();
                planning[lastDay] = [];
            }
            else if(divCours.classList.contains('PlanningEvt')) {
                const type = divCours.querySelector('span.lblEvtType + span.lblEvtExamen')
                    ? "EXAMEN"
                    : "COURS"
                console.log("**==Type d'event : ", type)
                planning[lastDay].push({
                    range: divCours.querySelector('.lblEvtRange').textContent.trim(),
                    ue: CONFIG["UE"][divCours.querySelector('.lblEvtUE').textContent.trim()] ?? divCours.querySelector('.lblEvtUE').textContent.trim(),
                    type: type,
                    salle: divCours.querySelector('.lblEvtSalle').textContent.trim()
                })
            }
        }

        return {
            semaine: this.uiStringSemaine.textContent,
            semaine_details: this.uiStringSemaineDetails.textContent,
            planning,
            viewstate: this.document.getElementById('__VIEWSTATE').getAttribute('value')
        }
    }
}

module.exports = {
    EDTHandler,
};