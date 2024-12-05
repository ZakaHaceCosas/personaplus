# PersonaPlus Privacy Policy

> [!WARNING]
> **As a NON FINISHED app, this is subject to changes. It's just a draft.**

## Data Collection

- What we **do not** collet: PersonaPlus does not collect any personal information from the user that allows to identify him or than can be directly associated to him. No real name, e-mail address, or any other kind of personal data from the user is collected.
- What we **do** collect: PersonaPlus stores basic data, such as age, gender, and username. Your username does not need to be an authentic name and is not checked to be real. Age and gender _should_ be correct (and we encourage you to provide accurate values), but we do not intrude on your privacy to validate their veracity. We also collect health data, in two ways:
  - **User provided health information:** PersonaPlus does ask for health way, in a fully anonymous way. This includes but is not limited to: age, gender, weight, height, estimate hours of sleep[^1], estimate activeness level of the user, among others.
  - **App generated health data:** Via an internal library (CoreLibrary, or "CL"), PersonaPlus can use user provided data to generate additional data based on standardized medical calculations, calculations designed by us, or by measuring your way of using the app in certain ways. For example, we may measure the amount of time you spent one week on an Active Objective like "Running", together with the data you provided to us (like your gender or your weight) to estimate[^2] the amount of calories you've burnt that week[^2]. Some examples of calculations the app makes are:
    - Your ideal body weight (IBW).
    - The percentage of fat in your body (BFP).
    - The estimate of calories you burn in a daily basis (BMR).
    - Among others. We keep adding additional calculations to the CL as needed.
  - You are always shown the results of all calculations and they're never shown to anyone. Please note their accuracy is not a guarantee[^2].
- **Usage data:** PersonaPlus does not compile technical usage data, diagnostics, telemetry, whatsoever. We do collect basic data onto your usage of the app, but it's only stored locally and you can see it and/or wipe it at any time. <!-- TODO: add data removal without needing to remove account as an actual feature -->

<!-- todo finish translating -->
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
