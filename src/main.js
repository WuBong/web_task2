//src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

//부트스트랩
import BootstrapVue3 from 'bootstrap-vue-3'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.bundle.js'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'

createApp(App).use(store).use(router).use(BootstrapVue3).mount('#app')
