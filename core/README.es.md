# PersonaPlus CoreLibrary

> Also available in [English (Inglés)]((https://github.com/GiveItAPlus/personaplus/blob/main/core/README.es.md))

La PersonaPlus CoreLibrary (antes conocida como "_OpenHealth_") es, como el nombre implica, el núcleo ("core") de la app - una "librería" de código TS diseñado para realizar cálculos relacionados con la salud y proporcionar información detallada sobre varios aspectos de bienestar personal. Desde el cálculo de diferentes índices y estadísticas hasta la explicación detallada de términos médicos, CoreLibrary está pensado para ser una herramienta versátil, educativa, útil, y abierta.

> [!NOTE]
> Todas las funciones deben contener (y contendrán) una función `getSources()` para obtener todas las URLs de todas las fuentes de información utilizadas para obtener los datos, fórmulas, y cálculos utilizados.

## Utilización

```tsx
// 1. haz la importación
import CoreLibrary from "@core/CoreLibrary.ts";

// 2. verás que todo está agrupado según el ámbito de la salud al que pertenece
CoreLibrary.physicalHealth;
CoreLibrary.performance;
// etc...

// 3. todas las funciones tienen nombres descriptivos (en inglés), así te será fácil encontrar lo que buscas
// proporciona la información necesaria y ya estás listo!
let bmi = CoreLibrary.physicalHealth.BodyMassIndex.calculate(
    30,
    "male",
    170,
    40,
    true,
    true,
);

// échale un vistazo a DOCS.es.md para un manual completo de lo que hace cada función
```

## Documentación

Aprende [aquí](DOCS.es.md) a utilizar CoreLibrary.

## Contribución

Agradecemos todas las contribuciones, de hecho son necesarias debido a la gran cantidad de aspectos de la salud que hay que cubrir. Siéntete libre de hacer un _fork_ del repositorio cuando quieras, y haz cualquier aporte, grande o pequeño.

**Lo único que te pedimos es que si alteras, añades, modificas, o quitas cualquier información, fórmula, o definición médica, añades, aunque sea en un comentario, una referencia a alguna fuente verificable en la que te hayas basado para hacer dicho cambio.** Los cambios que se hagan "porque sí" o sin una justificación válida no podrán ser aceptados. La salud requiere precisión.

---

Hecho con cariño por ZakaHaceCosas, creador de PersonaPlus.

¡Cuídate!
