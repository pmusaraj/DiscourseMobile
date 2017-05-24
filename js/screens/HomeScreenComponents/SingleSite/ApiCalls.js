/* @flow */
'use strict'

import React from 'react'

import {
  AsyncStorage,
} from 'react-native'

import Site from '../../../site'

class ApiCalls extends React.Component {

  getLatest(site, page) {
    return new Promise((resolve, reject) => {
      site.jsonApi(`/hot.json?page=${page}`)
        .then(json =>{
          resolve(json.topic_list.topics)
        })
        .catch(err => {
          reject(err)
        }).done()
    })
  }

  getCategories(site) {
    return new Promise((resolve, reject) => {
      site.jsonApi('/categories.json')
        .then(json =>{
          resolve(json.category_list.categories)
        })
        .catch(err => {
          reject(err)
        }).done()
    })
  }

}

export default ApiCalls
