var webpack = require('webpack');
var path = require('path');
var package = require('../package.json')
const ExtractTextPlugin = require('extract-text-webpack-plugin');
//var AssetsPlugin = require('assets-webpack-plugin')

module.exports = {
	output: {
		path: path.join(__dirname,'../static/dll'),
		filename: 'dll.[name]_[hash:6].js',
		library: '[name]_[hash:6]',
	},
	entry: {
		//lib:Object.keys(package.dependencies),
		lib:[
			'jquery',
			'vue',
			'vue-router',
			'vuex',
			'uiv',
			'element-ui',
			'iview',
			'echarts',
			'axios',
			'babel-polyfill',
		]
	},
	plugins: [
		new webpack.DllPlugin({
			path: path.join(__dirname,'../static/dll','[name]-manifest.json'),
			name:  '[name]_[hash:6]',
			context: __dirname,
		}),
	    new ExtractTextPlugin('[name].css'),
	]
}
