// src/router.js
import { createRouter, createWebHistory } from "vue-router";
import HomeView from "./views/HomeView.vue";
import AuthView from "./views/AuthView.vue";

function requireAuth(to, from, next) {
	const token = localStorage.getItem("token");
	if (!token) {
		next({ path: "/auth" });
	} else {
		next();
	}
}

function redirectIfLoggedIn(to, from, next) {
	const token = localStorage.getItem("token");
	if (token) {
		next({ path: "/" });
	} else {
		next();
	}
}
const routes = [
	{
		path: "/",
		name: "Home",
		component: HomeView,
		beforeEnter: requireAuth,
	},
	{
		path: "/auth",
		name: "Auth",
		component: AuthView,
		beforeEnter: redirectIfLoggedIn,
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
