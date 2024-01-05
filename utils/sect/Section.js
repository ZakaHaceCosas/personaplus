import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ArrowSprint20Filled, Question20Filled, Food20Filled, MoreCircle20Filled, Pulse20Filled, HeartPulse20Filled, ArrowUp20Filled, Games20Regular, Group20Filled } from '@fluentui/react-native-icons';

export default function Section({ label, icon, children }) {
  let IconComponent;

  if (icon === "growth") {
    IconComponent = Group20Filled;
  } else if (icon === "health") {
    IconComponent = HeartPulse20Filled;
  } else if (icon === "more") {
    IconComponent = MoreCircle20Filled
  } else {
    IconComponent = Question20Filled;
  }

  return (
    <View style={styles.section}>
      <View style={styles.flex}>
        <IconComponent style={styles.icon}/>
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={styles.children}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#0C0F14',
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    alignItems: 'flex-start',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20
  },
  flex: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'start',
    padding: 10,
    gap: 10,
    width: '100%'
  },
  label: {
    color: '#dddddd',
    fontFamily: 'Inter-Bold',
    textTransform: 'uppercase',
  },
  icon: {
    color: '#dddddd'
  },
  children: {
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
    width: '100%'
  }
});
