import React from 'react'
import {FlatList, Text, View, Dimensions, ScrollView} from 'react-native'
import {inject, observer} from 'mobx-react'
import {Header, Body, Title, Left, Right, Footer, Container} from 'native-base'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import MultiSlider from '@ptomasroos/react-native-multi-slider'
import moment from 'moment'
import DatePicker from 'react-native-datepicker'
import {Constants} from 'expo'

import EventCard from '../Components/EventCard'
import SliderMarker from '../Components/SliderMarker.js'
import SlideUpPanel from '../Components/SlideUpPanel.js'

import {dateFormat} from '../config'
const {height, width} = Dimensions.get('window')

Slider = inject('mapStore')(observer((props) => {
    return (
        <View 
            style = {{alignItems: 'center'}}
        >
            <MultiSlider
                values = {[
                    props.mapStore.startTime, props.mapStore.endTime
                ]}
                min={0} // 12 AM current date
                max={24} // 12 AM next date
                step={1} // 1 hour steps
                allowOverlap
    
                onValuesChangeFinish = {
                    (values) => props.mapStore.setTime(values[0], values[1])
                } // update time interval that events can lie in
                customMarker = {SliderMarker}
                snapped
            />          
        </View>
    )    
}))

@inject('mapStore')
@observer
export default class ListScreen extends React.Component {

    constructor(props) {
        super(props)
        this.format = dateFormat
        this.minDate = moment().subtract(10, "y").format(this.format)
        this.maxDate = moment().add(10, "y").format(this.format)
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
    
    componentDidMount() {
        this.props.mapStore.getAllEvents() // fetch events from database
    }

    render() {
        return (
            <Container>
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
                <Slider/>
                {/* list of events */}
                <ScrollView>
                    {this.props.mapStore.events.map(event => {
                        if (this.showEvent(event.time)) 
                            return (<EventCard key = {event._id} event = {event}/>)
                        })
                    }
                </ScrollView>
                <Footer>
                    <DatePicker
                        date = {this.props.mapStore.currDate}
                        format = {this.format}
                        mode = "date"
                        minDate = {this.minDate}
                        maxDate = {this.maxDate}
                        onDateChange = {(date) => {this.props.mapStore.setDate(date)}}
                        confirmBtnText = "change"
                        cancelBtnText = "cancel"
                    />
                </Footer>
            </Container>
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