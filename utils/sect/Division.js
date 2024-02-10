// FILE DEPRECATED
// ARCHIVO DEPRECADO

// DO *NOT* USE DIVISION.JS
// USE THE NEW MODULES


import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';

export default function Division({ type, status, average }) {
  let labelText, typeColor, statusText, backgroundImageSrc;

  switch (type) {
    default:
      typeColor = '#FFF';
      backgroundImageSrc = require('../../assets/imgs/Bg.Normal.png');
      break;
    case 'NEGATIVE':
      typeColor = '#FFF';
      backgroundImageSrc = require('../../assets/imgs/Bg.Negative.png');
      break;
    case 'DANGER':
      typeColor = '#FFF';
      backgroundImageSrc = require('../../assets/imgs/Bg.Worrying.png');
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
          <Text style={{ ...styles.type, color: typeColor }}>{labelText}</Text>
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
    gap: 10,
    padding: 10,
  },
  flex: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
    justifyContent: 'center',
    gap: 10,
    width: '100%'
  },
  type: {
    color: '#32FF80',
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    fontStyle: 'normal',
    textTransform: 'uppercase',
    lineHeight: 10,
  },
  status: {
    color: 'white',
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    fontStyle: 'normal',
    lineHeight: 14,
  },
  average: {
    color: '#AAA',
    fontFamily: 'Inter-Regular',
    fontSize: 8,
    fontStyle: 'normal',
    lineHeight: 8,
  }
});

/*
import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { Food24Filled } from '@fluentui/react-native-icons';
import Btn from '../Btn';

export default function Division({
  type,
  labelText,
  statusText,
  showButtons,
  button1Text,
  button1Color,
  button2Text,
  button2Color,
  button3Text,
  button3Color,
  showIcon,
}) {
  let typeColor, backgroundImageSrc;

  switch (type) {
    default:
      typeColor = '#FFF';
      backgroundImageSrc = require('../../assets/imgs/Bg.Normal.png');
      break;
    case 'NEGATIVE':
      typeColor = '#FF9B32';
      backgroundImageSrc = require('../../assets/imgs/Bg.Negative.png');
      break;
  }

  return (
    <ImageBackground source={backgroundImageSrc} style={styles.bgwrapper}>
      <View style={styles.division}>
        {showIcon && <Food24Filled />}
        <View style={styles.flex}>
          <Text style={{ ...styles.type, color: typeColor }}>{labelText}</Text>
          <Text style={styles.status}>{statusText}</Text>
          {showButtons && (
            <View style={styles.btnFlex}>
              <Btn text={button1Text} kind={button1Color} onPress={() => handleButtonPress(button1Text)} />
              <Btn text={button2Text} kind={button2Color} onPress={() => handleButtonPress(button2Text)} />
              <Btn text={button3Text} kind={button3Color} onPress={() => handleButtonPress(button3Text)} />
            </View>
          )}
        </View>
      </View>
    </ImageBackground>
  );
}

const handleButtonPress = (buttonText) => {
  console.log(`Button pressed: ${buttonText}`);
};

const styles = StyleSheet.create({
  bgwrapper: {
    width: '100%',
  },
  division: {
    width: '100%',
    color: 'black',
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    padding: 10,
  },
  flex: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
    justifyContent: 'center',
    gap: 10,
    width: '100%',
  },
  type: {
    color: '#32FF80',
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    fontStyle: 'normal',
    textTransform: 'uppercase',
    lineHeight: 10,
  },
  status: {
    color: 'white',
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    fontStyle: 'normal',
    lineHeight: 14,
  },
  btnFlex: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
  }
});
*/
