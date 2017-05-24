/* @flow */
'use strict'

import React from 'react'

import {
  Animated,
  Image,
  Text,
  Platform,
  StyleSheet,
  TouchableHighlight,
  View
} from 'react-native'

import colors from '../../../colors'
import Notification from '../Notification'

class NavBar extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.leftContainer}>
        	<Image style={styles.icon} source={{uri: this.props.site.icon}} />
        </View>
        <View style={styles.rightContainer}>
          { !this.props.site.authToken &&
            <TouchableHighlight
              onPress={()=>this.props.onDidPressRightButton()}>
      		      <Text style={styles.connect}>authenticate</Text>
            </TouchableHighlight>
          }
          { this.props.site.authToken &&
              this._renderNotifications(this.props.site)
          }
        </View>
      </View>
    )
  }

  _renderNotifications(site) {
    if (site.authToken) {
      return (
        <View>
          <TouchableHighlight 
            onPress={()=>this._visitPage('flags')}>
            <View>
              <Notification color={colors.redDanger} count={site.flagCount}/>
            </View>
          </TouchableHighlight>
          <TouchableHighlight 
            onPress={()=>this._visitPage('messages')}>
            <View>
              <Notification color={colors.greenPrivateUnread} count={site.unreadPrivateMessages}/>
            </View>
          </TouchableHighlight>
          <TouchableHighlight 
            onPress={()=>this._visitPage('unread')}>
            <View>
              <Notification color={colors.blueUnread} count={site.unreadNotifications}/>
            </View>
          </TouchableHighlight>
        </View>
      )
    }
  }

  _visitPage(item) {
    if (item == 'messages') {
      this.props.onVisitPage(this.props.site.url + '/u/' + this.props.site.username + '/messages')
    }

    if (item == 'flags') {
      this.props.onVisitPage(this.props.site.url + '/admin/flags/active')
    }

    if (item == 'unread') {
      this.props.onVisitPage(this.props.site.url + '/unread')
    }

  }

}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: colors.grayBorder,
    borderBottomWidth: StyleSheet.hairlineWidth,     
    height: Platform.OS === 'ios' ? 64 : 55,
    paddingTop: Platform.OS === 'ios' ? 20 : 0
  },
  leftContainer: {
    marginLeft: 10
  },
  icon: {
    height: 32,
    width: 32
  },
  rightContainer: {
    marginRight: 10
  },
  connect: {
    backgroundColor: colors.blueCallToAction,
    color: 'white',
    padding: 4,
    paddingHorizontal: 8
  },
})

export default NavBar
