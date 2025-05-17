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
* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

html,
body {
	width: 100%;
	height: 100%;
	font-family: sans-serif;
	background-color: #f9f9f9;
}
.app-content {
	flex: 1;
	padding: 1rem 2rem;
}
</style>
