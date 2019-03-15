import {observable, transaction, action, autorun, computed} from 'mobx'
import DBService from '../Database/service.js'

class MapState {
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