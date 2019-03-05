<template>
  <div>
    <p>
      <img class="logo" src="../images/logo.jpg" alt="ロゴ">
      <span class="sample">サンプルfdf</span>
    </p>
    <InputForm @submit="onSubmit" />
    <TextList :textList="$data.textList" />
  </div>
</template>

<script>
import socket from './utils/socket';

// components
import MyComponent from './components/MyComponent.vue';
import InputForm from './components/InputForm.vue';
import TextList from './components/TextList.vue';

export default {
  components: {
    MyComponent,
    InputForm,
    TextList
  },
  data() {
    const textList = [];
    return {
      message: '',
      text: '',
      textList: textList.map((item, index) => ({ ...item, id: index })),
      /**
       * 次のtextに降るID番号
       */
      nextTextId: textList.length
    };
  },
  created() {
    socket.on('connect', () => {
      console.log('connected!');
    });

    /**
     * 受け取ったtextDetailをもとにtextListを更新
     * その後nextTextIdをインクリメント
     * @param {object} textDetail - idとtextが格納されてる
     */
    socket.on('send', (textDetail) => {
      console.log(textDetail);
      this.$data.textList.unshift(textDetail);
      this.$data.nextTextId += 1;
    });
  },
  methods: {
    /**
     * InputFormから受け取ったtextをもとにtextDetailをソケットに送信
     * @param {string} text - 文
     */
    onSubmit(text) {
      const textDetail = {
        id: this.$data.nextTextId,
        text: text
      };
      socket.emit('send', textDetail);
      this.$data.text = '';
    },
  }
};
</script>

<style lang="scss" scoped>
.logo {
  width: 40px;
}

.sample {
  color: $red;
}
</style>
