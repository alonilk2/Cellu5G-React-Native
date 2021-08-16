
import React from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Pressable } from 'react-native';
const Footer = (props) => {
    if(props.loadingWV || props.isLoading){
      return (
        <ActivityIndicator color="orange" size="large" style={{marginTop: '30%'}} />
        )
    }
    else if(props.type === "gps") return (
      <View style={styles.listsec}>
        <Text style={{color: 'red', fontWeight: 'bold', fontSize:30, textAlign: 'center', paddingTop: '2%'}}> אופס ! </Text>
        <Text style={{color: 'black', fontWeight: 'bold', fontSize:15}}>{
        `
        או שאין אנטנות ברדיוס שהגדרתם ממיקומכם,
        או שלא הצלחנו למצוא את מיקומכם הנוכחי.
        אם אתם בטוחים שאתם בכדור הארץ,
        אנא וודאו כי:

              א) ה-GPS במכשירכם דלוק
              ב) הינכם נמצאים במקום פתוח, ללא גג
        
        לאחר מכן ניתן לנסות לרענן את העמוד:
        `
        }
        </Text>
        <Pressable onPress={(e) => {
            props.reRenderPage();
          }} style={styles.BtnStyle}>
          <Text style={styles.txtBtn}>רענון</Text>
        </Pressable>
      </View>
    )
    else return (
      <View style={styles.footer}>
          <View style={styles.listsec}>
            <Text style={{color: 'red', fontWeight: 'bold', fontSize:30, textAlign: 'center', paddingTop: '5%'}}> אופס ! </Text>
            <Text style={{color: 'black', fontWeight: 'bold', fontSize:15}}>{
            `
            כפי הנראה, 
            אין אנטנות בטווח הרדיוס מהמיקום שבחרתם.
            אנא נסו להגדיל את רדיוס החיפוש ע"י לחיצה על אייקון
            ההגדרות בראש המסך, או חפשו במיקום אחר.
            `
            }
            </Text>
          </View>
      </View>
    )
}

const styles = StyleSheet.create({
  BtnStyle: { 
    borderRadius: 50,
    borderColor:  '#ff6600',
    borderWidth: 2,
    color: 'black',
    backgroundColor: 'transparent',
    width: '47%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
    txtBtn: {
    fontFamily: "SF-Pro-Text-Bold",
    fontSize: 20,
    color: '#ff6600'
  },
});
export default Footer;

