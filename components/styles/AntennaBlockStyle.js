import React from "react";
import {
  StyleSheet,
} from 'react-native';


const styles = StyleSheet.create({
  Container: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 10,
    overflow: 'hidden'
  }, 
  infoContainer: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,1)',
    marginTop: '10%',
    marginBottom: '10%',
    padding: 20,
    borderRadius: 20,
    marginRight: '5%',
    marginLeft: '5%',
    elevation: 15,
    alignItems: 'center',
  },
  mainContainer: {
    flexDirection: 'column',
    flex: 9
  },
  Body: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  addr: {
    flexDirection: 'column',
    marginRight: 25,
    marginTop: 5
  },
  logo: {
    flex:1,
    height: null,
    resizeMode: 'contain',
    width: null
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
    borderRadius: 50,
    margin: 5,
    padding: 5,
    borderColor: '#b3b3b3',
    borderWidth: 2
  },

});

export {styles}