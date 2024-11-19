<template>
    <div class="input">
      <textarea 
        class="custom-textarea-input"
        v-model="inputValue"
        placeholder="Enter the instructions or topic to generate an assessment question. Example: 'Create a multiple-choice question about photosynthesis.'"
      ></textarea>
      <button class="GenerateButton" :disabled="isLoading" @click="handleGenerate">
        {{ isLoading ? "Generating..." : "Generate" }}
      </button>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </div>
</template>
  
<script>
  export default {
    props: {
      isLoading: Boolean,
    },
    data() {
      return {
        inputValue: "",
        errorMessage: null,
      };
    },
    methods: {
      handleGenerate() {
        if (!this.inputValue.trim()) {
          this.errorMessage = "Please enter a valid prompt!";
          return;
        }
        this.errorMessage = null;
        this.$emit("generate", this.inputValue);
      },
    },
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
  