import MapView from 'react-native-maps'
import React from 'react'
import {View, Button, TouchableOpacity, Text, StyleSheet} from 'react-native'
import {observer, inject} from 'mobx-react'
import MultiSlider from '@ptomasroos/react-native-multi-slider'
import Icon from 'react-native-vector-icons/Feather'
import moment from 'moment'

import EventPin from '../Components/EventPin.js'
import SliderMarker from '../Components/SliderMarker.js'
import NewEventButton from '../Components/NewEventButton.js'
import {riceCoords, dateParseString, backendAgent} from '../config.js'
import DBService from '../Database/service.js'
import NewEventForm from '../Components/NewEventForm.js'

@inject('mapStore')
@observer
export default class MapScreen extends React.Component {

    componentDidMount() {
      this.props.mapStore.getAllEvents()
    }

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
//      console.log(moment("time.start").format("h:mm a"))
      /*
      let start = this._parseTime(moment(time.start, "DD-MMM-YYYY, hh:mm A").format("hh:mm A"))
      let end = this._parseTime(moment(time.end, "DD-MMM-YYYY, hh:mm A").format("h:mm A"))
      */
      
      let start = moment(time.start, dateParseString)
      let end = moment(time.end, dateParseString)
      let intervalStart = this.props.mapStore.getStartFull
      let intervalEnd = this.props.mapStore.getEndFull
      return start.isBetween(intervalStart, intervalEnd) || end.isBetween(intervalStart, intervalEnd)
    }

    render() {
      return (
        <View
          style = {{flex: 1}}
          >

          {/* Map to display events*/}
          <MapView
            style={{ flex: 1 }}
            initialRegion={{
              latitude: riceCoords.latitude,
              longitude: riceCoords.longitude,
              latitudeDelta: 0.000922, // hand-tuned
              longitudeDelta: 0.00421, // hand-tuned
            }}
            onPress={ (event) => {
              if (!this.props.mapStore.addingEvent) {
                console.log(event.nativeEvent.coordinate)
              }
              else {
                let {
                  latitude: lat,
                  longitude: long
                } = event.nativeEvent.coordinate
                this.props.mapStore.recordCoords(lat, long)
                console.log(event.nativeEvent.coordinate)
              }
            }}
            >
              {/* list of events */}
              {this.props.mapStore.events.map(event => {
                if (this.showEvent(event.time)) // checks for overlap of each event with currently selected interval
                  return (<EventPin key = {event.name} event = {event}/>) // change key to reflect something more unique!!
              })}
          </MapView>

          {/* Button to add posts */}
          <View
          style={styles.newEventButton}
          >
            <NewEventButton/>
          </View>

          {/* Slider to control time interval */}
          <View style = {{alignItems: 'center'}}>
            <MultiSlider
                values = {[
                  this.props.mapStore.startTime, this.props.mapStore.endTime
                ]}
                min={0} // 12 AM
                max={24} // 12 AM
                step={1} // 1 hour steps
                allowOverlap

                onValuesChangeFinish = {(values) => this.props.mapStore.setTime(values[0], values[1])} // update time interval that events can lie in
                customMarker = {SliderMarker}
                snapped
              />          
          </View>
        <NewEventForm/>          
      </View>
      );
    }
  }

styles = StyleSheet.create({
  newEventButton: {
    position: 'absolute',//use absolute position to show button on top of the map
    top: '10%', //for center align
    alignSelf: 'flex-end' //for align to right
  }
})