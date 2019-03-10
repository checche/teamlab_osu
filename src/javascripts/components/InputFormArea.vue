<template>
<div>
  <form @submit="onSubmit">
      <textarea v-model="$data.text" type="text" placeholder="" />
      <button type="submit" :disabled="$data.text === ''"><slot name="bname">送信</slot></button>
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
//
</style>

