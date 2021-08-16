 /*
  * AntennaBlock is rendered for each antenna located near the user.
  * Information displayed: 1)Cellular Provider
  *                        2)Antenna's addresss
  *                        3)Distance between antenna's location and user
  *
  * @author [Alon Barenboim](https://github.com/alonilk2)
  * @version 1.0.0
  */



import React from "react";
import { StyleSheet, View, Text, Image, Pressable } from 'react-native';
import Animation from './Animation';
import CompanyLogo from './CompanyLogo';
const w = '15%';
const AntennaBlock = (props) => {
    let obj = props.fields;
    let dist = props.dis-(props.dis%1);
    let three = 0, four = 0 , five = 0;
    let broadcastTech = obj[18].Value;
    broadcastTech = broadcastTech.split(" ");
    for(var i = 0; i < broadcastTech.length; i++){
      if(broadcastTech[i] == "3") three=1;
      if(broadcastTech[i] == "4") four=1;
      if(broadcastTech[i] == "5") five=1;
    }
    return (
          <View style={styles.Body}>
            <View style={{flexDirection: 'row', flex: 2, justifyContent: 'flex-start', margin: 10, alignItems: 'center'}}>

                <View style={styles.techContainer}>
                  {three==1 ? <Text style={styles.techtxtOn}> 3G </Text> : <Text style={styles.techtxtOff}> 3G </Text>}
                  {four==1 ? <Text style={styles.techtxtOn}> 4G </Text> : <Text style={styles.techtxtOff}> 4G </Text>}
                  {five==1 ? <Text style={styles.techtxtOn}> 5G </Text> : <Text style={styles.techtxtOff}> 5G </Text>}
                </View>
            </View>
            <View style={styles.mainContainer}>
              <View style={styles.Container}>
                  <View style={styles.addr}>                
                      <Text>{obj[0].FieldName}: {obj[0].Value}</Text>             
                      <Text>{obj[2].FieldName}: {obj[2].Value}</Text>
                      <Text style={{color: 'black', flexWrap: 'wrap', flex:1}}>{obj[3].FieldName}: {obj[3].Value}</Text>
                      <Text style={{color: 'red', fontWeight: 'bold'}}>מרחק מהאנטנה: {dist}m</Text>
                  </View>
                  <View style={{width: 80}}>
                      {CompanyLogo(obj)}
                  </View>

              </View>                                                    

            </View>
          </View>
      );     
    
}

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
export default AntennaBlock;

