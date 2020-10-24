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
const AntennaBlock = (props) => {
    let obj = props.fields;
    let dist = props.dis;
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
        <View style={styles.Container}>
            <View style={styles.addr}>                
                <Text>{obj[0].FieldName}: {obj[0].Value}</Text>             
                <Text>{obj[2].FieldName}: {obj[2].Value}</Text>
                <Text style={{color: 'black'}}>{obj[3].FieldName}: {obj[3].Value}</Text>
                <Text style={{color: 'red', fontWeight: 'bold'}}>מרחק מהאנטנה: {dist}</Text>
            </View>
            <View style={{width: 80}}>
                {companyLogo()}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
  Container: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderColor: '#e6e6e6',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 15,
  }, 
  addr: {
    flexDirection: 'column',
    marginRight: 25,
    marginTop: 10
  },
  logo: {
    flex:1,
    height: null,
    resizeMode: 'contain',
    width: null
  }
});
export default AntennaBlock;

