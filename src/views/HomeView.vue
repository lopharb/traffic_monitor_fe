<!-- src/views/Home.vue -->
<template>
	<div class="notification-container">
		<div v-for="notif in notifications" :key="notif.id" class="notification">
			{{ notif.message }}
		</div>
	</div>
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

			crashMarkers: new Set(), // Store markers with crashes
			crashCheckInterval: null,
			notifications: [],
			alertSound: null,
			isMuted: true,
		};
	},
	mounted() {
		this.alertSound = new Audio(require("@/assets/alert.wav"));
		this.fetchMarkers();
		this.startCrashPolling();
	},
	methods: {
		async fetchMarkers() {
			try {
				const response = await axios.get("http://localhost:8000/api/v1/markers");
				this.markers = response.data.map((m) => ({
					...m,
					streamUrl: `http://localhost:8000/api/v1/${m.streamUrl}/${m.id}`,
					isCrash: false,
				}));
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

		startCrashPolling() {
			this.stopCrashPolling();

			this.crashCheckInterval = setInterval(async () => {
				for (const marker of this.markers) {
					try {
						const response = await axios.get(`http://localhost:8000/api/v1/crash/predict_frame/${marker.id}`);
						const { is_crash, confidence } = response.data;
						if (marker.isCrash != is_crash) {
							if (is_crash) {
								this.handleCrashDetected(marker, confidence);
							}
						}
						marker.isCrash = is_crash;
					} catch (error) {
						console.error(`Error checking crash for ${marker.id}:`, error);
					}
				}
			}, 10000); // every minute
		},

		stopCrashPolling() {
			if (this.crashCheckInterval) {
				clearInterval(this.crashCheckInterval);
				this.crashCheckInterval = null;
			}
		},

		handleCrashDetected(marker, confidence) {
			console.log(`Crash detected at marker "${marker.name || `ID: ${marker.id}`}" (Confidence: ${confidence * 100}%)`);
			if (!this.crashMarkers.has(marker.id)) {
				this.crashMarkers.add(marker.id);
				this.showNotification(marker, confidence);
			}
		},

		showNotification(marker, confidence) {
			const notification = {
				id: Date.now(),
				message: `⚠️ Возможная авария на камере "${marker.name || `ID: ${marker.id}`}" (Вероятность: ${(
					confidence * 100
				).toFixed(2)}%)`,
			};
			this.playAlertSound();

			this.notifications.push(notification);

			// Auto-remove after 5 sec
			setTimeout(() => {
				this.notifications = [];
			}, 5000);
		},
		playAlertSound() {
			if (this.isMuted) return;
			try {
				this.alertSound.currentTime = 0; // Rewind to start
				this.alertSound.play();
			} catch (e) {
				console.warn("Could not play sound:", e);
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

.notification-container {
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	z-index: 9999;
	pointer-events: none; /* Allows clicking through */
}

.notification {
	background-color: #e74c3c;
	color: white;
	padding: 1rem 2rem;
	border-radius: 8px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
	animation: slideIn 0.3s ease forwards, fadeOut 2s ease forwards 3s;
	pointer-events: auto; /* Make clickable if needed */
	min-width: 300px;
	text-align: center;
	margin-bottom: 1rem;
}
@keyframes slideIn {
	from {
		opacity: 0;
		transform: scale(0.9);
	}
	to {
		opacity: 1;
		transform: scale(1);
	}
}
@keyframes fadeOut {
	to {
		opacity: 0;
		transform: scale(0.9);
	}
}
</style>
