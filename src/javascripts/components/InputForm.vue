<template>
<div>
  <form @submit="onSubmit">
    <input v-model="$data.text" type="text" placeholder="" />
    <button class="btn" type="submit" :disabled="$data.text === ''"><slot name="bname">送信</slot></button>
  </form>
</div>
</template>

<script>
export default {
  data() {
    return {
      text: ''
    };
  },
  methods: {
    /**
     * 送信時
     * @param {event} event - DOMのイベント
     */
    onSubmit(event) {
      event.preventDefault();
      this.$emit('submit', this.$data.text);
      this.$data.text = '';
    }
  },
};
</script>

<style lang="scss" scoped>
input {
  padding: 5px;
  border-radius: 5px;
  box-shadow: 0 2px 7px rgba(0, 0, 0, 0.33) inset;
}

.btn {
  height: 30px;
  border-radius: 5px;
}
</style>

