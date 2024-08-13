<!--markdownlint-disable-next-line-->
<h1 align="center">PersonaPlus</h1>

![PersonaPlus banner](https://raw.githubusercontent.com/ZakaHaceCosas/personaplus/main/assets/PP_BANNER.png)

<!--markdownlint-disable-next-line-->
<div align="center">

<!--Se destacará el vídeo que a mi me parezca :v-->
<!--[![YouTube Video Views](https://img.shields.io/youtube/views/cPSmVmsvkeY?style=for-the-badge&logo=youtube)](https://www.youtube.com/watch?v=H2_0d-hLiMw)-->
[![GitHub last commit](https://img.shields.io/github/last-commit/ZakaHaceCosas/personaplus?style=for-the-badge&logo=github&color=black)](https://github.com/ZakaHaceCosas/personaplus/commits/)
[![GitHub Repo size](https://img.shields.io/github/repo-size/ZakaHaceCosas/personaplus?style=for-the-badge&logo=visualstudiocode)](https://github.com/ZakaHaceCosas/personaplus/tree/main/app)
[![GitHub Repo stars](https://img.shields.io/github/stars/ZakaHaceCosas/personaplus?style=for-the-badge&logo=github&color=orange)](https://github.com/ZakaHaceCosas/personaplus/stargazers)
![Created at](https://img.shields.io/github/created-at/ZakaHaceCosas/personaplus?style=for-the-badge&color=white&logo=github)
[![GitHub License](https://img.shields.io/github/license/zakahacecosas/personaplus?style=for-the-badge&color=%23d52e35)](https://github.com/ZakaHaceCosas/personaplus/blob/main/LICENSE.md)
[![Website](https://img.shields.io/website?url=https%3A%2F%2Fpersonaplus.vercel.app&up_message=WORKING%20%3A%5D&up_color=%2332FF80&down_message=NOT%20WORKING%20%3A%5B&down_color=%23FF3232&style=for-the-badge)](https://personaplus.vercel.app)
[![App version](https://img.shields.io/github/package-json/v/zakahacecosas/personaplus?style=for-the-badge&labelColor=%23000&color=%23fff)](https://github.com/ZakaHaceCosas/personaplus/blob/main/package.json#L3)

</div>

## DATE UN PLUS

PersonaPlus es una app de código abierto en React Native y Expo para ayudar a los usuarios a cuidar de su salud, dieta, y bienestar digital. A ***darse más***, como nos gusta decir.

Este repositorio actua de *monorepo*, pues aloja también otro proyecto, la libreria propia que he hecho para realizar cálculos estadísticos con datos del usuario para obtener información y estadísticas sobre la salud y el rendimiento del usuario.

## Descargar la app

Puedes probarla descargando alguna *Pre-Release* desde la [página de lanzamientos del repositorio](https://github.com/ZakaHaceCosas/personaplus/releases). Eso sí, **no hay versiones estables** - quiero decir, la app no está acabada y las versiones publicadas son para que los primeros usuarios vayan probando la app y reportando errores.

Que no te sorprenda encontrar fallos, o que varias funciones prometidas aún no están implementadas. Además, la app sólo está disponible en inglés (de momento).

### Testing

De momento PersonaPlus está en su primera fase, *codename* "PRE-APP". Ni Beta, ni Alpha, mucho anterior. Es muy inestable y presenta varios errores conocidos. Si encuentras alguna falla, por favor, [repórtala aquí (página "Issues" del repositorio)](https://github.com/ZakaHaceCosas/personaplus/issues). ¡Cada aporte ayuda a que la app sea mejor!

## Funciones planeadas

PersonaPlus es una app en un estado muy temprano, muchas funciones aún están por hacer y algunas tomarán mucho tiempo en empezar a implementarse. Además, las listas están sujetas a cambios, según voy mejorando las ideas (o quitando alguna, que no suele pasar, pero puede).

Dicho esto, desde el [proyecto de GitHub](https://github.com/users/ZakaHaceCosas/projects/1/views/1) puedes ver todo lo planeado.

### Orden de implementación

Para que nadie pierda el rumbo, aunque voy tocando un poco de todo, este es el plan que intento seguir de momento (actualizaré esto cada que haga falta).

1. [X] ~~Terminar de implementar las sesiones básicas.~~ **Hecho.**
2. [X] ~~Una vez hecho eso, algún ajuste más a la app y de ahí a lo importante.~~ **Hecho.**
3. [X] ~~Retomar OpenHealth (un poco olvidado desde que lo creé) e implementar todos los cálculos necesarios para las actividades que PersonaPlus soporta por defecto.~~ **Hecho.**
4. [X] Implementar - de alguna manera - obtención de datos básicos sobre cada sesión y su guardado.
5. [X] A partir de ahí, implementar también el guardado de las sesiones en sí - o sea, que la app registre cada día si has hecho algo o no.
6. [ ] La generación de estadísticas en base a los cálculos que OpenHealth pueda hacer con los datos guardados en cada sesión.
7. [ ] Implementar la *hora de pensar* y sus respectivas notificaciones (cuando haga eso aprovecharé para arreglar las notificaciones actuales que funcionan fatal)
8. A partir de ahí, iré viendo

## ¿Cómo contribuir?

Fácil, clona el repositorio (`git clone https://github.com/ZakaHaceCosas/personaplus.git`) y ponte a programar.

Cualquier contribución es bienvenida. Házlo a tu manera, aunque te agradecería que siguieras las [PAUTAS DE CONTRIBUCIÓN](https://github.com/ZakaHaceCosas/personaplus/blob/main/CONTRIBUTING.md) y la [DOCUMENTACIÓN](https://github.com/ZakaHaceCosas/personaplus/blob/main/DOCS.md#3-programando-personaplus).

## Licencia y créditos

### Licencia

PersonaPlus está licenciada bajo la licencia GPL-3.0-only. En resumen: puedes utilizar la aplicación para cualquier propósito, examinar, descargar, reutilizar, modificar y redistribuir el código fuente y las versiones modificadas libremente. Sin embargo, cualquier redistribución o modificación debe ser bajo la misma licencia GPL-3.0-only. Esto significa que tu redistribución debe ser de código abierto, incluir un acceso claro al código fuente y proporcionar créditos tanto al creador original como a cualquier otro contribuidor bajo GPL-3.0 u otras licencias que requieran atribución.

Asegúrate de que cualquier software de terceros utilizado que esté bajo diferentes licencias (como MIT) también se maneje adecuadamente según sus términos específicos.

### Créditos

#### Creador y contribuidores

Creado por Zakaria ([@ZakaHaceCosas](https://bento.me/zakahacecosas)).

[Todos los contribuidores aparecen en esta pestaña](https://github.com/zakaHaceCosas/personaplus/graphs/contributors). Los que hagan aportes significativos, aparecerán también aquí. ¡Gracias por contribuir!

#### Software libre

Gracias a todo este maravilloso software libre, PersonaPlus es posible. ¡Gracias!

- [React](https://react.dev/) (y los paquetes asociados)
- [React Native](https://reactnative.dev/) (y los paquetes asociados)
- [Expo](https://expo.dev/) (y los paquetes asociados)
- [React Native Animatable](https://github.com/oblador/react-native-animatable)
- [React Native Countdown Circle Timer](https://github.com/vydimitrov/react-countdown-circle-timer/)
- [React Native SVG](https://github.com/software-mansion/react-native-svg)
- [React Navigation](https://github.com/react-navigation/react-navigation)
- [i18next](https://github.com/i18next/i18next)

## Únete al club de los que quieren darse más :]

<!--markdownlint-disable-next-line-->
<div align="center">

[![YouTube button](https://img.shields.io/badge/YouTube-PersonaPlus-red?style=for-the-badge&logo=youtube)](https://www.youtube.com/playlist?list=PLdif1flfmG__g_a1QSmBNnSh_6pAeRizW)
[![Discord button](https://img.shields.io/badge/Discord-Servidor_de_Discord-blue?style=for-the-badge&logo=discord&logoColor=white)](https://discord.com/invite/euVHrr46c6)

</div>
