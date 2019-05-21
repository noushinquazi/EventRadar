import React from 'react'
import {FlatList, Text, View, Dimensions} from 'react-native'
import {inject, observer} from 'mobx-react'
import {Constants} from 'expo'

import EventCard from '../Components/EventCard'

const {height, width} = Dimensions.get('window')

@inject('mapStore')
@observer
export default class ListScreen extends React.Component {
    componentDidMount() {
        this.props.mapStore.getAllEvents() // fetch events from database
    }

    render() {
        return (
            <View style = {{flexDirection: 'column'}}>
                <View style = {[styles.header, {borderColor: 'red', borderWidth: 5}]}>
                    <Text style = {{textAlign: 'center'}}>Events</Text>
                </View>
                <FlatList
                    data = {this.props.mapStore.events}
                    renderItem = {({item}) => <EventCard event = {item}/>}
                    keyExtractor = {(item, index) => item._id}
                />
            </View>
        )
    }
}

const styles = {
    header: {
        justifyContent: 'center',
        top: Constants.statusBarHeight,
        width: width
    }
}