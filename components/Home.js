/**
 * This is the home page class component of CELLU App.
 *
 * @author [Alon Barenboim](https://github.com/alonilk2)
 * @version 3.0.0
 */

import React from 'react'
import {
  Image,
  ImageBackground, NativeModules, Pressable, StatusBar, Text, View
} from 'react-native'
import changeNavigationBarColor from 'react-native-navigation-bar-color'
import FontAwesome from 'react-native-vector-icons/Ionicons'
import Animation from './Animation'
import Global from './Global'
import InfoWindow from './homescreen/InfoWindow'
import { styles } from './styles/Default'
import RenderLoadingView from './utils/InitialLoader'
import { Sleep } from './utils/Utils'
const { AdmobInitiator } = NativeModules

class Home extends React.Component {
  constructor() {
    super()
    this.state = {
      infoWindow: false,
      modalDatavisible: true,
      loaded: false,
      donate: false,
      adLoaded: false,
      FirstInfoClick: false,
    }
    changeNavigationBarColor('transparent', false)
    this.CheckAdmobStatus()
  }
  CloseInfoWindow = () => this.setState({ infoWindow: false })

  /**
   * CheckAdmobStatus check for AdMob request status every 0.5 seconds.
   * If no positive response recieved after 15 seconds -> abort.
   * Initial sleep time for loading view was set to 2 seconds.
   * @author [Alon Barenboim]
   */
  CheckAdmobStatus = async () => {
    let startAdLoadTime = new Date()
    let loaded = false
    let res
    await Sleep(2000)
    while (Date.now() - startAdLoadTime < 15000 && loaded === false) {
      res = await AdmobInitiator.isAdLoaded().catch(e => console.log(e))
      if (res === 'success') {
        loaded = true
        this.setState({ adLoaded: true })
      } else await Sleep(500)
    }
    this.setState({ adLoaded: true })
  }

  render() {
    if (this.state.adLoaded)
      return (
        <View style={styles.MainContainer}>
          <StatusBar
            translucent
            backgroundColor='rgba(0,0,0,0)'
            barStyle='light-content'
          />
          <ImageBackground
            source={{ uri: 'https://alonilk2.github.io/map1/bg.jpg' }}
            style={styles.bg1}>
            <Animation style={styles.bg} animationState={0}>
              {this.state.FirstInfoClick ? (
                <InfoWindow
                  infoWindow={this.state.infoWindow}
                  CloseInfoWindow={this.CloseInfoWindow}></InfoWindow>
              ) : null}

              <View style={{ position: 'absolute', left: 25, top: 50 }}>
                <Pressable
                  onPress={e =>
                    this.setState({ FirstInfoClick: true, infoWindow: true })
                  }>
                  <FontAwesome
                    name={'information-circle-outline'}
                    size={40}
                    color='#ffffff'
                  />
                </Pressable>
              </View>
              <View style={{ zIndex: 1, marginTop: '10%' }}>
                <View style={{ alignSelf: 'center', marginTop: '15%' }}>
                  <Image
                    source={{ uri: 'https://alonilk2.github.io/map1/logo.png' }}
                    style={{ width: 500, height: 500 }}
                  />
                </View>
                <Text
                  style={{
                    alignSelf: 'center',
                    color: 'white',
                    fontSize: 18,
                    fontWeight: 'bold',
                    marginTop: '10%',
                  }}>
                  חפש אנטנות לפי...
                </Text>
                <View style={{ flexDirection: 'row' }}>
                  <Pressable
                    onPress={e => {
                      Global.settingsWindow = false
                      AdmobInitiator.showAd()
                      this.props.navigation.navigate('Location')
                    }}
                    style={styles.BtnStyle}>
                    <Text style={styles.txtBtn}>מיקום נוכחי</Text>
                  </Pressable>
                  <Pressable
                    onPress={e => this.props.navigation.navigate('CityInput')}
                    style={styles.BtnStyleAddr}>
                    <Text style={styles.txtBtnAddr}>כתובת</Text>
                  </Pressable>
                </View>
              </View>
            </Animation>
          </ImageBackground>
        </View>
      )
    else return <RenderLoadingView />
  }
}

export default Home
