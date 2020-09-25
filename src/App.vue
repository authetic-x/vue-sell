<template>
  <div id="app">
    <home-header :seller="seller"></home-header>
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评价</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <keep-alive>
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
import HomeHeader from '@/header/header'
import axios from 'axios'
// import { urlParse } from './common/js/url';

export default {
  name: 'App',
  components: {
    HomeHeader
  },
  data () {
    return {
      seller: {}
    }
  },
  mounted () {
    axios.get('/api/seller')
        .then(res => {
      if (res.data.errno === 0) {
        this.seller = res.data.seller
      }
    })
  }
}
</script>

<style lang="stylus" scoped>
  @import './common/stylus/mixin.styl'

  .tab
    display flex
    width 100%
    line-height 40px
    border-1px(rgba(7, 17, 27, .1))
    .tab-item
      flex 1
      text-align center
      & > a
        display block
        font-size 14px
        color rgb(77, 85, 93)
      .router-link-active
        color rgb(240, 20, 20)
</style>
