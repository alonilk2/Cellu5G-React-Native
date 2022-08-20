import proj4 from 'proj4'
import Geocode from 'react-geocode'
import * as Const from './Constants'

export function getGeolocation(street, city) {
  Geocode.setApiKey('AIzaSyCtP-auXe-kPUJMvxOZxiDACspzitfnlFo')
  Geocode.setLanguage('he')
  Geocode.setRegion('il')
  Geocode.enableDebug()
  let fullAddress = street + ', ' + city
  return new Promise((resolve, reject) => {
    Geocode.fromAddress(fullAddress)
      .then(response => {
        const { lat, lng } = response.results[0].geometry.location
        resolve(proj4(Const.Projection, [lng, lat]))
      })
      .catch(error => reject(console.error(error)))
  })
}
