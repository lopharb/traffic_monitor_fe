<template>
	<div class="auth-card">
		<!-- Logo / App Icon -->
		<div v-if="$slots.logo" class="auth-logo">
			<slot name="logo"></slot>
		</div>

		<!-- Title & Subtitle -->
		<div class="auth-header">
			<h2>{{ title }}</h2>
			<p v-if="subtitle" class="subtitle">{{ subtitle }}</p>
		</div>

		<!-- Content -->
		<div class="auth-content">
			<slot></slot>
		</div>
	</div>
</template>

<script>
export default {
	name: "AuthCard",
	props: {
		title: {
			type: String,
			required: true,
		},
		subtitle: {
			type: String,
			default: null,
		},
	},
};
</script>

<style scoped>
.auth-card {
	background: #fff;
	padding: 2rem 3rem;
	border-radius: 12px;
	box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
	width: 100%;
	max-width: 450px;
	text-align: center;
}

.auth-logo {
	margin-bottom: 1rem;
}

.auth-logo img {
	height: 50px;
}

.auth-header h2 {
	margin-bottom: 0.5rem;
	font-size: 1.8rem;
	color: #333;
}

.subtitle {
	color: #666;
	font-size: 1rem;
	margin-bottom: 1.5rem;
}

.auth-content {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}
</style>
