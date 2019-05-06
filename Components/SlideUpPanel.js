import React from 'react'
import {Text, View, Dimensions, Animated, TouchableOpacity} from 'react-native'

import SlidingUpPanel from 'rn-sliding-up-panel'

const {height} = Dimensions.get('window')

const styles = {
  container: {
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  panel: {
    flex: 1,
    backgroundColor: 'white',
//    position: 'relative'
  },
  panelHeader: {
    height: 120,
    backgroundColor: '#b197fc',
    alignItems: 'center',
    justifyContent: 'center'
  },
  favoriteIcon: {
    position: 'absolute',
    top: -24,
    right: 24,
    backgroundColor: '#2b8a3e',
    width: 48,
    height: 48,
    padding: 8,
    borderRadius: 24,
    zIndex: 1
  }
}

class BottomSheet extends React.Component {
  static defaultProps = {
    draggableRange: {
      top: height - 30,
      bottom: 20
    }
  }

  constructor(props) {
      super(props)
      this.text_arr = ["drag up to change date", "tap to close"]
      this.state = {
          show: false
      }
  }

  render() {    

    let text = this.text_arr[this.state.show | 0]
    return (
      <View style={styles.container}>
        <SlidingUpPanel
          showBackdrop={false}
          ref={c => (this._panel = c)}
          draggableRange={this.props.draggableRange}
         >
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
         </TouchableOpacity>
        </SlidingUpPanel>
      </View>
    )
  }
}

export default BottomSheet