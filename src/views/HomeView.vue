<!-- src/views/Home.vue -->
<template>
	<div>
		<div class="map">
			<l-map ref="map" :zoom="zoom" :center="center" @click="addMarker" style="height: 100%; width: 100%">
				<l-tile-layer :url="url" :attribution="attribution" />
				<l-marker v-for="(marker, index) in markers" :key="index" :lat-lng="marker.position" @click="openModal(marker)">
					<l-popup> Marker at {{ marker.position }} </l-popup>
				</l-marker>
			</l-map>
		</div>

		<MarkerModal
			v-if="selectedMarker"
			:show="isModalOpen"
			:lat="selectedMarker.position[0]"
			:lng="selectedMarker.position[1]"
			@update:show="handleModalClose"
		/>
	</div>
</template>

<script>
import { LMap, LTileLayer, LMarker, LPopup } from "vue3-leaflet";
import MarkerModal from "../components/MarkerModal.vue";

export default {
	name: "HomeView",
	components: {
		LMap,
		LTileLayer,
		LMarker,
		LPopup,
		MarkerModal,
	},
	data() {
		return {
			zoom: 13,
			center: [51.505, -0.09],
			url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright ">OpenStreetMap</a> contributors',
			markers: [],
			selectedMarker: null,
			isModalOpen: false,
		};
	},
	methods: {
		addMarker(event) {
			const { latlng } = event;
			this.markers.push({ position: [latlng.lat, latlng.lng] });
		},
		openModal(marker) {
			this.selectedMarker = marker;
			this.isModalOpen = true;
		},
		handleModalClose(isOpen) {
			this.isModalOpen = isOpen;
		},
	},
};
</script>

<style scoped>
.map {
	border-radius: 15px;
	height: 70vh;
}
</style>
