import {observable, transaction, action, autorun, computed} from 'mobx'
import moment from 'moment'

import DBService from '../Database/service.js'

class MapState {
    upperBound = moment().endOf("date") // Default time min value
    lowerBound = moment().startOf("date") // Default time max value
    @observable startTime = 0 // Default slider min value
    @observable endTime = 24 // Default slider max value
    @observable addingEvent = false
    @observable recordedLat = null
    @observable recordedLong = null

    @observable events = []

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

    @computed get getStartFull() {
        return this.lowerBound.clone().add(this.startTime, "h") // moment object
    }

    @computed get getEndFull() {
        return this.lowerBound.clone().add(this.endTime, "h") // moment object
    }

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