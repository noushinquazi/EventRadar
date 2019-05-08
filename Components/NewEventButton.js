import React from 'react'
import {Alert} from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import ActionButton from 'react-native-action-button'
import {inject} from 'mobx-react'

@inject('mapStore')
export default class NewEventButton extends React.Component {

    /* Pop-up alert that asks to create new event */
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
            <ActionButton
                onPress = {this.sendAlert}
                buttonColor = "rgba(135,206,250, 1)" // light sky blue
                degrees = {0} // disable animation
            >
                <Icon
                  name = "plus"
                  color = "white"
                  size = {30}
                />      
            </ActionButton>
        )
    }
}