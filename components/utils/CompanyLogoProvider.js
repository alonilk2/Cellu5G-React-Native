import React from 'react'
import {Image, StyleSheet} from 'react-native'

export default companyLogo = obj => {
  switch (obj[0].Value) {
    case 'סלקום':
      return (
        <Image
          style={styles.logo}
          source={require('../../images/cell_logo.png')}
        />
      )
      break
    case 'פלאפון':
      return (
        <Image style={styles.logo} source={require('../../images/pel_logo.png')} />
      )
      break
    case 'PHI (משרת את הוט ופרטנר)':
      return (
        <Image style={styles.logo} source={require('../../images/par_logo.png')} />
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
