import React from "react";
import {
  ImageBackground, StatusBar, Text, View
} from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { styles } from "../styles/Default";


export default function RenderLoadingView() {
  const offset = useSharedValue(0.0);
  const animatedStyle = useAnimatedStyle(() => {
    return { opacity: offset.value }
  });
  offset.value = withRepeat(withTiming(1, {
    easing: Easing.elastic(0.95),
    duration: 1000
  }), -5, true);
  return (
    <>
      <View style={styles.MainContainer}>
        <StatusBar translucent backgroundColor='rgba(0,0,0,0)' barStyle='light-content' />
        <ImageBackground source={{ uri: 'https://alonilk2.github.io/map1/bg.jpg' }} style={styles.bg1}>
          <View style={styles.bg}>
            <View style={{ zIndex: 1, marginTop: '10%', alignItems: 'center' }}>
              <Animated.Image source={{ uri: 'https://alonilk2.github.io/map1/logo.png' }} style={[{ width: 500, height: 500 }, animatedStyle]} />
              <Text style={styles.loadingtext}>טוען ...</Text>
            </View>
          </View>
        </ImageBackground>
      </View>
    </>
  );
}