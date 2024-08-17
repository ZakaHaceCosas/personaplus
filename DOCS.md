# Documentación para devs - PersonaPlus

![Banner](https://raw.githubusercontent.com/ZakaHaceCosas/personaplus/main/assets/PP_BANNER_DEV.png)
<!--markdownlint-disable-next-line-->
<div align="center">

[![reactnative](https://img.shields.io/badge/React-Native-57c4dc?style=for-the-badge&logo=react&logoColor=black&labelColor=white)](https://reactnative.dev)
[![expo](https://img.shields.io/badge/Expo-000?style=for-the-badge&logo=expo&logoColor=black&labelColor=white)](https://expo.dev)
[![ts](https://img.shields.io/badge/TypeScript-2d79c7?style=for-the-badge&logo=typescript&logoColor=2d79c7&labelColor=white)](https://www.npmjs.com/package/typescript)

</div>

Dale un PLUS a tu Persona <!-- dato curioso, este eslogan lo dejo a proposito, es el eslogan OG -->

## 1. Programando PersonaPlus

### > TRABAJANDO CON EL PROYECTO

Necesitarás TypeScript, Expo, y Expo CLI. Si trabajas desde VSCode, recomendamos la [extensión oficial de Expo Tools](https://marketplace.visualstudio.com/items?itemName=expo.vscode-expo-tools).

La mayor parte del tiempo solo usarás `expo start`, a veces con el arg. `--clear` (para limpiar la caché), y `expo install --check` y `--fix` para arreglar dependencias rotas.

> [!TIP]
> Recomiendo instalar Expo Go en tu teléfono para probar la app en Android. Probando en PC verás muchos errores visuales y botones que no funcionan - el código solo está optimizado para móvil.

[![Expo Go](https://img.shields.io/badge/Expo_Go-SDK_51-000.svg?style=for-the-badge&logo=EXPO&labelColor=f3f3f3&logoColor=000)](https://expo.dev/client)

### > CONFIGURACIÓN RECOMENDADA DEL EDITOR

Recomendamos utilizar [Microsoft Visual Studio Code](https://code.visualstudio.com/) o [VSCodium](https://vscodium.com/), junto a las siguientes extensiones:

- [Expo Tools](https://marketplace.visualstudio.com/items?itemName=expo.vscode-expo-tools)

Para el formato:

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [markdownlint](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint) (si planeas editar algún archivo MarkDown del proyecto)

Otros:

- [JS and TS Nightly](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-next)
- [npm IntelliSense](https://marketplace.visualstudio.com/items?itemName=christian-kohler.npm-intellisense)

### > ESTRUCTURA DE ARCHIVOS

PersonaPlus está organizada de forma concreta. Si creas un archivo nuevo, que no desorganice el proyecto.

- **`/app`**: Páginas de la app a las que se puede navegar (`/Dashboard`, p ej.).
- **`/src`**: Componentes, hooks, tipos, _toolkits_, etc...
- **`/core`**: Libreria core de la app. [Ver más](core/README.md).

### > REDACTAR CÓDIGO APROPIADO

Por el bien de todos, ¡el código se tiene que entender! Sigue estas prácticas:

#### 1. SIEMPRE EL MISMO ORDEN

IMPORT - INTERFACE - STYLE - FUNCTION

Siempre el mismo orden, primero importamos, luego definimos la interfaz, después los estilos si proceden, y por último la función (si hay varias, el `export default` siempre será el último). No olvides el comentario de título.

```tsx
// ruta/al/Modulo.tsx
// Breve descripción de que hace (en inglés)

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

Incluso tenemos colores globales. Ni se te ocurra usar `"#FFF"` o `"#32FF80"`, importa `colors` desde `@/src/toolkit/design/colors` e importa los colores desde ahí. Cada color tiene un JSDoc indicando donde deberías usarlo, así mantenemos una interfaz consistente. Pronto haremos lo mismo con espaciados y tamaños de tipografía.

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

#### 6. MANTEN EL FORMATO

Recuerda mantener un código uniforme, organizado, usando siempre puntos y coma, tabulación apropiada, entre otros. **Si usas Visual Studio Code, gracias a la configuración de`.vscode/settings.json`, cuando guardes un archivo se auto-formateará, así que esto es fácil :]**.

#### 7. HAZ USO DE JSDoc

Si eres tan humilde que vas a aportar una función entera a PersonaPlus, lo primero: ¡gracias!, y lo segundo: utiliza JSDoc. Personalmente recomiendo la extensión [JSDoc generator](https://marketplace.visualstudio.com/items?itemName=crystal-spider.jsdoc-generator) para VSCode, hace muy bien el trabajo (`Ctrl` + `Shift` + `P` y luego `Generate JSDoc for the current file`).

#### 8. COMENTA BIEN

Añade comentarios descriptivos a las funciones y variables para ayudar a que se entiendan. **Se comenta en inglés**, para el entendimiento de todos, aunque hay una excepción para esa regla: las funciones que usen JSDoc, pueden tener un comentario (no JSDoc) en Castellano al lado.

```tsx
/**
 * This function does something
 */
export default function doSomething() { // Esta funcion hace algo
    explode()
}
```

## Versionado y registro de cambios

Cuando hagas cambios, aunque no es obligatorio, agradecemos que los añadas al `CHANGELOG.md`. Basta con que digas brevemente que cambiaste, no hace falta más. No subas el número de version, de eso nos encargamos nosotros ;D

## Licencia

Este proyecto está licenciado bajo los términos de la Licencia GPL-3.0, véase `LICENSE.md`.
