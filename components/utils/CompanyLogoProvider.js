import React from 'react'
import {Image, StyleSheet} from 'react-native'


/**
 * companyLogo recieves antenna object, and returns the logo
 * of the specific antenna's operator
 * 
 * @param obj-Antenna Object
 * @author Alon Barenboim
 */
export default companyLogo = obj => {
  switch (obj[0].Value) {
    case 'סלקום':
      return (
        <Image
          style={styles.logo}
          source={{uri:'https://alonilk2.github.io/map1/cell_logo.png'}}
        />
      )
      break
    case 'פלאפון':
      return (
        <Image
          style={styles.logo}
          source={{uri:'https://alonilk2.github.io/map1/pel_logo.png'}}
        />
      )
      break
    case 'PHI (משרת את הוט ופרטנר)':
      return (
        <Image
          style={styles.logo}
          source={{uri:'https://alonilk2.github.io/map1/par_logo.png'}}
        />
      )
      break
  }
}
const styles = StyleSheet.create({
  logo: {
    flex: 1,
    height: null,
    resizeMode: 'contain',
    width: null,
  },
})
