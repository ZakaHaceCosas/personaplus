import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function BottomBar() {
    return(
        <View style={styles.bottombar}>
            <View style={styles.tile}>
                <Image></Image>
                <Text>Home</Text>
            </View>
            <View style={styles.tile}>
                <Image></Image>
                <Text>Panel</Text>
            </View>
            <View style={styles.tile}>
                <Image></Image>
                <Text>My profile</Text>
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
        backgroundColor: '#16191E',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    }
})