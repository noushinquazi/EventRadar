import {observable, transaction, action, computed, autorun} from 'mobx'
import moment from 'moment'

import DBService from '../Database/service.js'
import {dateFormat} from '../config'

class MapState {

    @observable currDate = moment().format(dateFormat) // date to display events from
    @observable lowerBound = ""
    @observable upperBound = ""

    @observable startTime = 0 // slider min value
    @observable endTime = 24 // slider max value
    
    @observable addingEvent = false
    @observable recordedLat = null
    @observable recordedLong = null

    @observable events = []

    constructor() {
        autorun(() => {
            this.lowerBound = moment(this.currDate).startOf('date')

            this.upperBound = moment(this.currDate).endOf('date')
        })    
    }

    @action setStartTime(newTime) {
        this.startTime = newTime
    }

    @action setEndTime(newTime) {
        this.endTime = newTime
    }

    @action setTime(newStart, newEnd) {
        transaction(() => { 
            this.setStartTime(newStart)
            this.setEndTime(newEnd)
        })
    }

    @action setDate(newDate) {
        this.currDate = newDate
    }
    
    /* Get full start time including the date. */
    @computed get getStartFull() { 
        return this.lowerBound.clone().add(this.startTime, "h") // moment object
    }

    /* Get full end time including the date. */
    @computed get getEndFull() {
        return this.lowerBound.clone().add(this.endTime, "h") // moment object
    }

    /* Format slider value. */
    getTimeFormatted(val) {
        return this.lowerBound.clone().add(val, "h").format("h A") // formatted time string
    }

    @action async getAllEvents() {
        this.events = await DBService.fetchEvents()
    }

    @action recordCoords(lat, long) {
        transaction(() => {
            this.recordedLat = lat
            this.recordedLong = long
        })
    }

    @computed get isRecorded() {
        return !(this.recordedLat == null && this.recordedLong == null)
    }
}

const store = new MapState()
export default store