 /*
  * Display antennas located near current location, which obtained by user's specified address.
  * 
  * @author [Alon Barenboim](https://github.com/alonilk2)
  * @version 1.0.0
  */

import React, { Component } from "react";
import LinearGradient from 'react-native-linear-gradient';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Pressable,
  StatusBar,
  Image,
  ActivityIndicator
} from 'react-native';
import { WebView } from 'react-native-webview';
import Geolocation from '@react-native-community/geolocation';
import proj4 from 'proj4';
import AntennaBlock from './AntennaBlock';
import Geocode from "react-geocode";
import changeNavigationBarColor from 'react-native-navigation-bar-color';

class MapByAddress extends Component {
  constructor (props) {
    super(props)
    this.state = {
      behavior: 'position',
      position: [],
      retDataFromWeb: [],
      city: "",
      street: props.route.params.street,
      isLoading: true
    }
    changeNavigationBarColor('transparent', true);
    Geocode.setApiKey("AIzaSyCtP-auXe-kPUJMvxOZxiDACspzitfnlFo");
    Geocode.setLanguage("he");
    Geocode.setRegion("il");
    Geocode.enableDebug();
    this.cutSpacesFromString();
    let fullAddress = "רחוב "+this.state.street +", "+ this.state.city;
    Geocode.fromAddress(fullAddress).then(
      response => {
          const { lat, lng } = response.results[0].geometry.location;
          var firstProjection = "+proj=tmerc +lat_0=31.73439361111111 +lon_0=35.20451694444445 +k=1.0000067 +x_0=219529.584 +y_0=626907.39 +ellps=GRS80 +towgs84=-48,55,52,0,0,0,0 +units=m +no_defs";
          this.setState({position: proj4(firstProjection,[lng,lat])});
      },
      error => {
          console.error(error);
      }
    );
  }
  /**
    * Any city name from DATA.CO.IL Gov api is 50 characters long, filled with name string and space chars.
    * cutSpacesFromString removes unwanted space chars from the end of the city name string.
    *
    * @param e A nativeEvent contains list of antennas sent from WebView.
    * @author [Alon Barenboim]
   */
  cutSpacesFromString() {
    let cityName = this.props.route.params.city;
    let nameLen = cityName.length;
    for(let x = nameLen-1; x > 0; x--) {
      if(cityName.charAt(x) === ' ')
          continue;
      else {
          let temp = cityName.substring(0, x+1)
          this.state.city = temp;
          x = 0;
      }
    }
  }
  /**
    * handleMessage gets an event from WebView and handles the event.
    * It gets a nativeEvent contains list of antennas, sorts and saves it in retDataFromWeb state.
    *
    * @param e A nativeEvent contains list of antennas sent from WebView.
    * @author [Alon Barenboim]
   */
  handleMessage = (e) => {
    let data = JSON.parse(e.nativeEvent.data);
    let x=0, y=0;
    let sortedList = [];
    if(data) {
        if(data.length > 0) {
            for(x = 0; x < data.length-1; x++){
                let min = parseInt(data[x].distance);
                sortedList[x] = data[x];
                for(y = x+1; y < data.length; y++) {
                  if(parseInt(data[y].distance) < min){
                      min = parseInt(data[y].distance);
                      let temp = sortedList[x];
                      sortedList[x] = data[y];
                      data[y] = temp;
                  }
                }
            }
        } else console.log("data error");
    }
    if(sortedList.length > 0) this.setState({retDataFromWeb: sortedList, isLoading: false});
    else return false
  }
  /**
    * antennaList creates list of AntennaBlocks out of each antenna located near the user
    * for displaying.
    *
    * @author [Alon Barenboim]
   */
  antennaList = () => {
      if(this.state.retDataFromWeb) {   
          let list = this.state.retDataFromWeb.map((res) =>
              <AntennaBlock key={res.Fields[1].Value} fields={res.Fields} dis={res.distance}/>
          );
          return (list);
      } 
  }

  render() {
    let jsCode = `x1=`+this.state.position[0]+`; y1=`+this.state.position[1]+`;
                  govmap.zoomToXY({ x:`+this.state.position[0]+`, y: `+this.state.position[1]+`, level:7, marker: true });
                  var res = "";
                  var params = {
                      LayerName: 'cell_active',
                      Point: {x: x1, y: y1},
                      Radius:1000
                  };
                  var win = window.ReactNativeWebView;
                  govmap.getLayerData(params).then(function(response){
                      win.postMessage(JSON.stringify(response.data));
                  });  
                  `
    return (
      <View style={styles.MainContainer}>
        <View style={styles.Header}>
          <Text style={styles.Paragraph}>Search By Address</Text>
            <View style={{flex: 1, borderRadius: 30, overflow: 'hidden', marginTop: 20 }}>
              <Pressable onPress={()=> {this.props.navigation.navigate('MapView')}} style={{flex:1}}>
                <WebView style={{flex:1}}
                source={{
                uri: 'http://165.227.137.116/map1.html',
                }}
                injectedJavaScript={jsCode}
                javaScriptEnabledAndroid={true}
                onMessage={(event)=> this.handleMessage(event)}
                startInLoadingState={true}
                renderLoading={
                  ()=> {
                    return (<ActivityIndicator color="#ff6a00" size="large" style={{alignSelf:'center', marginBottom: '35%'}}/> )
                  }
                }
              />
              </Pressable>
            </View>
        </View>
        <ScrollView style={styles.Body}>
          <Text style={{fontFamily: 'SF-Pro-Text-Semibold', fontSize: 20, marginLeft: 10, marginTop: 15}}>NEARBY ANTENNAS:</Text>
          {this.state.isLoading ? <ActivityIndicator color="#ff6a00" size="large" style={{alignSelf:'center', marginTop: '20%'}}/> 
          : this.antennaList() }
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: 'white',
    paddingBottom: '10%'

  },
  Header: {
    flex: 1,
    backgroundColor: '#02316e',
    padding: 10,
    paddingTop: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: 'black',
    shadowOpacity: 1,
    elevation: 20,
    paddingTop: '12%'
  },
  Body: {
    flex: 3,
  },
  Paragraph: {
    fontFamily: "SF-Pro-Text-Bold",
    fontSize: 30,
    color: 'white'
  },
  CityInput: { 
    marginLeft: 20,
    marginRight: 20,
    height:50,
    borderColor: 'white',
    borderWidth:1
  },
  firstLabel: {
    flex: 1,
    color: 'white'
  },
});
export default MapByAddress;
