import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import router from "./router";
import SocketIo from "./plugins/io";
import VeeValidatePlugin from "./includes/validation";
import VueGoogleMaps from "@fawmi/vue-google-maps";
import "./assets/main.css";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
pinia.use(piniaPluginPersistedstate);
app.use(router);
app.use(SocketIo, {
  connection: import.meta.env.VITE_PORT_IO,
});
app.use(VeeValidatePlugin);
app.use(VueGoogleMaps, {
  load: {
    key: import.meta.env.VITE_GOOGLE_MAP_API_KEY,
  },
});

app.mount("#app");
