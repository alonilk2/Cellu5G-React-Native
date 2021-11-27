/*
 * AntennaBlock is rendered for each antenna located near the user.
 * Information displayed: 1)Cellular Provider
 *                        2)Antenna's addresss
 *                        3)Distance between antenna's location and user
 *
 * @author [Alon Barenboim](https://github.com/alonilk2)
 * @version 1.0.0
 */

import React, {Component, useState} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Image,
  Switch,
  Pressable,
  ScrollView,
} from 'react-native'
import Animation from './Animation'
import Global from './Global.js'
import Slider from '@react-native-community/slider'
import {styles} from './styles/SettingsStyle'
const Settings = props => {
  const [distance, setDistance] = useState(1500)
  return (
    <Animation style={styles.settings}>
      <ScrollView>
        <Text style={styles.SettingsTitle}>הגדרות</Text>
        <Text style={styles.SettingsText}>רדיוס חיפוש:</Text>
        <View style={styles.bottomBorder} />
        <View
          style={{
            justifyContent: 'center',
            flexDirection: 'row',
            marginBottom: 15,
          }}>
          <Slider
            style={{margin: 15, minWidth: 200}}
            minimumValue={500}
            maximumValue={4000}
            step={100}
            minimumTrackTintColor='#ff6363'
            maximumTrackTintColor='#145ab5'
            value={Global.radius}
            onValueChange={num => {
              Global.radius = num
              setDistance(num)
            }}
          />
          <Text style={styles.SettingsText}> {distance}m </Text>
        </View>
        <Text style={styles.SettingsText}>הצג אנטנות שמשדרות:</Text>
        <View style={styles.bottomBorder} />

        <View style={{flexDirection: 'row', justifyContent: 'center', flex: 3}}>
          <View style={{margin: 10, marginTop: 0}}>
            <Text
              style={{
                fontFamily: 'SF-Pro-Text-Bold',
                fontSize: 25,
                fontWeight: 'bold',
              }}>
              {' '}
              3G{' '}
            </Text>
            <Switch
              trackColor={{false: '#767577', true: '#81b0ff'}}
              thumbColor={Global.g3Toggle ? '#00bd19' : '#a6a6a6'}
              ios_backgroundColor='#3e3e3e'
              value={Global.g3Toggle}
              onValueChange={
                Global.g3Toggle
                  ? () => {
                      Global.g3Toggle = false
                      props.page.forceUpdate()
                    }
                  : () => {
                      Global.g3Toggle = true
                      props.page.forceUpdate()
                    }
              }
            />
          </View>
          <View style={{margin: 10, marginTop: 0}}>
            <Text
              style={{
                fontFamily: 'SF-Pro-Text-Bold',
                fontSize: 25,
                fontWeight: 'bold',
              }}>
              {' '}
              4G{' '}
            </Text>
            <Switch
              trackColor={{false: '#767577', true: '#81b0ff'}}
              thumbColor={Global.g4Toggle ? '#00bd19' : '#a6a6a6'}
              ios_backgroundColor='#3e3e3e'
              value={Global.g4Toggle}
              onValueChange={
                Global.g4Toggle
                  ? () => {
                      Global.g4Toggle = false
                      props.page.forceUpdate()
                    }
                  : () => {
                      Global.g4Toggle = true
                      props.page.forceUpdate()
                    }
              }
            />
          </View>
          <View style={{margin: 10, marginTop: 0}}>
            <Text
              style={{
                fontFamily: 'SF-Pro-Text-Bold',
                fontSize: 25,
                fontWeight: 'bold',
              }}>
              {' '}
              5G{' '}
            </Text>
            <Switch
              trackColor={{false: '#767577', true: '#81b0ff'}}
              thumbColor={Global.g5Toggle ? '#00bd19' : '#a6a6a6'}
              ios_backgroundColor='#3e3e3e'
              value={Global.g5Toggle}
              onValueChange={
                Global.g5Toggle
                  ? () => {
                      Global.g5Toggle = false
                      props.page.forceUpdate()
                    }
                  : () => {
                      Global.g5Toggle = true
                      props.page.forceUpdate()
                    }
              }
            />
          </View>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'center', flex: 3}}>
          <Pressable
            onPress={e => {
              Global.settingsWindow = false
              props.reRenderPage()
            }}
            style={styles.BtnStyle1}>
            <Text style={styles.txtBtn1}>שמירה</Text>
          </Pressable>
        </View>
      </ScrollView>
    </Animation>
  )
}

export default Settings
