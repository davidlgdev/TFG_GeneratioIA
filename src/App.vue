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
        Select the type of question you want to make:   
      </p>
      <div class="button-header">
        <button @click="selectQuestionType(multipleChoiceText)" >Multiple Choice</button>
        <button @click="selectQuestionType(openAnswerText)">Open answer</button>
        <button @click="selectQuestionType(trueOrFalseText)">True/False</button>
      </div>
    </header>
    <InputComponent
      :isLoading="isLoading"
      :selectedQuestionType="selectedQuestionType"
      @generate="modifyPrompt"
    />
    <OutputComponent
      v-if="generatedQuestion"
      :generatedQuestion="generatedQuestion"
      :selectedQuestionTypeName="selectedQuestionTypeName"
      @sendToMoodle="savePromptResults"
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
      user: null,
      generatedQuestion: null,
      isLoading: false,
      selectedQuestionTypeName: "",
      selectedQuestionType: "",
      multipleChoiceText: " en el siguiente formato especificado GIFT: 'Question' {= Respuesta correcta ~Opción incorrecta 1 ~Opción incorrecta 2 ~Opción incorrecta 3 ~Opción incorrecta 4 }",
      openAnswerText: " en el siguiente formato especificado: 'Question'{= Respuesta correcta}",
      trueOrFalseText: " en el siguiente formato especificado GIFT, si pregunta verdadera ::TrueStatement sobre el 'tema'::'Question'{True}, si pregunta falsa ::FalseStatement sobre el 'tema'::'Question'{False}",
    };
  },
  mounted(){
    const urlParams = new URLSearchParams(window.location.search);
    const user = urlParams.get('id'); 
    this.user = Number(user);
    this.fetchMoodleCourses();

  },
  methods: {
    selectQuestionType(typeSelected) {
      if (this.selectedQuestionType == "  ") {
        console.error("No question type selected!");
        return;
      }
      this.selectedQuestionType = typeSelected;
      console.log(this.selectedQuestionType);
    },
    modifyPrompt(prompt, selectedQuestionTypeName){
      const modifyPrompt = prompt + this.selectedQuestionType
      this.selectedQuestionTypeName = selectedQuestionTypeName
      this.generateQuestionAI(modifyPrompt);
    },
    async generateQuestionAI(prompt) {
      this.isLoading = true;
      this.generatedQuestion = null;
      console.log(prompt);
      try {
        const response = await fetch("http://localhost:3001/api/AIGeneration", {
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
    savePromptResults(questionArray) {
      const regularArray = Array.from(questionArray);
      console.log(regularArray);
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
.button-header {
  margin-top: 15px;
}
.button-header button {
  margin-right: 10px;
  padding: 15px;
  font-size: 14px;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  background-color: #4cc750; 
}
.button-header button:hover {
  background-color: #3db143;
}
</style>
