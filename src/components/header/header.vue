<template>
  <div class="header">
    <div class="content">
      <div class="avatar">
        <img style="width: 64px" :src="seller.avatar" alt="#">
      </div>
      <div class="seller-info">
        <div class="title">
          <span class="brand"></span>
          <div class="seller-name">{{seller.name}}</div>
        </div>
        <div class="desc">
          {{seller.description}}/{{seller.deliveryTime}}分钟送达
        </div>
        <div class="support" v-if="seller.supports">
          <span class="icon" :class="classMap[seller.supports[0].type]"></span>
          <span class="text">
            {{seller.supports[0].description}}
          </span>
        </div>
        <div class="support-count" v-if="seller.supports" @click="showDetail">
          <span class="count">{{seller.supports.length}}个</span>
          <i class="icon-keyboard_arrow_right"></i>
        </div>
      </div>
    </div>
    <div class="bulletin" @click="showDetail">
      <span class="bulletin-title"></span><span class="bulletin-text">{{seller.bulletin}}</span>
      <i class="icon-keyboard_arrow_right"></i>
    </div>
    <div class="background">
      <img :src="seller.avatar" alt="background" width="100%" height="100%">
    </div>
    <div class="detail" v-show="detailShow">
      <div class="detail-wrapper">
        <div class="detail-main">
          <h1 class="name">{{seller.name}}</h1>
          <div class="star">
            <star :size="48" :score="4.5"></star>
          </div>
          <div class="title">
            <div class="line"></div>
            <div class="text">优惠信息</div>
            <div class="line"></div>
          </div>
          <ul class="supports" v-if="seller.supports">
            <li 
              class="support-item" 
              v-for="(item, i) of seller.supports" 
              :key="i"
            >
              <span class="icon" :class="classMap[seller.supports[i].type]"></span>
              <span class="text">{{seller.supports[i].description}}</span>
            </li>
          </ul>
          <div class="title">
            <div class="line"></div>
            <div class="text">商家公告</div>
            <div class="line"></div>
          </div>
          <p class="info">
            {{seller.bulletin}}
          </p>
        </div>
      </div>
      <div class="detail-close" @click="detailShow=false">
        <i class="icon-close"></i>
      </div>
    </div>
  </div>
</template>

<script>
import star from '@/star/star'

export default {
  name: 'HomeHeader',
  components: {
    star
  },
  props: {
    seller: Object
  },
  data () {
    return {
      classMap: ['decrease', 'discount', 'special', 'invoice', 'guarantee'],
      detailShow: false
    }
  },
  methods: {
    showDetail () {
      this.detailShow = true
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "../../common/stylus/mixin.styl"

  .header
    overflow hidden
    position relative
    color #fff
    background-color rgba(7, 17, 27, .5)
    .content
      display flex
      padding 24px 12px 18px 24px
      .seller-info
        position relative
        flex 1
        margin-left 16px
        .title
          display flex
          margin-top 2px
          .brand
            display inline-block
            width 30px
            height 18px
            bg-image('brand')
            background-size 30px 18px
            background-repeat no-repeat
          .seller-name
            margin-left 12px
            line-height 18px
            font-weight bold
        .desc
          margin-top 8px
          font-size 12px
          line-height 12px
          font-weight 200
        .support
          margin-top 10px
          .icon
            display inline-block
            width 12px
            height 12px
            margin-right 2px
            vertical-align middle
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
          .text
            font-size 10px
            line-height 12px
            font-weight 200
        .support-count
          position absolute
          right 12px
          bottom -8px
          line-height 24px
          font-size 10px
          padding 0 8px
          background-color rgba(0, 0, 0, .2)
          border-radius 14px
          display flex
          align-items center
          .count
            margin-right 2px
    .bulletin
      position relative
      height 28px
      line-height 28px
      padding 0 22px 0 12px
      white-space nowrap
      overflow hidden
      text-overflow ellipsis
      background-color rgba(7, 17, 27, .2)
      .bulletin-title
        display inline-block
        width 22px
        height 12px
        vertical-align top
        bg-image('bulletin')
        background-size 22px 12px
        background-repeat no-repeat
        margin-top 8px
      .bulletin-text
        margin 0 4px
        vertical-align top
        font-size 10px
      .icon-keyboard_arrow_right
        position absolute
        font-size 10px
        right 12px
        top 9px
    .background
      position absolute
      top 0
      left 0
      right 0
      bottom 0
      z-index -1
      filter blur(10px)
    .detail
      position fixed
      width 100%
      height 100%
      overflow auto
      background rgba(7, 17, 27, .8)
      z-index 100
      top 0
      .detail-wrapper
        min-height 100%
        .detail-main
          min-height 100%
          padding 64px 0
          box-sizing border-box
          .name
            text-align center
          .star
            display flex
            justify-content center
            margin 16px 0 24px
          .title
            display flex
            width 80%
            margin 0 auto
            .line
              flex 1
              position relative
              top 6px
              height 0
              border-bottom 1px solid rgba(255, 255, 255, .2)
            .text
              padding 0 12px
              font-weight 700
              font-size 14px
          .supports
            width 80%
            margin 24px auto 28px
            padding 0 12px
            box-sizing border-box
            .support-item
              font-size 0
              margin-bottom 12px
              &:last-child
                margin-bottom 0
              .icon
                display inline-block
                width 16px
                height 16px
                background-size 16px 16px
                margin-right 6px
                vertical-align top
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
              .text
                font-size 12px
                line-height 16px
                font-weight 200
                color #fff
          .info
            width 80%
            margin 24px auto 0
            padding 0 12px
            font-size 12px
            line-height 24px
            font-weight 200
            color #fff
            box-sizing border-box
      .detail-close
        width 32px
        height 32px
        margin -64px auto 0
        font-size 32px
        clear both
</style> 