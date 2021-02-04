 /*
  * Display antennas located near current location, which obtained by device's GPS module.
  * 
  * @author [Alon Barenboim](https://github.com/alonilk2)
  * @version 1.0.0
  */


import React, { Component } from "react";
import {
  StyleSheet,
  FlatList,
  ScrollView,
  View,
  Text,
  Pressable,
  StatusBar,
  SafeAreaView,
  Image,
  PermissionsAndroid,
  ActivityIndicator
} from 'react-native';
import { WebView } from 'react-native-webview';
import proj4 from 'proj4';
import AntennaBlock from './AntennaBlock';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import Geolocation from 'react-native-geolocation-service';
var WebViewRef = '';
class ByLocation extends Component {
  constructor () {
    super()
    this.state = {
      behavior: 'position',
      hasLocationPermission: false,
      position: [],
      retDataFromWeb: [],
      orientation: '',
      isLoading: true,
      loadingWV: true
    }
    changeNavigationBarColor('transparent', true);
    this.fetchData();
  }
  /**
    * getPermissions asks for Location Permission from the user when invoked.
    * Returns a Promise which awaits the permission.
    * 
    * @author [Alon Barenboim]
   */
  getPermissions() {
    return new Promise(async(resolve, reject) => {
      const permissions = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
      if (permissions === PermissionsAndroid.RESULTS.GRANTED) {
        this.setState({hasLocationPermission: true});
        resolve(true);
      }
      else reject(false);
    });
  }
  /**
    * fetchData gets current GPS location using Geolocation API, translates long-lat to (X,Y) Israeli Transverse Mecator coordinates and saves the position.
    * 
    * @author [Alon Barenboim]
   */
  fetchData() {
    this.getPermissions().then((res)=> {
    Geolocation.getCurrentPosition(
      (pos) => {
        var firstProjection = "+proj=tmerc +lat_0=31.73439361111111 +lon_0=35.20451694444445 +k=1.0000067 +x_0=219529.584 +y_0=626907.39 +ellps=GRS80 +towgs84=-48,55,52,0,0,0,0 +units=m +no_defs";
        this.setState({position: proj4(firstProjection,[pos.coords.longitude,pos.coords.latitude])});
        console.log("long: "+pos.coords.longitude+ " and lat: "+pos.coords.latitude+ " and position: "+this.state.position);
      },
      (error) => {
        console.log(error.code, error.message);
      },
      { enableHighAccuracy: false, timeout: 25000, maximumAge: 20000 })
    }).catch((Err)=>{
      console.log("me"+Err);
    });
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
    return new Promise((resolve, reject) => {
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
      else {resolve(this.state.isLodaing = false)}
      resolve(this.setState({retDataFromWeb: sortedList, isLoading: false}));
      reject('error');
    })
  }
  /**
    * antennaList creates list of AntennaBlocks out of each antenna located near the user
    * for displaying.
    *
    * @author [Alon Barenboim]
   */
  renderFooter = () => {
    return (
      <View style={styles.footer}>
        {this.state.loadingWV ? (
          <ActivityIndicator
            color="orange"
            style={{margin: 15}} />
        ) : 
        (
          <View style={styles.listsec}>
            <Text style={{color: 'red', fontWeight: 'bold', fontSize:30, textAlign: 'center', paddingTop: '2%'}}> אופס ! </Text>
            <Text style={{color: 'black', fontWeight: 'bold', fontSize:15}}>{
            `
            או שאין אנטנות בטווח 1.5 ק"מ ממיקומכם,
            או שלא הצלחנו למצוא את מיקומכם הנוכחי.
            אם אתם בטוחים שאתם בכדור הארץ,
            אנא וודאו כי:

                  א) ה-GPS במכשירכם דלוק
                  ב) הינכם נמצאים במקום פתוח, ללא גג
            
            לאחר מכן ניתן לרענן את העמוד:
            `
            }
            </Text>
            <Pressable onPress={(e) => {
                this.fetchData();
                WebViewRef && WebViewRef.reload();
                this.setState({orientation: 1})
              }} style={styles.BtnStyle}>
              <Text style={styles.txtBtn}>רענון</Text>
            </Pressable>
          </View>
        )}
      </View>
    );
  };
  ItemView = ({item}) => {
    return (
      <AntennaBlock key={item.Fields[1].Value} fields={item.Fields} dis={item.distance}/>
    );
  };
  render() {
    console.log("pos: "+this.state.position);

    let jsCode = `x1=`+this.state.position[0]+`; y1=`+this.state.position[1]+`;
                  govmap.zoomToXY({ x:`+this.state.position[0]+`, y: `+this.state.position[1]+`, level:7, marker: true });
                  var res = "";
                  var params = {
                      LayerName: 'cell_active',
                      Point: {x: x1, y: y1},
                      Radius:1500
                  };
                  var win = window.ReactNativeWebView;
                  govmap.getLayerData(params).then(function(response){
                      win.postMessage(JSON.stringify(response.data));
                  });  
                  `
    return (
      <View style={styles.MainContainer}>
        <View style={styles.Header}>
          <Text style={styles.Paragraph}>חיפוש לפי מיקום</Text>
          <Text style={styles.SmallText}>לחץ על המפה להגדלה</Text>
            <View style={{flex: 1, borderRadius: 30, overflow: 'hidden', marginTop: 20 }}>
              <Pressable onPress={()=> {this.props.navigation.navigate('MapView', {position: this.state.position})}} style={{flex:1}}>
                <WebView style={{flex:1}}
                  ref={WEBVIEW_REF => (WebViewRef = WEBVIEW_REF)}
                  source={{
                  uri: 'http://165.227.137.116/map1.html',
                  }}
                  injectedJavaScript={jsCode}
                  javaScriptEnabledAndroid={true}
                  onMessage={(event)=> this.handleMessage(event) }
                  startInLoadingState={true}
                  onLoadEnd={(event)=> this.setState({loadingWV: false})}
                  renderLoading={
                    ()=> {
                      return(
                      <View style={{alignItems:'center', justifyContent:'center'}}>
                        <ActivityIndicator color="#ff6a00" size="large" style={{alignSelf:'center'}}/>
                        <Text style={{color: 'red', fontWeight: 'bold', fontSize:15, marginBottom: '25%'}}> ממתין לתשובה מGovmap </Text>
                      </View>
                     )
                    }
                  }
                />
              </Pressable>
            </View>
        </View>
        <SafeAreaView style={styles.Body}>
          <FlatList 
            data={this.state.retDataFromWeb}
            renderItem={this.ItemView}
            keyExtractor={(item, index) => index.toString()}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={this.renderFooter}
          />
        </SafeAreaView>

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
  BtnStyle: { 
    borderRadius: 50,
    borderColor:  '#ff6600',
    borderWidth: 2,
    color: 'black',
    backgroundColor: 'transparent',
    width: '47%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  Header: {
    flex: 3,
    backgroundColor: '#02316e',
    padding: 10,
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
  txtBtn: {
    fontFamily: "SF-Pro-Text-Bold",
    fontSize: 20,
    color: '#ff6600'
  },
  SmallText: {
    fontFamily: "SF-Pro-Text",
    fontSize: 15,
    color: 'rgba(255,255,255,0.6)'
  }
});
export default ByLocation;
