<!-- src/views/Home.vue -->
<template>
	<table class="content-table">
		<tr>
			<td style="width: 80%">
				<div class="map-container">
					<div class="map">
						<l-map ref="map" :zoom="zoom" :center="center" @click="addMarker" style="height: 100%; width: 100%">
							<l-tile-layer :url="url" :attribution="attribution" />
							<l-marker
								v-for="(marker, index) in markers"
								:key="index"
								:lat-lng="marker.position"
								@click="openModal(marker)"
							>
								<l-popup> Marker at {{ marker.position }} </l-popup>
							</l-marker>
						</l-map>
					</div>

					<MarkerModal
						v-if="selectedMarker"
						:show="isModalOpen"
						:lat="selectedMarker.position[0]"
						:lng="selectedMarker.position[1]"
						:marker-id="selectedMarker.id"
						:stream-url="selectedMarker.streamUrl"
						@update:show="handleModalClose"
					/>
				</div>
			</td>
			<td>
				<div class="marker-list-container"><MarkerList :markers="markers" @marker-selected="centerOnMarker" /></div>
			</td>
		</tr>
	</table>
</template>

<script>
import { LMap, LTileLayer, LMarker, LPopup } from "vue3-leaflet";
import MarkerModal from "../components/MarkerModal.vue";
import MarkerList from "@/components/MarkerList.vue";
import axios from "axios";

export default {
	name: "HomeView",
	components: {
		LMap,
		LTileLayer,
		LMarker,
		LPopup,
		MarkerModal,
		MarkerList,
	},
	data() {
		return {
			zoom: 13,
			center: [53.893009, 27.567444],
			url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright ">OpenStreetMap</a> contributors',
			markers: [],
			selectedMarker: null,
			isModalOpen: false,
		};
	},
	mounted() {
		this.fetchMarkers();
	},
	methods: {
		async fetchMarkers() {
			try {
				const response = await axios.get("http://localhost:8000/api/v1/markers");
				this.markers = response.data.map((m) => ({ ...m, streamUrl: `http://localhost:8000/api/v1/${m.streamUrl}` }));
			} catch (error) {
				console.error("Failed to fetch markers:", error);
			}
		},
		addMarker(event) {
			const { latlng } = event;
			this.markers.push({ position: [latlng.lat, latlng.lng], name: "New Marker", streamUrl: "detect/video_stream" });
		},
		openModal(marker) {
			this.selectedMarker = marker;
			this.isModalOpen = true;
		},
		handleModalClose(isOpen) {
			this.isModalOpen = isOpen;
		},
		centerOnMarker(marker) {
			this.center = marker.position;
			this.zoom = 17; // Optional: zoom in on selection
			if (this.$refs.map) {
				const map = this.$refs.map;
				map.setView(this.center, this.zoom); // Zoom level 17
			}
		},
	},
};
</script>

<style scoped>
.map {
	height: 80vh;
	overflow: hidden;
	width: 100%;
	border-radius: 10px 0 0 10px;
}
.content-table {
	display: table;
	width: 98%;
	height: 98%;
	table-layout: fixed;
	margin: 1%;
}
.map-container {
	width: 100%;
	height: 100%;
}
.marker-list-container {
	width: 100%;
	height: 100%;
	border-radius: 0 10px 10px 0;
}
</style>
