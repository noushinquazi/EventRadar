import MapView from 'react-native-maps'
import {Callout, Marker} from 'react-native-maps'
import React from 'react'
import {Text, FlatList} from 'react-native'
import {observer, inject} from 'mobx-react'

import EventPin from '../Components/EventPin.js'
import {riceCoords} from '../config.js'
var events = require('../mockData.json')

@inject('mapStore')
@observer
export default class MapScreen extends React.Component {

    _parseTime = (timeStr) => {
      let str1 = timeStr.split(" ") // [hr:min, pm or am]
      let str2 = str1[0].split(":") // [hr, min]
      let hr = parseInt(str2[0])
      let min = parseInt(str2[1]) / 60
      let isPM = (str1[1] == "pm") ? 1 : 0

      hr = hr % 12 + isPM * 12
      return hr + min

    }
    showEvent = (time) => {
      let start = this._parseTime(time.start)
      let end = this._parseTime(time.end)

      return !(start >= this.props.mapStore.endTime || end <= this.props.mapStore.startTime)
    }

    render() {
      return (
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: riceCoords.latitude,
            longitude: riceCoords.longitude,
            latitudeDelta: 0.000922,
            longitudeDelta: 0.00421,
          }}
          onPress={ (event) => console.log(event.nativeEvent.coordinate)}
          >
            {/* list of events */}
            {events.map(event => {
              if (this.showEvent(event.time)) // checks for overlap 
                return (<EventPin key = {event.name} event = {event}/>)
            })}
          </MapView>
      );
    }
  }