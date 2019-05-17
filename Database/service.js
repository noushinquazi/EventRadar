import {
    Stitch,
    AnonymousCredential
} from 'mongodb-stitch-react-native-sdk'

import {observable} from 'mobx'

const {backendAgent, api_url} = require('../config.js')

class DBService {

    @observable DBClient = null
    @observable isAuthenticated = false

    /* Initialize database client */
    constructor() {

        /* PHASING OUT STITCH
        Stitch.initializeDefaultAppClient(backendAgent).then(client => {
            this.DBClient = client   

            // first log out of current session
                client.auth.loginWithCredential(new AnonymousCredential()).then
                (user => this.isAuthenticated = true)
 
        })
        .catch(console.log)
        */

        this.DBClient = {}
        this.isAuthenticated = true
    }

    /* Query all events in DB */
    fetchEvents = async() => {
        try {
            //let events = await this.DBClient.callFunction("getAllEvents")
            let res = await fetch(api_url + '/events', {
                method: 'GET'
              });
            return await res.json()    
        } catch(err) {
            console.log(err)
        }
        return []
    }

    /* Add event to DB */
    addEvent = async(event) => {
        console.log(JSON.stringify(event))
        try {
            //let result = this.DBClient.callFunction("addEvent", [event])
            //if (result == null) console.log("invalid insertion")
            let res = await fetch(api_url + '/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    event
                )
            })
            console.log(await res.json())
        } catch(err) {
            console.log(err)
        }
        return null

    }

    /* Check that DB client is initialized */
    checkClient = async() => {
        var cnt = 0

        /* Wait for authentication to resolve for a set time */
        while(this.DBClient == null && cnt < 10) {
            cnt++
            await this.sleep(100)
        }

        /* Time out error */
        if (cnt >= 10) {
            console.log("mongodb auth error - timed out")
            return false
        }
        return true
    }

    /* Block execution for ms time */
    sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

srv = new DBService()
export default srv