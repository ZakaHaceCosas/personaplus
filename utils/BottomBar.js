import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function BottomBar() {
    return(
        <View style={styles.bottombar}>
            <View style={styles.tile}>
                <Image></Image>
                <Text>asfas</Text>
            </View>
            <View style={styles.tile}>
                <Image></Image>
                <Text>asfas</Text>
            </View>
            <View style={styles.tile}>
                <Image></Image>
                <Text>asfas</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    bottombar: {
        position: 'fixed',
        width: '100vw',
        bottom: 0,
        left: 0,
        right: 0,
        paddingTop: '20px',
        paddingBottom: '20px',
        paddingLeft: '50px',
        paddingRight: '50px',
        backgroundColor: '#ffffff10',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backdropFilter: 'blur(40px)'
    }
})