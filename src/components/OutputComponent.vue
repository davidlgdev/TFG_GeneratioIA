<template>
  <div class="output">
    <div v-if="generatedQuestionsArray.length > 0">
      <div
        v-for="(question, index) in generatedQuestionsArray"
        :key="index"
        class="textarea-container"
      >
        <textarea
          class="custom-textarea-output"
          :readonly="selectedTextarea !== index || !isEditing"
          :value="question"
          @click="selectTextarea(index)"
          v-model="generatedQuestionsArray[index]"
        ></textarea>
        <div v-if="selectedTextarea === index" class="options-container">
          <button class="confirm-button" @click="handleOption('deleteAnswer', index)">
            Delete Answer
          </button>
          <button class="confirm-button" @click="handleOption('modifyAnswer', index)">
            Modify Answer
          </button>
          <button
            v-if="isEditing && selectedTextarea === index"
            class="confirm-button"
            @click="saveQuestion(index)"
          >
            Save
          </button>
        </div>
      </div>
      <div class="send-container">
        <button class="confirm-button" @click="sendAllToMoodle">
          Send to Moodle
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    generatedQuestion: String,
    selectedQuestionTypeName: String
  },
  data() {
    return {
      generatedQuestionsArray: [],
      selectedTextarea: null,
      isEditing: false,
      jsonQuestions: []
    };
  },
  mounted() {
    this.changeGeneratedQuestions();
  },
  watch: {
    generatedQuestion: "changeGeneratedQuestions",
  },
  methods: {
    
    selectTextarea(index) {
      this.selectedTextarea = index;
    },
    handleOption(option, index) {
      if (option === "deleteAnswer") {
        this.generatedQuestionsArray.splice(index, 1); 
      } else if (option === "modifyAnswer") {
        alert(`Modify option clicked for question: ${this.generatedQuestionsArray[index]}`); 
        this.isEditing = true;
      }
    },
    updateQuestion(value, index) {
      this.generatedQuestionsArray[index] = value; 
    },
    saveQuestion(index) {
      this.isEditing = false;
      this.selectedTextarea = null;
      alert(`Question ${index + 1} updated successfully!`);
    },
    sendAllToMoodle() {
      alert("All questions sent to Moodle!");
      this.$emit("sendToMoodle", this.jsonQuestions)
    },
    changeGeneratedQuestions() {
      if (!this.generatedQuestion) {
        return;
      }
      switch (this.selectedQuestionTypeName) {
        case "multipleChoice":
          console.log("Multiple Choice question");
          [this.generatedQuestionsArray, this.jsonQuestions] = this.parseQuestionMultipleChoice(this.generatedQuestion);
          break;
        case "openAnswer":
          console.log("Open Answer question");
          [this.generatedQuestionsArray, this.jsonQuestions] = this.parseQuestionsOpenAnswer(this.generatedQuestion);
          break;
        case "trueOrFalse":
          console.log("True or False question");
          [this.generatedQuestionsArray, this.jsonQuestions] = this.parseQuestionTrueOrFalse(this.generatedQuestion);
          break;
        default:
          console.log("Unknown question type");
          
      }
    },
    parseQuestionMultipleChoice(rawText) {
      const questionRegex = /(\d+\.\s+)["'](.+?)["']\s*\{(.*?)\}/g;      
      const answerRegex = /([=~])\s*([^~}]+)/g; 
      let filteredQuestion;
      const questions = [];
      const jsonQuestions = [];
      while ((filteredQuestion = questionRegex.exec(rawText)) !== null) { 
        const questionText = filteredQuestion[2].trim(); // Pregunta
        const rawAnswers = filteredQuestion[3]; // Respuestas

        const answers = [];
        let correctAnswer = null;
        let filteredAnswer;

        while ((filteredAnswer = answerRegex.exec(rawAnswers)) !== null) {
          const isCorrect = filteredAnswer[1] === "="; // correcta?
          const answerText = filteredAnswer[2].trim();
          answers.push(answerText);
          if (isCorrect) {
            correctAnswer = answerText; // Guardar respuesta correcta
          }
        }
        questions.push(`-Pregunta: ${questionText}\n-Respuestas: ${answers.join(", ")}\n-Respuesta correcta: ${correctAnswer}`);
        jsonQuestions.push({
          question: questionText,
          answers: answers.join(", "),
          correctAnswer: correctAnswer
        });
      }
      return [questions, jsonQuestions];
    },
    parseQuestionsOpenAnswer(rawText) {
      const regex = /['"](.*?)['"]\{=\s*([^}]+)\}/g;
      let filteredText;
      const questions = [];
      const jsonQuestions = [];
      while ((filteredText = regex.exec(rawText)) !== null) {
        questions.push(`Pregunta: ${filteredText[1]}\nRespuesta Correcta: ${filteredText[2]}`);
      }
      jsonQuestions.push({
        question: filteredText[1],
        answer: filteredText[2]
      });

      return [questions, jsonQuestions];
    },
    parseQuestionTrueOrFalse(rawText) {
      const regex = /::(True|False)Statement sobre ([^:]+)::'([^']+)'{(True|False)}/g;
      let filteredText;
      const questions = [];
      const jsonQuestions = [];
      while ((filteredText = regex.exec(rawText)) !== null) {
        questions.push(`Tipo: ${filteredText[1]}\nTema: ${filteredText[2]}\nTexto: ${filteredText[3]}\nCorrecta: ${filteredText[4]}`);
      }
      jsonQuestions.push({
        type: filteredText[1],
        topic: filteredText[2],
        text: filteredText[3],
        correct: filteredText[4]
      });

      return [questions, jsonQuestions];
    }
  },
};
</script>

<style>
.output {
  position: absolute;
  top: 250px;
  left: 1143px;
}

.custom-textarea-output {
  width: 200%;
  height: 200px;
  border-radius: 10px;
  padding: 8px;
  font-size: 16px;
  background-color: #fdfdfd;
  resize: none;
  overflow-y: auto;
  white-space: pre-wrap;
}

.textarea-container {
  margin-bottom: 15px;
}

.options-container {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}

.confirm-button {
  background-color: #2c2c2c;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  border: none;
  padding: 10px 15px;
  text-align: center;
}

.confirm-button:hover {
  background-color: #4b4b4b;
}

.send-container {
  margin-top: 20px;
  margin-bottom: 50px;
  display: flex;
  justify-content: center;
}
</style>
