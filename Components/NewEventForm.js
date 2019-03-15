import t from 'tcomb-form-native'
import Modal from 'react-native-modal'
import React from 'react'
import {View, Dimensions, StyleSheet, Button, Text, ScrollView} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import {observer, inject} from 'mobx-react'
import moment from 'moment'

import DBService from '../Database/service.js'
// form component
const Form = t.form.Form

// template for new post form
const EventSchema = t.struct({
    eventName: t.String,
    startTime: t.Date,
    endTime: t.Date,
    date: t.Date,
    eventPlace: t.String,
    link: t.maybe(t.String),
    description: t.maybe(t.String)
})

const options = {
    fields: {
      description: {
        multiline: true,
        numberOfLines: 5,
        blurOnSubmit: true,
        maxLength: 1000,
      },
      date: {
        mode: 'date',
        config: {
          format: (date) =>  moment(date).format('YYYY-MM-DD'),
          dateFormat: (date) =>  moment(date).format('YYYY-MM-DD')
        },
      },
      startTime: {
          mode: 'time',
          config: {
            format: date => moment(date).format('h:mm a'),
            timeFormat: date => moment(date).format('h:mm a')
          }
      },
      endTime: {
        mode: 'time',
        config: {
            format: date => moment(date).format('h:mm a'),
            timeFormat: date => moment(date).format('h:mm a')
        }
      }
    }
  };
// get screen width
let {width: screenWidth} = Dimensions.get('window')

@inject('mapStore')
@observer
export default class NewEventForm extends React.Component {

        // validate submission, send submission, close parent modal
    submitEvent = async() => {

        let results = this.form.validate()
        let errors = results.errors

        // check if submission is valid -- there must be a title!
        if(errors.length === 0){
            protoEvent = results.value
            newEvent = {
                name: protoEvent.eventName,
                time: {
                    start: moment(protoEvent.startTime).format('h:mm a'),
                    end: moment(protoEvent.endTime).format('h:mm a'),
                    date: moment(protoEvent.date).format('YYYY-MM-DD')
                },
                place: {
                    name: protoEvent.eventPlace,
                    latitude: this.props.mapStore.recordedLat,
                    longitude: this.props.mapStore.recordedLong
                },
                link: protoEvent.link,
                description: protoEvent.description
            }
            DBService.addEvent(newEvent).then(ev =>
                this.props.mapStore.getAllEvents())
            this.hideModal() // disable parent modal by changing its state
        }
    }

    renderModal = () => {
        this.props.mapStore.addingEvent = true
    }

    hideModal = () => {
        this.props.mapStore.addingEvent = false
        this.props.mapStore.recordCoords(null, null)
    }

    render () {
        return(
            <Modal
                    isVisible = {this.props.mapStore.addingEvent && this.props.mapStore.isRecorded()}
                    animationIn = {'slideInUp'}
                    animationOut = {'zoomOut'}
                    animationInTiming = {500}
                    animationOutTiming = {500}
            >
                <View 
                    style={{
                        borderRadius: 10, 
                        backgroundColor: 'white'
                    }}
                >
                    <View 
                        style={{
                            flexDirection: 'row', 
                            justifyContent: 'flex-end'
                        }}
                    >

                        {/* cancel button */}
                        <Icon 
                            name = 'close' 
                            size = {30}
                            color = 'skyblue'
                            padding = {10}
                            onPress = {this.hideModal}
                        />
                    </View>

                    {/* new event creation form*/}
                    <ScrollView>
                        <View style = {styles.content}>
                            <Form 
                                type = {EventSchema}
                                options = {options}
                                ref={c => this.form = c}
                            />
                            <Button
                                title = "Create New Event!" 
                                onPress = {()=> this.submitEvent()}
                            >
                            </Button>
                        </View>
                    </ScrollView>
                </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create(
    {
        content: {
            alignItems: "center", 
            justifyContent: "center",
            backgroundColor: "white",
        }
    }
)