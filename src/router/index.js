import Vue from "vue";
import VueRouter from "vue-router";
import goods from '@/goods/goods'
import ratings from '@/ratings/ratings'
import seller from '@/seller/seller'

Vue.use(VueRouter);

const routes = [
	{
		path: '/goods',
		name: 'goods',
		component: goods
	},
	{
		path: '/ratings',
		name: 'ratings',
		component: ratings
	},
	{
		path: '/seller',
		name: 'seller',
		component: seller
	},
	{
		path: '/',
		redirect: '/goods'
	}
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
