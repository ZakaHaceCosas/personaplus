# Documentación para devs - PersonaPlus

![Banner](https://raw.githubusercontent.com/ZakaHaceCosas/personaplus/main/assets/PP_BANNER_DEV.png)

Dale un PLUS a tu Persona <!-- dato curioso, este eslogan lo dejo a proposito, es el eslogan OG -->

## 1. El *stack* tecnológico

La aplicación está desarrollada con **React Native** y **Expo**, y programada en TypeScript.

<!--markdownlint-disable-next-line-->
<div align="center">

[![reactnative](https://img.shields.io/badge/React-Native-57c4dc?style=for-the-badge&logo=react&logoColor=black&labelColor=white)](https://reactnative.dev)
[![expo](https://img.shields.io/badge/Expo-000?style=for-the-badge&logo=expo&logoColor=black&labelColor=white)](https://expo.dev)
[![ts](https://img.shields.io/badge/TypeScript-2d79c7?style=for-the-badge&logo=typescript&logoColor=2d79c7&labelColor=white)](https://www.npmjs.com/package/typescript)

</div>

## 2. Programando PersonaPlus

### > TRABAJANDO CON EL PROYECTO

Necesitarás (obviamente) `Git` y `Node.js`, y de ahí, `Expo CLI`, con el cual interactuarás vía `npx expo <comando>`. Si trabajas desde VSCode, recomendamos la [extensión oficial de Expo Tools](https://marketplace.visualstudio.com/items?itemName=expo.vscode-expo-tools).

<!--markdownlint-disable-next-line-->
<div align="center">

[![git](https://img.shields.io/badge/Git-fb4f28?style=for-the-badge&logo=git&logoColor=white)](https://git-scm.com/downloads)
[![node](https://img.shields.io/badge/NodeJS-417e38?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/en/download/package-manager)
[![expocli](https://img.shields.io/badge/NPM-Expo_CLI-black?style=for-the-badge&labelColor=cb0000&logo=npm)](https://www.npmjs.com/package/@expo/cli)
[![expotools](https://img.shields.io/badge/VSCode-Expo_Tools-black?style=for-the-badge&labelColor=0066b8&logo=visualstudiocode)](https://marketplace.visualstudio.com/items?itemName=expo.vscode-expo-tools)
</div>

La mayor parte del tiempo solo usarás `npx expo start` (para iniciar el proyecto (debes estar en la raíz)), a veces con el arg. `--clear` (para limpiar la caché), y `npx expo install <opcionalmente-un-paquete>` para instalar paquetes de Expo. `npx expo install` y `npm install` instalarán todas las dependencias nada más hayas clonado el repositorio. `npx expo install --check` y `--fix` pueden arreglar dependencias rotas.

> [!TIP]
> Es ***muy*** recomendable que instales en tu teléfono **Expo Go** y lo utilices para probar la app. Ofrece una vista previa más realista de como se verá la app en Android. De hecho, si pruebas en PC verás errores visuales que en el móvil no se ven, derivados precisamente del hecho de que el código está optimizado pensado sólo en Android.

[![Runs with Expo Go](https://img.shields.io/badge/Runs_with_Expo_Go-SDK_51-000.svg?style=for-the-badge&logo=EXPO&labelColor=f3f3f3&logoColor=000)](https://expo.dev/client)

### > CONFIGURACIÓN RECOMENDADA DEL EDITOR

Recomendamos utilizar [Microsoft Visual Studio Code](https://code.visualstudio.com/) o [VSCodium](https://vscodium.com/), junto a las siguientes extensiones:

- La ya mencionada [Expo Tools](https://marketplace.visualstudio.com/items?itemName=expo.vscode-expo-tools)

Para el formato:

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [markdownlint](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint) (si planeas editar algún archivo MarkDown del proyecto)

Otros:

- [JS and TS Nightly](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-next)
- [npm IntelliSense](https://marketplace.visualstudio.com/items?itemName=christian-kohler.npm-intellisense)

### > ESTRUCTURA DE ARCHIVOS

PersonaPlus está organizada de forma concreta. Si creas un archivo nuevo, que no desorganice el proyecto.

```tsx
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
/ src
  BetterText.tsx
  / section
    Section.tsx
  / hooks
  / toolkit
    / debug
    / design
  ...
|
/ app
  _layout.tsx
  index.tsx
  Dashboard.tsx
  Profile.tsx
  Sessions.tsx
  // Cada página, nombrada con el nombre en ingles (salvo index y _layout)
  // EJ. "Panel de control" > "Dashboard" > "Dashboard.tsx"
```

### > CÓMO REDACTAR CÓDIGO APROPIADO

Por el bien de todos, ¡el código se tiene que entender! Sigue estas prácticas:

#### 1. SIEMPRE EL MISMO ORDEN

IMPORT - INTERFACE - STYLE - FUNCTION

Siempre el mismo orden, primero importamos, luego definimos la interfaz, después los estilos si proceden, y por último la función (si hay varias, el `export default` siempre será el último).

```tsx
// ruta/al/Modulo.tsx
// Breve descripción de que hace

import React from 'react';
import { View, StyleSheet } from 'react-native';
import BetterText from '@/src/BetterText';
import termLog from '@/src/toolkit/debug/console';

interface ModuloProps {
  variable: string;
}

const styles = StyleSheet.create({
  mainview: {
    padding: 10,
    backgroundColor: "#FFF"
  }
});

const otraFunction = () => {
  termLog("Hago algo :D")
}

export default function Modulo() {
  return (
    <View style={styles.mainview}>
      <BetterText textAlign="normal" fontWeight="bold" fontSize={20} textColor="#000">
        Un módulo bien hecho
      </BetterText>
    </View>
  );
}
```

#### 2. IMPORTA CORRECTAMENTE

Para los componentes propios, utiliza `@` en vez de `./`. E.J.:

```tsx
import BetterText from '@/src/BetterText'; // bien
import BetterText from './src/BetterText'; // no bien
```

#### 3. NOMBRA CLARAMENTE VARIABLES Y FUNCIONES

Utiliza el inglés, crea nombres descriptivos y comprensibles, que se entienda fácilmente qué es cada cosa. Aunque ninguna capitalización especifica es obligada (y yo mismo las mezclo a veces 😅), recomiendo utilizar capitalización en camello (CamelCasing).

```tsx
// Muy mal.
const w = Dimensions.get("screen").width / 2
const t = "Bold"
const a = "center"

// Mal.
const widt = Dimensions.get("screen").width / 2
const text = "Bold"
const algn = "center"

// Bien. Recomendable.
const width = Dimensions.get("screen").width / 2
const text = "Bold"
const align = "center"

// También bien, funciona. Aún así, evita pasarte de largo.
const alignment = "center"

// No hagas ninguno de estos.
const access_objectives(objective-identifier);

// Haz esto.
const AccessObjectives(ObjectiveIdentifier);
// Empezar con MAYÚSCULA es opcional.
```

#### 4. USA LOS COMPONENTES PROPIOS

No utilices `Text` o `Pressable` de React Native: utiliza `BetterText` o `Button`. Tenemos una serie de componentes propios para facilitar el trabajo, haciendo que de forma más rápida tengas algo funcional y acorde al estilo de la app.

Incluso tenemos colores globales. Ni se te ocurra usar `"#FFF"` o `"#32FF80"` (color de acento), importa `colors` desde `@/src/toolkit/design/colors` e importa los colores desde ahí. Cada color tiene un JSDoc indicando donde deberías usarlo, así mantenemos una interfaz consistente.

#### 5. HAZ UN BUEN USO DE LOS TIPOS

Estás trabajando con TypeScript, así que obviamente te verás usando tipos.

```tsx
import React from 'react';
import BetterText from "@/src/BetterText";

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

#### 6. ELIMINA LOS *ERRORES TONTOS*

##### `Unable to resolve "./elements/Polygon" from

¿Error al buscar "Polygon"?

Por alguna razón, la libreria `react-native-countdown-circle-timer` da este error:

```bash
Android Bundling failed 884ms C:\Users\tu_usuario\personaplus\node_modules\expo-router\entry.js (1142 modules)
Unable to resolve "./elements/Polygon" from "node_modules\react-native-svg\src\ReactNativeSVG.ts"
```

Lo que recomiendo hacer es abrir el archivo (`node_modules\react-native-svg\src\ReactNativeSVG.ts`), buscar "Polygon" y comentar `//` todas las lineas que lo mencionen. Hacer eso dará el mismo error con otro archivo:

```bash
Android Bundling failed 10727ms C:\Users\tu_usuario\personaplus\node_modules\expo-router\entry.js (1224 modules)
Unable to resolve "./elements/Polygon" from "node_modules\react-native-svg\src\xml.tsx"
```

Repite el proceso con ese otro archivo, y ahora si debería funcionar. De momento no veo otra alternativa, de hecho cambié `react-native-countdown-component` por `react-native-countdown-circle-timer` solo por un problema de compatibilidad, ya que por ir iba perfecto - pero daba un error por usar React Native de mala manera / manera anticuada y no era viable, crasheaba la app.

Tienes que arreglarlo manualmente ya que (obviamente y como sabrás) `node_modules/` no se puede sincronizar con GitHub (a ver, si puede, pero es una idea estúpida subir todo eso a Git y ya lo sabes), así que tendrás que manipularlo por tu cuenta para testear en móvil (o si no quieres hacerlo, simplemente no intentes testear la página Sessions/).

#### 7. MANTEN EL FORMATO

Recuerda mantener un código uniforme, organizado, usando siempre puntos y coma, tabulación apropiada, entre otros. **Si usas Visual Studio Code, gracias a la configuración de`.vscode/settings.json`, cuando guardes un archivo se auto-formateará, así que esto es fácil :]**.

#### 8. HAZ USO DE JSDoc

Si eres tan humilde que vas a aportar una función entera a PersonaPlus, lo primero: ¡gracias!, y lo segundo: utiliza JSDoc. Personalmente recomiendo la extensión [JSDoc generator](https://marketplace.visualstudio.com/items?itemName=crystal-spider.jsdoc-generator) para VSCode, hace muy bien el trabajo (`Ctrl` + `Shift` + `P` y luego `Generate JSDoc for the current file`).

#### 9. COMENTA BIEN

Añade comentarios descriptivos a las funciones y variables para ayudar a que se entiendan. **Se comenta en inglés**, para el entendimiento de todos, aunque hay una excepción para esa regla: las funciones que usen JSDoc, pueden tener un comentario (no JSDoc) en Castellano al lado.

```tsx
/**
 * This function does something
 */
export default function doSomething() { // Esta funcion hace algo
    explode()
}
```

## Versionado

Actualmente se usa un versionado muy simple, cuando cambies algo suma 1 a la `b` (*build*) en el archivo `CHANGELOG.md` y describe que cambios o mejoras hiciste.

## Licencia

Este proyecto está licenciado bajo los términos de la Licencia GPL-3.0, véase `LICENSE.md`.
