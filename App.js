import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {Provider} from 'mobx-react'
import MultiSlider from '@ptomasroos/react-native-multi-slider'

import MapScreen from './Screens/MapScreen.js'
import SliderMarker from './Components/SliderMarker.js'

import mapStore from './Stores/MapStore.js'


export default class App extends React.Component {
  render() {
    return (
      <Provider mapStore = {mapStore}>
        <View style = {{flex: 1}}>
          <MapScreen
          />
          <View style = {{alignItems: 'center'}}>
            <MultiSlider
                values = {[
                  mapStore.startTime, mapStore.endTime
                ]}
                min={0} // 12 AM
                max={24} // 12 AM
                step={1} // 30 min steps
                allowOverlap

                onValuesChangeFinish = {(values) => mapStore.setTime(values[0], values[1])} // update time interval that events can lie in
                customMarker = {SliderMarker}
                snapped
              />          
          </View>
        </View>
      </Provider>
    );
  }
}