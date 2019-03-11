<template>
<div>
  <button class="btn" id="show-modal" @click="showModal = true">名前を変更する</button>
  <BaseModal v-if="showModal" @close="closeModal">
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
    /**
     * 閉じたとき
     */
    closeModal() {
      this.$data.showModal = false;
      this.$emit('closeModal');
    },
    /**
     * 名前を送信したとき
     */
    onSubmit(text) {
      this.$data.showModal = false;
      this.$emit('changeName', text);
    },
  }
};
</script>

<style lang=scss scoped>
div {
  height: 50px;
  display: table-cell;
}

.btn {
  height: 30px;
  border-radius: 5px;
}

</style>

