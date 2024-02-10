import React from 'react';
import { Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';

export default function Btn({ kind, text }) {
    let bgImgSrc;
    let btnwidth;
    
    switch (kind) {
        default:
            bgImgSrc = require('../assets/imgs/Btn.Blu.png');
            btnwidth = '48%';
            break;
        case 'REGULAR':
            bgImgSrc = require('../assets/imgs/Btn.Blu.png');
            btnwidth = '48%';
            break;
        case 'GOOD':
            bgImgSrc = require('../assets/imgs/Btn.Gre.png');
            btnwidth = '48%';
            break;
        case 'BAD':
            bgImgSrc = require('../assets/imgs/Btn.Red.png');
            btnwidth = '18%';
            break;
    }

    return (
        <TouchableOpacity style={[styles.btn, { width: btnwidth }]}>
            <ImageBackground source={bgImgSrc} style={styles.bg}>
                <Text style={styles.txt}>{text}</Text>
            </ImageBackground>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    btn: {
        borderRadius: 6,
        padding: 0,
        overflow: 'hidden',
        borderRadius: 10,
        borderWidth: 2.5,
        borderColor: 'rgba(255, 255, 255, 0.40)',
    },
    bg: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 10,
        borderStyle: 'solid',
    },
    txt: {
        fontFamily: 'Inter-Bold',
        textTransform: 'uppercase',
        color: 'white',
        fontSize: 13,
        textAlign: 'center'
    }
});
