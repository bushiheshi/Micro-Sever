import {createApp} from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from "@/router/index";
import pinia from "@/stores/index"
import './assets/styles/reset.css'
import './assets/styles/var.css'
const app = createApp(App)

app.use(pinia)

app.use(router)

app.use(ElementPlus)
app.mount('#app')
