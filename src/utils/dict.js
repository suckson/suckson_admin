import useDictStore from '@store/modules/dict'
import { getDicts } from '@api/system/dict/data'

/**
 * 获取字典数据
 */
export function useDict(...args) {
  const res = ref({});
  return (() => {
    args.forEach((dictType, index) => {
      res.value[dictType] = [];
      const dicts = useDictStore().getDict(dictType);
      if (dicts) {
        res.value[dictType] = dicts;
      } else {
        getDicts(dictType).then(resp => {
          res.value[dictType] = resp.data.map(p => ({ label: p.dictLabel, value: p.dictValue, elTagType: p.listClass, elTagClass: p.cssClass }))
          useDictStore().setDict(dictType, res.value[dictType]);
        })
      }
    })
    return toRefs(res.value);
  })()
}

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
	let list = await getDicts()
	store.state.DictList = list
}
//载入到app中
export default function (app) {
	app.config.globalProperties.$dict = dict
}
