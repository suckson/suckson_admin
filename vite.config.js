import { defineConfig, loadEnv } from 'vite'
import { resolve } from 'path'

import createVitePlugins from './plugins'

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
  const envDir = 'config'
	const env = loadEnv(mode, resolve(envDir))
  const { VITE_APP_BASE_URL,VITE_APP_BASE_API } = env
  return {
    base: '/',
		envDir: resolve(envDir),
    plugins: createVitePlugins(env, command === 'build'),
    resolve: {
      alias: {
        // 设置路径
        '~': resolve(__dirname, './'),
        // 设置别名
        '@': resolve('src'),
				'@bin': resolve('bin'),
        '@store': resolve('bin/store'),
        '@router': resolve('bin/router'),
				'@api': resolve('bin/api'),
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
    },
    // vite 相关配置
    server: {
      port: 8000,
      host: '127.0.0.1',
      open: false,
      proxy: {
        [VITE_APP_BASE_API]: {
          target: VITE_APP_BASE_URL,
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/api/, '')
        }
      }
    },
    //fix:error:stdin>:7356:1: warning: "@charset" must be the first rule in the file
    css: {
      postcss: {
        plugins: [
          {
            postcssPlugin: 'internal:charset-removal',
            AtRule: {
              charset: (atRule) => {
                if (atRule.name === 'charset') {
                  atRule.remove();
                }
              }
            }
          }
        ]
      }
    }
  }
})
