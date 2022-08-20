/*
 * @author [Alon Barenboim](https://github.com/alonilk2)
 * @version 4.0.0
 */

import axios from 'axios'
import React, { Component } from 'react'
import {
  ImageBackground, Text,
  TextInput, TouchableOpacity, View
} from 'react-native'
import Autocomplete from 'react-native-autocomplete-input'
import { styles } from './styles/AddressStyle'
import * as Utils from './utils/Utils'

export class CityInput extends Component {
  constructor(props) {
    super(props)
    this.state = {
      citiesObj: [],
      query: 'שם הישוב',
      lastResult: '',
      counter: 0,
      cityFlag: false,
    }
  }
  async componentDidMount() {
    do {
      let url = `https://data.gov.il/api/3/action/datastore_search?offset=${this.state.counter}&resource_id=5c78e9fa-c2e2-4771-93ff-7f400a12f7ba`
      await axios
        .get(url)
        .then(res => {
          if (this.state.citiesObj.length === 0) {
            this.setState({ citiesObj: res.data.result.records })
          } else {
            this.setState({
              citiesObj: this.state.citiesObj.concat(res.data.result.records),
            })
          }
          this.setState({
            lastResult: res.data.result.records.length,
            counter: this.state.counter + 100,
          })
        })
        .catch(err => {
          console.log('city error:' + err)
        })
    } while (this.state.lastResult === 100)
  }

  handleListItemClick(item) {
    let newItem = Utils.cutSpacesFromString(item)
    this.setState({ query: newItem })
    this.props.navigation.navigate('StreetInput', { item: newItem })
  }

  render() {
    return (
      <View style={styles.MainContainer}>
        <ImageBackground
          source={{ uri: 'https://alonilk2.github.io/map1/bg.jpg' }}
          style={styles.bg1}>
          <View style={styles.bg}>
            <Autocomplete
              placeholder='Enter City Name'
              data={Utils.FilterByName(
                this.state.citiesObj,
                this.state.query,
                'שם_ישוב',
              )}
              listStyle={styles.ListStyle}
              listContainerStyle={styles.ListContainer}
              inputContainerStyle={styles.FormContainer}
              containerStyle={{ zIndex: 1 }}
              renderTextInput={() => (
                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <Text style={styles.FormTitle}> הכנס את שם הישוב </Text>
                  <TextInput
                    style={styles.TextInputStyle}
                    onChangeText={text => {
                      this.setState({ query: text, cityFlag: false })
                    }}
                    value={this.state.query}
                    onFocus={() => {
                      if (this.state.query === 'שם הישוב')
                        this.setState({ query: '' })
                    }}
                  />
                </View>
              )}
              renderItem={({ item, i }) => (
                <TouchableOpacity
                  key={item}
                  onPress={() => {
                    this.handleListItemClick(item)
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
