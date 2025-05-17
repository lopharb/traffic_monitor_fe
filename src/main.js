// src/main.js
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
	iconUrl,
	shadowUrl,
});

createApp(App).use(router).mount("#app");
