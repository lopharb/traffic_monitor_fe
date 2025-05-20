<!-- src/components/Footer.vue -->
<template>
	<footer class="app-footer">
		<p>&copy; {{ year }} TrafficControl. Все права защищены.</p>
	</footer>
</template>

<script>
export default {
	name: "FooterComponent",
	data() {
		return {
			year: new Date().getFullYear(),
		};
	},
};
</script>

<style scoped>
.app-footer {
	background-color: #2c3e50;
	color: white;
	text-align: center;
	padding: 1rem;
	margin-top: 2rem;
}
</style>
