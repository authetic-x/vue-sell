<template>
  <div class="rating" ref="rating">
    <div class="rating-content">
      <div class="overview">
        <div class="overview-left">
          <h1 class="score">{{seller.score}}</h1>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <star :size="36" :score="seller.serviceScore"/>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <star :size="36" :score="seller.foodScore"/>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="delivery">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <Split />
      <RatingSelect
        :ratings="ratings"
        :selectType="selectType"
        :onlyContent.sync="onlyContent"
        @updateSelect="updateSelectType"
      />
      <div class="rating-wrapper">
        <ul>
          <li class="rating-item border-1px" v-for="(rating, id) of ratings" :key="id">
            <div class="avatar">
              <img :src="rating.avatar" width="28" height="28">
            </div>
            <div class="content">
              <h1 class="name">{{rating.username}}</h1>
              <div class="star-wrapper">
                <star :size="24" :score="rating.score"/>
                <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}</span>
              </div>
              <p class="text">{{rating.text}}</p>
              <div class="recommend" v-show="rating.recommend && rating.recommend.length">
                <span class="icon-thumb_up"></span>
                <span class="item" v-for="(item, id) of rating.recommend" :key="id">{{item}}</span>
              </div>
              <div class="time">
                {{rating.rateTime | formatDate}}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { formatDate } from '../../common/js/date'
import BScroll from 'better-scroll';
import star from '@/star/star';
import Split from '@/split/split';
import RatingSelect from '@/RatingSelect/RatingSelect';

/* eslint no-unused-vars: "off" */
const POSITIVE = 0;
const NEGATIVE = 1;
const ALL = 2;

export default {
  name: 'ratings',
  components: {
    star,
    Split,
    RatingSelect,
  },
  data() {
    return {
      seller: {},
      ratings: [],
      showFlag: false,
      selectType: ALL,
      onlyContent: true,
    }
  },
  created() {
    axios.all([axios.get('/api/seller'), axios.get('/api/ratings')])
      .then(axios.spread((seller, ratings) => {
        if (seller.data.errno === 0) {
          this.seller = seller.data.seller;
        }

        if (ratings.data.errno === 0) {
          this.ratings = ratings.data.ratings;
        }
      }));
  },
  mounted() {
    if (!this.scroll) {
      this.scroll = new BScroll(this.$refs.rating, {
        probeType: 3,
        scrollY: true,
        click: true,
        mouseWheel: true
      });
    } else {
      this.scroll.refresh();
    }
  },
  filters: {
    formatDate(time) {
      let date = new Date(time);
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  },
  methods: {
    updateSelectType(type) {
      console.log('click');
      this.selectType = type;
      this.$nextTick(() => {
        this.scroll.refresh();
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "../../common/stylus/mixin.styl"

.rating
  overflow hidden
  position absolute
  top 174px
  bottom 0
  left 0 
  right 0
  .rating-content
    .overview
      display flex
      padding 18px 0
      .overview-left
        flex: 0 0 137px
        width 137px
        padding-bottom 6px
        text-align center
        border-right 1px solid rgba(7, 17, 27, .1)
        @media only screen and (max-width: 320px)
          flex 0 0 120px
          width 120px
        .score
          line-height 28px
          font-size 24px
          color rgb(255, 153, 0)
        .title
          margin-top 14px
          line-height 12px
          font-size 12px
          color rgb(7, 17, 27)
        .rank
          margin-top 20px
          line-height 10px
          font-size 10px
          color rgb(147, 153, 159)
      .overview-right
        flex 1
        padding 6px 0 6px 24px
        .score-wrapper
          margin-bottom 8px
          line-height 18px
          font-size 0
          .title
            display inline-block
            vertical-align top
            font-size 12px
            line-height 18px
            color rgb(7, 17, 27)
          .star
            display inline-block
            margin 0 12px
            line-height 18px
            vertical-align top
          .score
            display inline-block
            vertical-align top
            font-size 12px
            line-height 18px
            color rgb(255, 153, 0)
        .delivery-wrapper
          .title
            display inline-block
            font-size 12px
            line-height 18px
            color rgb(7, 17, 27)
          .delivery
            margin-left 8px
            font-size 12px
            color rgb(147, 153, 159)
    .rating-wrapper
      padding 0 18px
      .rating-item
        display flex
        padding 18px 0
        border-1px(rgba(7, 17, 27, .1))
        .avatar
          flex 0 0 28px
          width 28px
          margin-right 12px
          img
            border-radius 50%
        .content
          position relative
          flex 1
          .name
            margin-bottom 4px
            line-height 12px
            font-size 10px
            color rgb(7, 17, 27)
          .star-wrapper
            margin-bottom 6px
            font-size 0
            .star
              display inline-block
              vertical-align top
              margin-right 6px
            .delivery
              display inline-block
              vertical-align top
              font-size 10px
              color rgb(147, 153, 159)
          .text
            margin-bottom 8px
            line-height 18px
            color rgb(7, 17, 27)
            font-size 12px
          .recommend
            line-height 16px
            font-size 0
            .icon-thumb_up, .item
              display inline-block
              margin 0 8px 4px 0
              font-size 9px
            .icon-thumb_up
              color rgb(0, 160, 220)
            .item
              padding 0 6px
              border 1px solid rgba(7, 17, 27, .1)
              border-radius 1px
              color rgb(147, 153, 159)
              background #fff
          .time
            position absolute
            top 0
            right 0
            line-height 12px
            font-size 10px
            color rgb(147, 153, 159)
</style>
