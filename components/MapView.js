import React, { Component } from 'react';
import { ActivityIndicator, NativeModules, Pressable, View } from 'react-native';
import FontAwesome from "react-native-vector-icons/Ionicons";
import { WebView } from 'react-native-webview';
import Global from './Global.js';
import * as Utils from './utils/Utils';

const { AdmobInitiator } = NativeModules;
class MapView extends Component {
    constructor(props) {
        super(props)
        this.state = { position: props.route.params.position }
    }
    render() {
        return (
            <View style={{ flexDirection: 'column', flex: 1 }}>
                <WebView style={{ zIndex: 0 }}
                    source={{
                        uri: 'https://alonilk2.github.io/map1/',
                    }}
                    injectedJavaScript={Utils.jsCode(
                        this.state.position[0],
                        this.state.position[1],
                        Global.radius,
                    )}
                    javaScriptEnabledAndroid={true}
                    startInLoadingState={true}
                    scalesPageToFit={false}
                    renderLoading={
                        () => {
                            return (<ActivityIndicator color="#ff6a00" size="large" style={{ alignSelf: 'center', marginBottom: '35%' }} />)
                        }
                    }
                >
                </WebView>
                <View style={{ position: 'absolute', left: 20, top: 40, zIndex: 5, elevation: 30 }}>
                    <Pressable onPress={(e) => { this.props.navigation.goBack(); AdmobInitiator.showAd(); }}>
                        <View style={{ width: 60, height: 60, backgroundColor: "#02316e", borderRadius: 50, alignItems: 'center', justifyContent: 'center', }} >
                            <FontAwesome
                                name={"arrow-back-outline"}
                                size={30}
                                color="#ffffff"
                            />
                        </View>
                    </Pressable>
                </View>
            </View>
        );
    }
}
export default MapView;