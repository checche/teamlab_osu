<template>
  <div class="wrapper">
    <header>
    <p>
      <img class="logo" src="../images/logo.jpg" alt="ロゴ">
      <span class="sample">サンプル</span>
      <span>ようこそ{{ $data.name }}さん</span>
    </p>
    <NameModal @changeName="setName" />
    </header>
    <div class="container">
    <InputFormArea @submit="onSubmit" />
    <TextList :textList="$data.textList" />
    </div>
    <footer></footer>
  </div>
</template>

<script>
import socket from './utils/socket';

// components
import InputForm from './components/InputForm.vue';
import InputFormArea from './components/InputFormArea.vue';
import TextList from './components/TextList.vue';
import NameModal from './components/NameModal.vue';

export default {
  components: {
    InputForm, // InputForm:InputFormの省略形
    InputFormArea,
    TextList,
    NameModal
  },
  data() {
    const textList = [];
    return {
      name: '匿名希望',
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
        text: text,
        name: this.$data.name,
      };
      socket.emit('send', textDetail);
      this.$data.text = '';
    },
    setName(name) {
      this.$data.name = name;
    }
  }
};
</script>

<style lang="scss" scoped>
header {
  margin: 0 0 10px 0;
}

.logo {
  width: 40px;
}

.sample {
  color: $red;
}

.wrapper {
  width: 80%;
  max-width: 960px;
  margin: 0 auto;
}
</style>
