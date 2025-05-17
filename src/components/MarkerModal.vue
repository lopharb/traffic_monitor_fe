<!-- src/components/MarkerModal.vue -->
<template>
	<div v-if="show" class="modal-overlay">
		<div class="modal">
			<h2>Marker Details</h2>
			<p><strong>Latitude:</strong> {{ lat }}</p>
			<p><strong>Longitude:</strong> {{ lng }}</p>

			<div class="iframe-container" v-if="streamUrl"><img :src="streamUrl" /></div>

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
		streamUrl: {
			type: String,
			default: null,
		},
	},
	watch: {
		show(newVal) {
			if (this.$refs.videoPlayer) {
				if (newVal) {
					this.$refs.videoPlayer.play().catch((err) => {
						console.error("Video autoplay failed:", err);
					});
				} else {
					this.$refs.videoPlayer.pause();
				}
			}
		},
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
	max-width: 600px;
	width: 90%;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
	text-align: left;
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

button {
	margin: auto;
	padding: 0.5rem 1rem;
	font-size: 1rem;
	cursor: pointer;
}

.iframe-container {
	position: relative;
	width: 100%;
	aspect-ratio: 16 / 9; /* Ensures consistent video proportions */
	background-color: black;
	overflow: hidden;
	border-radius: 8px;
	object-fit: cover;
}

.iframe-container img {
	zoom: 100%;
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	border: none;
	transform-origin: top left;
	transition: transform 0.2s ease;
}
</style>
