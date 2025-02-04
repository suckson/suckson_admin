import { createApp, defineAsyncComponent } from 'vue'

import Cookies from 'js-cookie'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import locale from 'element-plus/es/locale/lang/zh-cn'

import '@/assets/styles/index.scss' // global css

import App from './App'
import router from '@bin/router/index.js'
import store from '@bin/store/index.js'
import directive from './directive' // directive

// 注册指令
import plugins from './plugins' // plugins
import { download } from '@/utils/request'

// svg图标
import 'virtual:svg-icons-register'

import elementIcons from '@/components/SvgIcon/svgicon'

import './permission' // permission control

import { useDict } from '@/utils/dict'
import { parseTime, resetForm, addDateRange, handleTree, selectDictLabel, selectDictLabels } from '@/utils/common'
import * as echarts from "echarts"

const app = createApp(App)

// 全局方法挂载
app.config.globalProperties.useDict = useDict
app.config.globalProperties.download = download
app.config.globalProperties.parseTime = parseTime
app.config.globalProperties.resetForm = resetForm
app.config.globalProperties.handleTree = handleTree
app.config.globalProperties.addDateRange = addDateRange
app.config.globalProperties.selectDictLabel = selectDictLabel
app.config.globalProperties.selectDictLabels = selectDictLabels 
app.config.globalProperties.$echarts = echarts

const COMPONENTS = import.meta.glob('./components/**/**.vue')
const COMPONENTSNAMES= []
for (const [key, Component] of Object.entries(COMPONENTS)) {
	let str
	if (key.endsWith('index.vue')) {
		str = key.slice(key.lastIndexOf('/', key.length - 11) + 1, key.lastIndexOf('/index.vue'))
	} else {
		str = key.slice(key.lastIndexOf('/') + 1, key.lastIndexOf('.'))
	}
	let strRepeat = key.replace('./components', '')
	if(!strRepeat.includes('components')){
		str = str.replace(/[-_](.)/g, (_, s) => s.toUpperCase())
		const strUp = str.replace(/./, s => s.toUpperCase())
		app.component(strUp, defineAsyncComponent(Component))
		COMPONENTSNAMES.push(strUp)
	}
}
console.info(COMPONENTSNAMES);


app.use(router)
app.use(store)
app.use(plugins)
app.use(elementIcons)
directive(app)

// 使用element-plus 并且设置全局的大小
app.use(ElementPlus, {
  locale: locale,
  // 支持 large、default、small
  size: Cookies.get('size') || 'default'
})

app.mount('#app')

window.addEventListener('unhandledrejection', (event) => {
  console.log(event.reason);
});
