<template>
  <head>
    <link
      href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap"
      rel="stylesheet"
    />
  </head>
  <div class="container">
    <header class="header">
      <h1>Create Custom Questions for Exams DE MOMENTO SOLO PREGUNTAS EN ESPAÑOL</h1>
      <p>
        This tool allows you to create assessment questions in any language
        with the help of AI.
      </p>
    </header>
    <InputComponent
      :isLoading="isLoading"
      @generate="generateQuestion"
    />
    <OutputComponent
      v-if="generatedQuestion"
      :generatedQuestion="generatedQuestion"
      @optionSelected="handleOption"
    />
  </div>
</template>

<script>
import InputComponent from "./components/InputComponent.vue";
import OutputComponent from "./components/OutputComponent.vue";

export default {
  components: {
    InputComponent,
    OutputComponent,
  },
  data() {
    return {
      generatedQuestion: null,
      isLoading: false,
    };
  },
  methods: {
    async generateQuestion(prompt) {
      this.isLoading = true;
      this.generatedQuestion = null;

      try {
        const response = await fetch("http://localhost:3000/api/AIGeneration", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
          throw new Error(`Server error: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.generatedQuestion) {
          throw new Error("The server did not return a valid question.");
        }

        this.generatedQuestion = data.generatedQuestion;
      } catch (error) {
        console.error("Error fetching question:", error);
      } finally {
        this.isLoading = false;
      }
    },
    handleOption(option) {
      if (option === "sendToMoodle") {

      }
      if (option === "deleteAnswer") {
        const confirmation = window.confirm("Are you sure you want to delete the answer?");
        if (confirmation) {
          this.generatedQuestion = null; 
          console.log("Answer deleted");
        } else {
          console.log("Delete cancelled");
        }
      }
      if (option === "modifyAnswer") {

      }
    }
  },
};
</script>

<style>
body {
  background-color: #A7A7A7;
  font-family: 'Poppins';
  margin: 0;
  padding: 0;
}
.header {
  position: absolute;
  top: 40px; 
  left: 60px; 
  text-align: left;
  margin: 0; 
  color: black;
}
.header h1 {
  font-weight: 500;
  font-size: 40px; 
  margin: 0;
}
.header p {
  font-weight: 400;
  font-size: 16px;
  margin-top: 8px;
}
</style>
