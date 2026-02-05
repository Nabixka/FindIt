import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './components/router'
import 'leaflet/dist/leaflet.css'

createApp(App).use(router).mount('#app')
