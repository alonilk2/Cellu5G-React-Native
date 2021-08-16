import React, {Component} from 'react';
import { WebView } from 'react-native-webview';
import { View, Text, Pressable, ActivityIndicator} from 'react-native';
import FontAwesome from "react-native-vector-icons/Ionicons";

class MapView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            position: props.route.params.position
        }
    }
    render () {
        let jsCode = `x1=`+this.props.route.params.position[0]+`; y1=`+this.props.route.params.position[1]+`;
                govmap.zoomToXY({ x:`+this.props.route.params.position[0]+`, y: `+this.props.route.params.position[1]+`, level:7, marker: true });
                var res = "";
                var params = {
                    LayerName: 'cell_active',
                    Point: {x: x1, y: y1},
                    Radius:800
                };
                var win = window.ReactNativeWebView;
                govmap.getLayerData(params).then(function(response){
                    win.postMessage(JSON.stringify(response.data));
                });  
                `
        return (
            <View style={{flexDirection: 'column', flex:1}}>
                <WebView style={{zIndex: 0}}
                    source={{
                    uri: 'http://165.227.137.116/map1.html',
                    }}
                    injectedJavaScript={jsCode}
                    javaScriptEnabledAndroid={true}
                    startInLoadingState={true}
                    renderLoading={
                        () => {
                            return (<ActivityIndicator color="#ff6a00" size="large" style={{alignSelf:'center', marginBottom: '35%'}}/> )
                        }
                    }
                >
                </WebView>
                <View style={{position: 'absolute', left: 20, top: 40, zIndex: 5, elevation: 30}}>
                <Pressable onPress={(e)=>{this.props.navigation.goBack()}}>
                    <View style={{width: 60, height: 60, backgroundColor: "#02316e", borderRadius: 50, alignItems: 'center', justifyContent: 'center', }} >
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