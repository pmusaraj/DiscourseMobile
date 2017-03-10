/* @flow */
'use strict'

import React from 'react'

import {
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  ScrollView,
  View
} from 'react-native'

import Swipeout from 'react-native-swipeout'

import colors from '../../../colors'
import CountSingle from './CountSingle'

import NotificationsScreen from '../../NotificationsScreen'

class SiteRowSingle extends React.Component {

  render() {
    return (
      <Swipeout
        sensitivity={2}
        backgroundColor={'white'}
        >
        <TouchableHighlight
          underlayColor={colors.yellowUIFeedback}
          onPress={()=>this.props.onClick()}
          {...this.props.sortHandlers}>
            <View accessibilityTraits="link" style={styles.row}>
              <Image style={styles.icon} source={{uri: this.props.site.icon}} />
              <View style={styles.info}>
                <Text
                  ellipsizeMode="tail"
                  numberOfLines={1}
                  style={styles.url}>
                    {this.props.site.url.replace(/^https?:\/\//, '')}
                </Text>
              </View>
              {this._renderShouldLogin(this.props.site)}
            </View>
        </TouchableHighlight>
        <View accessibilityTraits="link">
          { this.props.site.authToken &&
            this._renderCountPills(this.props.site)
          } 
        </View>
        <View style={styles.loggedIn}>
          { this.props.site.authToken &&
            <Text>
              {this.props.site.username}
            </Text>
          } 
        </View>
      </Swipeout>
    )
  }

  _renderCountPills(site) {
    if (site.authToken) {
      var messagesLink = 'users/' + site.username + '/messages'
      return (
        <View style={styles.actionables}>
          <TouchableHighlight
            underlayColor={colors.yellowUIFeedback}
            style={styles.item}
            onPress={()=>this.props.onClickSub('admin/flags/index')} 
            {...this.props.sortHandlers}>
              <View>
                <CountSingle color={colors.redDanger} count={site.flagCount} text="flagged"/>
              </View>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor={colors.yellowUIFeedback}
            style={styles.item}
            onPress={()=>this.props.onClickSub('queued-posts')}
            {...this.props.sortHandlers}>
              <View>
                <CountSingle color={colors.redDanger} count={site.queueCount} text="queued"/>
              </View>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor={colors.yellowUIFeedback}
            style={styles.item}
            onPress={()=>this.props.onClickSub(messagesLink)}
            {...this.props.sortHandlers}>
              <View>
                <CountSingle color={colors.greenPrivateUnread} count={site.unreadPrivateMessages} text="message(s)"/>
              </View>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor={colors.yellowUIFeedback}
            style={styles.item}
            onPress={()=>this.props.onClickSub('new')}
            {...this.props.sortHandlers}>
              <View>
                <CountSingle color={colors.blueUnread} count={site.totalNew} text="new"/>
              </View>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor={colors.yellowUIFeedback}
            style={styles.item}
            onPress={()=>this.props.onClickSub('unread')}
            {...this.props.sortHandlers}>
              <View>
                <CountSingle color={colors.blueUnread} count={site.totalUnread} text="unread"/>
              </View>
          </TouchableHighlight>
          {/*<TouchableHighlight
            underlayColor={colors.yellowUIFeedback}
            style={styles.item}
            onPress={()=>this.props.onClick()}
            {...this.props.sortHandlers}>
              <View>
                <CountSingle color={colors.blueUnread} count={site.unreadNotifications} text="replie(s) / mention(s)"/>
              </View>
          </TouchableHighlight>*/}
        </View>
      )
    }
  }

  _renderShouldLogin(site) {
    if (!site.authToken) {
      return (
        <View style={styles.row}>
          <Text style={styles.connect}>connect</Text>
        </View>
      )
    }
  }

}

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
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
  notificationsRow: {
    flexDirection: 'row'
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
  actionables: {
    backgroundColor: '#FFF',
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    borderTopColor: colors.grayBorder,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.grayBorder,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  loggedIn: {
    flex: 1,
    padding: 12,
    alignItems: 'flex-end',
    borderBottomColor: colors.grayBorder,
    borderBottomWidth: StyleSheet.hairlineWidth,
  }
})

export default SiteRowSingle
