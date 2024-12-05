# Política de Privacidad de PersonaPlus

> [!WARNING]
> **Al ser una aplicación que NO ESTÁ ACABADA, esto es susceptible a cambios. Esto es solo un boceto.**

## Introducción

Esta Política de Privacidad describe las prácticas en relación con la recolección, uso y protección de tus datos cuando utilizas nuestra aplicación.

## Recopilación de Información

- **Información Personal:** PersonaPlus no recopila ninguna información personal sobre el usuario que permita su identificación. La aplicación recopila datos requeridos, como la edad del sujeto, pero nunca pide ningún nombre real, correo-e, u otros datos cualesquiera que permitan identificar al usuario.
- **Información Física:** PersonaPlus sí recopila información de salud, de manera totalmente anónima. Esto incluye pero no se limita al peso, edad, altura, género, cantidad estimada de horas de sueño[^1], entre otros.
  - Además, PersonaPlus puede utilizar esta información para obtener otros datos vía cálculos médicos o mediante el uso que hace de la app. Por ejemplo, puede que utilice la cantidad de ejercicios que realiza en un periodo de tiempo para estimar su nivel de actividad física, y usar esa estimación para obtener cálculos médicos aproximados[^2], como el Peso Corporal Ideal (IBW), Porcentaje de Grasa del Cuerpo (BFP), entre otros índices.
- **Datos de Uso:** PersonaPlus no recopila ningún dato de uso técnico o de diagnóstico, no hace uso alguno de tecnologías como la telemetría, ni similares.

## Métodos de Recopilación

- **Obtención directa:** Podemos obtener los datos directamente desde usted: al abrir la app por primera vez, se le hace un cuestionario preguntándole ciertos datos. Varias preguntas son opcionales, por lo que no hay problema si no quiere responder alguna.
- **Deducción / Obtención indirecta:** Como mencionado anteriormente, podemos usar los datos proporcionados por usted para realizar cálculos médicos[^2] y generar datos más precisos.

### Procesamiento de la Información

- **Almacenamiento:** La información del usuario se almacena única y exclusivamente en el dispositivo en el que se utilice la aplicación, vía el almacenamiento local del teléfono (`AsyncStorage`). Nunca se almacena en ningún servidor externo[^3] o cualquier otro almacenamiento que no sea el tuyo.

## Uso de Información

- **Funcionalidad:** Los datos mencionados anteriormente, como su peso, edad, o los índices médicos[^2] que se pueden obtener mediante esos y otros datos, se utilizan para que PersonaPlus cumpla con lo prometido: proporcionar estadísticas, consejos, y actividades personalizadas para el usuario. Para ello, es necesario entenderle, y la información recopilada lo hace posible.
- **Terceros:** PersonaPlus no comparte, vende ni intercambia datos con terceros. No se usan proveedores externos para el almacenamiento de datos ni para el análisis de datos personales.

[^1]: La estimación de horas de sueño es proporcionada por el propio usuario mediante cuestionario. La app NO realiza rastreo del sueño de ningún tipo.

[^2]: Los "cálculos médicos" en esta app incluyen (pero no se limitan a) índices como el BMI, BMR, e IBW, entre otros, que proporcionan estimaciones sobre aspectos de salud del usuario, para ayudar a dar recomendaciones más precisas. Esta app NO DEBE SER CONSIDERADA BAJO NINGÚN CONCEPTO como una fuente de información médica real ni reemplaza la información proporcionada por su médico.

[^3]: **PersonaPlus jamás compartirá sus datos con terceros por cuenta propia.** Sin embargo, los datos del usuario se almacenan como objetos AsyncStorage individuales NO ENCRIPTADOS. Una copia de seguridad, por ejemplo, podría "quebrantar" el principio de no hacer copias en la nube, ya que Google (o el proveedor de copias de seguridad de su teléfono Android) sería el responsable de realizar dicha copia. PersonaPlus deshabilita desde su código las copias de seguridad automáticas de Android, pero esto no es una garantía absoluta. Nunca almacenaremos ninguna información sensible de esta manera.
