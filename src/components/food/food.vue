<template>
  <transition name="move">
    <div class="food" v-show="showFlag" ref="food">
      <div>
        <div class="food-content">
          <div class="image-header">
            <img :src="food.image">
            <div class="back" @click="hide">
              <i class="icon-arrow_lift"></i>
            </div>
          </div>
          <div class="content">
            <div class="title">{{food.name}}</div>
            <div class="detail">
              <span class="sell-count">月售{{food.sellCount}}份</span>
              <span class="rating">好评率{{food.rating}}%</span>
            </div>
            <div class="price">
              <span class="new">￥{{food.price}}</span>
              <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
            </div>
          </div>
          <div class="cartControl-wrapper">
            <cartControl :food="food"/>
          </div>
          <div class="buy" v-show="!food.count || food.count === 0"
            @click="addFirst"
          >购物车</div>
        </div>
        <Split v-show="food.info"/>
        <div class="info" v-show="food.info">
          <h1 class="title">商品信息</h1>
          <p class="text">{{food.info}}</p>
        </div>
        <Split />
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <RatingSelect :selectType="selectType" @updateSelect="updateSelectType" :onlyContent.sync="onlyContent"
            :desc="desc" :ratings="food.ratings"
          />
          <div class="rating-wrapper">
            <ul v-show="food.ratings && food.ratings.length">
              <li v-show="needShow(rating.rateType, rating.text)" class="rating-item border-1px" v-for="(rating, id) of food.ratings" :key="id">
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img class="avatar" :src="rating.avatar" width="12" height="12">
                </div>
                <div class="time">{{rating.rateTime | formatDate}}</div>
                <p class="text">
                  <span :class="{'icon-thumb_up': rating.rateType === 0, 
                  'icon-thumb_down': rating.rateType === 1}"></span>
                  {{rating.text}}
                </p>
              </li>
            </ul>
            <div class="no-rating" v-show="!food.ratings || !food.ratings.length">
              暂无评价
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Vue from 'vue';
import BScroll from 'better-scroll';
import CartControl from '@/CartControl/CartControl'
import Split from '@/split/split';
import RatingSelect from '@/RatingSelect/RatingSelect';
import { formatDate } from '../../common/js/date'

/* eslint no-unused-vars: "off" */
const POSITIVE = 0;
const NEGATIVE = 1;
const ALL = 2;

export default {
  name: 'Food',
  props: {
    food: {
      type: Object,
    },
  },
  components: {
    CartControl,
    Split,
    RatingSelect,
  },
  data() {
    return {
      showFlag: false,
      selectType: ALL,
      onlyContent: true,
      desc: {
        all: '全部',
        positive: '推荐',
        negative: '吐槽',
      }
    }
  },
  filters: {
    formatDate(time) {
      let date = new Date(time);
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  },
  methods: {
    show() {
      this.showFlag = true;
      this.selectType = ALL;
      this.onlyContent = true;
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.food, {
            probeType: 3,
            scrollY: true,
            click: true,
            mouseWheel: true
          });
        } else {
          this.scroll.refresh();
        }
      })
    },
    hide() {
      this.showFlag = false;
    },
    addFirst(e) {
      if (!e._constructed) {
        return;
      }
      if (typeof this.food.count === 'undefined') {
        Vue.set(this.food, 'count', 1);
      } else {
        this.food.count++;
      }
    },
    needShow(type, text) {
      if (this.onlyContent, !text) {
        return false;
      }
      if (this.selectType === ALL) {
        return true;
      } else {
        return type === this.selectType;
      }
    },
    updateSelectType(type) {
      this.selectType = type;
      this.$nextTick(() => {
        this.scroll.refresh();
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/mixin.styl'

.food
  position fixed
  top 0
  left 0
  right 0
  bottom 48px
  z-index 30
  background #fff
  &.move-enter-active, &.move-leave-active {
    transition all .2s linear
  }
  &.move-enter, &.move-leave-to {
    transform translate3d(-100%, 0, 0)
  }
  .food-content
    position relative
    .image-header {
      position relative
      width 100%
      height 0
      padding-bottom 100%
      img {
        position absolute
        top 0
        left 0
        width 100%
        height 100%
      }
      .back {
        position absolute
        left 0
        top 10px
        .icon-arrow_lift {
          display block
          padding 18px
          font-size 20px
          color #fff
        }
      }
    }
    .content
      padding 18px
      .title
        margin-bottom 8px
        line-height 14px
        font-size 14px
        font-weight 700
        color rgb(7, 17, 27)
      .detail {
        margin-bottom 18px
        line-height 10px
        height 10px
        font-size 0
        .sell-count, .rating {
          font-size 10px
          color rgb(147, 153, 159)  
        }
        .sell-count {
          margin-right 12px
        }
      }
      .price
        font-weight 700
        line-height 24px
        .new
          margin-right 8px
          font-size 14px
          color rgb(240, 20, 20)
        .old
          text-decoration line-through
          font-size 10px
          color rgb(147, 153, 159)
    .cartControl-wrapper
      position absolute
      right 12px
      bottom 12px
    .buy
      position absolute
      right 18px
      bottom 18px
      z-index 10
      height 24px
      line-height 24px
      font-size 10px
      padding 0 12px
      box-sizing border-box
      color #fff
      border-radius 12px
      background rgb(0, 160, 200)
  .info
    padding 18px
    .title
      margin-bottom 6px
      line-height 14px
      font-size 14px
      color rgb(7, 17, 27)
    .text
      padding 0 8px
      line-height 24px
      font-size 12px
      color rgb(77, 85, 93)
  .rating
    padding-top 18px
    .title
      margin-left 18px
      line-height 14px
      font-size 14px
      color rgb(7, 17, 27)
    .rating-wrapper
      padding 0 18px
      .rating-item
        position relative
        padding 16px 0
        border-1px(rgba(7, 17, 27, .2))
        .user
          position absolute
          top 16px
          right 0
          line-height 12px
          font-size 0
          .name
            display inline-block
            vertical-align top
            margin-right 6px
            font-size 10px
            color rgb(147, 153, 159)
          .avatar
            border-radius 50%
        .time
          margin-bottom 6px
          line-height 12px
          font-size 10px
          color rgb(147, 153, 159)
        .text
          line-height 16px
          font-size 12px
          color rgb(7, 17, 27)
          .icon-thumb_up, .icon-thumb_down
            margin-right 4px
            font-size 12px
          .icon-thumb_up
            color rgb(0, 160, 220)
          .icon-thumb_down
            color rgb(147, 153, 159)
        .no-rating
          padding 16px 0
          font-size 12px
          color rgb(147, 153, 159)
</style>