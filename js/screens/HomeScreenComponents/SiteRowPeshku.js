/* @flow */
'use strict'

import React from 'react'

import {
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native'

import Swipeout from 'react-native-swipeout'

import colors from '../../colors'
import Notification from './Notification'

class SiteRow extends React.Component {
  render() {
    return (
      <Swipeout
        sensitivity={2}
        backgroundColor={'transparent'}
        >
        <TouchableHighlight
          onPress={()=>this.props.onClick()}
          {...this.props.sortHandlers}>
            <View accessibilityTraits="link" style={styles.masthead}>
                <Text
                  style={styles.mastheadName}>
                    peshku pa ujë
                </Text>
            </View>
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor={colors.yellowUIFeedback}
          onPress={()=>this.props.onClick()}
          {...this.props.sortHandlers}>
            <View accessibilityTraits="link" style={styles.row}>
              <View style={styles.info}>
                {this._renderCounts(this.props.site)}
              </View>
              {this._renderShouldLogin(this.props.site)}
              {this._renderNotifications(this.props.site)}
            </View>
        </TouchableHighlight>
      </Swipeout>
    )
  }

  _renderNotifications(site) {
    if (site.authToken) {
      return (
        <View style={styles.notifications}>
          <Notification color={colors.redDanger} count={site.flagCount}/>
          <Notification color={colors.greenPrivateUnread} count={site.unreadPrivateMessages}/>
          <Notification color={colors.blueUnread} count={site.unreadNotifications}/>
        </View>
      )
    }
  }

  _renderShouldLogin(site) {
    if (!site.authToken) {
      return (
        <View style={styles.notifications}>
          <Text style={styles.connect}>connect</Text>
        </View>
      )
    }
  }

  _renderCounts(site) {
    var counts = []
    console.log(site);
    if (site.authToken) {
      site.queueCount = 2
      site.totalNew = 3
      if (site.totalNew > 0) {
        counts.push(site.totalNew + ' postim i ri')
      }
      if (site.totalUnread > 0) {
        counts.push(site.totalUnread + ' postim i palexuar')
      }
    }

    if (counts.length > 0) {
      return (
        <View style={styles.counts}>
          <Text style={styles.countsText}>
            {counts.join('  ')}
          </Text>
        </View>
      )
    }
  }
}

const styles = StyleSheet.create({
  masthead: {
    backgroundColor: '#444',
    flex: 1,
    flexDirection: 'row',
    padding: 24,
    justifyContent: 'center'
  },
  mastheadName: {
    color: '#FFF',
    fontSize: 28,
    fontFamily: 'Signika-Bold',
    alignSelf: 'center'
  },
  row: {
    borderBottomColor: colors.grayBorder,
    borderBottomWidth: 0,
    flex: 1,
    flexDirection: 'row',
    padding: 12
  },
  icon: {
    alignSelf: 'center',
    height: 40,
    width: 40
  },
  info: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingLeft: 12
  },
  url: {
    color: colors.grayTitle,
    fontSize: 18,
    fontWeight: 'normal'
  },
  description: {
    color: colors.graySubtitle,
    flex: 10,
    fontSize: 14
  },
  notifications: {
    flexDirection: 'row',
    paddingLeft: 12
  },
  connect: {
    alignSelf: 'flex-start',
    backgroundColor: colors.blueCallToAction,
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
    marginBottom: 6,
    overflow: 'hidden',
    padding: 6
  },
  counts: {
    marginTop: 10
  },
  countsText: {
    fontSize: 22
  }
})

export default SiteRow
