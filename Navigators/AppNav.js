import React from 'react'
import { createDrawerNavigator, createAppContainer } from 'react-navigation'
import {Dimensions, Text, View} from 'react-native'
import {Header, Body, Title} from 'native-base'

import Sidebar from '../Components/SideBar'
import MapScreen from '../Screens/MapScreen'
import ListScreen from '../Screens/ListScreen'

let { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const HomeNav = createDrawerNavigator(
    {
      Map: {
        screen: MapScreen,
      },
      List: {
        screen: ListScreen
      }
    },
    {
      initialRouteName: 'Map',
      contentComponent: Sidebar,
      drawerWidth: screenWidth * 0.2,
    }
);


export default createAppContainer(HomeNav);
  