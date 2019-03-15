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
        </View>
      </Provider>
    );
  }
}