import {
    Stitch,
    AnonymousCredential
} from 'mongodb-stitch-react-native-sdk'

var {backendAgent} = require('../config.js')

class DBService {

    /* Initialize database client */
    constructor() {
        this.client = Stitch.initializeDefaultAppClient(backendAgent).then(client => client);
    }

    /* Query all events in DB */
    fetchEvents = async() => {
        try {
            let client = await this.client
            let events = await client.callFunction("getAllEvents")
            return events
        } catch(err) {
            console.log("not logged into mongodb yet")
        }
        return []
    }

    addEvent = async(event) => {
        let client = await this.client
        let result = await client.callFunction("addEvent", [event])
        if (result == null) console.log("invalid insertion")
        return result
    }
}

srv = new DBService()
export default srv