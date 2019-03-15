import React from 'react'
import {TouchableOpacity} from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import {inject} from 'mobx-react'

@inject('mapStore')
export default class NewEventButton extends React.Component {

    render () {
        return (
            <TouchableOpacity
                onPress = {() => this.props.mapStore.addingEvent = true}
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