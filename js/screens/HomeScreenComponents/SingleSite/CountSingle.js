/* @flow */
'use strict'

import React from 'react'
import {
  StyleSheet,
  Text,
  View
} from 'react-native'

import colors from '../../../colors'

class CountSingle extends React.Component {
  render() {
    if (this.props.count > 0) {
      return (
        <View style={styles.container}>
          <View style={[styles.number, {backgroundColor: this.props.color}]}>
            <Text style={styles.numberText}>
              {this.props.count}
            </Text>
          </View>
          <Text style={styles.text}>
            {this.props.text}
          </Text>
        </View>
      )
    }
    else {
      return null
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding:12
  },
  number: {
    padding: 6,
    borderRadius: 6,
    marginRight: 12
  },
  numberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white'
  },
  text: {
    fontSize: 13,
    color: '#555'
  }
})


export default CountSingle
