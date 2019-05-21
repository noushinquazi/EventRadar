import { createDrawerNavigator, createAppContainer } from 'react-navigation'
import {Dimensions} from 'react-native'

import Sidebar from '../Components/SideBar'
import MapScreen from '../Screens/MapScreen'
import ListScreen from '../Screens/ListScreen'

let { width: screenWidth } = Dimensions.get('window');

const HomeNav = createDrawerNavigator(
    {
      Map: {
        screen: MapScreen,
      },
      List: {
        screen: ListScreen,
      }
    },
    {
      initialRouteName: 'Map',
      contentComponent: Sidebar,
      drawerWidth: screenWidth * 0.2,
    }
);


export default createAppContainer(HomeNav);
  