<!-- src/components/Header.vue -->
<template>
	<header class="app-header">
		<h1>🗺️ My Map App</h1>
		<nav>
			<router-link to="/">Home</router-link> |
			<router-link to="/about">About</router-link>
		</nav>
	</header>
</template>

<script>
export default {
	name: "HeaderComponent",
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
