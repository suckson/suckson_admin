import url from 'url'
export default function ({ need, exclude, width, heigth = 1080, minwidth = 800, minHeight = 600, size = 16, handles, open = false }) {
	if (!open || open === '0' || open === 'false') return
	need = need || ['.css', '.scss', '.vue']
	exclude = exclude || ['.prettierrc.js', 'index.html', 'vite.config.js']

	return {
		name: 'vite-plugin-rem',
		transform(code, id) {
			if (open == 'scale') return
			if (new RegExp(`(${exclude.join('|')})`).test(id)) return code
			if (!new RegExp(`(${need.join('|')})$`).test(url.parse(id).pathname)) return code
			if (handles) code = handles(code, id)
			code = code.replace(/(\d+)px/g, (text, val) => {
				let num = parseInt(val)
				return num <= 1 ? text : `${(num / size).toFixed(6)}rem`
			})
			return code
		},
		transformIndexHtml(code) {
			if (open == 'scale') {
				let str1 = `<script>function resize() {
					let lh = window.innerHeight / 1080
					let lw = window.innerWidth / 1920
					let zl = lh < lw ? lh : lw
					document.body.style.height = lw < lh ? \`\${window.innerHeight / lw}px\` : '1080px'
					document.body.style.width = lh < lw ? \`\${window.innerWidth / lh}px\` : '1920px'
					document.body.style.transform = \`scale(\${zl})\`
					document.body.style.transformOrigin = "left top" 
					window.transformScale = zl
				}
				resize()
				window.addEventListener('resize', resize)
				</script>`
				code = code.replace(/<body.*?>/, htm => `${htm}\n${str1}`)
			} else {
				let num = (size / (width || heigth)) * 100
				let unit = (width && 'vw') || (heigth && 'vh')
				let minFontSize = ((num / 100) * ((width && minwidth) || (heigth && minHeight))).toFixed(6)
				let str = `<style>
				html {
				  font-size: ${num.toFixed(6)}${unit};
				  min-width: ${minwidth}px;
				  min-height: ${minHeight}px;
				}
				@media screen and (max-width: ${minwidth}px) , (max-height:${minHeight}px)  {
					html {
						font-size: ${minFontSize}px;
					  }
				  }
				</style>`

				code = code.replace(/<head.*?>/, htm => `${htm}\n${str}`)
			}
			return code
		},
	}
}
