<template>
  <transition-group tag="ul" class="list" name="flip">
    <template v-for="item in $props.textList">
      <li
        :key="item.id"
        class="item"
      >
        <span class="item__name">{{ item.name }}</span>
        <span class="item__text">{{ item.text }}</span>
        <span class="item__date">{{ item.date }}</span>
      </li>
    </template>
  </transition-group>
</template>

<script>
import VueTypes from 'vue-types';

export default {
  props: {
    textList: VueTypes.arrayOf(VueTypes.shape({
      id: VueTypes.number.isRequired,
      text: VueTypes.string.isRequired,
      name: VueTypes.string.isRequired,
      date: VueTypes.string.isRequired,
    })).isRequired
  },
  methods: {
  }
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}

.list {
  position: relative;
  padding: 0;
}

.item {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  transition: all 0.5s;
  padding: 10px;
  margin-top: 10px;
  border: solid 1px #ddd;
  border-radius: 5px;
  box-shadow: 0 0 10px 0 rgba(#000, 0.1);
  cursor: pointer;

  &__name {
    background-color: #fff;
    border-radius: 10px;
    line-height: 30px;
    padding: 10px;
    color: #42b983;
  }

  &__text {
    flex: 1 1 0;
    padding: 0 5px;
    white-space: pre-line;
    color: #2c3e50;
  }

  &__date {
    color: #999;
  }
}

.flip {
  // 要素が動くときにtransitionを設定する（.itemでtransitionを設定しているため-moveで書く必要はない）
  &-move {
    transition: transform 0.5s;
  }

  // 要素が入るときのアニメーション
  &-enter {
    &-active {
      opacity: 0;
      transform: translate3d(0, 30px, 0);
    }

    &-to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }

  // 要素が消える時のアニメーション
  &-leave {
    &-active {
      position: absolute;
    }

    &-to {
      opacity: 0;
      transform: translate3d(0, -30px, 0);
    }
  }
}
</style>
