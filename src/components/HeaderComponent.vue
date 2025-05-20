<!-- src/components/Header.vue -->
<template>
	<header class="app-header">
		<h1>🗺️ TrafficControl</h1>
		<nav>
			<router-link to="/">Главная</router-link> |
			<a href="#" @click.prevent="logout">Выйти</a>
		</nav>
	</header>
</template>

<script>
export default {
	name: "HeaderComponent",
	methods: {
		logout() {
			localStorage.removeItem("token");
			this.$router.push("/auth");
		},
	},
};
</script>

<style scoped>
.app-header {
	background-color: #2c3e50;
	color: white;
	padding: 1rem 2rem;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

nav a {
	color: white;
	text-decoration: none;
	margin: 0 0.5rem;
}

nav a:hover {
	text-decoration: underline;
}
</style>
