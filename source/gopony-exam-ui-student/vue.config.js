'use strict'
const autoprefixer = require('autoprefixer')
const _ = require('lodash')
const env = process.env
const isDev = env.VUE_APP_ENV === 'dev'
const path = require('path')

function resolve(dir) {
	return path.join(__dirname, dir)
}

if (isDev) {
	const isEmpty = prefix => prefix === '' || prefix === '/'
	if (isEmpty(env.VUE_APP_BASE_API)) env.VUE_APP_BASE_API = '/@API'
}

const port = process.env.port || process.env.npm_config_port || 80 // 端口
/**
 * @type {import('@vue/cli-service').ConfigFunction}
 */
module.exports = () => ({
	devServer: {
		host: '0.0.0.0', // 需要内网的其它机器也能访问时，将值改成 '0.0.0.0'
		port: port,
		open: true,
		/* 更详细的配置规则：https://webpack.docschina.org/configuration/dev-server/#devserver-proxy */
		proxy: {
			[env.VUE_APP_BASE_API]: {
				pathRewrite: {
					'^/(api|@API)': ''
				},
				target: env.DEV_PROXY_TARGET_API,
			},
		},
		disableHostCheck: true
	},

	assetsDir: 'static',

	publicPath: './',

	css: {
		extract: false,
		requireModuleExtension: true,
		loaderOptions: {
			css: {
				modules: {
					localIdentName: isDev || env.VUE_APP_ENV === 'stage' ?
						'[path][name]__[local]__[hash:base64:5]' :
						'[name]__[local]__[hash:base64:5]',
				},
			},
			postcss: {
				plugins: function({
					resourcePath: path
				}) {
					if (
						/* 跳过 autoprefixer */
						/[\\/]node_modules[\\/].+\.css$/.test(path) ||
						/[\\/]src[\\/]libs[\\/].+\.css$/.test(path) ||
						(isDev && env.DEV_CSS_AUTOPREFIXER !== 'true')
					) {
						return []
					}
					return [autoprefixer]
				},
			},
		},
		sourceMap: isDev ? env.DEV_CSS_SOURCEMAP === 'true' : false,
	},

	productionSourceMap: env.VUE_APP_ENV === 'stage',

	configureWebpack: config => {
		if (isDev) config.devtool = 'source-map'
		config.optimization.splitChunks.cacheGroups.vendors.test = module => {
			const {
				resource: path
			} = module
			if (!path) return false
			if (
				/* 为了 chunk-vendors*.js 的稳定性，需要排除掉经过 babel 插件处理成按需引入的模块（详见 babel.config.js） */
				/[\\/]node_modules[\\/]element-ui[\\/]/.test(path) || // @PC.element-ui
				/[\\/]node_modules[\\/]lodash[\\/]/.test(path)
			) {
				return false
			}
			return /[\\/]node_modules[\\/]|[\\/]src[\\/]libs[\\/]/.test(
				path) // 将这些初始化时的依赖包纳入 chunk-vendors*.js（其它的则纳入 app*.js）
		}
	},

	chainWebpack: config => {
		/* 跳过 babel-loader */
		config.module.rule('js').exclude.add(path => {
			return /[\\/]src[\\/]libs[\\/].+\.js$/.test(path)
		})

		config.plugins.delete('preload') 
		config.plugins.delete('prefetch')

		// set svg-sprite-loader
		config.module
			.rule('svg')
			.exclude.add(resolve('src/assets/icons'))
			.end()
		config.module
			.rule('icons')
			.test(/\.svg$/)
			.include.add(resolve('src/assets/icons'))
			.end()
			.use('svg-sprite-loader')
			.loader('svg-sprite-loader')
			.options({
				symbolId: 'icon-[name]'
			}).end()



		if (config.plugins.has('copy')) {
			config.plugin('copy').tap(args => {
				args[0][0].ignore.push('.eslintrc.js', '.prettierrc.js')
				args[0][0].transform = function(content, path) {
					if (
						/* 让 public 中的其它文件也支持 EJS 语法（传入运行时可用的环境变量） */
						/\.(html|htm|js|json)$/.test(path) &&
						/[\\/]public[\\/]libs[\\/]/.test(path) === false
					) {
						const options = {
							interpolate: /<%=([\s\S]+?)%>/g,
							sourceURL: path,
						}
						const obj = _.pickBy(env, (val, key) =>
							/^(NODE_ENV|BASE_URL|VUE_APP_.*)$/.test(key),
						)
						content = _.template(`${content}`, options)(obj)
					}
					return content
				}
				return args
			})
		}
	},
})

if (env.NODE_ENV) {
	if (
		/^(development|production|test)$/.test(env.NODE_ENV) === false ||
		/^(dev|stage|prod)$/.test(env.VUE_APP_ENV) === false ||
		(env.NODE_ENV === 'development' && env.VUE_APP_ENV !== 'dev') ||
		(env.NODE_ENV === 'production' && env.VUE_APP_ENV === 'dev') ||
		(env.NODE_ENV === 'production' && env.VUE_APP_ENABLE_DOCS === undefined)
	) {
		throw new Error('环境变量配置错误或缺失')
	}
}
