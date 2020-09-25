<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menu">
      <ul>
        <li 
          v-for="(item, id) of goods" 
          :key="id" 
          class="menu-item"
          :class="{'current': currentIndex === id}"
          @click="selectMenu(id, $event)"
        >
          <span class="text border-1px">
            <my-icon v-show="item.type > 0" :type="item.type > 0 ? item.type : 0"></my-icon>
            {{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="goods-wrapper" ref="goods">
      <ul>
        <li 
          ref="foodList" 
          v-for="(item, id) of goods" 
          :key="id"
        >
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li class="food-item" v-for="food in item.foods" 
              :key="food.name"
              @click="selectFood(food, $event)"
            >
              <div class="icon">
                <img width="57" height="57" :src="food.icon">
              </div>
              <div class="content">
                <h1 class="name">{{food.name}}</h1>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span>
                  <span>{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="new">￥{{food.price}}</span>
                  <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <CartControl 
                    :food="food"
                    @addCart="handleCartAdd"
                  />
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shopcart
      :deliveryPrice="seller.deliveryPrice"
      :minPrice="seller.minPrice"
      :selectedFoods="selectedFoods"
      ref="shopcart"
    ></shopcart>
    <Food :food="selectedFood" ref="food"/>
  </div>
</template>

<script>
import axios from 'axios'
import MyIcon from '@/my-icon/my-icon'
import BScroll from 'better-scroll'
import shopcart from '@/shopcart/shopcart'
import CartControl from '@/CartControl/CartControl'
import Food from '@/food/food';

export default {
  name: 'goods',
  components: {
    MyIcon,
    shopcart,
    CartControl,
    Food,
  },
  data () {
    return {
      goods: [],
      seller: {},
      listHeight: [],
      scrollY: 0,
      selectedFood: {},
    }
  },
  computed: {
    currentIndex() {
      for (let i = 0; i < this.listHeight.length-1; i ++ ) {
        let [h1, h2] = [this.listHeight[i], this.listHeight[i+1]]
        if (this.scrollY >= h1 && this.scrollY < h2) {
          return i
        }
      }
      return 0
    },
    selectedFoods() {
      let foods = [];
      this.goods.forEach(good => {
        good.foods.forEach(food => {
          if (food.count) {
            foods.push(food);
          }
        })
      });
      return foods;
    }
  },
  // 如何处理并发请求？
  created () {
    axios.all([axios.get('/api/goods'), axios.get('/api/seller')])
    .then(axios.spread((goods, seller) => {
      if (goods.data.errno === 0) {
        this.goods = goods.data.goods
      }

      if (seller.data.errno === 0) {
        this.seller = seller.data.seller
      }

      this.$nextTick(() => {
        this._calculateHeight()
        this._initScroll()
      })
    }))
  },
  methods: {
    // 初始化滚动
    _initScroll() {
      this.menuScroll = new BScroll(this.$refs.menu, {
        probeType: 3,
        scrollY: true,
        click: true,
        mouseWheel: true
      })
      this.goodScroll = new BScroll(this.$refs.goods, {
        probeType: 3,
        scrollY: true,
        click: true,
        mouseWheel: true
      })
      this.goodScroll.on('scroll', (pos) => {
        this.scrollY = Math.abs(Math.round(pos.y))
      })
    },
    // 计算商品列表的高度
    _calculateHeight() {
      let height = 0
      this.listHeight.push(height)
      this.$refs.foodList.forEach(item => {
        height += item.clientHeight
        this.listHeight.push(height)
      })
    },
    // 左侧菜单栏点击滚动到对应的商品列表
    selectMenu(index, e) {
      // pc原生点击事件
      if (!e._constructed) {
        return
      }
      this.goodScroll.scrollToElement(this.$refs.foodList[index], 300)
    },
    handleCartAdd(el) {
      // 动画性能优化
      this.$nextTick(() => {
        this.$refs.shopcart.drop(el);
      })
    },
    selectFood(food, e) {
      if (!e._constructed) return;
      this.selectedFood = food;
      this.$refs.food.show();
    }
  },
  mounted() {  
  }
}
</script>

<style lang="stylus" scoped>
  @import "../../common/stylus/mixin.styl"

  .goods
    display flex
    width 100%
    position absolute
    top 174px
    bottom 46px
    overflow hidden
    .menu-wrapper
      width 80px
      flex-shrink 0
      background #f3f5f7
      .menu-item
        display table
        width 56px
        height 54px
        line-height 14px
        padding 0 12px
        text-align center
        .text
          display table-cell
          width 56px
          vertical-align middle
          font-size 12px
          border-1px(rgba(7, 17, 27, .1))
        &.current
          background #fff
          font-weight 700
          margin-top -1px
          z-index 100
          .text
            border-none()
    .goods-wrapper
      flex 1
      .title
        height 26px
        line-height 26px
        padding-left 14px
        border-left 2px solid #d9dde1
        background #f3f5f7
        font-size 12px
        color rgb(147, 153, 159)
      .food-item
        display flex
        margin 18px
        border-1px(rgba(7, 17, 27, .1))
        padding-bottom 18px
        &:last-child
          border-none()
          margin-bottom 0
        .icon
          flex 0 0 57px
          margin-right 10px
        .content
          flex 1
          position relative
          .name
            margin 2px 0 8px 0
            height 14px
            font-size 14px
            color rgb(7, 17, 27)
          .desc, .extra
            margin-bottom 8px
            font-size 10px
            color rgb(147, 153, 159)
          .extra
            .count
              margin-right 12px
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
          .cartcontrol-wrapper
            position absolute
            right 0
            bottom 0
</style>
