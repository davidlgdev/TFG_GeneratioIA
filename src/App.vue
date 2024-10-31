<template>
  <div>
    <h1>Generador de Preguntas IA</h1>
    <input v-model="prompt" placeholder="Escribe tu pregunta..." />
    <button @click="generateQuestion">Generar Pregunta</button>
    <p v-if="generatedQuestion">Respuesta de la IA: {{ generatedQuestion }}</p>
    <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      prompt: "",              // Contenido del campo de entrada
      generatedQuestion: null,  // Almacena la respuesta generada
      errorMessage: null,      // Almacena mensajes de error, si hay
    };
  },
  methods: {
    async generateQuestion() {
      this.errorMessage = null; // Limpiar el mensaje de error
      try {
        const response = await fetch("http://localhost:3000/api/AIGeneration", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt: this.prompt }),
        });
        
        // Manejo de errores de la respuesta
        if (!response.ok) {
          throw new Error("Error en la respuesta del servidor.");
        }
        
        const data = await response.json();
        this.generatedQuestion = data.generatedQuestion; // Guarda la respuesta en `generatedQuestion`
      } catch (error) {
        console.error("Error fetching question:", error);
        this.errorMessage = error.message; // Muestra el mensaje de error en la interfaz
      }
    },
  },
};
</script>
