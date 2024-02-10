import React from 'react';
import { StyleSheet, Text, ScrollView } from 'react-native';
import Section from '../sect/Section';
import BasicDivision from '../sect/BasicDivision';
import Btn from '../Btn';
import IconedDivision from '../sect/IconedDivision';

export default function Home() {
    return (
    <ScrollView
      style={styles.body}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      android={{ scrollbars: 'none' }}
    >
        
        <Text style={styles.header}>Hi, username!</Text>
        <Text style={styles.sheader}>This is your summary for today</Text>

        <Section label='YOUR DAILY OBJECTIVES' icon='growth'>

          <BasicDivision labelc='To run for 10 minutes' status='NORMAL' headert='DAILYHEALTHOBJ'>
            <Btn kind='REGULAR' text='LETS GO!'/>
            <Btn kind='GOOD' text='ALREADY DONE IT'/>
            <Btn kind='BAD' text='I FORGOT...'/>
          </BasicDivision>

          <BasicDivision labelc='To do 10 series of 5 lifts of 1 kilos each' status='GOOD' headert='BUSTEDDAILYHEALTHOBJ'>
          </BasicDivision>

        </Section>

        <Section label='YOUR WEEKLY SUMMARY' icon='health'>       
          
          <IconedDivision labelc='PRUEBA' headert='FOOD' slabelc='hola mundo'>
          </IconedDivision>
        
        </Section>

        <Section label='MORE' icon='more'>

        </Section>

      </ScrollView>
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
      padding: 20,
      gap: 20,
      width: '100%',
      height: '100vh',
      overflow: 'scroll'
    },
    header: {
        fontFamily: 'Inter-Bold',
        fontSize: 40,
        lineHeight: 40,
        color: 'white',
        marginBottom: 10
    },
    sheader: {
        fontFamily: 'Inter-Regular',
        fontSize: 20,
        lineHeight: 20,
        color: 'white',
        marginBottom: 10
    }
});