/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {
  Component,
  PropTypes
} from 'react';

import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  AsyncStorage,
  TouchableHighlight,
  Navigator,
  ListView,
  WebView,
  RefreshControl
} from 'react-native';

import CookieManager from 'react-native-cookies';
import FetchBlob from 'react-native-fetch-blob';
import Moment from 'moment';


class SiteManager {

  constructor() {
    this._subscribers = [];
    this.sites = [];
    this.load();
  }

  add(site) {
    this.sites.push(site);
    this.save();
    this._onChange();
  }

  subscribe(callback) {
    this._subscribers.push(callback);
  }

  unsubscribe(callback) {
    var pos = this._subscribers.indexOf(callback);
    if (pos >= -1) {
      this._subscribers = this._subscribers.splice(pos,1);
    }
  }

  save() {
    AsyncStorage.setItem('@Discourse.sites', JSON.stringify(this.sites));
  }

  load() {
    AsyncStorage.getItem('@Discourse.sites').then((json) => {
      if (json) {
        this.sites = JSON.parse(json).map(obj=>new Site(obj));
        this._onChange()
      }
    });
  }

  refreshSites() {
    let sites = this.sites.splice(0);


    return new Promise((resolve,reject)=>{
      if (sites.length === 0) {
        resolve();
      }

      let site = sites.pop();
      let somethingChanged = false;

      let processSite = (site) => {
        site.refreshNotificationCounts().then((changed) => {
          somethingChanged = somethingChanged || change;
          let s = sites.pop();
          if (s) { processSite(s); }
          else {
            if (somethingChanged) {
              this.save();
            }
            resolve(somethingChanged);
          }
        });
      };

      processSite(site);
    });
  }

  _onChange() {
    this._subscribers.forEach((sub) => sub());
  }
}

class Site {
  static FIELDS = ['authToken', 'title', 'description', 'icon', 'url', 'unreadNotifications'];

  static fromURL(url, callback) {
    return FetchBlob.fetch('GET', url)
      .then(resp=>Site.parseSite(resp.text(), url))
      .catch((e)=>alert(url + " not found! " + e))
  }

  static parseSite(body,url) {
    var titleRegex = /<title>(.*)<\/title>/gi;
    var title = titleRegex.exec(body)[1];

    var descriptionRegex = /<meta name="description" content="([^"]*)">/;
    var description = descriptionRegex.exec(body)[1];

    var iconRegex = /<link rel="apple-touch-icon"[^>]*href="([^"]*)">/;
    var icon = iconRegex.exec(body)[1];

    if (icon && icon[0] === "/") {
      icon = url + icon;
    }

    return new Site({title, description, icon, url});
  }

  constructor(props) {
    if(props) {
      Site.FIELDS.forEach(prop=>{this[prop]=props[prop];});
    }
  }

  updateAuthCookie(done){
    CookieManager.get(this.url, (err, res) => {
      this.authToken = res && res["_t"];
      done();
    });
  }

  refreshNotificationCounts(){
    return new Promise((resolve,reject) => {
      if(!this.authToken) { return resolve(false); }

      FetchBlob.fetch('GET', this.url + "/session/current.json")
         .then(resp=>{
           currentUser = resp.json().current_user;

           let changed = false;
           if (this.unreadNotifications !== currentUser.unread_notifications) {
             this.unreadNotifications = currentUser.unread_notifications;
             changed = true;
           }

           resolve(changed);

          }).catch(()=>{
           resolve(false);
         });
    });
  }

  toJSON(){
    let obj = {};
    Site.FIELDS.forEach(prop=>{obj[prop]=this[prop];});
    return obj;
  }

}

class DiscourseMobile extends Component {

  constructor(props) {
    super(props);
    this._siteManager = new SiteManager();
  }

  openUrl(navigator, site) {
    navigator.push({title: site.url, index: 1, site: site});
  }

  checkAuthCookie(navigator, site) {
    let oldToken = site.authToken;
    site.updateAuthCookie(()=>{
      if (oldToken !== site.authToken) {
        this._siteManager.save();
        console.warn("Auth token changed to" + site.authToken);
      }
    });
  }

  render() {
    return (
      <Navigator
        initialRoute={{ title: 'Discourse', index: 0 }}
        renderScene={(route, navigator) => {
            if(route.index == 0) {
              return <HomePage title={route.title}
                        siteManager={this._siteManager}
                        onVisitSite={(site)=> this.openUrl(navigator, site)}
              />
            } else if(route.index == 1) {
              return <WebView source={{uri: route.site.url}}
                              onLoadEnd={() =>
                                this.checkAuthCookie(navigator, route.site)}
              />
            }
          }
        }
        style={{paddingTop: 20}}
      />
    );
  }
}


class HomePage extends Component {
  static propTypes = {
    onVisitSite: PropTypes.func.isRequired,
    siteManager: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);


    this._dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this._dataSource = this._dataSource.cloneWithRows(this.props.siteManager.sites);

    this.state = {
      dataSource: this._dataSource,
      isRefreshing: false,
      refreshMessage: ""
    }

    this._onChangeSites = () => this.onChangeSites();
    this.props.siteManager.subscribe(this._onChangeSites);
  }

  componentWillUnmount() {
    this.props.siteManager.unsubscribe(this._onChangeSites);
  }

  onChangeSites() {
    this._dataSource = this._dataSource.cloneWithRows(this.props.siteManager.sites);
    this.setState({
      dataSource: this._dataSource
    })
  }


  doSearch(term) {
    Site.fromURL(term).then(site=>this.props.siteManager.add(site));
  }

  _onRefresh() {
    this.setState({isRefreshing: true});
    this.props.siteManager.refreshSites()
      .then(()=>{
      this.setState({
        isRefreshing: false,
        refreshMessage: "Last updated: " + Moment().format("LT")
      })
    });
  }

  renderNotifications(site) {
    if(site.unreadNotifications) {
      return (
        <View style={styles.notifications}>
          <Text style={styles.blueNotification}>{site.unreadNotifications}</Text>
        </View>
      );
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.term}
          placeholder="Add Site"
          returnKeyType="search"
          keyboardType="url"
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={(search) => this.setState({search})}
          onSubmitEditing={()=>this.doSearch(this.state.search)}

        />
        <ListView
          dataSource={this.state.dataSource}
          enableEmptySections={true}
          styles={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={()=>this._onRefresh()}
              title="Loading..."
            />
          }
          renderRow={(rowData) =>
             <TouchableHighlight
                onPress={()=>this.props.onVisitSite(rowData)}>
              <View accessibilityTraits="link" style={styles.row}>
                <Image style={styles.icon} source={{uri: rowData.icon}} />
                <View style={styles.info}>
                  <Text
                      ellipsizeMode='tail'
                      numberOfLines={1}
                      style={styles.url}>
                    {rowData.url}
                  </Text>
                    <Text
                        ellipsizeMode='tail'
                        numberOfLines={1}
                        style={styles.description}>
                      {rowData.description}
                    </Text>
                </View>
                {this.renderNotifications(rowData)}
              </View>
            </TouchableHighlight>
          }
        />
        <Text style={styles.statusLine}>{this.state.refreshMessage}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  term: {
    height: 40,
    paddingLeft: 10
  },
  icon: {
    width: 40,
    height: 40,
  },
  info: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: 1,
    paddingLeft: 5
  },
  descriptionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  description: {
    fontSize: 12,
    color: "#999",
    flex: 10
  },
  spacer: {
    flex: 10
  },
  list: {
    flex: 10
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    paddingBottom: 20,
    marginBottom: 21,
    borderBottomColor: '#ddd',
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  container: {
    flex: 1,
    padding: 10,
    justifyContent: 'flex-start',
    backgroundColor: '#FFFAFF',
  },
  notifications: {
    paddingLeft: 5
  },
  blueNotification: {
    justifyContent: 'flex-end',
    backgroundColor: "#6CF",
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 6,
    paddingRight: 6,
    fontSize: 11,
    fontWeight: 'bold',
    borderRadius: 8,
    color: "#FFF",
  },
  greenNotification: {
    color: "#FFF"
  },
  statusLine: {
    color: "#777",
    fontSize: 10
  }
});

AppRegistry.registerComponent('DiscourseMobile', () => DiscourseMobile);