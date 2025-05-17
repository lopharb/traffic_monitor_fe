<!-- src/components/MarkerModal.vue -->
<template>
	<div v-if="show" class="modal-overlay">
		<div class="modal">
			<h2>Marker Details</h2>
			<p><strong>Latitude:</strong> {{ lat }}</p>
			<p><strong>Longitude:</strong> {{ lng }}</p>
			<button @click="close">Close</button>
		</div>
	</div>
</template>

<script>
export default {
	name: "MarkerModal",
	props: {
		show: Boolean,
		lat: [String, Number],
		lng: [String, Number],
	},
	methods: {
		close() {
			this.$emit("update:show", false);
		},
	},
};
</script>

<style scoped>
.modal-overlay {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 999;
}

.modal {
	background: white;
	padding: 2rem;
	border-radius: 8px;
	max-width: 400px;
	width: 90%;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
	text-align: left;
}

button {
	margin-top: 1rem;
	padding: 0.5rem 1rem;
	font-size: 1rem;
	cursor: pointer;
}
</style>
