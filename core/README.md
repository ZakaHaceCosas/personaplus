# OpenHealthJS

OpenHealthJS (o simplemente _Open Health_) es una biblioteca JavaScript diseñada para realizar cálculos relacionados con la salud y proporcionar información detallada sobre varios aspectos de bienestar personal. Desde el cálculo de diferentes índices y estadísticas hasta la explicación detallada de términos médicos, OpenHealth está pensado para ser una herramienta versátil, educativa, útil, y abierta.

Forma parte del proyecto **PersonaPlus** (de hecho, de momento comparten repositorio de GitHub).

> Todos los archivos y funciones contienen al principio en un comentario las fuentes de información utilizadas para obtener los datos, fórmulas, y cálculos utilizados.

## Utilización

```tsx
// 1. haz la importación
import OpenHealth from "@core/openhealth.ts"

// 2. verás que todo está agrupado según el ámbito de la salud al que pertenece
OpenHealth.phisicalHealth
OpenHealth.mentalHealth

// 3. todas las funciones tienen nombres descriptivos, por lo que será muy facil encontrarlas
let bmi = OpenHealth.phisicalHealth.calculateBodyMassIndex(30, "male", 170, 40, true, true)

// ya está!
```

## Documentación

Aprende [aquí](DOCS.md) a utilizar OpenHealth.

## Contribución

Agradecemos todas las contribuciones, de hecho son necesarias debido a la gran cantidad de aspectos de la salud que hay que cubrir. Siéntente libre de hacer un _fork_ del repositorio cuando quieras, y haz cualquier aporte, grande o pequeño.

**Lo único que te pedimos es que si alteras, añades, modificas, o quitas cualquier información, fórmula, o definición médica, añades, aunque sea en un comentario, una referencia a alguna fuente verificable en la que te hayas basado para hacer dicho cambio.** Los cambios que se hagan "porque sí" o sin una justificación válida no podrán ser aceptados. La salud requiere precisión.

## Licencia

Al igual que PersonaPlus, OpenHealth está bajo la licencia **Apache-2.0**.
