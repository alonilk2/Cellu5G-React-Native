import React from 'react'

import PermissionsAndroid from 'react-native'
export const Sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms))
}
export function isStringStartsWithSubString (checkedString, startString) {
  if (checkedString === '' || startString === '') return
  var x
  for (x = 0; x < startString.length; x++) {
    if (startString.charAt(x) !== checkedString.charAt(x)) {
      return false
    }
  }
  return true
}

export const jsCode = (posX, posY, radius) => {
    return (
        `x1=`+posX+`; y1=`+posY+`;
        var params = {
            LayerName: 'cell_active',
            Point: {x: x1, y: y1},
            Radius:`+radius+`,
            zoomButtons:false

        };
        var win = window.ReactNativeWebView;
        govmap.getLayerData(params).then(function(response){
            win.postMessage(JSON.stringify(response.data));
        });  
        govmap.zoomToXY({ x:`+posX+`, y: `+posY+`, level:6, marker:true });
        var res = "";`
        )
}; 
export const filterAntenna = tech => {
  let parsed = tech.split(' ')
  let answer = [0, 0, 0]
  for (var i = 0; i < parsed.length; i++) {
    if (parsed[i] == '3') answer[0] = 1
    if (parsed[i] == '4') answer[1] = 1
    if (parsed[i] == '5') answer[2] = 1
  }
  return answer
}
