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
            {{ $t('deleteAnswerButton') }}
          </button>
          <button class="confirm-button" @click="handleOption('modifyAnswer', index)">
            {{ $t('modifyAnswerButton') }}
          </button>
          <button
            v-if="isEditing && selectedTextarea === index"
            class="confirm-button"
            @click="saveQuestion(index)"
          >
          {{ $t('SaveButton') }}
          </button>
        </div>
      </div>
      <div class="send-container">
        <button class="confirm-button" @click="sendAllToMoodle">
          {{ $t('sendToMoodleButton') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n';

export default {
  props: {
    generatedQuestion: String,
    selectedQuestionTypeName: String
  },
  setup() {
    const t = useI18n();
    return t;
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
        this.jsonQuestions.splice(index, 1); 
      } else if (option === "modifyAnswer") {
        alert(this.t('modifyOptionAlert', { question: this.generatedQuestionsArray[index] })); 
        this.isEditing = true;
      }
    },
    updateQuestion(value, index) {
      this.generatedQuestionsArray[index] = value; 
    },
    saveQuestion(index) {
      this.isEditing = false;
      this.selectedTextarea = null;

      // Update jsonQuestions with the modified content.
      const modifiedQuestion = this.generatedQuestionsArray[index];
      const questionData = this.jsonQuestions[index];
      console.log(modifiedQuestion);
      console.log(questionData);
      if (!questionData) {
        console.error(`No se encontró jsonQuestions en el índice ${index}`);
        return;
      }
      if (questionData.type === "multipleChoice") {
        const parts = modifiedQuestion.split('\n');
        const questionText = parts[0].split(': ')[1].trim();
        const answers = parts[1].split(': ')[1].trim().split(", ");
        const correctAnswer = parts[2].split(': ')[1].trim();

        this.jsonQuestions[index] = {
          ...questionData,
          question: questionText,
          answers: answers.join(", "),
          correctAnswer: correctAnswer,
        };
      } else if (questionData.type === "openAnswer") {
        const parts = modifiedQuestion.split('\n');
        const questionText = parts[0].split(': ')[1].trim();
        const correctAnswer = parts[1].split(': ')[1].trim();

        this.jsonQuestions[index] = {
          ...questionData,
          question: questionText,
          answer: correctAnswer,
        };
      } else if (questionData.type === "True" || questionData.type === "False") {
        const parts = modifiedQuestion.split('\n');
        const newType = parts[0].split(': ')[1].trim();
        const topic = parts[1].split(': ')[1].trim(); 
        const text = parts[2].split(': ')[1].trim();
        const correct = parts[3].split(': ')[1].trim();

        this.jsonQuestions[index] = {
          ...questionData,
          type: newType,
          topic: topic,
          text: text,
          correct: correct,
        };
      }
      console.log("this.jsonQuestions:", this.jsonQuestions);
      
      alert(this.t('questionUpdatedAlert', { index: index + 1 }));
    },
    sendAllToMoodle() {
      alert(this.t('allQuestionsSentAlert')); 
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
      const regex1 = /(\d+\.\s+)["'](.+?)["']\s*\[(.*?)\]/g; 
      const answerRegex1 = /([=~])\s*([^~\]]+)/g;

      const regex2 = /(.+?) \[(.+?)\]/g; // Capture the question and answers.
      const answerRegex2 = /(=|\~)(.+?)(?=(=|\~)|$)/g; // Capture each answer individually


      let filteredQuestion;
      const questions = [];
      const jsonQuestions = [];

      while ((filteredQuestion = regex1.exec(rawText)) !== null) {
        const questionText = filteredQuestion[2].trim(); // Questions
        const rawAnswers = filteredQuestion[3]; // Answers

        const answers = [];
        let correctAnswer = null;
        let filteredAnswer;

        while ((filteredAnswer = answerRegex1.exec(rawAnswers)) !== null) {
          const isCorrect = filteredAnswer[1] === "="; // Correct?
          const answerText = filteredAnswer[2].trim();
          answers.push(answerText);
          if (isCorrect) {
            correctAnswer = answerText; // Save the correct answer
          }
        }

        questions.push(`-${this.t('Question')} ${questionText}\n-${this.t('Answers')} ${answers.join(", ")}\n-${this.t('CorrectAnswer')} ${correctAnswer}`);
        jsonQuestions.push({
          type: "multipleChoice",
          question: questionText,
          answers: answers.join(", "),
          correctAnswer: correctAnswer,
        });
      }

      if (questions.length === 0) {
        console.log("regex1 falló");
        while ((filteredQuestion = regex2.exec(rawText)) !== null) {
          const questionText = filteredQuestion[1].trim(); // Question
          const rawAnswers = filteredQuestion[2]; // Answers
          console.log(filteredQuestion);
          
          const answers = [];
          let correctAnswer = null;
          let filteredAnswer;

          while ((filteredAnswer = answerRegex2.exec(rawAnswers)) !== null) {
            const isCorrect = filteredAnswer[1] === "="; // Correct?
            const answerText = filteredAnswer[2].trim();
            answers.push(answerText);
            if (isCorrect) {
              correctAnswer = answerText; // Save the correct answer
            }
          }

          questions.push(`-${this.t('Question')} ${questionText}\n-${this.t('Answers')} ${answers.join(", ")}\n-${this.t('CorrectAnswer')} ${correctAnswer}`);
          jsonQuestions.push({
            type: "multipleChoice",
            question: questionText,
            answers: answers.join(", "),
            correctAnswer: correctAnswer,
          });
        }
      }

      return [questions, jsonQuestions];
    },

    parseQuestionsOpenAnswer(rawText) {
      const regex1 = /(.+?)\[\s*=\s*([^\]]+)\]/g;
      const regex2 = /['"](.*?)['"]\{=\s*([^}]+)\}/g;
  
      let filteredText;
      const questions = [];
      const jsonQuestions = [];
      
      while ((filteredText = regex1.exec(rawText)) !== null) {
        const questionText = filteredText[1].trim(); // Question
        const correctAnswer = filteredText[2].trim(); // Correct Answer
        
        questions.push(`${this.t('Question')} ${questionText}\n${this.t('CorrectAnswer')} ${correctAnswer}`);
        jsonQuestions.push({
          type: "openAnswer",
          question: questionText,
          answer: correctAnswer
        });
      }
      
      if (questions.length === 0) {
        while ((filteredText = regex2.exec(rawText)) !== null) {
          const questionText = filteredText[1].trim(); // Question
          const correctAnswer = filteredText[2].trim(); // Correct Answer
          
          questions.push(`${this.t('Question')} ${questionText}\n${this.t('CorrectAnswer')} ${correctAnswer}`);
          jsonQuestions.push({
            type: "openAnswer",
            question: questionText,
            answer: correctAnswer
          });
        }
      }
      
      return [questions, jsonQuestions]
    },
    parseQuestionTrueOrFalse(rawText) {
      const regex = /::(True|False)Statement sobre ([^:]+)::'([^']+)'\[(True|False)\]/g;
      let filteredText;
      const questions = [];
      const jsonQuestions = [];
      while ((filteredText = regex.exec(rawText)) !== null) {
        questions.push(`Tipo: ${filteredText[1]}\nTema: ${filteredText[2]}\nTexto: ${filteredText[3]}\nCorrecta: ${filteredText[4]}`);
        jsonQuestions.push({
        type: filteredText[1],
        topic: filteredText[2],
        text: filteredText[3],
        correct: filteredText[4]
      });
      }
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
