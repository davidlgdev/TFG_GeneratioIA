<template>
  <head>
    <link
      href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap"
      rel="stylesheet"
    />
  </head>
  <div class="container">
    <header class="header">
      <h1>{{ $t('Title') }}</h1>
      <p>
        {{ $t('chooseQuestionTypeButton') }}   
      </p>
      <div class="language-selector">
        <h3>{{ $t('chooseLanguageButton') }}</h3>
        <img 
          src="/es_flag.png" 
          alt="Español" 
          class="flag" 
          @click="changeLanguage('es')"
        />
        <img 
          src="/en_flag.png" 
          alt="Inglés" 
          class="flag" 
          @click="changeLanguage('en')"
        />
        <img 
          src="/ca_flag.png" 
          alt="Catalán" 
          class="flag" 
          @click="changeLanguage('ca')"
        />
      </div>
      <div class="button-header">
        <button @click="selectQuestionType(multipleChoiceText)">{{ $t('multipleChoiceButton') }}</button>
        <button @click="selectQuestionType(openAnswerText)">{{ $t('openAnswerButton') }}</button>
        <button @click="selectQuestionType(trueOrFalseText)">{{ $t('trueOrFalseButton') }}</button>
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

  },
  methods: {
    changeLanguage(lang) {
      this.$i18n.locale = lang;
      localStorage.setItem("language", lang); 
    },
    selectQuestionType(typeSelected) {
      if (this.selectedQuestionType == "  ") {
        console.error("No question type selected!");
        return;
      }
      this.selectedQuestionType = typeSelected;
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
      fetch("http://localhost:3001/api/webserverMoodle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ questions: regularArray }),
      })
      .catch((error) => {
        console.error("Error al enviar los datos al servidor:", error);
      });
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
.language-selector {
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.language-selector h3 {
  margin-right: 10px;
}

.flag {
  width: 30px;
  height: 20px;
  cursor: pointer;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.flag:hover {
  border-color: #000;
}

</style>
