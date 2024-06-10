import { createApp } from "vue";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import { createPinia } from "pinia";
import App from "./App.vue";
import "./style.css";

import options from "./config/toast";
const pinia = createPinia();
const app = createApp(App);

app.use(pinia).use(Toast, options).mount("#app");
