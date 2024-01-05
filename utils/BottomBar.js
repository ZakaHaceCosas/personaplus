import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Home28Filled, Board28Filled, Person28Filled } from '@fluentui/react-native-icons';

export default function BottomBar({ active, changePage }) {
  return (
    <View style={styles.bottombar}>
      <TouchableOpacity onPress={() => changePage('Home')} style={styles.tile}>
        <Home28Filled style={[styles.color, active === 'Home' && styles.colorActive]} />
        <Text style={[styles.color, active === 'Home' && styles.colorActive]}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => changePage('Panel')} style={styles.tile}>
        <Board28Filled style={[styles.color, active === 'Panel' && styles.colorActive]} />
        <Text style={[styles.color, active === 'Panel' && styles.colorActive]}>Panel</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => changePage('MyProfile')} style={styles.tile}>
        <Person28Filled style={[styles.color, active === 'MyProfile' && styles.colorActive]} />
        <Text style={[styles.color, active === 'MyProfile' && styles.colorActive]}>My profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottombar: {
    position: 'absolute',
    width: '100vw',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
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
