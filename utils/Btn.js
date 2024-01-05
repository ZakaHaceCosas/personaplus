import React from 'react';
import { Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';

export default function Btn(kind, text){
    switch (kind) {
        default:
            bgImgSrc = require('../assets/imgs/Btn.Blu.png');
            break;
        case 'REGULAR':
            bgImgSrc = require('../assets/imgs/Btn.Blu.png');
            break;
        case 'GOOD':
            bgImgSrc = require('../assets/imgs/Btn.Gre.png');
            break;
        case 'BAD':
            bgImgSrc = require('../assets/imgs/Btn.Red.png');
            break;
    }

    return (
        <ImageBackground source={bgImgSrc} style={styles.bgwrapper}>
            <TouchableOpacity style={styles.btn}>
                <Text style={styles.txt}>{text}</Text>
            </TouchableOpacity>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    bgwrapper: {
      width: '100%',
    },
    btn: {
        borderRadius: 5,
        padding: 5
    },
    txt: {
        fontFamily: 'Inter-Bold',
        textTransform: 'uppercase'
    }
});
  