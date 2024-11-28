<template>
  <div class="output">
    <div v-if="generatedQuestions.length > 0">
      <div
        v-for="(question, index) in generatedQuestions"
        :key="index"
        class="textarea-container"
      >
        <textarea
          class="custom-textarea-output"
          readonly
          :value="question"
          @click="selectTextarea(index)"
        ></textarea>
        <div v-if="selectedTextarea === index" class="options-container">
          <button class="confirm-button" @click="handleOption('deleteAnswer', index)">
            Delete Answer
          </button>
          <button class="confirm-button" @click="handleOption('modifyAnswer', index)">
            Modify Answer
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
  },
  data() {
    return {
      selectedTextarea: null,
    };
  },
  computed: {
    generatedQuestions() {
      const regex = /\d+\.\s+/g;
      let cleanedText = this.generatedQuestion.trim();
      const parts = cleanedText.split(/1\./);
      if (parts.length > 1) {
        cleanedText = "1." + parts[1];
      }

      const questions = cleanedText.split(regex).filter(Boolean);
      return questions;
    },
  },
  methods: {
    selectTextarea(index) {
      this.selectedTextarea = index;
    },
    handleOption(option, index) {
      if (option === "deleteAnswer") {
        this.generatedQuestions.splice(index, 1); // Borra la respuesta
      } else if (option === "modifyAnswer") {
        alert(`Modify Answer clicked for question: ${this.generatedQuestions[index]}`);
      }
      this.selectedTextarea = null; 
    },
    sendAllToMoodle() {
      alert("All questions sent to Moodle!");
    },
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
  width: 100%;
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
