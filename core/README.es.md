# OpenHealthJS

> Also available in [English](README.md)

OpenHealthJS (o simplemente _OpenHealth_) es una biblioteca JavaScript diseñada para realizar cálculos relacionados con la salud y proporcionar información detallada sobre varios aspectos de bienestar personal. Desde el cálculo de diferentes índices y estadísticas hasta la explicación detallada de términos médicos, OpenHealth está pensado para ser una herramienta versátil, educativa, útil, y abierta.

Forma parte del proyecto **PersonaPlus** (de hecho, de momento comparten repositorio de GitHub).

> [!NOTE]
> Todas las funciones deben contener (y contienen) una función `getSource` para obtener todas las URLs de todas las fuentes de información utilizadas para obtener los datos, fórmulas, y cálculos utilizados.
> Para archivos de texto / contenido, debería haber un comentario al principio.

## Utilización

```tsx
// 1. haz la importación
import OpenHealth from "@core/openhealth.ts"

// 2. verás que todo está agrupado según el ámbito de la salud al que pertenece
OpenHealth.phisicalHealth
OpenHealth.mentalHealth
OpenHealth.performance
// etc...

// 3. todas las funciones tienen nombres descriptivos (en ingles), por lo que será muy facil encontrarlas
let bmi = OpenHealth.phisicalHealth.BodyMassIndex.calculate(30, "male", 170, 40, true, true)

// proporciona la información necesaria y ya estás listo!
// échale un vistazo a DOCS.es.md para un manual completo de lo que hace cada funcion
```

## Documentación

Aprende [aquí](DOCS.es.md) a utilizar OpenHealth.

## Contribución

Agradecemos todas las contribuciones, de hecho son necesarias debido a la gran cantidad de aspectos de la salud que hay que cubrir. Siéntente libre de hacer un _fork_ del repositorio cuando quieras, y haz cualquier aporte, grande o pequeño.

**Lo único que te pedimos es que si alteras, añades, modificas, o quitas cualquier información, fórmula, o definición médica, añades, aunque sea en un comentario, una referencia a alguna fuente verificable en la que te hayas basado para hacer dicho cambio.** Los cambios que se hagan "porque sí" o sin una justificación válida no podrán ser aceptados. La salud requiere precisión.

## Licencia

Al igual que PersonaPlus, OpenHealth está bajo la licencia **Apache-2.0**.
Es totalmente gratuito hacer uso de OpenHealth, también para fines comerciales, siempre y cuando acredites al proyecto original (OpenHealth). _Además, es recomendable citar también las fuentes de información médica que utilices, recuerda que puedes obtenerlas con `getSource()`._

Hecho con cariño por ZakaHaceCosas, creador de PersonaPlus.
¡Cuídate!
