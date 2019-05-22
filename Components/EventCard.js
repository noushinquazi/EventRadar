import React from 'react'
import {View, Text} from 'react-native'
import {Card, CardItem, Body} from 'native-base'
import moment from 'moment'

import {dateTimeDisplayString} from '../config'

export default class EventCard extends React.Component {
    render() {
        let {place} = this.props.event
        let {time} = this.props.event

        // Format time to display according to config
        let start = moment(time.start).format(dateTimeDisplayString)
        let end = moment(time.end).format(dateTimeDisplayString)

        return (
            <Card>
                <CardItem header bordered>
                    <Text>
                        {this.props.event.name}
                    </Text>
                </CardItem>
                <CardItem bordered>
                    <Body>
                        <Text>from: {start}</Text>
                        <Text>to: {end}</Text>
                        <Text>where: {place.name}</Text>
                    </Body>
                </CardItem>
            </Card>
        )
    }
}