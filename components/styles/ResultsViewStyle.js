import React from "react";
import {
  StyleSheet,
} from 'react-native';


const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: 'white',
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
    overflow: 'hidden',
  },
  bottomBorder: {
    marginTop: 4,
    borderBottomWidth: 1,
    borderColor: '#e6e6e6',
  },
  Header: {
    flex: 3,
    backgroundColor: '#02316e',
    padding: 10,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: 'black',
    shadowOpacity: 1,
    elevation: 20,
    paddingTop: '8%'
  },
  Body: {
    flex: 4,
  },
  Paragraph: {
    fontSize: 34,
    fontWeight: 'bold',
    color: 'white',
    
  },
  SmallText: {
    fontSize: 16,
    marginTop: '3%',
    color: 'rgba(255,255,255,0.9)'
  },
});

export { styles };