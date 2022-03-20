/*
 * Display antennas located near current location, which obtained by user's specified address.
 *
 * @author [Alon Barenboim](https://github.com/alonilk2)
 * @version 1.0.0
 */

import React, {Component} from 'react'
import {
  StyleSheet,
  SafeAreaView,
  FlatList,
  ScrollView,
  View,
  Text,
  Pressable,
  StatusBar,
  Image,
  ActivityIndicator,
} from 'react-native'
import {WebView} from 'react-native-webview'
import AntennaBlock from './AntennaBlock'
import changeNavigationBarColor from 'react-native-navigation-bar-color'
import Settings from './Settings'
import Global from './Global.js'
import Footer from './Footer'
import Animation from './Animation'
import FontAwesome from 'react-native-vector-icons/Ionicons'
import AntennaDescription from './utils/AntennaDescription'
import {styles} from './styles/ResultsViewStyle.js'
import * as Utils from './utils/Utils'
import {getGeolocation} from './utils/GeolocationProvider'
var WebViewRef = ''

class ResultsByAddress extends Component {
  constructor (props) {
    super(props)
    this.state = {
      behavior: 'position',
      position: [],
      retDataFromWeb: [],
      city: props.route.params.city,
      street: props.route.params.street,
      isLoading: true,
      loadingWV: true,
      antennaDescription: false,
      chosenAntenna: [],
      FirstClick: false,
    }
    changeNavigationBarColor('transparent', true)
  }

  componentDidMount () {
    getGeolocation(this.state.street, this.state.city)
      .then(res => this.setState({...this.state, position: res}))
      .catch(err => this.setState({isLoading: false}))
  }

  /**
   * handleMessage gets an event from WebView and handles the event.
   * It gets a nativeEvent contains list of antennas, sorts, filters by antenna technology
   * and saves it in retDataFromWeb state.
   *
   * @param e A nativeEvent contains list of antennas sent from WebView.
   * @author [Alon Barenboim]
   */
  handleMessage = e => {
    let data = JSON.parse(e.nativeEvent.data)
    return new Promise((resolve, reject) => {
      if (!data) {
        this.setState({isLoading: false})
        reject('no data')
      } else {
        data = Utils.SortAntennasByDistance(data)
      }
      let FilteredSortedList = Utils.FilterAntennasByTech(data)
      resolve(
        this.setState({retDataFromWeb: FilteredSortedList, isLoading: false}),
      )
    }).catch(e => console.error(e))
  }

  ItemView = ({item}) => {
    return (
      <View>
        <Pressable
          onPress={() => {
            this.setState({
              FirstClick: true,
              antennaDescription: true,
              chosenAntenna: item.Fields,
            })
          }}>
          <AntennaBlock
            key={item.Fields[1].Value}
            fields={item.Fields}
            dis={item.distance}
          />
          <View style={styles.bottomBorder}></View>
        </Pressable>
      </View>
    )
  }

  handleListView = () => {
    if (this.state.isLoading) {
      return (
        <ActivityIndicator
          color='#ff6a00'
          size='large'
          style={{alignSelf: 'center', marginTop: '20%'}}
        />
      )
    } else return this.antennaList()
  }

  reRenderPage = () => {
    WebViewRef && WebViewRef.reload()
    this.setState({retDataFromWeb: '', isLoading: true})
  }

  renderBody = () => {
    if (Global.settingsWindow)
      return <Settings reRenderPage={this.reRenderPage} page={this} />
    else
      return (
        <SafeAreaView style={styles.Body}>
          <FlatList
            data={this.state.retDataFromWeb}
            renderItem={this.ItemView}
            keyExtractor={(item, index) => index.toString()}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={() => (
              <Footer
                loadingWV={this.state.loadingWV}
                isLoading={this.state.isLoading}
                type='addr'
                reRenderPage={this.reRenderPage}
              />
            )}
          />
        </SafeAreaView>
      )
  }

  CloseAntennaDescription = () => this.setState({antennaDescription: false})

  render () {
    return (
      <View style={styles.MainContainer}>
        {this.state.FirstClick ? <AntennaDescription reference={this} /> : null}
        <View style={styles.Header}>
          <View style={{flex: 2, flexDirection: 'row', marginBottom: '6%'}}>
            <View style={{flex: 2, marginLeft: 10, marginTop: 15}}>
              <Pressable
                onPress={() => {
                  Global.settingsWindow = true
                  this.setState({settingsWindow: true})
                }}
                style={{flex: 1}}>
                <FontAwesome
                  name={'settings-outline'}
                  size={35}
                  color='#ffffff'
                />
              </Pressable>
            </View>
            <View style={{flex: 8}}>
              <Text style={styles.Paragraph}>חיפוש לפי כתובת</Text>
              <Text style={styles.SmallText}>לחץ על המפה להגדלה</Text>
            </View>
          </View>
          <View
            style={{
              flex: 10,
              borderRadius: 30,
              overflow: 'hidden',
              marginTop: 20,
            }}>
            <Pressable
              onPress={() => {
                this.props.navigation.navigate('MapView', {
                  position: this.state.position,
                })
              }}
              style={{flex: 1}}>
              <WebView
                ref={WEBVIEW_REF => (WebViewRef = WEBVIEW_REF)}
                source={{
                  uri: 'https://alonilk2.github.io/map1/',
                }}
                injectedJavaScript={Utils.jsCode(
                  this.state.position[0],
                  this.state.position[1],
                  Global.radius,
                )}
                javaScriptEnabledAndroid={true}
                onMessage={event => this.handleMessage(event)}
                startInLoadingState={true}
                scalesPageToFit={false}
                onLoadEnd={event => this.setState({loadingWV: false})}
                renderLoading={() => {
                  return (
                    <View
                      style={{alignItems: 'center', justifyContent: 'center'}}>
                      <ActivityIndicator
                        color='#ff6a00'
                        size='large'
                        style={{alignSelf: 'center'}}
                      />
                      <Text
                        style={{
                          color: 'red',
                          fontWeight: 'bold',
                          fontSize: 15,
                          marginBottom: '25%',
                        }}>
                        {' '}
                        ממתין לתשובה מGovmap{' '}
                      </Text>
                    </View>
                  )
                }}
              />
            </Pressable>
          </View>
        </View>
        {this.renderBody()}
      </View>
    )
  }
}

export default ResultsByAddress
