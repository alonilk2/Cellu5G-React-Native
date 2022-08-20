import React from 'react'
import Animated, {
  Easing, useAnimatedStyle, useSharedValue, withTiming
} from 'react-native-reanimated'

const Animation = props => {
  let offset = useSharedValue(props.animationState)
  let placex = useSharedValue(-2)

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: offset.value,
      transform: [{ translateX: placex.value * 255 }],
    }
  })
  offset.value = withTiming(1 - props.animationState, {
    easing: Easing.elastic(0.99),
    duration: 1000,
  })
  if (props.animationState === 1) {
    placex.value = withTiming(-2, {
      easing: Easing.elastic(0.99),
      duration: 1000,
    })
  } else
    placex.value = withTiming(0, {
      easing: Easing.elastic(0.99),
      duration: 1000,
    })
  return (
    <Animated.View // Special animatable View
      style={[{ ...props.style }, animatedStyle]}>
      {props.children}
    </Animated.View>
  )
}

export default Animation
