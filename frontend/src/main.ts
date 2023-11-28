import { apollo } from './services/apollo'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import "./theme.scss"
import VueKonva from 'vue-konva'


import { library } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { fas } from "@fortawesome/free-solid-svg-icons"
import { fab } from "@fortawesome/free-brands-svg-icons"

library.add(fas, fab)

import App from './App.vue'
import { router } from './router/index'


const app = createApp(App)
//app.use(VueKonva)

app.component(`font-awesome-icon`, FontAwesomeIcon)
app.use(ElementPlus)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(createPinia())
app.use(router)
app.use(apollo.install)


app.mount(`#app`)
