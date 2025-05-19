// src/router.js
import { createRouter, createWebHistory } from "vue-router";
import HomeView from "./views/HomeView.vue";
import AuthView from "./views/AuthView.vue";

const routes = [
	{
		path: "/",
		name: "Home",
		component: HomeView,
	},
	{
		path: "/auth",
		name: "Auth",
		component: AuthView,
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
