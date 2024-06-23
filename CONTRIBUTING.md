# Contribuyendo a PersonaPlus

En primer lugar - ¡gracias por colaborar!

Todo tipo de aportes son aceptados y valorados. Aquí encontrarás algunas pautas y directrices para contribuir de manera efectiva al proyecto. ¡Esperamos tus aportes 🎉!

> Psst... Si te gusta el proyecto pero no tienes tiempo para contribuir o sencillamente no sabes programar, ¡no pasa nada! Hay muchas otras formas de mostrar aprecio y ayudar al proyecto que nos alegrarían mucho:
>
> - Darle una estrella al proyecto
> - Compartirlo con tus amigos para que lo conozcan
> - Probar la app y hacer sugerencias o reportar errores

## Código de Conducta

Este proyecto y todos sus participantes y contribuyentes cumplen y deben cumplir el [Código de Conducta](https://github.com/ZakaHaceCosas/personaplus/blob/main/CODE_OF_CONDUCT.md). Al contribuir, esperamos que cumplas con dicho código - y en caso de que alguien no lo haga, esperamos que nos lo hagas saber.

¡Veamos como puedes aportar al proyecto!

## Reportar Errores

Si encuentras un error, por favor abre un [issue](https://github.com/tuusuario/personaplus/issues) en GitHub. Asegúrate de incluir:

- Una descripción clara del error.
- Pasos para reproducir el error.
- Capturas de pantalla o registros (logs) si es posible.
- Información sobre tu entorno (sistema operativo, versión de la aplicación, etc.).

> [!WARNING]
> **Si se trata de reportar un error de** ***seguridad*** **no lo hagas mediante una issue pública, envía un correo a <zakahacecosas@protonmail.com>**. Échale un vistazo a [SECURITY.md](https://github.com/ZakaHaceCosas/personaplus/blob/main/SECURITY.md) para más información. **Gracias.**

## Hacer sugerencias

Si tienes una idea para una nueva funcionalidad, abre un [issue](https://github.com/tuusuario/personaplus/issues) y describe:

- El problema que estás tratando de resolver o el motivo de tu sugerencia.
- Tu propuesta como tal.
- Cualquier ejemplo o referencia que pueda ayudar a entender mejor la funcionalidad propuesta.

## Contribuir con Código

### 1. Clona este repositorio

```bash
git clone https://github.com/ZakaHaceCosas/personaplus.git
```

### 2. Navega hasta el directorio del proyecto

```bash
cd personaplus
```

### 3. Asegurarte de que estás en la rama correcta

```bash
git branch
```

Debería mostrar `main` marcado con un asterisco:

```bash
* main
  (debajo puede que se muestren otras ramas)
```

Si el asterisco *no está en `main`*, debes cambiar de rama:

```bash
git checkout main
```

Ahora sí.

### 4. Instala las dependencias

```bash
npm install
npx expo install --fix
```

(*Si no tienes Expo CLI, te ofrecerá instalarlo*)

### 5. Inicia la aplicación utilizando Expo CLI

```bash
npx expo start
```

¡Aparcado! En la interfaz, clica `w` para ver una demo rápida en tu navegador, o clica `a` para abrirla en un emulador Android (requiere Android Studio). Ya estás listo para programar. Realiza tus cambios en el código. Asegúrate de seguir las [convenciones de codificación del proyecto (la documentación)](https://github.com/ZakaHaceCosas/personaplus/blob/main/DOCS.md).

Prueba tus cambios para asegurarte de que no rompen nada. Para ello, puedes usar el servidor local (que ya has iniciado con `expo start`), o para pruebas más precisas de como se verá en dispositivos móviles, utiliza Expo Go.

[![Runs with Expo Go](https://img.shields.io/badge/Runs_with_Expo_Go-SDK_51-000.svg?style=for-the-badge&logo=EXPO&labelColor=f3f3f3&logoColor=000)](https://expo.dev/client)

Una vez hayas probado todo, confirma tus cambios con un mensaje de commit claro y descriptivo.

```bash
git commit -m "Descripción de mi cambio"
```

No toques `CHANGELOG` ni el número de versión, ya nos encargaremos de eso.

### 6. Sube tus cambios

```bash
git push origin main
```

Abre una solicitud de cambios en el repositorio original de PersonaPlus y listo.

## Estándares de Codificación

Sigue los estándares especificados en la [documentación](https://github.com/ZakaHaceCosas/personaplus/blob/main/DOCS.md#2-programando-personaplus).

## Comunicación

Únete a nuestras discusiones y debates en el [servidor de Discord](https://discord.com/invite/euVHrr46c6). Sé respetuoso y cortés con otros colaboradores y usuarios del proyecto.

## Licencia

Al contribuir a PersonaPlus, aceptas que tus contribuciones se incluyan a la base de código y se distribuyan bajo la licencia Apache-2.0.

**¡Gracias por tu tiempo y esfuerzo para hacer de PersonaPlus una mejor aplicación para todos!**
