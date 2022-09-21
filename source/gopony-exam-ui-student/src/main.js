import Vue from 'vue'
import router from './router'
import store from './store'
import App from './App.vue'
import element from 'element-ui'
import './assets/styles/element-variables.scss'
import './assets/icons' 
import './assets/styles/css/global.css'
import '@/assets/styles/less/index.less'
import "@/assets/iconfont/iconfont.css";
import {
	parseTime,
	resetForm,
	addDateRange,
	selectDictLabel,
	selectDictLabels
} from "@/utils/common";
import Pagination from "@/components/Pagination";
import directive from './directive' // directive
import plugins from './plugins' // plugins
// 字典标签组件
import DictTag from '@/components/DictTag'
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css' //样式
import globalFunction from '@/utils/globalFunction'
Vue.config.devtools = process.env.VUE_APP_ENV === 'dev' || process.env.VUE_APP_ENV === 'stage'
Vue.config.silent = process.env.VUE_APP_ENV === 'prod'

Vue.config.productionTip = false
document.title ="小马在线考试通用信息系统"

// 全局方法挂载
Vue.prototype.fileUploadHost = process.env.VUE_APP_UPLOAD_HOST
Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.selectDictLabels = selectDictLabels

Vue.use(directive)
Vue.use(plugins)
// 全局组件挂载
Vue.component('Pagination', Pagination)
Vue.component('DictTag', DictTag)

for (let key in globalFunction) {
	Vue.prototype[key] = globalFunction[key]
}

// 全局过滤器设置
Vue.filter('ellipsis', function(msg, num) {
	const currentNum = num || 5
	if (!msg) {
		return ''
	}
	if (msg.length > currentNum) {
		return msg.slice(0, currentNum) + '...'
	}
	return msg
})

Vue.directive('highlight', function(el) {
	let blocks = el.querySelectorAll('pre code');
	blocks.forEach((block) => {
		hljs.highlightBlock(block)
	})
})


Vue.use(element)
new Vue({
	router,
	render: h => h(App),
	store
}).$mount('#app');
