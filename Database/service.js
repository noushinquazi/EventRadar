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
        let client = await this.client
        let events = await client.callFunction("getAllEvents")
        return events
    }

    addEvent = async(event) => {
        let client = await this.client
        let result = await client.callFunction("addEvent", [event])
        if (!result) console.log("invalid insertion")
    }
}

srv = new DBService()
export default srv