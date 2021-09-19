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
  NativeModules
} from 'react-native';
import { WebView } from 'react-native-webview';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import Global from './Global';
import Animation from './Animation';
import FontAwesome from "react-native-vector-icons/Ionicons";

const { AdmobInitiator } = NativeModules;

// Will show it if already loaded, or wait for it to load and show it.
class Hello extends React.Component {
  constructor () {
    super()
    this.state = {
      infoWindow: false,
      modalDatavisible: true,
      loaded: false,
      donate: false,
    }
    changeNavigationBarColor('transparent', false);

  }

  renderInfoWindow = () => {
    if(this.state.infoWindow === true) return (
      <Animation style={{height: '100%', width: '100%',position:'absolute', zIndex: 5, elevation: 30}} page={this}>
        <View style={styles.infoContainer}>
          <Pressable onPress={(e)=>this.setState({infoWindow: false})}>
            <FontAwesome
                name={"arrow-back-outline"}
                size={30}
            />
          </Pressable>
          <ScrollView>
            <View style={{alignItems:'center'}}>
              <Image source = {require('../images/logo.png')} style={{width: 150, height: 150, marginTop: '1%'}} />
              <Text style={styles.textInfoBold}>Cellu App</Text>
              <Text style={styles.textInfo}>Version: 3.0.2</Text>
              <Text style={styles.textInfo}> 
              {`           
המידע המוצג באפליקציה זו נאסף 
מתוך מאגרי המידע של 
Govmap.gov.il
Data.gov.il
אין מפתחי האפליקציה אחראיים על
נכונות ועדכניות המידע המוצג למשתמש.
השימוש באפליקציה ובמידע המוצג בה הינו באחריות המשתמש בלבד.

ליצירת קשר:`}
              </Text>
              <Pressable onPress={(e) => Linking.openURL('mailto:alonilk2@gmail.com')} style={styles.BtnStyleEmail}>
                <Text style={styles.txtBtnAddr}>Email Me</Text>
              </Pressable>
              <Image source = {require('../images/abdev.png')} style={styles.abdev} />
            </View>
          </ScrollView>
        </View>
      </Animation>
    )
  }
  render() {
    return (
      <Animation style={styles.MainContainer}>
        <StatusBar translucent backgroundColor='rgba(0,0,0,0)' barStyle='light-content' />
        <ImageBackground source={require('../images/bg.jpg')} style={styles.bg1}>
        <View style={styles.bg}>
          {this.renderInfoWindow()}
          <View style={{position: 'absolute', left: 25, top: 50}}>
            <Pressable onPress={(e) => this.setState({infoWindow: true})}>
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
            <Text style={{alignSelf: 'center', color: 'white', fontFamily: "SF-Pro-Text",fontWeight: "bold", marginTop: '25%'}}>חפש אנטנות לפי...</Text>
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
        </View>
      </ImageBackground>
      </Animation>
    );
  }
}

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    zIndex: 1,
  },
  infoContainer: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,1)',
    marginTop: '10%',
    marginBottom: '10%',
    padding: 20,
    borderRadius: 20,
    marginRight: '5%',
    marginLeft: '5%',
    elevation: 15,
  },
  bg: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    backgroundColor:'rgba(0,20,100,0.3)',
  },
  bg1: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  abdev: {
    marginTop: '15%',
    width: '40%',
    height: undefined,
    aspectRatio: 2
  },
  info: {
    width: '100%',
    height: '100%', 
  },
  coffee: {
    width: '100%',
    height: '100%', 
  },

  coffeePressable: {
    width: 30,
    height: 30,
    alignSelf: 'center',
    marginRight: '35%',
    marginBottom: '20%',
  },
  textInfoBold: {
    fontFamily: "SF-Pro-Text-Bold",
    fontSize: 30,
    color: 'black',
    textAlign: 'left',
    fontWeight: 'bold'
  },
  textInfo: {
    fontFamily: "SF-Pro-Text-Regular",
    fontSize: 18,
    color: 'black',
    textAlign: 'center',
  },
  BtnStyle: { 
    borderRadius: 50,
    color: 'black',
    backgroundColor: 'white',
    width: '47%',
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5
  },
  BtnStyleEmail: { 
    borderRadius: 50,
    color: 'white',
    backgroundColor: '#ff6600',
    width: '90%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  BtnStyleAddr: {   
    borderRadius: 50,
    borderColor:  '#ff6600',
    borderWidth: 2,
    color: 'black',
    backgroundColor: 'transparent',
    width: '47%',
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  txtBtn: {
    fontFamily: "SF-Pro-Text",
    fontSize: 20,
    color: '#ff6600',
    fontWeight: 'bold'
  },
  txtBtnAddr: {
    fontFamily: "SF-Pro-Text",
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold'

  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
});
export default Hello;
