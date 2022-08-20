import React from 'react'
import {
  Image, Linking, Pressable, ScrollView, Text, View
} from 'react-native'
import FontAwesome from 'react-native-vector-icons/Ionicons'
import Animation from '../Animation'
import { styles } from '../styles/Default'

const InfoWindow = props => {
  return (
    <Animation
      style={{
        height: '100%',
        width: '100%',
        position: 'absolute',
        zIndex: 5,
        elevation: 30,
      }}
      animationState={props.infoWindow ? 0 : 1}
      page={this}>
      <View style={styles.infoContainer}>
        <Pressable onPress={e => props.CloseInfoWindow()}>
          <FontAwesome name={'arrow-back-outline'} size={30} />
        </Pressable>
        <ScrollView>
          <View
            style={{
              alignItems: 'center',
            }}>
            <Image
              source={{ uri: 'https://alonilk2.github.io/map1/logo.png' }}
              style={{
                width: 150,
                height: 150,
                marginTop: '1%',
              }}
            />
            <Text style={styles.textInfoBold}>Cellu App</Text>
            <Text style={styles.textInfo}>
              {`Version: 4.1
              
המידע המוצג באפליקציה זו נאסף 
מתוך מאגרי המידע של 

govmap.gov.il & data.gov.il

ואין מפתחי האפליקציה אחראיים על
נכונות ועדכניות המידע המוצג מהם למשתמש.
`}
            </Text>
            <Pressable
              onPress={e => Linking.openURL('mailto:alonilk2@gmail.com')}
              style={styles.BtnStyleEmail}>
              <Text style={styles.txtBtnAddr}>Email Me</Text>
            </Pressable>
            <Pressable
              onPress={e => Linking.openURL('mailto:alonilk2@gmail.com')}>
              <Image
                source={{ uri: 'https://alonilk2.github.io/map1/abdev.png' }}
                style={styles.abdev}
              />
            </Pressable>

          </View>
        </ScrollView>
      </View>
    </Animation>
  )
}
export default InfoWindow
