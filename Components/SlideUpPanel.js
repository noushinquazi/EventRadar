import React from 'react'
import {Text, View, Dimensions, Animated, TouchableOpacity} from 'react-native'
import SlidingUpPanel from 'rn-sliding-up-panel'
import DatePicker from 'react-native-datepicker'
import moment from 'moment';
import { inject, observer } from 'mobx-react';

import {dateFormat} from '../config'

const {height} = Dimensions.get('window')

@inject('mapStore')
@observer
class BottomSheet extends React.Component {
  static defaultProps = {
    draggableRange: { // the range for which the panel can drop down or up
      top: height - 30,
      bottom: 20
    }
  }

  constructor(props) {
      super(props)
      this.text_arr = ["tap to change date", "tap to close"] 
      this.format = dateFormat
      this.minDate = moment().subtract(10, "y").format(this.format)
      this.maxDate = moment().add(10, "y").format(this.format)
      this.state = {
          show: false,
          date: this.props.mapStore.currDate
      }
  }

  render() {    

    let text = this.text_arr[this.state.show | 0] // text renders conditioned on panel state
    return (
        <View style={styles.container}>

            {/* Sliding panel that contains date picker */}
            <SlidingUpPanel 
                showBackdrop={false}
                ref={c => (this._panel = c)}
                draggableRange={this.props.draggableRange}
                allowDragging = {false}
            >
                <View style = {{flex: 1}}>

                {/* Text that opens and closes panel */}
                <TouchableOpacity
                    style={styles.panel}
                    onPress={() => 
                        this.setState({
                            show: !this.state.show
                        }, () => {
                            if (this.state.show)
                                this._panel.show()
                            else
                                this._panel.hide()
                        })
                    }
                >
                    <Text style={{alignSelf: 'center'}}>{text}</Text>
                    <View style = {{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
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

                    </View>

                </TouchableOpacity>
                </View>
            </SlidingUpPanel>
        </View>
    )
  }
}

const styles = {
    container: {
      backgroundColor: '#f8f9fa',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    },
    panel: {
      flex: 1,
      backgroundColor: 'white',
    },
  }
  
export default BottomSheet