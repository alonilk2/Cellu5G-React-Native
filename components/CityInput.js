 /*
  * @author [Alon Barenboim](https://github.com/alonilk2)
  * @version 4.0.0
  */


import React, {Component} from 'react';
import {View, Image, StyleSheet, ImageBackground, TouchableOpacity, Text, TextInput, NativeModules} from 'react-native';
import axios from 'axios';
import Autocomplete from 'react-native-autocomplete-input';
import Global from './Global.js'
import * as Utils from './utils/Utils'
import {styles} from './styles/AddressStyle'

export class CityInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            citiesObj: [],
            query:'שם הישוב',
            lastResult: '',
            counter: 0,
            cityFlag: false
        }
    }
    async componentDidMount() {
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
        if(Utils.isStringStartsWithSubString(name, str) && city.שם_ישוב){
          citiesNamesArr.push(city.שם_ישוב)
        }
      }
      return citiesNamesArr;
    }
    handleListItemClick(item) {
      let newItem = this.cutSpacesFromString(item)
      this.setState({query: newItem});
      this.props.navigation.navigate('StreetInput', {item: newItem})
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
                      <Text style={styles.FormTitle}> הכנס את שם הישוב </Text>
                      <TextInput
                        style={styles.TextInputStyle}
                        onChangeText={text => {this.setState({ query: text, cityFlag: false });}}
                        value={this.state.query}
                        onFocus= {() => {if(this.state.query === "שם הישוב") this.setState({query : ''})}}
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





