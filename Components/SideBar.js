import React, { Component } from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

export default class Sidebar extends Component {
  navigate = route => {
    this.props.navigation.navigate(route);
  };
  
  render() {
    return (
      // each icon represents a page accessible from the menu
      <View style={styles.container}>
          <TouchableOpacity
            onPress={() => this.navigate('Map')}
            style={{
                flexDirection: 'row', 
                alignItems: 'center',
                flex: 1
            }}
          >
            <Icon
              name="map-outline"
              size={30}
              style={{ 
                  color: 'white',
                  flex: 1 
                }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[{
                flexDirection: 'row', 
                alignItems: 'center',
                flex: 1
            }]}
            onPress={() => this.navigate('List')}
          >
            <Icon
              name="format-list-bulleted"
              size={30}
              style={[{ 
                  color: 'white',
                  flex: 1 
                }]}
            />
          </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: 'lightskyblue',
    padding: 5
  },
  seeBorders: {
    borderWidth: 1,
    borderColor: 'red',
  },
});
