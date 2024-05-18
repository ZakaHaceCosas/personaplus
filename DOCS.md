> [!WARNING]
> **DOCUMENTACIÓN INCOMPLETA**

![DIAGRAMA](https://personaplus.vercel.app/PP_BANNER_DEV.png)
<h1 align="center">PersonaPlus</h1>
<h2 align="center">Dale un PLUS a tu Persona</h2>
<p align="center">
DOCUMENTACIÓN DE LA BASE DE CÓDIGO
</p>

## 0. ¿Qué es PersonaPlus?
###### (Este punto es orientativo y no dirijido al código como tal, se puede omitir)
PersonaPlus es una aplicación de salud y bienestar digital (con planes para implementar también protección antivirus), desarrollada en React Native y Expo.

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
La aplicación está desarrollada con **React Native 0.73**, **Expo SDK 50.0.17**, y programada en TypeScript.

## 2. Funcionamiento: La aplicación
La aplicación se divide en tres páginas, el Inicio, el Panel, y el Perfil.

![DIAGRAMA](https://personaplus.vercel.app/DEV-org-esquema-app.png)

El primer módulo, en términos de funcionalidad, se divide en dos submódulos.
-	SALUD FÍSICA
	1. Ofrecer al usuario la capacidad de crear objetivos ACTIVOS o PASIVOS
		
		1.1 **ACTIVOS**: Objetivos diarios que él mismo indicará antes de la media noche el haber cumplido dicho objetivo o no (no indicarlo = no lo ha cumplido). Ejemplos de objetivos activos serían "Correr durante 10 minutos", "Correr 15 kilómetros", "Hacer x flexiones al día", y similares. Pueden ser más genéricas ("Correr 5 minutos"), o más específicas ("Correr 10 kilometros en 20 minutos con 2 descansos", por ejemplo).

		1.2 **PASIVOS**: Se les puede llamar "metas", ya que es lo que son en realidad. El usuario no indica si los ha cumplido o no, si no que la propia app lo determina según la información que recibe por parte del usuario. Ejemplos de objetivos pasivos serían "No ingerir más de 3500 kcal diarias", "Cumplir mi objetivo de correr 15 días seguidos", "No usar el móvil más de 3 horas al día", y similares.
> [!WARNING]
> A partir de aquí, la doc. está deprecada

	2. El usuario también podrá controlar su dieta, estableciendo a que horas desayuna, come, o cena, para recibir una notificación a cada hora como se ve en el siguiente diagrama*.
	3. Además, a la noche (cuando se le pregunte por todos sus objetivos en general), también se le preguntará, entre otras cosas, si ha estado "picando entre horas", para obtener estadísticas más precisas.
	4. En base a dichos objetivos y registros alimentarios, la app cálculos con la actividad física realizada por el usuario (de los que la app tenga constancia) para obtener estadísticas y en base a dichas estadísticas mantener al usuario informado de su rendimiento**.

(*Diagrama)
![DIAGRAMA](https://personaplus.vercel.app/func_salud1_dieta.png)

(**La definición de que números son "buenos" o "malos" se hará en base a datos médicos, aunque la app siempre recordará que no está hecha por ningún hospital ni es 100% precisa.)

- SALUD PSICOLÓGICA (aka BIENESTAR DIGITAL)
	1.	El usuario tendrá a su disposición un conteo del tiempo invertido en cada aplicación y de la cantidad de notificaciones que recibe de cada una, mas un contador de desbloqueos de la pantalla, para que el usuario sepa con exactitud que uso hace del dispositivo y como lo usa.
	
## 3. Programando PersonaPlus
Estas son las indicaciones básicas para programar, desde nombres de variables hasta prácticas recomendadas.

### > TRABAJANDO CON EL PROYECTO

Necesitarás instalar (obviamente) `Git` y `Node.js` en tu sistema, y de ahí, instalar `Expo CLI`, con el cual interactuarás vía `npx expo <comando>`. Probablemente trabajas desde VSCode, así que recomendamos también la [extensión oficial](https://marketplace.visualstudio.com/items?itemName=expo.vscode-expo-tools).

La mayor parte del tiempo solo usarás `npx expo start` (para iniciar el proyecto (debes estar en la raíz)), a veces con el arg. `--clear` (para limpiar la caché), y `npx expo install <opcionalmente-un-paquete>` para instalar paquetes de Expo. `npx expo install` y `npm install` instalarán todas las dependencias nada más hayas clonado el repositorio. `npx expo install --check` y `--fix` pueden arreglar dependencias rotas.

### > LAS "PRE-VARIABLES"
En el *root* del proyecto hay archivos `VAR-algo.jsonc` (JSON con comentarios).
Estos incluyen las "variables" que no se pueden incorporar como variables reales (p ej., variables de CSS).

### > ESTRUCTURA DE ARCHIVOS
PersonaPlus está organizado de una forma concreta. En caso de que te veas creando un archivo nuevo, que no desorganice el sistema de archivos.

```
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

Siempre el mismo orden, primero importamos, luego definimos la interfaz (los *types*), después, si procede, los estilos, y por último la función principal (ésta siempre sera la última. Si hace falta colocar otra función fuera de esta misma, que sea justo antes).

```tsx
// ruta/al/Modulo.tsx
// Breve descripción de que hace

import React from 'react';

interface ModuloProps {
	variable: string;
}

const styles

export default function Modulo() {
	return (
		<Text>Un módulo bien hecho</Text>
	)
}
```

#### 2. IMPORTA CORRECTAMENTE

Para evitar tener importaciones muy largas, cuando sea necesario utiliza `import * as <Nombre> from <importacion>`.
> **Siempre** se importa React Native de este modo, con el nombre "Native".

Ten en cuenta que cuando programes, esto llevará a que en vez de escribir, por ejemplo, `<View>`, escribas `<Native.View>`.

> [!WARNING]
> Aún hay que acabar esta documentación
