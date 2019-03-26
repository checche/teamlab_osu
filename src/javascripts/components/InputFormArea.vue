<template>
<div>
  <form @submit="onSubmit">
    <textarea v-model="$data.text" type="text" placeholder=""/>
    <div class="btnarea"><button class="btn" type="submit" :disabled="$data.text === ''"><slot name="bname">送信</slot></button></div>
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
  height: 100%;
  width: 100%;
  border-radius: 5px;
  color: #2c3e50;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  background-color: #fff;
}

:disabled {
  color: #2c3e50;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33) inset;
}

.btnarea {
  height: 100px;
  max-width: 192px;
  width: 20%;
  box-sizing: border-box;
  display: table-cell;
  vertical-align: middle;
}

textarea {
  padding: 10px;
  height: 100px;
  max-width: 768px;
  width: 80%;
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33) inset;
  float: left;
  box-sizing: border-box;
  color: #2c3e50;
}

</style>

