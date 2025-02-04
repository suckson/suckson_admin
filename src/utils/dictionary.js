/**
 * 字典相关功能
 */
import store from '@bin/store/index.js'

//获取字典
export function dict(type, val) {
	if (!store.state.DictList) return
	// 通用化需求
	let len = arguments.length
	let list = store.state.DictList.filter(item => item.type === type) || []
	list.exclude = function () {
		let arr = [...arguments]
		return this.filter(item => !arr.includes(item.value))
	}
	list.only = function () {
		let arr = [...arguments]
		return this.filter(item => arr.includes(item.value))
	}
	list.include = function (values) {
        let arr = Array.isArray(values) ? values : [...arguments]
        return this.filter(item => arr.includes(item.value))
    }
	if (len === 1) return list || []
	let iterator = list.find(item => item.value === val)
	if (len === 2) return iterator ? iterator.label : val
}
// 初始化字典
export async function initDict() {
	let list = await postBaseDictionary()
	store.state.DictList = list
}
//载入到app中
export default function (app) {
	app.config.globalProperties.$dict = dict
}
