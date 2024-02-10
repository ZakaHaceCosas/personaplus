import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Home28Filled, Board28Filled, Person28Filled } from '@fluentui/react-native-icons';

export default function BottomBar({ active, changePage }) {
  return (
    <View style={styles.bottombar}>
      <Pressable onPress={() => changePage('Home')} style={styles.tile}>
        <Home28Filled style={[styles.color, active === 'Home' && styles.colorActive]} />
        <Text style={[styles.color, active === 'Home' && styles.colorActive]}>Home</Text>
      </Pressable>
      <Pressable onPress={() => changePage('Panel')} style={styles.tile}>
        <Board28Filled style={[styles.color, active === 'Panel' && styles.colorActive]} />
        <Text style={[styles.color, active === 'Panel' && styles.colorActive]}>Panel</Text>
      </Pressable>
      <Pressable onPress={() => changePage('MyProfile')} style={styles.tile}>
        <Person28Filled style={[styles.color, active === 'MyProfile' && styles.colorActive]} />
        <Text style={[styles.color, active === 'MyProfile' && styles.colorActive]}>My profile</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bottombar: {
    position: 'absolute',
    width: 'calc(100vw - 40)',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 30,
    paddingRight: 30,
    backgroundColor: '#16191E',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tile: {
    display: 'flex',
    flexDirection: 'column',
    gap: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  color: {
    color: '#8A8C8E',
  },
  colorActive: {
    color: '#FFF',
  },
});
