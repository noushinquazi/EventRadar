import {observable, transaction, action} from 'mobx'

class MapState {
    @observable startTime = 0
    @observable endTime = 24
    @observable eventsLoaded = false

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
}

const store = new MapState()
export default store