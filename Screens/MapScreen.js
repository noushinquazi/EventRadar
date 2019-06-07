import MapView from 'react-native-maps'
import React from 'react'
import {View, TouchableOpacity, StyleSheet} from 'react-native'
import {observer, inject} from 'mobx-react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import MultiSlider from '@ptomasroos/react-native-multi-slider'
import moment from 'moment'

import EventPin from '../Components/EventPin.js'
import SliderMarker from '../Components/SliderMarker.js'
import NewEventButton from '../Components/NewEventButton.js'
import {riceCoords, dateTimeParseString} from '../config.js'
import NewEventForm from '../Components/NewEventForm.js'
import SlideUpPanel from '../Components/SlideUpPanel.js'

@inject('mapStore')
@observer
export default class MapScreen extends React.Component {

    componentDidMount() {
        this.props.mapStore.getAllEvents() // fetch events from database
    }

    /* Determines whether to show an event based on its time */
    showEvent = (time) => {      
        let start = moment(time.start)
        let end = moment(time.end)

        let intervalStart = this.props.mapStore.getStartFull
        let intervalEnd = this.props.mapStore.getEndFull

        /* Show the event if there is any overlap in the times */
        return start.isBetween(intervalStart, intervalEnd) || end.isBetween(intervalStart, intervalEnd) || intervalStart.isBetween(start, end) || intervalEnd.isBetween(start, end)
    }

    /* Log location of map press and add events when necessary */
    handlePress = event => {
        if (this.props.mapStore.addingEvent) {
            let {
                latitude: lat,
                longitude: long
                } = event.nativeEvent.coordinate
                this.props.mapStore.recordCoords(lat, long)
        }
        console.log(event.nativeEvent.coordinate)
    }

    render() {
        return (
            <View
                style = {{flex: 1}}
            >

                {/* Map to display events*/}
                <MapView
                    style={{ flex: 1 }}

                    /* Default region */
                    initialRegion={{
                    latitude: riceCoords.latitude,
                    longitude: riceCoords.longitude,
                    latitudeDelta: 0.000922, // hand-tuned
                    longitudeDelta: 0.00421, // hand-tuned
                    }}

                    onPress={ this.handlePress }
                >
                    {/* list of events */}
                    {this.props.mapStore.events.map(event => {
                        if (this.showEvent(event.time)) 
                            return (<EventPin key = {event._id} event = {event}/>)
                    })}
                </MapView>

                {/* Button to add posts */}
                <View
                style={styles.newEventButton}
                >
                    <NewEventButton/>
                </View>
                
                {/* Menu button */}
                <TouchableOpacity
                    style={styles.menuButton}
                >
                    <Icon
                        name = "menu"
                        color = "powderblue"
                        size = {40}
                        onPress = {this.props.navigation.toggleDrawer}
                    />
                </TouchableOpacity>    

                {/* Slider to control time interval */}
                <View 
                    style = {{alignItems: 'center'}}
                >
                    <MultiSlider
                        values = {[
                            this.props.mapStore.startTime, this.props.mapStore.endTime
                        ]}
                        min={0} // 12 AM current date
                        max={24} // 12 AM next date
                        step={1} // 1 hour steps
                        allowOverlap

                        onValuesChangeFinish = {
                            (values) => this.props.mapStore.setTime(values[0], values[1])
                        } // update time interval that events can lie in
                        customMarker = {SliderMarker}
                        snapped
                    />          
                </View>
                        
                <View style={{height:20}}/>
                
                {/* Panel to change date */}
                <SlideUpPanel/>

                {/* Event creation modal */}
                <NewEventForm/>          
            </View>
        );
    }
}

styles = StyleSheet.create({
  newEventButton: {
    position: 'absolute',// use absolute position to show button on top of the map
    alignSelf: 'flex-end', // align to right
    bottom: '30%',
    right: '10%'
  },
  menuButton: {
    position: 'absolute',// use absolute position to show button on top of the map
    top: '5%', // offset from top
    alignSelf: 'flex-start', // align to right
    left: '5%' // offset from left
  }
})