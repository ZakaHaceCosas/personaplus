import React from 'react';
import { View, Text, StyleSheet, Image, ImageBackground } from 'react-native';

export default function Division({ type, status, average }) {
  let typeText, typeColor, statusText, backgroundImageSrc;

  switch (type) {
    case 'POSITIVE':
      typeText = 'POSITIVE';
      typeColor = '#32FF80';
      backgroundImageSrc = require('../../assets/imgs/positive_grad.png');
      break;
    case 'NEGATIVE':
      typeText = 'NEGATIVE';
      typeColor = '#FF9B32';
      backgroundImageSrc = require('../../assets/imgs/negative_grad.png');
      break;
    default:
      typeText = 'NORMAL';
      typeColor = '#FFF';
      backgroundImageSrc = require('../../assets/imgs/normal_grad.png');
    }

  switch (status) {
    case 'DOING_ENOUGH_EXERCISE':
      statusText = 'You’re doing enough exercise, great!';
      break;
    case 'DOING_TOOMUCH_EXERCISE':
      statusText = 'Seems like you’re exercising too much, calm down!';
      break;
    case 'DOING_NOTENOUGH_EXERCISE':
      statusText = 'You’re not doing enough exercise... Try harder!';
      break;
    default:
      statusText = 'No content';
  }

  return (
    <ImageBackground
      source={backgroundImageSrc}
      style={styles.bgwrapper}
    >
      <View style={styles.division}>
        <View style={styles.flex}>
          <Text style={{ ...styles.type, color: typeColor }}>{typeText}</Text>
          <Text style={styles.status}>{statusText}</Text>
          <Text style={styles.average}>{average}</Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bgwrapper: {
    width: '100%',
  },
  division: {
    width: '100%',
    color: 'black',
    display: 'flex',
    flexDirection: 'row',
    gap: '10px',
    padding: '10px',
  },
  flex: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
    justifyContent: 'center',
    gap: '10px'
  },
  type: {
    color: '#32FF80',
    fontFamily: 'Inter-Regular',
    fontSize: '10px',
    fontStyle: 'normal',
    textTransform: 'uppercase',
    lineHeight: '10px',
  },
  status: {
    color: 'white',
    fontFamily: 'Inter-Bold',
    fontSize: '16px',
    fontStyle: 'normal',
    lineHeight: '14px',
  },
  average: {
    color: '#AAA',
    fontFamily: 'Inter-Regular',
    fontSize: '8px',
    fontStyle: 'normal',
    lineHeight: '8px',
  }
});
