# PersonaPlus

![DIAGRAMA](https://personaplus.vercel.app/PP_BANNER_DEV.png)

## Dale un PLUS a tu Persona

DOCUMENTACIÓN DE LA BASE DE CÓDIGO

## 0. ¿Qué es PersonaPlus?

> (Este punto es orientativo y no dirijido al código como tal, se puede omitir)

PersonaPlus es una aplicación de salud y bienestar digital, desarrollada en React Native y Expo.

Aún se halla en una fase muy temprana del desarrollo, pero apunta a traer las siguientes funcionalidades:

- Sistema basado en "Objetivos".
  - El usuario nada más acceder a la app por primera vez, especifica sus datos necesarios para el funcionamiento de la app Y sus objetivos. Además, diariamente, recibirá una notificación para añadir datos nuevos sobre lo que ha hecho en el día de hoy, para crear un perfil y unas estadísticas sobre el mismo.
  - Un "Objetivo" es una meta (puede ser un recordatorio para una actividad o proponerse hacer que las estadísticas lleguen a `x` punto (lo cual requeriría mejorar sus hábitos, probablemente)). Se clasifican en dos tipos, según la implementación:
    - OBJETIVOS ACTIVOS: Aquellos que implican un recordatorio para realizar una actividad. Estos pueden marcarse como completados, como no realizados (dando por hecho que no se realizarán en todo el día), o pueden activarse en el momento, iniciando una sesión (la app se volvería un cronometro con indicaciones para que el usuario realice la actividad en cuestión).
    - OBJETIVOS PASIVOS: Aquellos que implican establecer una "meta", como cumplir con `x` OBJ. ACT. durante 15 días seguidos, no ingerir más de `x` kilocalorías al día, etc...
- Funcionalidades de Bienestar Digital y prevención de la adicción al teléfono móvil.
  - El usuario podrá ver en que apps pasa más o menos tiempo, de que apps le llegan más o menos notificaciones, y etcétera.
  - El usuario recibirá consejos y motivación para hacer algo con su vida y dejar el teléfono.
- Autocontrol: El usuario se monitorea a si mismo (que come, cuando lo hace, con que frecuencia, visitas al lavabo, frecuencia con la que fuma o bebe (si lo hace)), para ayudarse a autocontrolar sus hábitos (o a abandonarlos directamente si fueran malos hábitos, como la fuma o el consumo de estupefacientes).

Con estas ideas apuntamos a crear una aplicación estrella, gratuita y de código abierto, para ayudar a las personas a mejorar su propia salud.

## 1. El *stack* tecnológico

La aplicación está desarrollada con **React Native 0.73.6**, **Expo SDK 50.0.19**, y programada en TypeScript.

## 2. Programando PersonaPlus

Estas son las indicaciones básicas para programar, desde nombres de variables hasta prácticas recomendadas.

### > TRABAJANDO CON EL PROYECTO

Necesitarás instalar (obviamente) `Git` y `Node.js` en tu sistema, y de ahí, instalar `Expo CLI`, con el cual interactuarás vía `npx expo <comando>`. Probablemente trabajas desde VSCode, así que recomendamos también la [extensión oficial](https://marketplace.visualstudio.com/items?itemName=expo.vscode-expo-tools).

La mayor parte del tiempo solo usarás `npx expo start` (para iniciar el proyecto (debes estar en la raíz)), a veces con el arg. `--clear` (para limpiar la caché), y `npx expo install <opcionalmente-un-paquete>` para instalar paquetes de Expo. `npx expo install` y `npm install` instalarán todas las dependencias nada más hayas clonado el repositorio. `npx expo install --check` y `--fix` pueden arreglar dependencias rotas.

### > LAS "PRE-VARIABLES"

En el *root* del proyecto hay archivos `VAR-algo.jsonc` (JSON con comentarios).
Estos incluyen las "variables" que no se pueden incorporar como variables reales (p ej., variables de CSS).

Actualmente sólo hay una, `VAR-DSGN.jsonc`, con la paleta de colores de la app.

### > ESTRUCTURA DE ARCHIVOS

PersonaPlus está organizado de una forma concreta. En caso de que te veas creando un archivo nuevo, que no desorganice el sistema de archivos.

```txt
> App.tsx
> VAR-*.jsonc
> package.json
(etc...)
|
/ assets
 adaptative-icon.png
 favicon.png
 (etc...)
|
/ fonts
 (...) // Todos los archivos .ttf de "Be Vietnam Pro", la tipografía de la app.
|
/ components
 Text.tsx
 / section
  Section.tsx
 // Componentes reutilizados, nombrados, preferiblemente pero no necesariamente por las primeras 3 o 4 letras del nombre en inglés
 // Por ejemplo, si hicieras un componente llamado "Imagen", lo llamarías Img.tsx. Section podría ser Sect.tsx (aunque no lo es XD). Entiendes la idea.
|
/ app
 _layout.tsx // Nombre que no sigue la estructura, debido a que Expo requiere que el nombre sea así
 index.tsx // Lo mismo
 Dash.tsx
 Prof.tsx
 Sess.tsx
 // Cada página, nombrada (a poder ser) por las primeras 4 letras del nombre en ingles
 // EJ. "Panel de control" > "Dashboard" > "Dash.tsx"
```

### > CÓMO REDACTAR CÓDIGO APROPIADO

Por el bien de todos, ¡el código se tiene que entender! Sigue estas prácticas:

#### 1. SIEMPRE EL MISMO ORDEN

IMPORT - INTERFACE - STYLE - *FUNCTION

Siempre el mismo orden, primero importamos, luego definimos la interfaz (los tipos), después, si procede, los estilos, y por último la función principal (ésta siempre sera la última. Si hace falta colocar otra función fuera de esta misma, que sea justo antes).

```tsx
// ruta/al/Modulo.tsx
// Breve descripción de que hace

import * as React from 'react';
import * as Native from 'react-native';

interface ModuloProps {
 variable: string;
}

const styles = Native.StyleSheet.create({
 mainview: {
  padding: 10,
  backgroundColor: "#FFF"
 }
})

export default function Modulo() {
 return (
  <Native.View style={styles.mainview}>
   <BeText align="normal" weight="Bold" size={20} color="#000">
    Un módulo bien hecho
   </BeText>
  </Native.View>
 )
}
```

#### 2. IMPORTA CORRECTAMENTE

Para evitar tener importaciones muy largas, cuando sea necesario utiliza `import * as <Nombre> from <importacion>`.
> **Siempre** se importa React Native de este modo, con el nombre "Native", al igual que React con el nombre "React".

Ten en cuenta que cuando programes, esto llevará a que en vez de escribir, por ejemplo, `<View>`, escribas `<Native.View>`, o `React.useEffect` en vez de `useEffect`. Esto se hace para mantener unas importaciones limpias y consistentes.

Además, para los componentes propios, utiliza `@` en vez de `./`. E.J.:

```tsx
import BeText from '@/components/Text'; // bien
import BeText from './components/Text'; // no bien
```

#### 3. NOMBRA CLARAMENTE LAS VARIABLES

Utiliza el nombre completo en inglés de lo que sea que busques crear, o, a poder ser y siempre que sea comprensible, una acortación a cuatro letras. Tampoco hagas nombres *demasiado* descriptivos.

```tsx
// Mal.
const w = "100vw"
const t = "Bold"
const a = "center"

// Bien. Recomendable.
const widt = "100vh"
const text = "Bold"
const algn = "center"

// También bien. Funciona.
const width = "100vh"
const text = "Bold"
const align = "center"

// No tan bien. Podrías usar "align", estandar y más fácil.
const alignment = "center"
```

#### 4. HAZ USO DEL TIPEADO

Estás trabajando con TypeScript, así que recuerda usar tipos. No vaya a ser que acabes asignando valores ilógicos a una variable...

Cuando se trate de la función principal de un componente, haz uso de una Interfaz.

```tsx
import * as React from 'react';
import * as Native from 'react-native';
import BeText from "@/components/Text";

const mivariable: string = "String :D";

interface miComponenteProps {
 param: string; // Comentario explicando el param
 param2: number; // Comentario explicando el param2
}

export default function miComponente({ param, param2 }: miComponenteProps) {
 return (
  <BeText>{param} + {" "} + {param2}</BeText>
 )
}
```

#### 5. ELIMINA LOS *ERRORES TONTOS*

Por alguna razón, el tipeado de TS da error cuando, por ejemplo, tratas de asignar "100vw" a `width` vía StyleSheet. Cuando eso pase, usa estas correcciones (si no hay ninguna para tu "error", añade en la línea anterior un salto y un `// @ts-ignore`, y aparcado).

##### `width`y `height` dando guerra

¿No puedes asignar "100vw" a `width`?

```tsx
width: "100vw" // Error: Type '"100vw"' is not assignable to type 'DimensionValue | undefined'.
```

Utiliza `DimensionValue`

```tsx
width: "100vw" as Native.DimensionValue // Perfecto.
```

#### 6. MANTEN EL FORMATO

Recuerda mantener un código uniforme, organizado, usando siempre puntos y coma, tabulación apropiada, entre otros. **Si usas Visual Studio Code, gracias a la configuración de `.vscode/settings.json`, cuando guardes un archivo se auto-formateará, así que esto es fácil :]**.

## Versionado

Actualmente se usa un versionado muy simple, cuando cambies algo suma 1 a la `b` (*build*) en el archivo `CHANGELOG.md` y describe que cambios o mejoras hiciste.

## Licencia

Este proyecto está licenciado bajo los términos de la Licencia Apache 2.0, véase `LICENSE.md`.
