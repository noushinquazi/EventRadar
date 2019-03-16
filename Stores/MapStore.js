import {observable, transaction, action, autorun, computed} from 'mobx'
import moment from 'moment'

import DBService from '../Database/service.js'

class MapState {
    upperBound = moment().endOf("date")
    lowerBound = moment().startOf("date")
    @observable startTime = 0
    @observable endTime = 24
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
        transaction(() => { // mobx updates after all actions complete
            this.setStartTime(newStart)
            this.setEndTime(newEnd)
        })
    }

    @computed get getStartFull() {
        return this.lowerBound.clone().add(this.startTime, "h")
    }

    @computed get getEndFull() {
        return this.lowerBound.clone().add(this.endTime, "h")
    }

    getTimeFormatted(val) {
        return this.lowerBound.clone().add(val, "h").format("h A")
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

    isRecorded() {
        return !(this.recordedLat == null && this.recordedLong == null)
    }
}

const store = new MapState()
export default store