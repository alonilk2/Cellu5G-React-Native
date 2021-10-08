/**
  * This is the home page class component of CELLU App.
  *
  * @author [Alon Barenboim](https://github.com/alonilk2)
  * @version 3.0.0
 */

import React, { Component } from "react";
import {
  StyleSheet,
  StatusBar,
  View,
  Text,
  Modal,
  ScrollView,
  Image,
  ImageBackground,
  Pressable,
  Linking,
  ActivityIndicator,
  NativeModules,
  Button
} from 'react-native';
import { WebView } from 'react-native-webview';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import Global from './Global';
import Animation from './Animation';
import FontAwesome from "react-native-vector-icons/Ionicons";
import Animated, { withTiming, withRepeat, useSharedValue, useAnimatedStyle, Easing } from 'react-native-reanimated';
import { styles } from "./styles/Default";
import InfoWindow from './homescreen/InfoWindow';

const { AdmobInitiator } = NativeModules;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
const RenderLoadingView = (scaler) => {
  const offset = useSharedValue(0.0);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: offset.value
    };
  });
  offset.value = withRepeat(withTiming(1, {
    easing: Easing.elastic(0.95),
    duration: 1000
  }), -5, true);
  return (
    <>
      <View style={styles.MainContainer}>
        <StatusBar translucent backgroundColor='rgba(0,0,0,0)' barStyle='light-content' />
        <ImageBackground source={require('../images/bg.jpg')} style={styles.bg1}>
          <View style={styles.bg}>
            <View style={{zIndex: 1, marginTop: '10%', alignItems: 'center'}}>
              <Animated.Image source = {require('../images/logo.png')} style={[{width: 500, height: 500}, animatedStyle]} />
              <Text style={styles.loadingtext}>טוען ...</Text>
            </View>
          </View>
        </ImageBackground>
      </View>
    </>
  );
}

class Hello extends React.Component {
  constructor () {
    super()
    this.state = {
      infoWindow: false,
      modalDatavisible: true,
      loaded: false,
      donate: false,
      adLoaded: false,
      FirstInfoClick: false
    }
    changeNavigationBarColor('transparent', false);
    this.CheckAdmobStatus();
  }
  CheckAdmobStatus = async () => {
    let startAdLoadTime = new Date();
    let loaded = false, res;
    await sleep(2000);
    while((Date.now() - startAdLoadTime) < 15000 && loaded === false){
      res = await AdmobInitiator.isAdLoaded().catch(e=> console.log(e))
      if(res === "success"){
        loaded = true;
        this.setState({adLoaded: true})
      }
      else await sleep(100)
      console.log(res)
    }
    this.setState({adLoaded: true})
  }
  CloseInfoWindow = () => this.setState({infoWindow: false})
  renderInfoWindow = () => {
    return (
      <InfoWindow infoWindow={this.state.infoWindow} CloseInfoWindow={this.CloseInfoWindow}></InfoWindow>
    )
  }
  render() {
    if(this.state.adLoaded) return (
      <View style={styles.MainContainer} >
        <StatusBar translucent backgroundColor='rgba(0,0,0,0)' barStyle='light-content' />
        <ImageBackground source={require('../images/bg.jpg')} style={styles.bg1}>
        <Animation style={styles.bg} animationState={0}>
          {this.state.FirstInfoClick ? this.renderInfoWindow() : null}
          <View style={{position: 'absolute', left: 25, top: 50}}>
            <Pressable onPress={(e) => this.setState({FirstInfoClick: true, infoWindow: true})}>
                <FontAwesome
                    name={"information-circle-outline"}
                    size={40}
                    color="#ffffff"
                />            
            </Pressable>
          </View>
          <View style={{zIndex: 1, marginTop: '10%'}}>
            <View style={{alignSelf:'center', marginTop: '10%'}}>
              <Image source = {require('../images/logo.png')} style={{width: 400, height: 400}} />
            </View>
            <Text style={{alignSelf: 'center', color: 'white', fontSize: 18,fontWeight: "bold", marginTop: '25%'}}>חפש אנטנות לפי...</Text>
            <View style={{flexDirection: 'row'}}>
              <Pressable onPress={(e) =>{
                Global.settingsWindow = false
                AdmobInitiator.showAd();
                this.props.navigation.navigate('Location');
                }} style={styles.BtnStyle}>
                <Text style={styles.txtBtn}>מיקום נוכחי</Text>
              </Pressable>
              <Pressable onPress={(e) => this.props.navigation.navigate('ByAddress')} style={styles.BtnStyleAddr}>
                <Text style={styles.txtBtnAddr}>כתובת</Text>
              </Pressable>
            </View>
          </View>
        </Animation>
      </ImageBackground>
      </View>
    );
    else {
      return (<RenderLoadingView />)
    }
  }
}

export default Hello;
