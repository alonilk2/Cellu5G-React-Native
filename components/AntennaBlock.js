 /*
  * AntennaBlock is rendered for each antenna located near the user.
  * Information displayed: 1)Cellular Provider
  *                        2)Antenna's addresss
  *                        3)Distance between antenna's location and user
  *
  * @author [Alon Barenboim](https://github.com/alonilk2)
  * @version 1.0.0
  */



import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
const w = '15%';
const AntennaBlock = (props) => {
    let obj = props.fields;
    let dist = props.dis-(props.dis%1);
    var three, four, five;
    let broadcastTech = obj[18].Value;
    broadcastTech = broadcastTech.split(" ");
    for(var i = 0; i < broadcastTech.length; i++){
      if(broadcastTech[i] == "3") three=1;
      if(broadcastTech[i] == "4") four=1;
      if(broadcastTech[i] == "5") five=1;
    }
    const companyLogo = () => {
        switch(obj[0].Value) {
            case "סלקום": 
                return (<Image style={styles.logo} source={require('../images/cell_logo.png')} />);
                break;
            case "פלאפון":
                return (<Image style={styles.logo} source={require('../images/pel_logo.png')} />);
                break;
            case "PHI (משרת את הוט ופרטנר)":
                return (<Image style={styles.logo} source={require('../images/par_logo.png')} />);
                break;
        }
    }
    return (
        <View style={styles.mainContainer}>
          <View style={styles.Container}>
            <View style={styles.addr}>                
                <Text>{obj[0].FieldName}: {obj[0].Value}</Text>             
                <Text>{obj[2].FieldName}: {obj[2].Value}</Text>
                <Text style={{color: 'black', flexWrap: 'wrap', flex:1}}>{obj[3].FieldName}: {obj[3].Value}</Text>
                <Text style={{color: 'red', fontWeight: 'bold'}}>מרחק מהאנטנה: {dist}m</Text>
            </View>
            <View style={{width: 80}}>
                {companyLogo()}
            </View>
          </View>
          <View style={styles.techContainer}>
            {three==1 ? <Text style={styles.techtxtOn}> 3G </Text> : <Text style={styles.techtxtOff}> 3G </Text>}
            {four==1 ? <Text style={styles.techtxtOn}> 4G </Text> : <Text style={styles.techtxtOff}> 4G </Text>}
            {five==1 ? <Text style={styles.techtxtOn}> 5G </Text> : <Text style={styles.techtxtOff}> 5G </Text>}
          </View>
        </View>
    );
}

const styles = StyleSheet.create({
  Container: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flex:10,
    padding: 10
  }, 
  mainContainer: {
    flexDirection: 'column'
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
    flex:1,
    justifyContent: 'center',
    alignItems:'center',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#e6e6e6',

  }
});
export default AntennaBlock;

