<template>
  <form @submit="onSubmit">
      <input v-model="$data.text" type="text" placeholder="" />
      <button type="submit" :disabled="$data.text === ''">送信</button>
    </form>
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
//
</style>

