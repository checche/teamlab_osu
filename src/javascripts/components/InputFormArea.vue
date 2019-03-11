<template>
<div>
  <form @submit="onSubmit">
    <textarea v-model="$data.text" type="text" placeholder="" />
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
.btn {
  height: 30px;
  border-radius: 5px;
}

textarea {
  padding: 10px;
  width: 85%;
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33) inset;
}

</style>

