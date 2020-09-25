<template>
  <span class="icon" :class="classMap[type]"></span>
</template>

<script>
export default {
  name: 'MyIcon',
  props: {
    type: Number
  },
  data () {
    return {
      classMap: ['decrease', 'discount', 'special', 'invoice', 'guarantee']
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "../../common/stylus/mixin.styl"

  .icon
    display inline-block
    width 12px
    height 12px
    margin-right 2px
    vertical-align top
    background-size 12px 12px 
    background-repeat no-repeat
    &.decrease
      bg-image('decrease_1')
    &.discount
      bg-image('discount_1')
    &.special
      bg-image('special_1')
    &.guarantee
      bg-image('guarantee_1')
    &.invoice
      bg-image('invoice_1')
</style>