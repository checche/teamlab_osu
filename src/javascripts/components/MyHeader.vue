<template>
  <header>
    <img class="logo" src="../../images/logo.jpg" alt="ロゴ">
    <ul>
      <li>チャット</li>
      <li><a class="welcome">ようこそ{{ $props.name }}さん</a></li>
      <li><NameModal @closeModal="_entry" @changeName="_setName"/></li>
      <li><UserDropdown :userList="$props.userList"/></li>
    </ul>
    <input type="text" :value="$props.value" @input="$emit('input', $event.target.value)">
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
    value: VueTypes.string.isRequired,
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
  height: 50px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);

  ul {
    margin: 0;
  }

  li {
    display: inline-block;
    margin-right: 10px;
    height: 50px;
    line-height: 50px;
  }

  img {
    height: 50px;
    margin: 0;
    float: left;
  }
}
</style>
