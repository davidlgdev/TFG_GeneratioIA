# TFG_GeneratioIA
Bienvenido a la guía de usuario de la herramienta GeneratioIA, una aplicación diseñada para generar preguntas de evaluación de manera automática mediante inteligencia artificial y facilitar su integración con Moodle.
## Requisitos previos
Lista todo lo necesario antes de utilizar la aplicación:
• Acceso a Moodle con permisos de profesor (capaz de poder configurar la herramienta).
• Tokens necesarios:
o Acceso a un token del modelo de IA para su uso.
o Acceso a un token de Moodle para poder retornar las preguntas
mediante el webservice.
• Tener la aplicación “ngrok” o similar instalado para poder exponer el servidor local
## Acceso a la aplicación
1. Clonar el repositorio del proyecto en un directorio conocido
2. Crea un archivo llamado .env en el directorio raíz del proyecto y coloca los siguientes valores:
a. MOODLE_TOKEN_RETQUESTION=tu_token_de_Moodle
b. MISTRA_TOKEN=tu_token_del_modelo_de_IA
3. Ejecutar ngrok exponiendo el puerto 3001 “ngrok http 3001”.
4. En “administración del sitio”→“Extensiones”→“Módulos de actividad”→“Herramienta Externa” →“Administrar Herramienta”
5. Configurar una nueva herramienta con los siguientes parámetros:
![image](https://github.com/user-attachments/assets/6c4fe17a-e94c-483b-a5fc-a71d456410a6)
Substituir las direcciones de la imagen por las generadas por ngrok, pero manteniendo los endpoints a los que se apunta.
6. Colocar el contenido de la carpeta “qbank_plugin” en la carpeta “mod/local” de Moodle para integrar el plugin.
7. Para el retorno, asegurarse se puedan usar webservice en Moodle y añadir el webservice modificado a Moodle.
8. Colocar la herramienta en el curso a partir de la interfaz de Moodle.
## Utilizar la aplicación
Una vez todo configurado y asegurando que se puede acceder a la aplicación, se describe como generar las preguntas.
1. Selecciona el tipo de preguntas que deseas generar (opción múltiple, verdadero/falso, respuestas cortas).
2. Introduce las instrucciones en el campo de texto proporcionado. Por ejemplo: "Genera 5 preguntas de opción múltiple sobre matemáticas."
3. Haz clic en el botón Generar preguntas.
4. Una vez generadas, las preguntas aparecen listadas.
5. Ahora se puede:
a. Editar: Modificar el texto de las preguntas o las respuestas.
b. Eliminar: Quitar preguntas que no sean relevantes.
c. Enviar a Moodle: Aprobar las preguntas que deseas enviar a Moodle.
6. Una vez enviadas las preguntas, si todo funciona correctamente, estas se guardarán automáticamente en el banco de preguntas del curso correspondiente en Moodle.
## Resolución de problemas comunes
1. No puedo acceder a la aplicación desde Moodle:
a. Asegurarse de haber configurado correctamente ngrok y las URLs en la herramienta LTI.
b. Verificar que tu usuario de Moodle tenga permisos para configurar
herramientas externas.
2. La aplicación no genera preguntas:
a. Revisa que los tokens estén correctamente configurados en el archivo .env.
b. Comprueba la conexión con el servidor del modelo de IA.
3. No se envían las preguntas a Moodle:
a. Verifica el token de Moodle en el archivo .env.
b. Asegúrate de que el webservice de Moodle esté habilitado.
