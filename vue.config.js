const data = require('./data.json')
const seller = data.seller
const goods = data.goods
const ratings = data.ratings
const {resolve} = require('path')

module.exports = {
	configureWebpack: {
		resolve: {
			alias: {
					'@': resolve('src/components'),
					'stylus': resolve('src/common/stylus')
			}
		},
		devServer: {
			before (app) {
				app.get('/api/seller', (_, res) => {
					res.json({
						errno: 0,
						seller
					})
				})
				
				app.get('/api/goods', (_, res) => {
					res.json({
						errno: 0,
						goods
					})
				})

				app.get('/api/ratings', (_, res) => {
					res.json({
						errno: 0,
						ratings
					})
				})
			}
		}
	}
}