<template>
	<div class="auth-layout">
		<div class="left-panel">
			<slot name="left"></slot>
		</div>
		<div class="right-panel">
			<slot name="right"></slot>
		</div>
	</div>
</template>

<script>
export default {
	name: "AuthLayout",
};
</script>

<style scoped>
.auth-layout {
	display: flex;
	height: 100vh;
	width: 100%;
}

.left-panel {
	flex: 1;
	background-color: #2c3e50; /* Dark theme */
	color: white;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	padding: 2rem;
	text-align: center;
}

.right-panel {
	flex: 2;
	background-color: #fff;
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
