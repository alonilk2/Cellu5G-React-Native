 /*
  * ByAddress class component - display and choose a city to get antenna's deployment
  * StreetList class component - display and choose a street to get antenna's deployment.
  * @author [Alon Barenboim](https://github.com/alonilk2)
  * @version 1.0.0
  */


import React, {Component} from 'react';
import {View, Image, StyleSheet, ImageBackground, TouchableOpacity, Text, TextInput} from 'react-native';
import axios from 'axios';
import Autocomplete from 'react-native-autocomplete-input';
export class ByAddress extends Component {
    constructor(props) {
        super(props);
        this.state = {
            citiesObj: [],
            query:'',
            lastResult: '',
            counter: 0,
            cityFlag: false         //cityFlag is true if and only if the city was chosen from the recommendation list.
        }
    }
    async componentDidMount() {
        //Get list of cities in Israel from data.gov.il API
        do {
          let url = `https://data.gov.il/api/3/action/datastore_search?offset=${this.state.counter}&resource_id=5c78e9fa-c2e2-4771-93ff-7f400a12f7ba`;
          await axios.get(url)
          .then((res) => {
              if(this.state.citiesObj.length === 0){
                this.setState({citiesObj: res.data.result.records})
              }
              else {
                this.setState({citiesObj: this.state.citiesObj.concat(res.data.result.records)});
              }
              this.setState({lastResult:res.data.result.records.length, counter: this.state.counter+100});
          })
          .catch((err) => {
              console.log("city error:"+err)
          })
        } while (this.state.lastResult === 100)
    }
    getCities = (str) => {
      if(str === '') return [];
      var citiesNamesArr = [];
      var city;
      for(city of this.state.citiesObj){
        let name = city.שם_ישוב;
        if(stringStartsWith(name, str) && city.שם_ישוב){
          citiesNamesArr.push(city.שם_ישוב)
        }
      }
      return citiesNamesArr;
    }
    handleListItemClick(item) {
      let newItem = this.cutSpacesFromString(item)
      this.setState({query: newItem});
      this.props.navigation.navigate('StreetList', {item: newItem})
    }
    /**
    * Any city name from DATA.CO.IL Gov api is 50 characters long, filled with name string and space chars.
    * cutSpacesFromString removes unwanted space chars from the end of the city name string.
    *
    * @param e A nativeEvent contains list of antennas sent from WebView.
    * @author [Alon Barenboim]
    */
    cutSpacesFromString(str) {
      let Name = str
      let nameLen = Name.length;
      for(let x = nameLen-1; x > 0; x--) {
        if(Name.charAt(x) === ' ')
            continue;
        else {
            let temp = Name.substring(0, x+1)
            return temp;
            x = 0;
        }
      }
    }
    render () {
      return (
        <View style={styles.MainContainer}>
          <ImageBackground source={require('../images/bg.jpg')} style={styles.bg1}>
            <View style={styles.bg}>
                <Autocomplete 
                  placeholder="Enter City Name"
                  data={this.getCities(this.state.query)}
                  listStyle={styles.ListStyle}
                  listContainerStyle={styles.ListContainer}
                  inputContainerStyle={styles.FormContainer}
                  containerStyle={{zIndex:1}}
                  renderTextInput={()=> (
                    <View style={{flex:1, justifyContent:'center'}}>
                      <Text style={styles.FormTitle}> הכנס שם עיר </Text>
                      <TextInput
                        style={styles.TextInputStyle}
                        onChangeText={text => {this.setState({ query: text, cityFlag: false });}}
                        value={this.state.query}
                      />
                    </View>
                  )}
                  renderItem={({ item, i }) => (
                    <TouchableOpacity key={item} onPress={() => {this.handleListItemClick(item)}}>
                      <Text style={styles.itemText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item, i) => item}
                />
            </View>
          </ImageBackground>
        </View>
      );
    }
}

export class StreetList extends Component {
  constructor(props){
    super(props);
    this.state = {
      counterStr:0,
      streetsObj: '',
      lastResultStr: '',
      strQuery: '',
      cityName: props.route.params.item
    }
    this.handleCityClick(this.props.route.params.item)
  }
  async handleCityClick(name) {
      //Get list of streets in Israel from data.gov.il API
      do {
        await axios.get(`https://data.gov.il/api/3/action/datastore_search?offset=${this.state.counterStr}&q={"שם_ישוב":"${name}"}&resource_id=9ad3862c-8391-4b2f-84a4-2d4c68625f4b`)
        .then((res) => {
            if(this.state.streetsObj.length === 0){
              this.setState({streetsObj: res.data.result.records})
            }
            else {
              this.setState({streetsObj: this.state.streetsObj.concat(res.data.result.records)});
            }
            this.setState({lastResultStr: res.data.result.records.length, counterStr: this.state.counterStr+100});
        })
        .catch((err) => {
            console.log("street error:"+err)
        })
      } while (this.state.lastResultStr === 100)
  }
  getStreets = (str) => {
    if(str === '' || this.state.cityFlag === false) return [];
    var streetsNamesArr = [];
    var street;
    for(street of this.state.streetsObj){
      if(stringStartsWith(street.שם_רחוב, str) && street.שם_רחוב){
        streetsNamesArr.push(street.שם_רחוב)
      }
    }
    return streetsNamesArr;
  }
  render() {
    return (
      <View style={styles.MainContainer}>
          <ImageBackground source={require('../images/bg.jpg')} style={styles.bg1}>
            <View style={styles.bg}>
              <Autocomplete autoCapitalize="none"
                  autoCorrect={false}
                  placeholder="Enter Street Name"
                  data={this.getStreets(this.state.strQuery)}
                  value={this.state.strQuery}
                  listStyle={styles.ListStyle}
                  listContainerStyle={styles.ListContainer}
                  inputContainerStyle={styles.FormContainer}
                  containerStyle={{zIndex:1}}
                  renderTextInput={()=> (
                    <View style={{flex:1, justifyContent:'center'}}>
                      <Text style={styles.FormTitle}> הכנס שם רחוב </Text>
                      <TextInput
                        style={styles.TextInputStyle}
                        onChangeText={text => this.setState({ strQuery: text})}
                        value={this.state.query}
                      />
                    </View>
                  )}
                  renderItem={({ item, i }) => (
                    <TouchableOpacity key={item} onPress={() => {this.setState({ strQuery: item }); this.props.navigation.navigate('MapByAddress', {street: item, city: this.state.cityName})}}>
                      <Text style={styles.itemText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item, i) => item}
                />
            </View>
          </ImageBackground>
        </View>      
    )
  }
}

function stringStartsWith(checkedString, startString) {
  if(checkedString === '' || startString === '') return;
  var x;
  for(x=0; x<startString.length; x++){
    if(startString.charAt(x) !== checkedString.charAt(x)){
      return false;
    }

  }
  return true;
}

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
  },
  TextInputStyle: {
    color: 'white',
    fontFamily: "SF-Pro-Text-Bold",
    borderRadius: 15,
    fontSize: 18,
    backgroundColor: 'rgba(255,255,255,0.3)',
    padding:10,
    height: 50
  },
  FormContainer: {
    flex: 1,
    backgroundColor: 'rgba(200,200,200,0.3)',
    borderRadius: 30,
    borderWidth: 0,
    margin: 10,
    zIndex: 1,
    overflow: 'hidden',
    padding: 15,
  },
  FormTitle: {
    fontFamily: "SF-Pro-Text-Regular",
    fontSize: 20,
    color: '#ffffff',
    alignSelf: 'center'
  },
  ListContainer: {
    flex:5,
    backgroundColor: 'rgba(200,200,200,0.3)',
    borderRadius: 30,
    borderWidth: 0,
    margin: 10,
    zIndex: 1,
    overflow: 'hidden',
    paddingTop: 10,
  },
  ListStyle: {
    flex:1,
    backgroundColor: 'rgba(255,255,255,0)',
    borderWidth: 0,
  },
  bg: {
    flex: 1,
    resizeMode: "cover",
    backgroundColor:'rgba(0,20,100,0.7)',
    flexDirection: 'column',
    paddingTop: '15%',
    paddingBottom: '10%'
  },
  itemText: {
    fontSize: 15,
    margin: 10,
    color: 'white',
    fontSize: 20,
  },
  bg1: {
    flex: 1,
    resizeMode: "cover",
  },

});