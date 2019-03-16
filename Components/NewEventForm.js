import t from 'tcomb-form-native'
import Modal from 'react-native-modal'
import React from 'react'
import {View, Dimensions, StyleSheet, Button, Text, ScrollView, TouchableOpacity} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import {observer, inject} from 'mobx-react'
import moment from 'moment'

import DBService from '../Database/service.js'
import {dateParseString} from '../config.js'

// form component
const Form = t.form.Form

// template for new post form
const EventSchema = t.struct({
    eventName: t.String,
    startTime: t.Date,
    endTime: t.Date,
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
      startTime: {
          mode: 'datetime',
          config: {
            format: date => moment(date).format(dateParseString)
          },
          label: "Start time                                    " // make datepicker expand
      },
      endTime: {
        mode: 'datetime',
        config: {
            format: date => moment(date).format(dateParseString)
        },
        label: "End time                                    "
      }
    }
  };
// get screen width
let {width: screenWidth} = Dimensions.get('window')

@inject('mapStore')
@observer
export default class NewEventForm extends React.Component {

    /* validate submission, send submission, close parent modal */
    submitEvent = async() => {

        let results = this.form.validate()
        let errors = results.errors

        // Check if submission is valid
        if(errors.length === 0){
            protoEvent = results.value
            newEvent = { // Construct event object
                name: protoEvent.eventName,
                time: {
                    start: moment(protoEvent.startTime).format(dateParseString),
                    end: moment(protoEvent.endTime).format(dateParseString),
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
                this.props.mapStore.getAllEvents()) // Refresh map after insertion
            this.hideModal()
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
                    isVisible = {this.props.mapStore.addingEvent && this.props.mapStore.isRecorded}
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
                            justifyContent: 'flex-end',
                        }}
                    >
                        {/* cancel button */}
                        <TouchableOpacity
                            onPress = {this.hideModal}
                            style = {{
                                paddingLeft: 50,
                                paddingRight: 10
                            }}
                        >   
                        <Icon 
                            name = 'close' 
                            size = {30}
                            color = 'skyblue'
                        />
                        </TouchableOpacity>
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