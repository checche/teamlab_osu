<template>
<div>
  <button id="show-modal" @click="showModal = true">名前を変更する</button>
  <BaseModal v-if="showModal" @close="showModal = false">
    <h3 slot="header">ユーザー名を入力してください.</h3>
    <InputForm slot="body" @submit="onSubmit">
      <span slot="bname">名前変更</span>
    </InputForm>
    <small slot="footer">おもしろい名前にしましょう.</small>
  </BaseModal>
</div>
</template>

<script>
import BaseModal from './BaseModal.vue';
import InputForm from './InputForm.vue';

export default {
  components: {
    BaseModal,
    InputForm
  },
  data() {
    return {
      showModal: true
    };
  },
  methods: {
    onSubmit(text) {
      this.$emit('changeName', text);
      this.$data.showModal = false;
    }
  }
};
</script>
