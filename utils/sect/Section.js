import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ArrowSprint20Filled, Question20Filled, Food20Filled, MoreCircle20Filled } from '@fluentui/react-native-icons';

export default function Section({ label, slabel, icon, children }) {
  let IconComponent;

  if (icon === "growth") {
    IconComponent = ArrowSprint20Filled;
  } else if (icon === "health") {
    IconComponent = Food20Filled;
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
    color: '#dddddd',
    fontFamily: 'Inter-Bold',
    textTransform: 'upercase',
  },
  slabel: {
    color: '#dddddd',
    fontFamily: 'Inter-Regular'
  },
  icon: {
    color: '#dddddd'
  },
  children: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  }
});
