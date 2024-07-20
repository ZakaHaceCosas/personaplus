import React, {useEffect, useState, useCallback} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import BottomBar from './utils/BottomBar';
import { useFonts } from 'expo-font';
import Home from './utils/pages/Home';
import MyProfile from './utils/pages/MyProfile';
import Panel from './utils/pages/Panel';
import * as FileSystem from 'expo-file-system';

export default function App() {
  const [activePage, setActivePage] = useState('Home');

  const changePage = (page) => {
    setActivePage(page);
  };

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
      <StatusBar barStyle="light-content" />

      {activePage === 'Home' && <Home />}
      {activePage === 'Panel' && <Panel />}
      {activePage === 'MyProfile' && <MyProfile />}

      <BottomBar active={activePage} changePage={changePage} />
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
    width: '100vw',
    height: '100vh',
    overflow: 'scroll'
  },
});
