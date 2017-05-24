/* @flow */
'use strict'

import React from 'react'

import {
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  ScrollView,
  FlatList,
  AsyncStorage,
  View
} from 'react-native'

import colors from '../../../colors'

import Icon from 'react-native-vector-icons/FontAwesome'
import NavBar from './NavBar'
import ApiCalls from './ApiCalls'

class SiteRowSingle extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      posts: [],
      page: 1,
      error: null,
      refreshing: false,
      loading: false
    };

    this.getCategories(this.props.site)
  }

  componentDidMount() {
    this.getLatest(this.props.site)
  }

  getLatest(site) {
    this._api = new ApiCalls()
    const { page } = this.state
    if (this.state.loading) {
      console.log('already loading more')
      return false
    }

    this.setState({
      loading: true
    })

    return new Promise((resolve,reject) => {

      this._api.getLatest(site, page - 1)
        .then(posts => {
          this.setState({
            posts: this.state.page === 1 ? posts : [...this.state.posts, ...posts],
            refreshing: false,
            loading: false
          })
          resolve()
        })
        .catch(e=>{
          console.log(e)
          reject('failure')
        })
        .done()
    })

  }

  getCategories(site) {
    this._api = new ApiCalls()
    return new Promise((resolve,reject) => {

      this._api.getCategories(site)
        .then(cats => {
          this.setState({
            categories: cats
          })
          resolve()
        })
        .catch(e=>{
          console.log(e)
          reject('failure')
        })
        .done()
    })
  }

  displayCategory(id) {
    var cat = this.state.categories.find(x => x.id === id)

    if (!cat)
      return false;

    var catStyle = {
      backgroundColor: `#${cat.color}`,
      color: '#000000',
      fontSize: 11,
      padding: 4
    };

    return (
        <Text style={catStyle}>{cat.name}</Text>
      )
  }

  handleRefresh = () => {
    this.setState(
      {
        page: 1,
        refreshing: true
      },
      () => {
        this.getLatest(this.props.site);
      }
    );
  };

  handleLoadMore = () => {
    this.setState(
      {
        page: this.state.page + 1
      },
      () => {
        this.getLatest(this.props.site);
      }
    );
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: colors.grayBorder
        }}
      />
    );
  };

  render() {
    return (
      <FlatList
        data={this.state.posts}
        renderItem={this._renderItem}
        keyExtractor={item => item.id}
        onRefresh={this.handleRefresh}
        refreshing={this.state.refreshing}
        ItemSeparatorComponent={this.renderSeparator}
        onEndReached={this.handleLoadMore}
      />
    )
  }

  _renderItem = ({item}) => (
    <TouchableHighlight
      underlayColor={'white'}
      onPress={() => this._visitPage(item)}>
      <View style={styles.item} key={item.id}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <View style={styles.itemMeta}>
            {this.displayCategory(item.category_id)}
            <Text style={styles.itemMetaText}>
              <Text>{item.posts_count} replies</Text>
              {global.showViewCountInList &&
                <Text>&nbsp;| {item.views} views</Text>
              }
            </Text>
        </View>
      </View>
    </TouchableHighlight>
  );

  _visitPage(item) {
    this.props.onVisitPage(this.props.site.url + '/t/' + item.slug + '/')
  }
}

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'column',
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  icon: {
    alignSelf: 'center',
    height: 32,
    width: 32
  },
  notificationsRow: {
    flexDirection: 'row'
  },
  item: {
    paddingHorizontal: 14,
    paddingVertical: 10
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5
  },
  itemMetaText: {
    opacity: 0.6,
    fontSize: 12,
    paddingLeft: 6
  }
})

export default SiteRowSingle
