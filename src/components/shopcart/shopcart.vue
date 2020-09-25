<template>
  <div>
    <div class="shopcart">
      <div class="content">
        <div class="content-left">
          <div class="logo-wrapper" @click="toggleList">
            <div class="logo" :class="{'highlight': totalCount}">
              <i class="icon-shopping_cart" :class="{'highlight': totalCount}"></i>
            </div>
            <div v-show="totalCount" class="num">{{totalCount}}</div>
          </div>
          <div 
            class="price" 
            :class="{'highlight': totalCount}"
          >
            ￥{{totalPrice}}
          </div>
          <div class="desc">另需配送费￥{{this.deliveryPrice}}元</div>
        </div>
        <div class="content-right">
          <div class="pay" :class="{'enough': minPrice - totalPrice <= 0}" @click="pay">
            {{payDesc}}
          </div>
        </div>
      </div>
      <transition-group 
        class="ball-container"
        name="drop"
        tag="div"
        @before-enter="beforeEnter"
        @enter="enter"
        @after-enter="afterEnter"
      >
        <div class="ball" v-for="(ball, id) of balls" :key="id" v-show="ball.show"></div>
      </transition-group>
      <transition name="fold">
        <div class="shopcart-list" v-show="listShow">
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <span class="empty" @click="clearShopCart">清空</span>
          </div>
          <div class="list-content" ref="cartList">
            <ul>
              <li class="food" v-for="(food, id) of selectedFoods" :key="id">
                <span class="name">{{food.name}}</span>
                <div class="price">
                  <span>￥{{food.price*food.count}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cart-control :food="food"/>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <transition name="fade">
      <div class="list-mask" v-show="listShow" @click="clickModal"></div>
    </transition>
  </div>
</template>

<script>
import CartControl from '@/CartControl/CartControl'
import BScroll from 'better-scroll';

export default {
  name: 'shopcart',
  props: {
    deliveryPrice: Number,
    minPrice: Number,
    selectedFoods: {
      type: Array,
      default() {
        return [{count: 10, price: 10}]
      }
    }
  },
  components: {
    CartControl
  },
  data() {
    return {
      balls: [
        {
          show: false,
        },
        {
          show: false,
        },
        {
          show: false,
        },
        {
          show: false,
        },
        {
          show: false,
        }
      ],
      dropBalls: [],
      fold: true,
    }
  },
  computed: {
    totalPrice() {
      let total = 0
      this.selectedFoods.forEach(food => {
        total += food.price * food.count
      })
      return total
    },
    totalCount() {
      let count = 0
      this.selectedFoods.forEach(food => {
        count += food.count
      })
      return count
    },
    payDesc() {
      if (this.totalPrice === 0) {
        return `￥${this.minPrice}元起送`
      } else if (this.totalPrice < this.minPrice) {
        let diff = this.minPrice - this.totalPrice
        return `还差${diff}元起送`
      } else {
        return `去结算`
      }
    },
    listShow() {
      if (!this.totalCount) {
        // this.fold = true;
        return false;
      }
      let show = !this.fold;
      if (show) {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.cartList, {
              click: true,
            })
          } else {
            this.scroll.refresh();
          }
        })
      }
      return show;
    }
  },
  methods: {
    toggleList() {
      if (this.totalCount) {
        this.fold = !this.fold;
      }
    },
    clearShopCart() {
      this.selectedFoods.forEach(food => {
        food.count = 0;
      })
    },
    clickModal() {
      if (this.listShow) {
        this.fold = !this.fold;
      }
    },
    pay() {
      if (this.totalPrice >= this.minPrice) {
        window.alert(`支付${this.totalPrice}元`)
      }
    },
    drop(el) {
      for (let ball of this.balls) {
        if (!ball.show) {
          ball.show = true;
          ball.el = el;
          this.dropBalls.push(ball);
          return;
        }
      }
    },
    beforeEnter(el) {
      let count = this.balls.length;
      while(count--) {
        let ball = this.balls[count];
        if (ball.show) {
          let rect = ball.el.getBoundingClientRect();
          let x = rect.left - 32;
          let y = -(window.innerHeight - rect.top - 22);
          el.style.display = '';
          el.style.webkitTransform = `translate3d(${x}px, ${y}px, 0)`;
          el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
          console.log('----start animation----');
        }
      }
    },
    enter(el, done) {
      /* eslint-disable no-unused-vars */
      let rf = el.offsetHeight;
      this.$nextTick(() => {
        el.style.display = '';
        el.style.webkitTransform = 'translate3d(0, 0, 0)';
        el.style.transform = 'translate3d(0, 0, 0)';
      });
      done();
    },
    afterEnter(el) {
      let ball = this.dropBalls.shift();
      if (ball) {
        ball.show = false;
        el.style.display = 'none';
      }
    }
  }
} 
</script>

<style lang="stylus" scoped>
@import "../../common/stylus/mixin.styl"

.shopcart
  position fixed
  bottom 0
  left 0
  width 100%
  height 48px
  z-index 50
  .content
    display flex
    background #141d27
    height 100%
    z-index 101
    .content-left
      flex 1
      font-size 0
      .logo-wrapper
        display inline-block
        position relative
        top -10px
        margin 0 12px
        padding 6px
        width 56px
        height 56px
        box-sizing border-box
        // 不知道这一行的作用
        vertical-align top
        border-radius 50%
        background #141d27
        .logo
          width 100%
          height 100%
          border-radius 50%
          background #2b343c
          text-align center
          &.highlight
            background rgb(0, 160, 220)

          .icon-shopping_cart
            font-size 24px
            line-height 44px
            color #80858a
            &.highlight
              color  #fff
        .num
          position absolute
          top 0
          right 0
          width 24px
          height 16px
          line-height 16px
          text-align center
          border-radius 16px
          font-size 9px
          font-weight 700
          color #ffffff
          background rgb(240, 20, 20)
          box-shadow 0 4px 8px 0 rbga(0, 0, 0, .4)
      .price
        display inline-block
        vertical-align top
        margin-top 12px
        line-height 24px
        box-sizing border-box
        padding-right 12px
        font-size 16px
        font-weight 700
        color rgba(255, 255, 255, .4)
        border-right 1px solid rgba(255, 255, 255, .1)
        &.highlight
          color #fff
      .desc
        display inline-block
        margin 12px 0 0 12px
        line-height 24px
        font-weight 700
        font-size 12px
        color rgba(255, 255, 255, .4)
    .content-right
      flex 0 0 105px
      width: 105px
      .pay
        height 48px
        line-height 48px
        text-align center
        font-size 12px
        font-wegiht 700
        background #2b333b
        color rgba(255, 255, 255, .4)
        &.enough
          background #00b43c
          color #fff
  .ball-container
    .drop-enter-active {
      transition all .4s
    }
    .ball
      position fixed
      left 32px
      bottom 22px
      width 16px
      height 16px
      border-radius 50%
      background rgb(0, 160, 220)
      z-index 200
  .shopcart-list
    position fixed
    left 0
    bottom 48px
    width 100%
    z-index 100
    &.fold-enter-active, &.fold-leave-active {
      transition all .5s
    }
    &.fold-enter, &.fold-leave-to
      transform translate3d(0, 100%, 0)
    .list-header
      height 40px
      line-height 40px
      padding 0 18px
      font-size 14px
      background #f3f5f7
      border-bottom 1px solid rgba(7, 17, 27, .1)
      .title
        float left 
        color rgb(7, 17, 27)
      .empty
        float right
        color rgb(0, 160, 220)
    .list-content
      overflow hidden
      padding 0 18px
      max-height 217px
      background #fff
      .food
        position relative
        padding 12px 0
        box-sizing border-box
        border-1px(rgba(7, 17, 27, .1))
        .name
          line-height 24px
          font-size 14px
          color rgb(7, 17, 27)
        .price
          position absolute
          right 90px
          line-height 24px
          bottom 12px
          font-size 14px
          font-weight 700
          color rgb(240, 20, 20)
        .cartcontrol-wrapper
          position absolute
          right 0
          bottom 6px
.list-mask
  position fixed
  top 0
  left 0
  right 0
  bottom 0
  z-index 40
  background rgba(7, 17, 27, .6)
  background-filter blur(10px)
  &.fade-enter-active, &.fade-leave-active
    transition all .4s
  &.fade-enter, &.fade-leave-to
    opacity 0
    background rgba(7, 17, 27, 0)
</style>