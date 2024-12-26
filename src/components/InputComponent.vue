<template>
    <div class="input">
      <textarea 
        class="custom-textarea-input"
        v-model="inputValue"
        :placeholder="swapPlaceholder"
        ></textarea>
      <button class="GenerateButton" :disabled="isLoading" @click="handleGenerate">
        {{ isLoading ? $t('GeneratingButton') : $t('GenerateButton') }}
      </button> 
      <p v-if="errorMessage" :style="{ color: 'red', fontSize: '18px', marginTop: '10px' }"> {{ errorMessage }}
      </p>    </div>
</template>
  
<script>
  import { useI18n } from 'vue-i18n'; 

  export default {
    props: {
      selectedQuestionType: String,
      isLoading: Boolean,
    },
    setup() {
      const t  = useI18n();
      return t;
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
          case this.$t('caseMultipleChoice'):
            this.selectedQuestionTypeName = "multipleChoice"
            return this.$t('placeholderMultiplechoice');
          //multiple choice
          case this.$t('caseOpenAnswer'):
          this.selectedQuestionTypeName = "openAnswer"
          return this.$t('placeholderOpenasnwer');
          //open answer
          case this.$t('caseTrueOrFalse'):
            this.selectedQuestionTypeName = "trueOrFalse"
            return this.$t('placeholderTrueorFalse');
          //true or false
          default:
            this.selectedQuestionTypeName = null;
            return this.$t('placeholderDefault');
        }
      }
    }
  };
</script>
  
<style>
.custom-textarea-input {
  position: absolute;
  top: 325px;
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
    top: 560px;
    left: 100px;
    width: 617px;
    background-color: #2C2C2C;
    color: white;
    border-radius: 5px;
    cursor: pointer;
    border: none;
    padding: 10px 15px;
    text-align: center;

}
</style>
  