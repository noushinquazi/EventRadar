import {Callout, Marker} from 'react-native-maps'
import React from 'react'
import {Text} from 'react-native'
import {observer, inject} from 'mobx-react'
import moment from 'moment'

import {dateTimeDisplayString, dateTimeParseString} from '../config'

/* Displays a pin on the map */
@inject('mapStore')
@observer
export default class EventPin extends React.Component {
    render() {
        let {place} = this.props.event
        let {time} = this.props.event

        // Format time to display according to config
        let start = moment(time.start).format(dateTimeDisplayString)
        let end = moment(time.end).format(dateTimeDisplayString)
        
        return (

            /* The pin */
            <Marker 
            coordinate = {{
                latitude: place.latitude,
                longitude: place.longitude
            }}
            tracksViewChanges = {false}
            >
                {/* Dialog with event info that shows when pin is tapped */}
                <Callout>
                    <Text style={{fontWeight: 'bold'}}>
                        {this.props.event.name}
                    </Text>
                    <Text>from: {start}</Text>
                    <Text>to: {end}</Text>
                    <Text>where: {place.name}</Text>
                </Callout>    
            </Marker> 
        )
    }
}