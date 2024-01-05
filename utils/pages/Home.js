import React, {useEffect, useState, useCallback} from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import Division from '../sect/Division';
import Section from '../sect/Section';
import BasicDivision from '../sect/BasicDivision';

export default function Home() {
    return (
    <ScrollView style={styles.body}>
        
        <Text style={styles.header}>Hi, username!</Text>
        <Text style={styles.sheader}>This is your summary for today</Text>

        <Section label='YOUR DAILY OBJECTIVES' icon='growth'>

          <BasicDivision labelc='Lorem ipsum'>
          </BasicDivision>

        </Section>

        <Section label='YOUR WEEKLY SUMMARY' icon='health'>       

        </Section>

        <Section label='MORE' icon='more'>

          <Division
            type="NEGATIVE"
            status="DOING_TOOMUCH_EXERCISE"
            labelText="Etiqueta Personalizada"
            statusText="¡Cuidado con el exceso de ejercicio!"
            showButtons={false}
            showIcon={false}
          />

          <Division
            type="DEFAULT"
            status="DOING_ENOUGH_EXERCISE"
            labelText="Otra Etiqueta"
            statusText="¡Estás haciendo suficiente ejercicio, genial!"
            showButtons={true}
            button1Text="Botón 1"
            button1Color="#3498db"
            button2Text="Botón 2"
            button2Color="#2ecc71"
            button3Text="Botón 3"
            button3Color="#e74c3c"
            showIcon={false}
          />

          <Division
            type="NEGATIVE"
            status="DOING_NOTENOUGH_EXERCISE"
            labelText="Etiqueta Personalizada"
            statusText="¡Necesitas hacer más ejercicio!"
            showButtons={true}
            button1Text="Acción 1"
            button1Color="#e67e22"
            button2Text="Acción 2"
            button2Color="#9b59b6"
            button3Text="Acción 3"
            button3Color="#34495e"
            showIcon={true}
          />

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
      height: '100%',
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