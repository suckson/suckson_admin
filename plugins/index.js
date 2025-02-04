import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vitePluginApifox from './apifox.js'
import createAutoImport from './auto-import'
import createSvgIcon from './svg-icon'
import createCompression from './compression'
import createSetupExtend from './setup-extend'
import cesium from 'vite-plugin-cesium'
export default function createVitePlugins(viteEnv, isBuild = false) {
    const vitePlugins = [vue()]
    vitePlugins.push(createAutoImport())
	vitePlugins.push(createSetupExtend())
    vitePlugins.push(vueJsx())
    // vitePlugins.push(vitePluginRem())
    vitePlugins.push(vitePluginApifox({
        url: viteEnv.VITE_APIFOX,
    }))
    vitePlugins.push(createSvgIcon(isBuild))
    vitePlugins.push(cesium(isBuild))
	isBuild && vitePlugins.push(...createCompression(viteEnv))
    return vitePlugins
}
