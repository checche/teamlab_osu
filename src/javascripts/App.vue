<template>
  <div>
    <div class="bg__mask"><div class="bg__wrapper"><div class="bg__container">{{ $data.roomName }}</div></div></div>
    <MyHeader
      :name="$data.name"
      :userList="$data.userList"
      :theme="$data.theme"
      @changeRoom="changeRoom"
      @changeName="setName"
      @closeModal="entry"
      @input="inputSearchText"
      @getwiki="getwiki"
    />

    <div class="main">
      <div class="container">
        <TextList :textList="$data.textList" :searchText="$data.searchText"/>
      </div>
      <div id="textBottom"></div>
    </div>
    <footer>
      <div class="container">
        <InputFormArea @submit="onSubmit" />
      </div>
    </footer>

  </div>
</template>

<script>
import socket from './utils/socket';

// components
import InputForm from './components/InputForm.vue';
import InputFormArea from './components/InputFormArea.vue';
import TextList from './components/TextList.vue';
import MyHeader from './components/MyHeader.vue';

export default {
  components: {
    InputForm, // InputForm:InputFormの省略形
    InputFormArea,
    TextList,
    MyHeader,
  },
  data() {
    const textList = [];
    return {
      firstEntry: true,
      preName: '',
      name: '匿名希望',
      text: '',
      textList: textList.map((item, index) => ({ ...item, id: index })),
      userList: {},
      searchText: '',
      roomName: '',
      theme: ''
    };
  },
  created() {
    socket.on('connect', () => {
      console.log('connected!');
    });

    /**
     * 受け取ったtextDetailをもとにtextListを更新
     * @param {object} textDetail - id,text,date,nameが格納されてる
     */
    socket.on('sendToC', (textDetail) => {
      console.log(textDetail);
      this.$data.textList.push(textDetail);
      const element = document.getElementById('textBottom'); // 移動させたい位置の要素を取得
      const rect = element.getBoundingClientRect();
      const position = rect.bottom;    // 一番上からの位置を取得
      setTimeout(() => scrollTo(0, position), 0);
    });

    socket.on('sendUL', (ul) => {
      console.log(ul);
      this.$data.userList = ul;
    });
    socket.on('sendThemeToC', (theme) => {
      this.$data.theme = theme;
    });
    socket.on('sendRoomName', (room) => {
      this.$data.roomName = room;
    });
  },
  methods: {
    getwiki() {
      socket.emit('getWiki');
    },
    inputSearchText(word) {
      this.$data.searchText = word;
    },
    booledit(text) {
      if (text === '') {
        this.$data.editting = false;
      } else if (text !== '') {
        this.$data.editting = true;
      }
    },
    /**
     * InputFormから受け取ったtextをもとにtextDetailをソケットに送信
     * @param {string} text - 文
     */
    onSubmit(text) {
      const textDetail = {
        text: text,
        name: this.$data.name,
      };
      socket.emit('sendToS', textDetail, this.$data.roomName);
      this.$data.text = '';
    },
    /**
     * 名前を登録したとき
     * @param {string} name - 新しい名前
     */
    setName(name) {
      // 初なら入室と表示
      if (this.$data.firstEntry === true) {
        this.$data.preName = this.$data.name;
        this.$data.name = name;
        socket.emit('entry', this.$data.name);
        socket.emit('entryMessageToYou', this.$data.name);
        this.$data.firstEntry = false;
      } else if (this.$data.name !== name) { // 2回め以降は改名と表示.同じ名前には変更できない.
        this.$data.preName = this.$data.name;
        this.$data.name = name;
        socket.emit('rename', this.$data.name, this.$data.preName);
      };
    },
    /**
     * モーダルを閉じたとき
     */
    entry() {
      // 初なら匿名希望として入室,二回目以降は何もしない
      if (this.$data.firstEntry === true) {
        socket.emit('entry', this.$data.name);
        socket.emit('entryMessageToYou', this.$data.name);
        this.$data.firstEntry = false;
      };
    },
    changeRoom(room) {
      this.$data.roomName = room;
      socket.emit('changeRoom', this.$data.roomName);
    },
  }
};
</script>

<style lang="scss" scoped>
.bg {
  &__mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: table;
  }

  &__wrapper {
    display: table-cell;
    vertical-align: middle;
  }

  &__container {
    width: 300px;
    margin: 0 auto;
    padding: 20px 30px;
    border-radius: 2px;
    transition: all 0.3s ease;
    font-family: Helvetica, Arial, sans-serif;
    font-size: 30vw;
    text-align: center;
    color: #42b98323;
  }
}

.userlist {
  color: #2c3e50;
}

.welcome {
  color: #fff;
}

.logo {
  width: 40px;
}

.sample {
  color: #2c3e50;
}

.container {
  width: 80%;
  max-width: 960px;
  margin: 0 auto;
}

.main {
  margin: 50px 0 100px 0;
}

footer {
  background-color: #42b983;
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 100px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
}
</style>
