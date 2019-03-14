import {Callout, Marker} from 'react-native-maps'
import React from 'react'
import {Text} from 'react-native'
import {observer, inject} from 'mobx-react'

@inject('mapStore')
@observer
export default class EventPin extends React.Component {
    render() {
        let {place} = this.props.event
        let {time} = this.props.event
        return (
            <Marker 
            coordinate = {{
                latitude: place.latitude,
                longitude: place.longitude
            }}
            tracksViewChanges = {false}
            >
            <Callout>
                <Text style={{fontWeight: 'bold'}}>
                    {this.props.event.name}
                </Text>
                <Text>from: {time.start}</Text>
                <Text>to: {time.end}</Text>
                <Text>where: {place.name}</Text>
            </Callout>    
          </Marker> 
        )
    }
}