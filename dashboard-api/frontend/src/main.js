import './assets/main.css'
import router from './router'
import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import axios from 'axios';

// Configuration globale d'Axios
axios.defaults.baseURL = import.meta.env.VITE_API_URL || '/api';


const app = createApp(App)
const pinia = createPinia();

app.use(pinia);
app.use(router)



app.config.globalProperties.$axios = axios;
app.mount('#app')
