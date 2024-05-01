![DIAGRAMA](https://personaplus.vercel.app/PP_DEVBANNER.png)
<h1 align="center">PersonaPlus</h1>
<h2 align="center">Dale un PLUS a tu Persona</h2>
<p align="center">
DOCUMENTACIÓN DE LA BASE DE CÓDIGO
</p>

###### BASE DE CÓDIGO R4

> [!WARNING]
> **DOCUMENTACIÓN INCOMPLETA**

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
Se usarán las siguientes tecnologías para llevar a cabo el desarrollo de la aplicación.
//TODO DESDE AQUÍ
![DIAGRAMA](https://personaplus.vercel.app/stack_del_proyecto.png)

## 2. Funcionamiento: La aplicación
La aplicación está basada en Expo.
La app se divide en dos módulos, el de salud y el antivirus, cómo se puede apreciar en este otro diagrama.
###### (El segundo módulo (antivirus) se implementará más adelante)

![DIAGRAMA](https://personaplus.vercel.app/org_esquema_app.png)

El primer módulo, en términos de funcionalidad, se divide en dos submódulos.
-	SALUD FÍSICA
	1. Ofrecer al usuario la capacidad de crear objetivos diarios, que él mismo indicará antes de la media noche el haber cumplido dicho objetivo o no (no indicarlo = no lo ha cumplido). Ejemplos de objetivos serían "Correr durante 10 minutos", "Correr 15 kilómetros", "Hacer x flexiones al día", y similares.
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
	// Componentes reutilizados, nombrados por las primeras 3 o 4 letras del nombre en inglés
	// Por ejemplo, si hicieras un componente llamado "Imagen", lo llamarías Img.tsx
|
/ app
	Home.tsx
	Dash.tsx
	Prof.tsx
	Sess.tsx
	// Cada página, nombrada por las primeras 4 letras del nombre en ingles
	// EJ. "Panel de control" > "Dashboard" > "Dash.tsx"
```

> [!WARNING]
> Por hacer / To do
