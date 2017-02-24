/* @flow */
'use strict'

import React from 'react'

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform
} from 'react-native'

import colors from '../../colors'

class OnBoardingView extends React.Component {
  static propTypes = {
    onDidPressAddSite: React.PropTypes.func.isRequired
  }

  render() {
    return (
      <View style={styles.container}>

        <View style={styles.button}>
          <TouchableOpacity onPress={() => this.props.onDidPressAddSite()}>
            <Text style={styles.buttonText}>
              + Launch Site
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    flex: 1,
    justifyContent: 'center'
  },
  text: {
    fontSize: 16,
    marginBottom: 12,
    padding: 24,
    textAlign: 'center'
  },
  buttonText: {
    backgroundColor: colors.blueCallToAction,
    color: 'white',
    fontSize: 24,
    fontWeight: '500',
    padding: 12
  }
})

export default OnBoardingView
