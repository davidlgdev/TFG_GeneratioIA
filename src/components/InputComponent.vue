<template>
    <div class="input">
      <textarea 
        class="custom-textarea-input"
        v-model="inputValue"
        :placeholder="swapPlaceholder"
        ></textarea>
      <button class="GenerateButton" :disabled="isLoading" @click="handleGenerate">
        {{ isLoading ? "Generating..." : "Generate" }}
      </button> 
      <p v-if="errorMessage" :style="{ color: 'red', fontSize: '18px', marginTop: '10px' }"> {{ errorMessage }}
      </p>    </div>
</template>
  
<script>
  export default {
    props: {
      selectedQuestionType: String,
      isLoading: Boolean,
    },
    data() {
      return {
        inputValue: "",
        errorMessage: null,
        selectedQuestionTypeName: String
      };
    },
    methods: {
      handleGenerate() {
        if (!this.inputValue.trim()) {
          this.errorMessage = "Please enter a valid prompt!";
          return;
        }
        this.errorMessage = null;
        this.$emit("generate", this.inputValue, this.selectedQuestionTypeName);
      },
    },
    computed: {
      swapPlaceholder() {
        switch (this.selectedQuestionType) {
          case " en el siguiente formato GIFT: Question{= Respuesta correcta ~Opción incorrecta 1 ~Opción incorrecta 2 ~Opción incorrecta 3 ~Opción incorrecta 4 }":
            this.selectedQuestionTypeName = "multipleChoice"
            return "Enter the instructions or topic for a multiple-choice question. Example: 'Create X multiple-choice question/s about photosynthesis.'";
          //multiple choice
          case " en el siguiente formato GIFT: 'Question'{= Respuesta correcta}":
          this.selectedQuestionTypeName = "openAnswer"
            return "Enter the instructions or topic for an open-answer question. Example: 'Create X open-answer question/s about the French Revolution.'";
          //open answer
          case " en el siguiente formato GIFT, si pregunta verdadera ::TrueStatement sobre el 'tema'::'Question'{True}, si pregunta falsa ::FalseStatement sobre el 'tema'::'Question'{False}":
            this.selectedQuestionTypeName = "trueOrFalse"
            return "Enter the instructions or topic for a true/false question. Example: 'Create X true/false question/s about global warming.'";
          //true or false
          default:
            return "Select a question type";
        }
      }
    }
  };
</script>
  
<style>
.custom-textarea-input {
  position: absolute;
  top: 250px;
  left: 100px;
  width: 600px;
  height: 200px;
  border-radius: 10px;
  padding: 8px;
  font-size: 16px;
  background-color: #fdfdfd;
  resize: none;
  overflow-y: auto;
}
.GenerateButton {
    position: absolute;
    top: 475px;
    left: 100px;
    width: 600px;
    background-color: #2C2C2C;
    color: white;
    border-radius: 5px;
    cursor: pointer;
    border: none;
    padding: 10px 15px;
    text-align: center;

}
</style>
  