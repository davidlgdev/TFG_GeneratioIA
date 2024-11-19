<template>
    <div class="output">
      <textarea
        class="custom-textarea-output"
        readonly
        v-if="generatedQuestion"
        :value="generatedQuestion"
      ></textarea>
      <div v-if="generatedQuestion" class="radio-container">
            <h3>What to do with the generated answer?</h3>
            <label class="radio-option">
                <input
                type="radio"
                name="responseOption"
                value="sendToMoodle"
                v-model="selectedOption"
                />
                Send to Moodle
            </label>
            <label class="radio-option">
                <input
                type="radio"
                name="responseOption"
                value="deleteAnswer"
                v-model="selectedOption"
                />
                Delete Answer
            </label>
            <label class="radio-option">
                <input
                type="radio"
                name="responseOption"
                value="modifyAnswer"
                v-model="selectedOption"
                />
                Modify Answer
            </label>
            <button class="confirm-button" @click="confirmOption">
                Confirm
            </button>
        </div>
    </div>
</template>
<script>
  export default {
    props: {
      generatedQuestion: String,
    },
    methods: {
    confirmOption() {
      if (!this.selectedOption) {
        alert("Please select an option before proceeding!");
        return;
      }
      this.$emit(this.selectedOption, this.generatedQuestion);
    },
  },
  };
</script>
<style>
.custom-textarea-output {
    position: absolute;
    top: 250px;
    left: 1143px;
    width: 600px;
    height: 300px;
    border-radius: 10px;
    padding: 8px;
    font-size: 16px;
    background-color: #fdfdfd;
    resize: none;
    overflow-y: auto;
    white-space: pre-wrap;
}
.radio-container {
    position: absolute;
    top: 560px;
    left: 1143px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.radio-container h3 {
    font-size: 20px; 
    color: black;
}
.radio-option {
    font-size: 16px; 
    color: black;
    display: flex;
    align-items: center;
}
.radio-option input {
    width: 20px; 
    height: 20px; 
    margin-right: 15px; 
}
.confirm-button {
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
  