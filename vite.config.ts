import {defineConfig} from "vite"
import vue from "@vitejs/plugin-vue"
import {resolve} from "path"
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import {VantResolver} from "@vant/auto-import-resolver";
import {VueAmapResolver} from "@vuemap/unplugin-resolver"

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        AutoImport({
            resolvers: [VantResolver({importStyle: true}), VueAmapResolver()]
        }),
        Components({
            resolvers: [VantResolver({importStyle: true}), VueAmapResolver()]
        })
    ],
    resolve: {
        alias: {
            "@": resolve(__dirname, "src")
        }
    },
})
