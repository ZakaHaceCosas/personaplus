import React from 'react';
import { StyleSheet, Text, View, ImageBackground } from 'react-native';
import { Food24Filled, Shield24Filled, Broom24Filled, Question24Filled } from '@fluentui/react-native-icons';

export default function BasicDivision({ labelc, headert, status, i, children, slabelc }) {
    let bgImgSrc = require('../../assets/imgs/Bg.Normal.png');

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

    let IComponent;

    if (i === "food") {
        IComponent = Food24Filled;
    } else if (i === "shield") {
        IComponent = Shield24Filled;
    } else if (i === "clean") { // casi me da por llamar "woman" a esta variable XD
        IComponent = Broom24Filled;
    } else {
        IComponent = Question24Filled;
    }

    return (
        <ImageBackground source={bgImgSrc} style={styles.bgwrapper}>
            <View style={styles.mainview}>
                <IComponent style={styles.i}></IComponent>
                <View style={styles.txtview}>
                    <Text style={styles.label}>{labelc}</Text>
                    <Text style={styles.slabel}>{slabelc}</Text>
                    <View style={styles.btnwrap}>
                        {children}
                    </View>
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
        flexDirection: 'row',
        gap: 10
    },
    txtview: {
        fontFamily: 'Inter-Regular',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 5
    },
    label: {
        fontFamily: 'Inter-Bold',
        color: '#FFF',
        fontSize: 30,
        fontStyle: 'normal',
        lineHeight: 30
    },
    slabel: {
        fontFamily: 'Inter-Regular',
        color: '#C8C8C8',
        fontSize: 12,
        fontStyle: 'normal',
        lineHeight: 15    
    },
    btnwrap: {
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        flexWrap: 'wrap'
    },
    i: {
        width: 60,
        height: 60,
        color: 'white'
    }
})
