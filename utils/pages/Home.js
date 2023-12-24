import React, {useEffect, useState, useCallback} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Division from '../sect/Division';
import Section from '../sect/Section';

export default function Home() {
    return (
    <View style={styles.body}>
        
        <Text style={styles.header}>Hi, username!</Text>
        <Text style={styles.sheader}>This is your summary for today</Text>

        <Section label='YOUR DAILY OBJECTIVES' icon='growth'>

          <Division type={'POSITIVE'} status={'DOING_ENOUGH_EXERCISE'} average='crico'></Division>          
      
          <Division type={'NEGATIVE'} status='oscar' average='crico'></Division>          
      
          <Division type='pepe' status='oscar' average='crico'></Division>          

        </Section>

        <Section label='YOUR WEEKLY SUMMARY' icon='health'>

          {/*a*/}

        </Section>

        <Section label='MORE' icon='more'>

          {/*a*/}        

        </Section>

      </View>
    );
}

const styles = StyleSheet.create({
    texto: {
      color: 'white',
      fontFamily: 'Inter-Regular',
    },
    body: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'start',
      padding: 20,
      gap: 20,
      width: '100%',
      height: '100%'
    },
    header: {
        fontFamily: 'Inter-Bold',
        fontSize: 40,
        lineHeight: 40,
        color: 'white',
    },
    sheader: {
        fontFamily: 'Inter-Regular',
        fontSize: 20,
        lineHeight: 20,
        color: 'white',
    }
});