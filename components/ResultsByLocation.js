/*
 * Display antennas located near current location, which obtained by device's GPS module.
 *
 * @author [Alon Barenboim](https://github.com/alonilk2)
 * @version 1.0.0
 */

import React, {Component} from 'react'
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  Pressable,
  StatusBar,
  SafeAreaView,
  PermissionsAndroid,
  ActivityIndicator,
} from 'react-native'
import FontAwesome from 'react-native-vector-icons/Ionicons'
import {WebView} from 'react-native-webview'
import proj4 from 'proj4'
import AntennaBlock from './AntennaBlock'
import changeNavigationBarColor from 'react-native-navigation-bar-color'
import Geolocation from 'react-native-geolocation-service'
import Footer from './Footer'
import Settings from './Settings'
import Global from './Global.js'
import AntennaDescription from './utils/AntennaDescription'
import {styles} from './styles/ResultsViewStyle.js'
import * as Utils from './utils/Utils'
import * as Const from './utils/Constants'

var WebViewRef = ''
class ResultsByLocation extends Component {
  constructor () {
    super()
    this.state = {
      position: [],
      retDataFromWeb: [],
      isLoading: true,
      loadingWV: true,
      settingsWindow: false,
      antennaDescription: false,
      chosenAntenna: [],
      FirstClick: false,
    }
    changeNavigationBarColor('transparent', true)
    this.fetchData()
  }
  /**
   * getPermissions asks for Location Permission from the user when invoked.
   * Returns a Promise which awaits the permission.
   *
   * @author [Alon Barenboim]
   */
  getPermissions () {
    return new Promise(async (resolve, reject) => {
      let permissions = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      )
      if (permissions === PermissionsAndroid.RESULTS.GRANTED) {
        resolve(true)
      } else reject(false)
    })
  }
  /**
   * fetchData gets current GPS location using Geolocation API, translates long-lat to (X,Y) Israeli Transverse Mecator coordinates and saves the position.
   *
   * @author [Alon Barenboim]
   */
  fetchData () {
    this.getPermissions()
      .then(res => {
        Geolocation.getCurrentPosition(
          pos => {
            this.setState({
              position: proj4(Const.Projection, [
                pos.coords.longitude,
                pos.coords.latitude,
              ]),
            })
          },
          error => console.log(error.code, error.message),
          {enableHighAccuracy: true, timeout: 25000, maximumAge: 20000},
        )
      })
      .catch(Err => console.log('me' + Err))
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
    let tempMinDistanceIdx
    let tempEntry
    let counter
    let sortedList = []
    return new Promise((resolve, reject) => {
      if (!data) {
        this.setState({isLoading: false})
        reject('no data')
      } else {
        for (let x = 0; x < data.length - 1; x++) {
          tempMinDistanceIdx = x
          for (let y = x + 1; y < data.length; y++)
            if (
              parseInt(data[y].distance) <
              parseInt(data[tempMinDistanceIdx].distance)
            )
              tempMinDistanceIdx = y
          tempEntry = data[x]
          data[x] = data[tempMinDistanceIdx]
          data[tempMinDistanceIdx] = tempEntry
        }
      }
      counter = 0
      for (x = 0; x < data.length; x++) {
        let bcastTechFlagArr = Utils.filterAntenna(data[x].Fields[18].Value)
        if (
          (Global.g5Toggle && bcastTechFlagArr[2]) ||
          (Global.g4Toggle && bcastTechFlagArr[1]) ||
          (Global.g3Toggle && bcastTechFlagArr[0]) ||
          (Global.g4Toggle && Global.g3Toggle && Global.g5Toggle)
        ) {
          sortedList[counter] = data[x]
          counter++
        }
      }
      resolve(this.setState({retDataFromWeb: sortedList, isLoading: false}))
    }).catch(e => console.error(e))
  }
  /**
   * antennaList creates list of AntennaBlocks out of each antenna located near the user
   * for displaying.
   *
   * @author [Alon Barenboim]
   */

  reRenderPage = () => {
    this.fetchData()
    WebViewRef && WebViewRef.reload()
    this.setState({retDataFromWeb: '', isLoading: true})
  }
  RenderItemView = ({item}) => {
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
  renderBody = () => {
    if (Global.settingsWindow)
      return (<Settings reRenderPage={this.reRenderPage} page={this} />)
    else
      return (
        <SafeAreaView style={styles.Body}>
          <FlatList
            data={this.state.retDataFromWeb}
            renderItem={this.RenderItemView}
            keyExtractor={(item, index) => index.toString()}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={() => (
              <Footer
                loadingWV={this.state.loadingWV}
                isLoading={this.state.isLoading}
                type='gps'
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
              <Text style={styles.Paragraph}>חיפוש לפי מיקום</Text>
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
                  uri: 'http://165.227.137.116/map1.html',
                }}
                injectedJavaScript={Utils.jsCode(
                  this.state.position[0],
                  this.state.position[1],
                  Global.radius,
                )}
                javaScriptEnabledAndroid={true}
                startInLoadingState={true}
                scalesPageToFit={false}

                onMessage={event => this.handleMessage(event)}
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

export default ResultsByLocation
