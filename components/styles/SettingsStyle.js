import React from "react";
import {
  StyleSheet,
} from 'react-native';

const styles = StyleSheet.create({
  SettingsText: {
    fontFamily: "SF-Pro-Text-Bold",
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
    margin: 5
  },
  settings: {
    flex: 4,
    flexDirection: 'column',
  },
   BtnStyle1: { 
    borderRadius: 50,
    borderColor:  'black',
    borderWidth: 2,
    color: 'black',
    backgroundColor: 'transparent',
    height: 50,
    margin: 20,
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
    txtBtn1: {
    fontFamily: "SF-Pro-Text-Bold",
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold'
  },
  SettingsTitle: {
    fontFamily: "SF-Pro-Text-Bold",
    fontSize: 27,
    textAlign: 'center',
    marginTop: 5,
    color: 'black'
  },
    bottomBorder: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderColor: '#e6e6e6',
  },
});

export {styles}