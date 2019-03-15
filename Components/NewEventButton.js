import React from 'react'
import {TouchableOpacity, Alert} from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import {inject} from 'mobx-react'

@inject('mapStore')
export default class NewEventButton extends React.Component {

    sendAlert = () => {
        Alert.alert(
            "Create event?",
            "Tap on map where event will take place",
            [
                {
                    text: "OK",
                    onPress: () => this.props.mapStore.addingEvent = true
                },
                {
                    text: "Cancel",
                }
            ]
        )
    }
    render () {
        return (
            <TouchableOpacity
                onPress = {this.sendAlert}
                style ={{
                backgroundColor: "lightblue",
                }}
            >
                <Icon
                    name = "plus"
                  color = "white"
                  size = {30}
                />      
            </TouchableOpacity>
        )
    }
}