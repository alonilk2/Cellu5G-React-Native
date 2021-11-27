import React from "react";
import {
  StyleSheet,
} from 'react-native';

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    zIndex: 1,
  },
  infoContainer: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,1)',
    marginTop: '10%',
    marginBottom: '10%',
    padding: 20,
    borderRadius: 20,
    elevation: 15,
  },
  bg: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  bg1: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  abdev: {
    marginTop: '15%',
    width: '40%',
    height: undefined,
    aspectRatio: 2
  },
  info: {
    width: '100%',
    height: '100%', 
  },
  techtxtOff: {
    fontSize: 17,
    color: 'grey',
  },
  techtxtOn: {
    fontSize: 17,
    color: 'green',
    fontWeight: 'bold'
  },
  techContainer: {
    justifyContent: 'center',
    alignItems:'center',
    flexDirection: 'row',
    borderRadius: 50,
    borderColor: '#b3b3b3',
    borderWidth: 2,
    margin: 5,
    padding: 5
  },
  textInfoBold: {
    fontFamily: "SF-Pro-Text-Bold",
    fontSize: 30,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textInfo: {
    fontFamily: "SF-Pro-Text-Regular",
    fontSize: 18,
    color: 'black',
    textAlign: 'center',
  },
  loadingtext: {
    fontFamily: "SF-Pro-Text-Bold",
    fontSize: 20,
    color: 'white',
    transform: [{translateY: -80}],
  },
  BtnStyle: { 
    borderRadius: 50,
    color: 'black',
    backgroundColor: 'white',
    width: '47%',
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5
  },
  BtnStyleEmail: { 
    borderRadius: 50,
    color: 'white',
    backgroundColor: '#ff6600',
    width: '90%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  BtnStyleAddr: {   
    borderRadius: 50,
    borderColor:  '#ff6600',
    borderWidth: 2,
    color: 'black',
    backgroundColor: 'transparent',
    width: '47%',
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5
  },
  txtBtn: {
    fontSize: 22,
    color: '#ff6600',
    fontWeight: 'bold'
  },
  txtBtnAddr: {
    fontSize: 22,
    color: 'white',
    fontWeight: 'bold'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
});

export { styles };