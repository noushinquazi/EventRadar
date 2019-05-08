
import React from 'react';
import { View } from 'react-native';
import {Provider, observer} from 'mobx-react'
import Spinner from 'react-native-loading-spinner-overlay';

import MapScreen from './Screens/MapScreen'
import DBService from './Database/service'
import mapStore from './Stores/MapStore'
import AppNav from './Navigators/AppNav'

@observer
export default class App extends React.Component {
    render() {
        /* Wait for database authentication */
        if (!DBService.isAuthenticated) {
            return (
                <Spinner
                    visible = {!DBService.isAuthenticated}
                    textContent = {'Initializing...'}
                />
            )
        }
        /* Display map */
        else {
            return (
                <Provider mapStore = {mapStore}>
                    <AppNav>
                        <View style = {{flex: 1}}>
                            <MapScreen
                            />
                        </View>
                    </AppNav>
                </Provider>

                );          
        }
    }
}