import React from 'react';
import Hello from './components/Hello'
import ByLocation from './components/ByLocation';
import MapByAddress from './components/MapByAddress';
import {ByAddress, StreetList} from './components/ByAddress';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MapView from './components/MapView';
export default class App extends React.Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false
          }}>
          <Stack.Screen name="Home" component={Hello} />
          <Stack.Screen name="Location" component={ByLocation} />
          <Stack.Screen name="MapView" component={MapView} />
          <Stack.Screen name="ByAddress" component={ByAddress} />
          <Stack.Screen name="StreetList" component={StreetList} />
          <Stack.Screen name="MapByAddress" component={MapByAddress} />
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
}

const Stack = createStackNavigator();


