import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import piniaPersistedstate from 'pinia-plugin-persistedstate'
import ToastService from 'primevue/toastservice'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import 'primeicons/primeicons.css'



const app = createApp(App)
app.use(PrimeVue, {
    theme: {
        preset: Aura,
    }
})
app.use(ToastService)

const pinia = createPinia()
pinia.use(piniaPersistedstate)

app.use(router)
app.use(pinia)

app.mount('#app')
