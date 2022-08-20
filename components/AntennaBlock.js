/*
 * AntennaBlock is rendered for each antenna located near the user.
 * Information displayed: 1)Cellular Provider
 *                        2)Antenna's addresss
 *                        3)Distance between antenna's location and user
 *
 * @author [Alon Barenboim](https://github.com/alonilk2)
 * @version 1.0.0
 */
import React from 'react'
import { Text, View } from 'react-native'
import { styles } from './styles/AntennaBlockStyle'
import CompanyLogo from './utils/CompanyLogoProvider'
const w = '15%'

const AntennaBlock = props => {
  let obj = props.fields
  let dist = props.dis - (props.dis % 1)
  let three = 0,
    four = 0,
    five = 0
  let broadcastTech = obj[18].Value
  broadcastTech = broadcastTech.split(' ')
  for (var i = 0; i < broadcastTech.length; i++) {
    if (broadcastTech[i] == '3') three = 1
    if (broadcastTech[i] == '4') four = 1
    if (broadcastTech[i] == '5') five = 1
  }
  return (
    <View style={styles.Body}>
      <View
        style={{
          flexDirection: 'row',
          flex: 2,
          justifyContent: 'flex-start',
          margin: 10,
          alignItems: 'center',
        }}>
        <View style={styles.techContainer}>
          {three == 1 ? (
            <Text style={styles.techtxtOn}> 3G </Text>
          ) : (
            <Text style={styles.techtxtOff}> 3G </Text>
          )}
          {four == 1 ? (
            <Text style={styles.techtxtOn}> 4G </Text>
          ) : (
            <Text style={styles.techtxtOff}> 4G </Text>
          )}
          {five == 1 ? (
            <Text style={styles.techtxtOn}> 5G </Text>
          ) : (
            <Text style={styles.techtxtOff}> 5G </Text>
          )}
        </View>
      </View>
      <View style={styles.mainContainer}>
        <View style={styles.Container}>
          <View style={styles.addr}>
            <Text>
              {obj[0].FieldName}: {obj[0].Value}
            </Text>
            <Text>
              {obj[2].FieldName}: {obj[2].Value}
            </Text>
            <Text style={{ color: 'black', flexWrap: 'wrap', flex: 1 }}>
              {obj[3].FieldName}: {obj[3].Value}
            </Text>
            <Text style={{ color: 'red', fontWeight: 'bold' }}>
              מרחק מהאנטנה: {dist}m
            </Text>
          </View>
          <View style={{ width: 80 }}>{CompanyLogo(obj)}</View>
        </View>
      </View>
    </View>
  )
}

export default AntennaBlock
