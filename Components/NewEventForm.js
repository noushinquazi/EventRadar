import t from 'tcomb-form-native'
import Modal from 'react-native-modal'
import React from 'react'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview'
import {View, StyleSheet, ScrollView, TouchableOpacity, Text, KeyboardAvoidingView} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import {observer, inject} from 'mobx-react'
import moment from 'moment'
import { Constants } from 'expo'

import DBService from '../Database/service.js'
import {dateTimeParseString} from '../config.js'

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

// format date options
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
            format: date => moment(date).format(dateTimeParseString)
          },
          label: "Start time                                    " // make datepicker expand
      },
      endTime: {
        mode: 'datetime',
        config: {
            format: date => moment(date).format(dateTimeParseString)
        },
        label: "End time                                    "
      }
    }
  };

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
                    start: moment(protoEvent.startTime).format(dateTimeParseString),
                    end: moment(protoEvent.endTime).format(dateTimeParseString),
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
            /* Pop-up containting the form */
            /* TODO: make more native looking */
            /*<Modal
                isVisible = {this.props.mapStore.addingEvent && this.props.mapStore.isRecorded}
                animationIn = {'slideInUp'}
                animationOut = {'zoomOut'}
                animationInTiming = {500}
                animationOutTiming = {500}
            >*/
            <Modal
                isVisible = {this.props.mapStore.addingEvent && this.props.mapStore.isRecorded}
                style = {{margin: 0}}
                animationType = {'slide'}
                swipeDirection = {'left'}
                onSwipeComplete = {this.hideModal}
                propagateSwipe
            >
                <View 
                    style={{
                        backgroundColor: 'white',
                        marginTop: Constants.statusBarHeight
                    }}
                >

                    <View 
                        style={{
                            flexDirection: 'row', 
                            justifyContent: 'space-between'
                        }}
                    >
                        
                        {/* cancel button */}
                        <TouchableOpacity
                            onPress = {this.hideModal}
                        >   
                        <Icon 
                            name = 'close' 
                            size = {30}
                            color = 'red'
                        />
                        </TouchableOpacity>                        
                        
                        <Text style = {{color: 'black', fontSize: 20}}>
                            New Event
                        </Text>                        
                        
                        {/* submit button */}
                        <TouchableOpacity
                            onPress = {this.submitEvent}
                        >   
                        <Icon 
                            name = 'check'
                            size = {30}
                            color = 'green'
                        />
                        </TouchableOpacity>                        
                        

                    </View>

                    {/* new event creation form*/}
                    <KeyboardAwareScrollView>
                        <View style = {styles.content}>
                            <Form 
                                type = {EventSchema}
                                options = {options}
                                ref={c => this.form = c}
                                value = {{
                                    startTime: moment().toDate(),
                                    endTime: moment().toDate()
                                }}
                            />
                        </View>
                    </KeyboardAwareScrollView>
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