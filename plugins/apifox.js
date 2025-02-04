import fs from 'fs'
import http from 'axios'
import { resolve } from 'path'
export default async function (param = {}) {
	//获取接口文档的url
	const url = param.url
	//生成文件输出位置
	const output = param.output || 'bin/request/api-templete.js'
	//是否打开接口生成
	const opne = param.opne || true
	//接口更新时间
	const refresh = param.refresh || 300000
	return {
		configResolved(config) {
			if (!opne || !url) return
			if (config.command == 'build') return
			generate(url, output, refresh)
		},
	}
}

//生成代码

// 用不到了 不用更新了
async function generate(url, output, refresh) {
	
	let result = fs.statSync(resolve(output))
	let mnum = Date.now() - result.mtime.getTime()
	if (mnum < refresh) return
	let code = fs.readFileSync(resolve(output), { encoding: 'utf8' })
	console.log('开始更新接口文档', url)
	let regular = code.replace(/\/\/--request-automatic-generation--[^]+/g, '//--request-automatic-generation--')
	let data = await http.get(url, { headers: { 'X-Client-Version': '2.2.30' } })
	let _code = ''
	let num = 0
	function getList(list, httpName) {
		if (!Array.isArray(list)) return
		for (const item of list) {
			if (item.children) getList(item.children, _httpName)
			let api = item.api
			if (item.type == 'apiDetail' && api) {
				let name = `${api.method}/${api.path}`.replace(/[:/_-]+([a-zA-Z0-9])/g, (_, t) => t.toUpperCase())
				if (!regular.includes(name)) {
					let params = api.method == 'get' ? '{ params }' : 'body'
					let paramsn = api.method == 'get' ? 'params' : 'body'
					let otherParams = api.path.includes('/export') ?  `, {responseType: 'blob'}` : ''
					let path
					if (api.path.includes('{')) {
						path = `\`${api.path.replaceAll('{', '${').replaceAll('{', `{${paramsn}.`)}\``
						name = name.slice(0, name.indexOf('/{'))
					} else {
						path = `'${api.path}'`
					}
					_code += `\n//${api.name}\nexport const ${name} = ${paramsn} => ${httpName || 'http'}.${api.method}(${path}${api.path.includes('{') ? '' : ', ' + params + otherParams})\n`
					num++
				}
			}
		}
	}

	getList(data?.data?.data)
	fs.writeFileSync(resolve(output), `// ${regular}自动生成接口 ${num} 个。\n${_code}`)
}
