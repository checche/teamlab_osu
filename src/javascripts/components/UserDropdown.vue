<template>
  <div class="ddmain">
  <li class="btn" id="show-dropdown" @click="showDropdown = true">参加者リスト</li>
  <BaseDropdown v-if="showDropdown" @close="closeDropdown">
      <template slot="text" v-for="user in $props.userList">
        <li class="name">{{ user.name }}: {{ user.room }}</li>
      </template>
  </BaseDropdown>
  </div>
</template>

<script>
import BaseDropdown from './BaseDropdown.vue';
import VueTypes from 'vue-types';

export default {
  components: {
    BaseDropdown,
  },
  props: {
    userList: VueTypes.objectOf(String).isRequired,
  },
  data() {
    return {
      showDropdown: false,
    };
  },
  methods: {
    closeDropdown() {
      this.$data.showDropdown = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.ddmain {
  position: relative;
}

.btn {
  display: inline-block;
  cursor: pointer;
}

.name {
  display: list-item;
  list-style: none;
  border-bottom: 1px;
  border-color: #fff;
}

</style>
