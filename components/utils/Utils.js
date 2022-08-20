import Global from '../Global.js';

export const Sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

function isStringStartsWithSubString(checkedString, startString) {
  if (checkedString === '' || startString === '') return;
  for (let x = 0; x < startString.length; x++) {
    if (startString.charAt(x) !== checkedString.charAt(x)) {
      return false;
    }
  }
  return true;
}

export const jsCode = (posX, posY, radius) => {
  return (
    `x1=` +
    posX +
    `; y1=` +
    posY +
    `;
        var params = {
            LayerName: 'cell_active',
            Point: {x: x1, y: y1},
            Radius:` +
    radius +
    `,
            zoomButtons:false

        };
        var win = window.ReactNativeWebView;
        govmap.getLayerData(params).then(function(response){
            win.postMessage(JSON.stringify(response.data));
        });  
        govmap.zoomToXY({ x:` +
    posX +
    `, y: ` +
    posY +
    `, level:6, marker:true });
        var res = "";`
  );
};

const parseAntennaTechString = (tech) => {
  let parsed = tech.split(' ');
  let answer = [0, 0, 0];
  for (var i = 0; i < parsed.length; i++) {
    if (parsed[i] == '3') answer[0] = 1;
    if (parsed[i] == '4') answer[1] = 1;
    if (parsed[i] == '5') answer[2] = 1;
  }
  return answer;
};
/**
 * FilterByName gets strArray which is an array of city\street names,
 * filters the names which are not starting with 'name' string, and returns
 * the filtered array.
 *
 * @param {array} strArray - Array of names as strings.
 * @param {string} name - The name to filter the array according to.
 * @param {string} param - 'שם_ישוב'\'שם_רחוב'
 * @author Alon Barenboim
 */
export function FilterByName(strArray, name, param) {
  if (name === '') return [];
  var filteredArray = [];
  for (str of strArray) {
    let nameType = param === 'שם_ישוב' ? str.שם_ישוב : str.שם_רחוב;
    if (nameType && isStringStartsWithSubString(nameType, name)) {
      filteredArray.push(nameType);
    }
  }
  return filteredArray;
}

/**
 * Any city name from DATA.CO.IL Gov api is 50 characters long, filled with name string and space chars.
 * cutSpacesFromString removes unwanted space chars from the end of the city name string.
 *
 * @param e A nativeEvent contains list of antennas sent from WebView.
 * @author [Alon Barenboim]
 */
export function cutSpacesFromString(Name) {
  for (let x = Name.length - 1; x > 0; x--) {
    if (Name.charAt(x) === ' ') continue;
    else {
      let temp = Name.substring(0, x + 1);
      return temp;
    }
  }
}

/**
 * FilterAntennasByTech gets an array of antennas,
 * and returns a technology-specific antenna's filtered array
 *
 * @param data Antennas array
 * @author [Alon Barenboim]
 */
export function FilterAntennasByTech(data) {
  let counter = 0,
    FilteredList = [];
  for (let x = 0; x < data.length; x++) {
    let bcastTechFlagArr = parseAntennaTechString(data[x].Fields[18].Value);
    if (
      (Global.g5Toggle && bcastTechFlagArr[2]) ||
      (Global.g4Toggle && bcastTechFlagArr[1]) ||
      (Global.g3Toggle && bcastTechFlagArr[0]) ||
      (Global.g4Toggle && Global.g3Toggle && Global.g5Toggle)
    ) {
      FilteredList[counter] = data[x];
      counter++;
    }
  }
  return FilteredList;
}
/**
 * SortAntennasByDistance gets an array of antennas,
 * and returns it as a sorted array according to distance.
 *
 * @param data Antenna's array
 * @author [Alon Barenboim]
 */
export function SortAntennasByDistance(data) {
  for (let x = 0; x < data.length - 1; x++) {
    let tempMinDistanceIdx = x;
    for (let y = x + 1; y < data.length; y++)
      if (
        parseInt(data[y].distance) < parseInt(data[tempMinDistanceIdx].distance)
      )
        tempMinDistanceIdx = y;
    let tempEntry = data[x];
    data[x] = data[tempMinDistanceIdx];
    data[tempMinDistanceIdx] = tempEntry;
  }
  return data;
}
