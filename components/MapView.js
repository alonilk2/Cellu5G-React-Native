import React, {Component} from 'react';
import { WebView } from 'react-native-webview';
import { View, Text, Pressable, ActivityIndicator} from 'react-native';

class MapView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            position: props.route.params.position
        }
    }
    render () {
        console.log(this.state.position);
        let jsCode = `x1=`+this.props.route.params.position[0]+`; y1=`+this.props.route.params.position[1]+`;
                govmap.zoomToXY({ x:`+this.props.route.params.position[0]+`, y: `+this.props.route.params.position[1]+`, level:7, marker: true });
                var res = "";
                var params = {
                    LayerName: 'cell_active',
                    Point: {x: x1, y: y1},
                    Radius:1000
                };
                var win = window.ReactNativeWebView;
                govmap.getLayerData(params).then(function(response){
                    win.postMessage(JSON.stringify(response.data));
                });  
                `
        return (
            <View style={{flexDirection: 'column', flex:1}}>
                    <WebView style={{flex:1}}
                        source={{
                        uri: 'http://165.227.137.116/map1.html',
                        }}
                        injectedJavaScript={jsCode}
                        javaScriptEnabledAndroid={true}
                        startInLoadingState={true}
                        renderLoading={
                            ()=> {
                            return (<ActivityIndicator color="#ff6a00" size="large" style={{alignSelf:'center', marginBottom: '35%'}}/> )
                            }
                        }
                    >
                    </WebView>
                    <View style={{height: 100, width:'100%', backgroundColor: '#02316e', padding: 5}}>
                        <Pressable onPress={(e)=>{this.props.navigation.goBack()}}>
                            <Text style={{color: 'white', fontSize: 30, fontFamily: 'SF-Pro-Text-Bold', alignSelf: 'center'}}>Back</Text>
                        </Pressable>
                    </View>
            </View>
        );
    }
}
export default MapView;