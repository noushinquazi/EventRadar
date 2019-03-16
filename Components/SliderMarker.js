import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Platform, TouchableHighlight, Text } from 'react-native';
import moment from 'moment'
import { inject, observer } from 'mobx-react';


const ViewPropTypes = require('react-native').ViewPropTypes || View.propTypes;

@inject('mapStore')
@observer
export default class SliderMarker extends React.Component {
  static propTypes = {
    pressed: PropTypes.bool,
    pressedMarkerStyle: ViewPropTypes.style,
    markerStyle: ViewPropTypes.style,
    enabled: PropTypes.bool,
    currentValue: PropTypes.number,
    valuePrefix: PropTypes.string,
    valueSuffix: PropTypes.string,
  };

  convertToTime = hr => {
    console.log(hr)
    if (hr % 12 == 0) {
        if (hr == 12) return "12 pm"
        else return "12 am"
    }

    end = hr >= 12 ? "pm" : "am"
    return hr % 12 + " " + end

  }

  render() {
    return (
      <View>

        {/* Label for marker */}  
        <Text style = {styles.label}>
            {this.props.mapStore.getTimeFormatted(this.props.currentValue)}
        </Text>
        {/* Marker */}
        <TouchableHighlight style = {styles.marker}>
          <View
            style={this.props.enabled ? [
              styles.markerStyle,
              this.props.markerStyle,
              this.props.pressed && styles.pressedMarkerStyle,
              this.props.pressed && this.props.pressedMarkerStyle,
            ] : [styles.markerStyle, styles.disabled]}
          />
        </TouchableHighlight>
      </View>
      
    );
  }
}

const styles = StyleSheet.create({
  markerStyle: {
    ...Platform.select({
        ios: {
            height: 30,
            width: 30,
            borderRadius: 30,
            borderWidth: 1,
            borderColor: '#DDDDDD',
            backgroundColor: '#FFFFFF',
            shadowColor: '#000000',
            shadowOffset: {
                width: 0,
                height: 3,
            },
            shadowRadius: 1,
            shadowOpacity: 0.2,
        },
        android: {
            height: 12,
            width: 12,
            borderRadius: 12,
            backgroundColor: '#0D8675',
        },
        }),
    },
    pressedMarkerStyle: {
    ...Platform.select({
        ios: {},
        android: {
            height: 20,
            width: 20,
            borderRadius: 20,
        },
        }),
    },
    disabled: {
    backgroundColor: '#d3d3d3',
    },
    label: {
    ...Platform.select({
            ios: {
                flex: 0.3
            },
            android: {
                flex: 0.4
            } 
        })
    },
    marker: {
        ...Platform.select({
            ios: {
                flex: 0.7
            },
            android: {
                flex: 0.6,
                alignSelf: "center"
            }
        })
    }
});

