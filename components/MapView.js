import React, {Component} from 'react';
import { WebView } from 'react-native-webview';
import { View, Text, Pressable } from 'react-native';

class MapView extends Component {
    render () {
        return (
            <View style={{flexDirection: 'column', flex:1}}>
                    <WebView style={{flex:1}}
                        source={{
                        uri: 'http://165.227.137.116/map1.html',
                        }}
                    >
                    </WebView>
                    <View style={{height: 70, width:'100%', backgroundColor: '#02316e'}}>
                        <Pressable onPress={(e)=>{this.props.navigation.goBack()}}>
                            <Text style={{color: 'white', fontSize: 30, fontFamily: 'SF-Pro-Text-Bold', alignSelf: 'center', marginBottom: 10}}>Back</Text>
                        </Pressable>
                    </View>
            </View>
        );
    }
}
export default MapView;