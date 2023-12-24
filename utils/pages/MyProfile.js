import React, {useEffect, useState, useCallback} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Division from '../sect/Division';
import Section from '../sect/Section';

export default function MyProfile() {
    return (
    <View style={styles.body}>
        
        <Text style={styles.header}>Hi, Zaka!</Text>
        
        <Section label='YOUR HEALTH' slabel='Regular' icon='growth'>

          <Division type={'POSITIVE'} status={'DOING_ENOUGH_EXERCISE'} average='crico'></Division>          
      
          <Division type={'NEGATIVE'} status='oscar' average='crico'></Division>          
      
          <Division type='pepe' status='oscar' average='crico'></Division>          

        </Section>

        <Section label='YOUR HEALTH' slabel='Regular' icon='health'>

          {/*a*/}

        </Section>

        <Section label='YOUR HEALTH' slabel='Regular' icon='more'>

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