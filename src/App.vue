<!-- src/App.vue -->
<template>
	<div id="app">
		<HeaderComponent />

		<main class="app-content">
			<router-view />
		</main>

		<FooterComponent />
	</div>
</template>

<script>
import HeaderComponent from "./components/HeaderComponent.vue";
import FooterComponent from "./components/FooterComponent.vue";

export default {
	name: "App",
	components: {
		HeaderComponent,
		FooterComponent,
	},
};
</script>

<style>
#app {
	display: flex;
	flex-direction: column;
	min-height: 100vh;
}
</style>
