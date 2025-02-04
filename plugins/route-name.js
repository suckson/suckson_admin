import fs from 'fs'
import { resolve, parse, sep } from 'path'

export default function (path, directory = {}) {
	const virtualModuleId = 'vue-router:routes'
	const resolvedVirtualModuleId = `\0${virtualModuleId}`
	let filePathList = FilePathList({ path })
	let routeData = routeJSON({ filePathList, root: path, directory })
	return {
		name: 'vite-vue-router-routes',
		resolveId(id) {
			if (id === virtualModuleId) return resolvedVirtualModuleId
		},
		load(id) {
			if (id !== resolvedVirtualModuleId) return
			let code = JSON.stringify(routeData, null, 6)
			code = code.replaceAll(/"(?=\(\))/g, '')
			code = code.replaceAll(/(?<=\.vue'\))"/g, '')
			return `export default ${code}`
		},
	}
}
function RouteOtherParam(code) {
	let [RouteOtherStr] = code.match(/(?<=<RouteOther)[^]+?(?=\/>)/g) || []
	if (!RouteOtherStr) return {}
	let param = {}
	let list = RouteOtherStr.trim()
		.replaceAll(/\s*=\s*/g, '=')
		.replaceAll(/"|'/g, '')
		.split(/\s/)
		.map(str => str.split('='))

	for (let [key, price] of list) {
		try {
			price = JSON.parse(price === undefined ? true : price)
		} catch (err) {
			//
		}
		if (!key.includes('.')) {
			param[key] = price
			continue
		}

		let keyArr = key.split('.')
		let len = keyArr.length
		keyArr.reduce((result, keys, ind) => {
			if (len === ind + 1) return (result[keys] = price)
			if (result[keys]) return result[keys]
			return (result[keys] = {})
		}, param)
	}
	return param
}
function FilePathList({ path, exclude = ['dist', 'components', 'node_modules', '.prettierrc.js', 'vite.config.js'], need = ['.vue'] }, root) {
	const frontPath = resolve(path)
	root = root || frontPath

	const excludeReg = new RegExp(`(${exclude.join('|')})`)
	const needReg = new RegExp(`(${need.join('|')})$`)
	let direntList = fs.readdirSync(frontPath, { withFileTypes: true })
	let pathArr = []
	for (let dirent of direntList) {
		let _path = resolve(frontPath, dirent.name)
		let relativelyPath = _path.slice(root.length, _path.length)

		if (excludeReg.test(relativelyPath)) continue
		if (dirent.isFile() && needReg.test(relativelyPath)) pathArr.push(_path)
		if (dirent.isDirectory()) pathArr.push(...FilePathList({ path: _path, exclude, need }, root))
	}

	return pathArr
}
function routeJSON({ filePathList, encoding = 'utf8', root, directory }) {
	let routeData = []
	let _root = resolve(root)
	for (let path of filePathList) {
		path = resolve(path)
		let code = fs.readFileSync(path, { encoding })
		let Outside = RouteOtherParam(code)
		let suffix = parse(path.slice(_root.length, path.length).replaceAll(sep, '/'))
		if (suffix.dir === '/') {
			routeData.push({
				name: suffix.name,
				path: `/${suffix.name.replaceAll('-', '_')}`,
				component: `() => import('${root}${suffix.dir}/${suffix.base}')`,
				...Outside,
			})
			continue
		}
		let keyall = suffix.dir.split(/(?<=\/.*)\//g)
		let SettingItem = keyall.reduce((item, name, ind) => {
			let path = name.replaceAll('-', '_')
			let Matching = item.find(to => to.path == path)
			if (Matching) return Matching.children
			let param = { children: [], name: path, path: path }
			let _path = keyall.slice(0, ind + 1).join('/')
			let other = directory[_path]
			if (other && typeof other === 'string') param.name = other
			if (other && typeof other === 'object') Object.assign(param, other)
			item.push(param)
			return param.children
		}, routeData)

		SettingItem.push({
			name: suffix.name,
			path: `${keyall.length ? '' : '/'}` + suffix.name.replaceAll('-', '_'),
			component: `() => import('${root}${suffix.dir}/${suffix.base}')`,
			...Outside,
		})
	}
	return routeData
}
