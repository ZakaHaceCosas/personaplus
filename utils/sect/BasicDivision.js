import React, {useEffect, useState, useCallback} from 'react';
import { StyleSheet, Text, View, ScrollView, ImageBackground } from 'react-native';
import Btn from '../Btn.js';

export default function BasicDivision(labelc) {
    const bgImgSrc = require('../../assets/imgs/Bg.Normal.png');

    return (
        <ImageBackground source={bgImgSrc} style={styles.bgwrapper}>
            <View style={styles.mainview}>
                <Text style={styles.header}>DAILY HEALTH OBJECTIVE</Text>
                <Text style={styles.label}>{labelc}</Text>
                <View style={styles.btnwrap}>
                    <Btn kind='REGULAR' text='LETS GO!'></Btn>
                </View>
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    bgwrapper: {
        width: '100%'
    },
    mainview: {
        fontFamily: 'Inter-Regular'
    },
    header: {
        fontFamily: 'Inter-Bold',
        color: '#FFF',
        fontSize: 8,
        fontStyle: 'normal',
        lineHeight: 8
    },
    label: {
        fontFamily: 'Inter-Bold',
        color: '#FFF',
        fontSize: 15,
        fontStyle: 'normal',
        lineHeight: 15    
    }
})
