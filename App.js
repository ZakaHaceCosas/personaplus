import React, {useEffect, useState, useCallback} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useFonts } from 'expo-font';
// import * as SplashScreen from 'expo-splash-screen';
import Division from './utils/sect/Division';
import Section from './utils/sect/Section';
import BottomBar from './utils/BottomBar';

export default function App() {
  const [fontsLoaded] = useFonts({
    'Inter-Thin': require('./fonts/Inter-Thin.ttf'),
    'Inter-ExtraLight': require('./fonts/Inter-ExtraLight.ttf'),
    'Inter-Light': require('./fonts/Inter-Light.ttf'),
    'Inter-Regular': require('./fonts/Inter-Regular.ttf'),
    'Inter-Medium': require('./fonts/Inter-Medium.ttf'),
    'Inter-SemiBold': require('./fonts/Inter-SemiBold.ttf'),
    'Inter-Bold': require('./fonts/Inter-Bold.ttf'),
    'Inter-ExtraBold': require('./fonts/Inter-ExtraBold.ttf'),
    'Inter-Black': require('./fonts/Inter-Black.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="#0F0F0F"
        barStyle="dark-content"
      />
      <View style={styles.body}>
        
        <Text style={styles.header}>Hi, Zaka!</Text>
        
        <Section label='YOUR HEALTH' slabel='Regular' icon='hand-with-heart'>

          <Division type={'POSITIVE'} status={'DOING_ENOUGH_EXERCISE'} average='crico'></Division>          
      
          <Division type={'NEGATIVE'} status='oscar' average='crico'></Division>          
      
          <Division type='pepe' status='oscar' average='crico'></Division>          

        </Section>

        <BottomBar>

        </BottomBar>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#030508',
    alignItems: 'start',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  texto: {
    color: 'white',
    fontFamily: 'Inter-Regular',
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'start',
    padding: '20px',
    gap: '20px',
  },
  header: {
    fontFamily: 'Inter-Bold',
    fontSize: 40,
    lineHeight: 40,
    color: 'white',
  }
});
