/**
  * This is the home page class component of CELLU App.
  *
  * @author [Alon Barenboim](https://github.com/alonilk2)
  * @version 1.0.0
 */

import React, { Component } from "react";
import LinearGradient from 'react-native-linear-gradient';
import {
  StyleSheet,
  ScrollView,
  StatusBar,
  View,
  Text,
  Image,
  Button,
  ImageBackground,
  Pressable
} from 'react-native';
import { WebView } from 'react-native-webview';
import changeNavigationBarColor from 'react-native-navigation-bar-color';

class Hello extends Component {
  constructor () {
    super()
    this.state = {
      behavior: 'position'
    }
    changeNavigationBarColor('transparent', false);
  }

  render() {
    return (
      <View style={styles.MainContainer}>
        <StatusBar translucent backgroundColor='rgba(0,0,0,0)' barStyle='light-content' />
        <ImageBackground source={require('../images/bg.jpg')} style={styles.bg1}>
          <View style={styles.bg}>
            <View style={styles.bodyContainer}>
              <View style={{alignSelf:'center', marginTop: 50}}>
                <Image source = {require('../images/logo.png')} style={{width: 400, height: 400}} />
              </View>
              <Text style={{alignSelf: 'center', color: 'white', fontFamily: "SF-Pro-Text-Bold"}}>Search Nearby Antennas By</Text>
              <View style={{flexDirection: 'row'}}>
                <Pressable onPress={(e) => this.props.navigation.navigate('Location')} style={styles.BtnStyle}>
                  <Text style={styles.txtBtn}>Location</Text>
                </Pressable>
                <Pressable onPress={(e) => this.props.navigation.navigate('ByAddress')} style={styles.BtnStyleAddr}>
                  <Text style={styles.txtBtnAddr}>Address</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
  },
  bg: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    backgroundColor:'rgba(0,20,100,0.7)',
  },
  bg1: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  BtnStyle: { 
    borderRadius: 50,
    color: 'black',
    backgroundColor: 'white',
    width: '47%',
    height: 70,
    marginTop:'5%',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5
  },
  BtnStyleAddr: {   
    borderRadius: 50,
    borderColor:  '#ff6600',
    borderWidth: 2,
    color: 'black',
    backgroundColor: 'transparent',
    width: '47%',
    height: 70,
    marginTop:'5%',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5
  },
  txtBtn: {
    fontFamily: "SF-Pro-Text-Bold",
    fontSize: 20,
    color: '#ff6600'
  },
  txtBtnAddr: {
    fontFamily: "SF-Pro-Text-Bold",
    fontSize: 20,
    color: 'white'
  },
  firstLabel: {
    flex: 1,
    color: 'white'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  BtnPart: {
    marginTop: 320
  }
});
export default Hello;
