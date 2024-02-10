import React from 'react';
import { StyleSheet, Text, View, ImageBackground } from 'react-native';

export default function BasicDivision({ labelc, headert, status, children }) {
    let bgImgSrc = require('../../assets/imgs/Bg.Normal.png');
    let headerc

    switch (status) {
        default:
            bgImgSrc = require('../../assets/imgs/Bg.Normal.png');
            break;
        // we specify NORMAL
        // especificamos NORMAL
        case 'NORMAL':
            bgImgSrc = require('../../assets/imgs/Bg.Normal.png');
            break;
        case 'GOOD':
            bgImgSrc = require('../../assets/imgs/Bg.Positive.png');
            break;
        case 'REGULAR':
            bgImgSrc = require('../../assets/imgs/Bg.Negative.png');
            break;
        case 'BAD':
            bgImgSrc = require('../../assets/imgs/Bg.Worrying.png');
            break;
    }

    switch (headert) {
        default:
            headerc = 'UNKNOWN';
            break;
        case 'DAILYHEALTHOBJ':
            headerc = 'DAILY HEALTH OBJECTIVE';
            break;
        case 'BUSTEDDAILYHEALTHOBJ':
            headerc = 'DAILY HEALTH OBJECTIVE - COMPLETED';
            break;
    }

    return (
        <ImageBackground source={bgImgSrc} style={styles.bgwrapper}>
            <View style={styles.mainview}>
                <Text style={styles.header}>{headerc}</Text>
                <Text style={styles.label}>{labelc}</Text>
                <View style={styles.btnwrap}>
                    {children}
                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    bgwrapper: {
        width: '100%'
    },
    mainview: {
        padding: 20,
        fontFamily: 'Inter-Regular',
        display: 'flex',
        flexDirection: 'column',
        gap: 10
    },
    header: {
        fontFamily: 'Inter-Bold',
        color: '#FFF',
        fontSize: 11,
        fontStyle: 'normal',
        lineHeight: 11
    },
    label: {
        fontFamily: 'Inter-Bold',
        color: '#FFF',
        fontSize: 21,
        fontStyle: 'normal',
        lineHeight: 21    
    },
    btnwrap: {
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        flexWrap: 'wrap'
    }
})
