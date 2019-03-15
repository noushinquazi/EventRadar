import {
    Stitch,
    AnonymousCredential
} from 'mongodb-stitch-react-native-sdk'

var {backendAgent} = require('../config.js')

class DBService {

    /* Initialize database client */
    constructor() {
        this.client = null
        Stitch.initializeDefaultAppClient(backendAgent).then(client => this.client = client); // PROBLEM: client value needs to be sync not async
    }

    /* Query all events in DB */
    fetchEvents = async() => {
        try {
            if (await this.checkClient()) { // REFACTOR THIS FOR SMARTER BLOCKING
                let events = await this.client.callFunction("getAllEvents")
                return events    
            }
        } catch(err) {
            console.log(err)
        }
        return []
    }

    addEvent = async(event) => {
        try {
            if (await this.checkClient()) { // REFACTOR THIS FOR SMARTER BLOCKING
                let result = this.client.callFunction("addEvent", [event])
                if (result == null) console.log("invalid insertion")
                return result
            }
        } catch(err) {
            console.log(err)
        }
        return null

    }

    checkClient = async() => {
        var cnt = 0

        /* Wait for authentication to resolve for a set time */
        while(this.client == null && cnt < 10) {
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