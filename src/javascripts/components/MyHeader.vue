<template>
  <header>
    <img class="logo" src="../../images/logo.jpg" alt="ロゴ">
    <ul>
      <li>チャット</li>
      <li><span class="welcome">ようこそ{{ $props.name }}さん</span></li>
      <li class="btn"><NameModal @closeModal="_entry" @changeName="_setName"/></li>
      <li class="btn"><UserDropdown :userList="$props.userList"/></li>
      <li>
        <select :value="$props.searchWord" @change="$emit('cRoom', $event.target.value)">
          <option disabled value="">部屋名</option>
          <option>A</option>
          <option>B</option>
          <option>C</option>
        </select>
      </li>
      <li><input placeholder="検索" class="searchbox" type="text" :value="$props.searchWord" @input="$emit('input', $event.target.value)"></li>
      <li class="btn"><span @click="$emit('getwiki')">話題をwikipediaから探す</span></li>
      <li>{{ $props.theme }}</li>
    </ul>

    </header>
</template>

<script>
import VueTypes from 'vue-types';
import NameModal from './NameModal.vue';
import UserDropdown from './UserDropdown.vue';

export default {
  components: {
    NameModal,
    UserDropdown,
  },
  props: {
    theme: VueTypes.string,
    roomName: VueTypes.string,
    searchWord: VueTypes.string,
    name: VueTypes.string.isRequired,
    userList: VueTypes.objectOf(String).isRequired,
  },
  methods: {
    _entry() {
      this.$emit('cModal');
    },
    _setName(name) {
      this.$emit('cName', name);
    }
  }
};
</script>

<style lang="scss" scoped>
header {
  color: #fff;
  z-index: 100;
  top: 0;
  position: fixed;
  background-color: #42b983;
  width: 100%;
  height: auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
}

ul {
  margin: 0;
}

li {
  display: inline-block;
  margin-right: 10px;
  height: 50px;
  line-height: 50px;
}

.btn {
  cursor: pointer;

  &:hover {
    background-color: #2e835d;
    box-shadow: 0 2px 7px rgba(0, 0, 0, 0.33) inset;
  }
}

img {
  height: 50px;
  margin: 0;
  float: left;
}

input {
  padding: 5px;
  border-radius: 5px;
  box-shadow: 0 2px 7px rgba(0, 0, 0, 0.33) inset;
}

</style>
