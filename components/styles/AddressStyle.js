import React from "react";
import {
  StyleSheet,
} from 'react-native';

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
    height: 50,
    zIndex:1
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
    fontSize: 25,
    color: '#ffffff',
    alignSelf: 'center',
    marginBottom: 5,
    zIndex: 5
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
    backgroundColor:'rgba(0,20,100,0.3)',
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

export {styles}