import React, {Component} from 'react'
import {
  View,
  Image,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Text,
  TextInput,
  NativeModules,
} from 'react-native'
import axios from 'axios'
import Autocomplete from 'react-native-autocomplete-input'
import Global from './Global.js'
import {styles} from './styles/AddressStyle'
import * as Utils from './utils/Utils'

const {AdmobInitiator} = NativeModules

export class StreetInput extends Component {
  constructor (props) {
    super(props)
    this.state = {
      counterStr: 0,
      streetsObj: '',
      lastResultStr: '',
      strQuery: 'שם הרחוב',
      cityName: props.route.params.item,
      loaded: false,
    }
    this.handleCityClick(this.props.route.params.item)
  }
  async handleCityClick (name) {
    do {
      await axios
        .get(
          `https://data.gov.il/api/3/action/datastore_search?offset=${this.state.counterStr}&q={"שם_ישוב":"${name}"}&resource_id=9ad3862c-8391-4b2f-84a4-2d4c68625f4b`,
        )
        .then(res => {
          this.state.streetsObj.length === 0
            ? this.setState({streetsObj: res.data.result.records})
            : this.setState({
                streetsObj: this.state.streetsObj.concat(
                  res.data.result.records,
                ),
              })
          this.setState({
            lastResultStr: res.data.result.records.length,
            counterStr: this.state.counterStr + 100,
          })
        })
        .catch(err => console.log('street error:' + err))
    } while (this.state.lastResultStr === 100)
  }
  render () {
    return (
      <View style={styles.MainContainer}>
        <ImageBackground
          source={{uri:'https://alonilk2.github.io/map1/bg.jpg'}}
          style={styles.bg1}>
          <View style={styles.bg}>
            <Autocomplete
              autoCapitalize='none'
              autoCorrect={false}
              placeholder='Enter Street Name'
              data={Utils.FilterByName(this.state.streetsObj,this.state.strQuery,'שם_רחוב')}
              value={this.state.strQuery}
              listStyle={styles.ListStyle}
              listContainerStyle={styles.ListContainer}
              inputContainerStyle={styles.FormContainer}
              containerStyle={{zIndex: 1}}
              renderTextInput={() => (
                <View style={{flex: 1, justifyContent: 'center'}}>
                  <Text style={styles.FormTitle}> הכנס את שם הרחוב </Text>
                  <TextInput
                    style={styles.TextInputStyle}
                    onChangeText={text => this.setState({strQuery: text})}
                    value={this.state.strQuery}
                    onFocus={() => {
                      if (this.state.strQuery === 'שם הרחוב')
                        this.setState({strQuery: ''})
                    }}
                  />
                </View>
              )}
              renderItem={({item, i}) => (
                <TouchableOpacity
                  key={item}
                  onPress={() => {
                    this.setState({strQuery: item})
                    AdmobInitiator.showAd()
                    this.props.navigation.navigate('ResultsByAddress', {
                      street: item,
                      city: this.state.cityName,
                    })
                  }}>
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
