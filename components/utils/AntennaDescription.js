import {styles} from '../styles/Default'
import React, {Component, useState} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
  Image,
} from 'react-native'
import FontAwesome from 'react-native-vector-icons/Ionicons'
import Animation from '../Animation'

const AntennaDescription = props => {
  let ref = props.reference
  let antenna = ref.state.chosenAntenna,
    broadcastTech = antenna[18].Value,
    techFlag = new Array(3).fill(0)
  broadcastTech = broadcastTech.split(' ')

  for (var i = 0; i < broadcastTech.length; i++) {
    if (broadcastTech[i] == '3') techFlag[0] = 1
    if (broadcastTech[i] == '4') techFlag[1] = 1
    if (broadcastTech[i] == '5') techFlag[2] = 1
  }

  return (
    <Animation
      style={{
        height: '100%',
        width: '100%',
        position: 'absolute',
        zIndex: 5,
        elevation: 30,
      }}
      animationState={ref.state.antennaDescription ? 0 : 1}
      page={this}>
      <ScrollView style={styles.infoContainer}>
        <Pressable
          onPress={e => {
            ref.CloseAntennaDescription()
          }}>
          <FontAwesome name={'arrow-back-outline'} size={30} />
        </Pressable>
        <View style={{alignItems: 'center'}}>
          <Image
            source={{uri: 'https://alonilk2.github.io/map1/logo.png'}}
            style={{width: 100, height: 100, marginTop: '3%'}}
          />
          <View style={styles.techContainer}>
            {techFlag[0] == 1 ? (
              <Text style={styles.techtxtOn}> 3G </Text>
            ) : (
              <Text style={styles.techtxtOff}> 3G </Text>
            )}
            {techFlag[1] == 1 ? (
              <Text style={styles.techtxtOn}> 4G </Text>
            ) : (
              <Text style={styles.techtxtOff}> 4G </Text>
            )}
            {techFlag[2] == 1 ? (
              <Text style={styles.techtxtOn}> 5G </Text>
            ) : (
              <Text style={styles.techtxtOff}> 5G </Text>
            )}
          </View>
          <Text style={styles.textInfo}>
            {antenna.map(item => (
              <Text key={item.FieldName} style={styles.textInfo}>
                {item.FieldName}: {item.Value}
                {'\n'}
              </Text>
            ))}
          </Text>
        </View>
      </ScrollView>
    </Animation>
  )
}

export default AntennaDescription
