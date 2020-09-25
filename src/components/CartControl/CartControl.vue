<template>
  <div class="cart-control">
    <transition name="move">
      <div 
        class="cart-decrease icon-remove_circle_outline" 
        v-show="food.count"
        @click="removeCart"
      >
        <transition name="rotate">
          <span class="inner icon-remove_circle_outline" v-show="food.count"></span>
        </transition>
      </div>
    </transition>
    <div class="cart-count" v-show="food.count">{{food.count}}</div>
    <div 
      class="cart-add icon-add_circle"
      @click.stop.prevent="addCart"
    ></div>
  </div>
</template>

<script>
import Vue from 'vue';

export default {
  name: 'CartControl',
  props: {
    food: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
    addCart(e) {
      // 防止点击两次
      if (!e._constructed) {
        return;
      }
      console.log('click');
      if (!this.food.count) {
        Vue.set(this.food, 'count', 1);
      } else {
        this.food.count++;
      }
      this.$emit('addCart', e.target);
    },
    removeCart(e) {
      if (!e._constructed) {
        return;
      }
      this.food.count--;
    }
  }
}
</script>

<style lang="stylus" scoped>
.cart-control
  font-size 0
  .cart-decrease
    display inline-block
    padding 6px
    &.move-enter-active, &.move-leave-active {
      transition all .4s linear
    }
    &.move-enter, &.move-leave-to
      opacity 0
      transform translate3d(24px, 0, 0)
    .inner
      display inline-block
      font-size 24px
      color rgb(0, 160, 220)
      transform rotate(0)
      &.rotate-enter-active, &.rotate-leave-active
        transition all .4s linear
      &.rotate-enter, &.rotate-leave-to
        transform rotate(180deg)
  .cart-add
    display inline-block
    padding 6px
    font-size 24px
    color rgb(0, 160, 220)
  .cart-count
    display inline-block
    vertical-align top
    width 12px
    padding-top 6px
    line-height 24px
    text-align center
    font-size 10px
    color rgb(147, 153, 159)
</style>