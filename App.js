import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {Provider, observer} from 'mobx-react'
import Spinner from 'react-native-loading-spinner-overlay';

import MapScreen from './Screens/MapScreen.js'
import DBService from './Database/service.js'
import mapStore from './Stores/MapStore.js'

@observer
export default class App extends React.Component {
    render() {

        /* Wait for database authentication. */
        if (!DBService.isAuthenticated) {
            return (
                <Spinner
                    visible = {!DBService.isAuthenticated}
                    textContent = {'Initializing...'}
                />
            )
        }
        /* Display map. */
        else {
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
}