 /*
  * Display antennas located near current location, which obtained by user's specified address.
  * 
  * @author [Alon Barenboim](https://github.com/alonilk2)
  * @version 1.0.0
  */

import React, { Component } from "react";
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
  ActivityIndicator
} from 'react-native';
import { WebView } from 'react-native-webview';
import proj4 from 'proj4';
import AntennaBlock from './AntennaBlock';
import Geocode from "react-geocode";
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import Settings from './Settings';
import Global from './Global.js';
import Footer from './Footer';
import Animation from './Animation';
import FontAwesome from "react-native-vector-icons/Ionicons";

var WebViewRef = '';

class MapByAddress extends Component {
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
      chosenAntenna: []
    }
    changeNavigationBarColor('transparent', true);

  }
  componentDidMount() {
     this.getGeolocation().then(this.setState({...this.state})).catch(err => {this.setState({isLoading: false}); console.log(err)});
  }
  getGeolocation() {
    Geocode.setApiKey("AIzaSyCtP-auXe-kPUJMvxOZxiDACspzitfnlFo");
    Geocode.setLanguage("he");
    Geocode.setRegion("il");
    Geocode.enableDebug();
    let fullAddress = this.state.street +", "+ this.state.city;
    return new Promise((resolve, reject) => {
      Geocode.fromAddress(fullAddress).then(
      response => {
          const { lat, lng } = response.results[0].geometry.location;
          var firstProjection = "+proj=tmerc +lat_0=31.73439361111111 +lon_0=35.20451694444445 +k=1.0000067 +x_0=219529.584 +y_0=626907.39 +ellps=GRS80 +towgs84=-48,55,52,0,0,0,0 +units=m +no_defs";
          resolve(this.setState({position: proj4(firstProjection,[lng,lat])}));
      }).catch(error => reject(console.error(error)))
    })
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
    if(data === null) {
      this.setState({isLoading: false});  
      return;
    }
    if(data.length > 0) {
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
      this.setState({isLoading: false});
      return;
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
        this.setState({retDataFromWeb: sortedList, isLoading: false});
    }
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
  ItemView = ({item}) => {
    return (
      <View>
        <Pressable onPress={()=> {
            this.setState({antennaDescription: true, chosenAntenna: item.Fields});
          }}>
          <AntennaBlock key={item.Fields[1].Value} fields={item.Fields} dis={item.distance}/>
          <View style={styles.bottomBorder}></View>
        </Pressable>
      </View>
    );
  };
  handleListView = () => {
    if(this.state.isLoading) {
      return (<ActivityIndicator color="#ff6a00" size="large" style={{alignSelf:'center', marginTop: '20%'}}/>)}
    else return (this.antennaList())
  }
  reRenderPage = () => {
    WebViewRef && WebViewRef.reload();
    this.setState({orientation: 1, retDataFromWeb: '', isLoading: true});
  }
  renderBody = () => {
    if(Global.settingsWindow) return ( <Settings reRenderPage={this.reRenderPage} page={this}/>)
    else return (
      <SafeAreaView style={styles.Body}>
        <FlatList 
          data={this.state.retDataFromWeb}
          renderItem={this.ItemView}
          keyExtractor={(item, index) => index.toString()}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={()=>(<Footer loadingWV={this.state.loadingWV} isLoading={this.state.isLoading} type="addr" reRenderPage={this.reRenderPage} />)}
        />
      </SafeAreaView>
    )
  }
  renderAntennaDescriptionWindow = () => {
    if(this.state.antennaDescription === true) {
      let antenna = this.state.chosenAntenna;
      let broadcastTech = antenna[18].Value;
      let three, four, five;
      broadcastTech = broadcastTech.split(" ");
      for(var i = 0; i < broadcastTech.length; i++){
        if(broadcastTech[i] == "3") three=1;
        if(broadcastTech[i] == "4") four=1;
        if(broadcastTech[i] == "5") five=1;
      }
      return (
      <Animation style={{flex: 1, height: '100%', width: '100%',position:'absolute', zIndex: 5, elevation: 30}} page={this}>
        <ScrollView style={styles.infoContainer}>
          <Pressable onPress={(e)=>this.setState({antennaDescription: false})}>
            <FontAwesome
                name={"arrow-back-outline"}
                size={30}
            />
          </Pressable>
          <View style={{alignItems:'center'}}>
            <Image source = {require('../images/logo.png')} style={{width: 100, height: 100, marginTop: '3%'}} />
            <Text style={styles.textInfo}> 
              {antenna[0].FieldName}: {antenna[0].Value}{"\n"}
              {antenna[1].FieldName}: {antenna[1].Value}{"\n"}
              {antenna[2].FieldName}: {antenna[2].Value}{"\n"}
              {antenna[3].FieldName}: {antenna[3].Value}{"\n"}
              {antenna[4].FieldName}: {antenna[4].Value}{"\n"}
              {antenna[5].FieldName}: {antenna[5].Value}{"\n"}
              {antenna[6].FieldName}: {antenna[6].Value}{"\n"}
              {antenna[7].FieldName}: {antenna[7].Value}{"\n"}
              {antenna[8].FieldName}: {antenna[8].Value}{"\n"}
              {antenna[9].FieldName}: {antenna[9].Value}{"\n"}
              {antenna[10].FieldName}: {antenna[10].Value}{"\n"}
              {antenna[11].FieldName}: {antenna[11].Value}{"\n"}
              {antenna[15].FieldName}: {antenna[15].Value}{"\n"}
              {antenna[16].FieldName}: {antenna[16].Value}{"\n"}
              {antenna[17].FieldName}: {antenna[17].Value}{"\n"}
            </Text>
            <View style={styles.techContainer}>
              {three==1 ? <Text style={styles.techtxtOn}> 3G </Text> : <Text style={styles.techtxtOff}> 3G </Text>}
              {four==1 ? <Text style={styles.techtxtOn}> 4G </Text> : <Text style={styles.techtxtOff}> 4G </Text>}
              {five==1 ? <Text style={styles.techtxtOn}> 5G </Text> : <Text style={styles.techtxtOff}> 5G </Text>}
            </View>
          </View>
        </ScrollView>
      </Animation>
      )
    }
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
        {this.renderAntennaDescriptionWindow()}
        <View style={styles.Header}>
          <View style={{flex: 2, flexDirection: 'row', marginBottom: '6%'}}>
            <View style={{flex: 2, marginLeft: 10, marginTop: 15 }}>
              <Pressable onPress={()=> {
                  Global.settingsWindow = true;
                  this.setState({settingsWindow: true})
                }} style={{flex:1}}>
                <FontAwesome
                    name={"settings-outline"}
                    size={40}
                    color="#ffffff"
                />
              </Pressable>
            </View>
            <View style={{flex: 8}}>
              <Text style={styles.Paragraph}>חיפוש לפי כתובת</Text>
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
    flex: 3,
  },
  Paragraph: {
    fontFamily: "SF-Pro-Text-Bold",
    fontSize: 30,
    color: 'white'
  },
  SmallText: {
    fontFamily: "SF-Pro-Text-Regular",
    fontSize: 15,
    color: 'rgba(255,255,255,0.6)'
  },
  techtxtOff: {
    fontSize: 17,
    color: 'grey',
  },
  techtxtOn: {
    fontSize: 17,
    color: 'green',
    fontWeight: 'bold'
  },
  techContainer: {
    justifyContent: 'center',
    alignItems:'center',
    flexDirection: 'row',
    borderRadius: 50,
    borderColor: '#b3b3b3',
    borderWidth: 2,
    margin: 5,
    padding: 5
  },
  textInfoBold: {
    fontFamily: "SF-Pro-Text-Bold",
    fontSize: 30,
    color: 'black',
    fontWeight: 'bold',
    alignSelf: 'flex-start',
  },
  textInfo: {
    fontFamily: "SF-Pro-Text-Regular",
    fontSize: 18,
    color: 'black',
    textAlign: 'center',
  },
});
export default MapByAddress;
