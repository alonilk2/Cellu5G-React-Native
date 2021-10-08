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
  View,
  Text,
  Pressable,
  StatusBar,
  ScrollView,
  SafeAreaView,
  Image,
  PermissionsAndroid,
  ActivityIndicator,
} from 'react-native';
import FontAwesome from "react-native-vector-icons/Ionicons";
import { WebView } from 'react-native-webview';
import proj4 from 'proj4';
import AntennaBlock from './AntennaBlock';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import Geolocation from 'react-native-geolocation-service';
import Footer from './Footer';
import Settings from './Settings';
import Global from './Global.js';
import AntennaDescription from './utils/AntennaDescription';
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
      loadingWV: true,
      settingsWindow: false,
      antennaDescription: false,
      chosenAntenna: [],
      FirstClick: false
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
      { enableHighAccuracy: true, timeout: 25000, maximumAge: 20000 })
    }).catch((Err)=>{
      console.log("me"+Err);
    });
  }

  filterAntenna = (tech) => { 
    let parsed = tech.split(" ");
    let answer = [0,0,0];
    for(var i = 0; i < parsed.length; i++){
      if(parsed[i] == "3") answer[0]=1;
      if(parsed[i] == "4") answer[1]=1;
      if(parsed[i] == "5") answer[2]=1;
    }
    return answer;
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
    let x, y, mindisttemp, tempentry, counter;
    let sortedList = [];
    return new Promise((resolve, reject) => {
      if(data) {
        for(x = 0; x < data.length-1; x++){
          mindisttemp = x
          for(y = x+1; y < data.length; y++)
            if(parseInt(data[y].distance) < parseInt(data[mindisttemp].distance))
              mindisttemp = y;
          tempentry = data[x]
          data[x] = data[mindisttemp]
          data[mindisttemp] = tempentry
        }
      }
      else {
        this.setState({isLoading:false});
        reject('no data')
      }
      counter = 0;
      for(x = 0; x < data.length; x++){
        let techarray = this.filterAntenna(data[x].Fields[18].Value);
        if((Global.g5Toggle && techarray[2])
          || (Global.g4Toggle && techarray[1])
          || (Global.g3Toggle && techarray[0])
          || (Global.g4Toggle && Global.g3Toggle && Global.g5Toggle)){
            sortedList[counter] = data[x];
            counter++;
          }
      }
      resolve(this.setState({retDataFromWeb: sortedList, isLoading: false}));
    }).catch(e => console.error(e))
  }
  /**
    * antennaList creates list of AntennaBlocks out of each antenna located near the user
    * for displaying.
    *
    * @author [Alon Barenboim]
   */

  reRenderPage = () => {
    this.fetchData();
    WebViewRef && WebViewRef.reload();
    this.setState({orientation: 1, retDataFromWeb: '', isLoading: true});
  }
  ItemView = ({item}) => {
    return (
      <View>
        <Pressable onPress={()=> {
            this.setState({FirstClick: true, antennaDescription: true, chosenAntenna: item.Fields});
          }}>
          <AntennaBlock key={item.Fields[1].Value} fields={item.Fields} dis={item.distance}/>
          <View style={styles.bottomBorder}></View>
        </Pressable>
      </View>
    );
  };
  renderBody = () => {
    if(Global.settingsWindow) return ( <Settings reRenderPage={this.reRenderPage} page={this}/>)
    else return (
      <SafeAreaView style={styles.Body}>
        <FlatList 
          data={this.state.retDataFromWeb}
          renderItem={this.ItemView}
          keyExtractor={(item, index) => index.toString()}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={()=>(<Footer loadingWV={this.state.loadingWV} isLoading={this.state.isLoading} type="gps" reRenderPage={this.reRenderPage} />)}
        />
      </SafeAreaView>
    )
  }
  CloseAntennaDescription = () => this.setState({antennaDescription: false})
  AntennaDescription = () => {
    return (
      <AntennaDescription reference={this} />
    )
  }
  render() {
    let jsCode = `x1=`+this.state.position[0]+`; y1=`+this.state.position[1]+`;
                  var params = {
                      LayerName: 'cell_active',
                      Point: {x: x1, y: y1},
                      Radius:`+Global.radius+`
                  };
                  var win = window.ReactNativeWebView;
                  govmap.getLayerData(params).then(function(response){
                      win.postMessage(JSON.stringify(response.data));
                  });  
                  govmap.zoomToXY({ x:`+this.state.position[0]+`, y: `+this.state.position[1]+`, level:5, marker:false });
                  var res = "";
                  `
    return (
      <View style={styles.MainContainer}>
        {this.state.FirstClick ? this.AntennaDescription() : null}
        <View style={styles.Header}>
          <View style={{flex: 2, flexDirection: 'row', marginBottom: '6%'}}>
            <View style={{flex: 2, marginLeft: 10, marginTop: 15 }}>
              <Pressable onPress={()=> {
                  Global.settingsWindow = true;
                  this.setState({settingsWindow: true})
                }} style={{flex:1}}>
                <FontAwesome
                    name={"settings-outline"}
                    size={35}
                    color="#ffffff"
                />
              </Pressable>
            </View>
            <View style={{flex: 8}}>
              <Text style={styles.Paragraph}>חיפוש לפי מיקום</Text>
              <Text style={styles.SmallText}>לחץ על המפה להגדלה</Text>
            </View>
          </View>
          <View style={{flex: 10, borderRadius: 30, overflow: 'hidden', marginTop: 20 }}>
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
      {this.renderBody()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: 'white',
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
    overflow: 'hidden',
  },
  bottomBorder: {
    marginTop: 4,
    borderBottomWidth: 1,
    borderColor: '#e6e6e6',
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
    paddingTop: '8%'
  },
  Body: {
    flex: 4,
  },
  Paragraph: {
    fontSize: 35,
    fontWeight: 'bold',
    color: 'white'
  },
  SmallText: {
    fontSize: 17,
    color: 'rgba(255,255,255,0.7)'
  },
});
export default ByLocation;
