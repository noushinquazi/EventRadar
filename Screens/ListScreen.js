import React from 'react'
import {FlatList, Text, View, Dimensions} from 'react-native'
import {inject, observer} from 'mobx-react'
import {Header, Body, Title, Left, Right, Card, CardItem} from 'native-base'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
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
            <View>
                <Header>
                    <Left>
                        <Icon
                            name = "menu"
                            size = {30}
                            onPress = {this.props.navigation.toggleDrawer}     
                        />
                    </Left>
                    <Body>
                        <Title>Events</Title>
                    </Body>
                    <Right/>
                </Header>
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