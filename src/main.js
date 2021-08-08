import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import installElementPlus from './plugins/element'
import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
import './assets/css/icon.css'
const app = createApp(App)
installElementPlus(app)
app
  .use(VXETable)
  .use(router)
  .use(store)
  .mount('#app')
