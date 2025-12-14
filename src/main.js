import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import piniaPersistedstate from 'pinia-plugin-persistedstate'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'


const app = createApp(App)
app.use(PrimeVue)
app.use(ToastService)

const pinia = createPinia()
pinia.use(piniaPersistedstate)

app.use(router)
app.use(pinia)

app.mount('#app')
