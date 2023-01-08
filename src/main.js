import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import router from "./router";
import VeeValidatePlugin from "./includes/validation";
import VueGoogleMaps from "@fawmi/vue-google-maps";
// import Toaster from "@meforma/vue-toaster";
// import {createToaster} from "@meforma/vue-toaster";
import "./assets/main.css";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
pinia.use(piniaPluginPersistedstate);
app.use(router);
app.use(VeeValidatePlugin);
app.use(VueGoogleMaps, {
  load: {
    key: import.meta.env.VITE_GOOGLE_MAP_API_KEY,
  },
});
// app.use(Toaster);

app.mount("#app");
