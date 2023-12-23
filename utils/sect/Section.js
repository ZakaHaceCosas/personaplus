import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function Section({ label, slabel, icon, children }) {
    const icons = {
        'hand-with-heart': require('../../icons/hand-with-heart.png'),
    };

    return (
        <View style={styles.section}>
            <View style={styles.flex}>
                <Image source={icons[icon]} style={styles.icon} ></Image>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.label}>·</Text>
                <Text style={styles.slabel}>{slabel}</Text>
            </View>
            <View style={styles.children}>
              {children}
            </View>
        </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#1A1A1A',
    display: 'flex',
    width: 'calc(100% - 20px)',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  flex: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px',
    gap: '10px'
  },
  label: {
    color: '#8C8C8C',
    fontFamily: 'Inter-Bold',
    textTransform: 'upercase',
  },
  slabel: {
    color: '#8C8C8C',
    fontFamily: 'Inter-Regular'
  },
  icon: {
    width: 20,
    height: 20
  },
  children: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  }
});
