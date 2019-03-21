<template>
  <div>
    <transition name="dd">
      <div class="dd-container">
        <slot name="text">内容</slot>
      </div>
    </transition>
    <div class="dd-mask" @click="onClick"></div>
  </div>
</template>

<script>
export default {
  methods: {
    onClick() {
      this.$emit('close');
    }
  }
};
</script>

<style lang="scss" scoped>
.dd {
  &-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: table;
    transition: opacity 0.3s ease;
  }

  &-container {
    position: absolute;
    width: 200px;
    padding: 20px 30px;
    background-color: #42b983;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    transition: all 0.3s ease;
    font-family: Helvetica, Arial, sans-serif;
    color: #fff;
  }

  &-enter {
    opacity: 0;
  }

  &-leave-active {
    opacity: 0;
  }

  &-enter,&-leave-active {
    transform: scale(1.1);
  }
}
</style>
