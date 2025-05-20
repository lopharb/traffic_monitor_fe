<template>
	<div v-if="show" class="modal-overlay" @click.self="close">
		<div class="modal">
			<h2>Подробности</h2>

			<!-- Tabs -->
			<div class="tabs">
				<button :class="['tab', { active: activeTab === 'stream' }]" @click="activeTab = 'stream'">Камера</button>
				<button :class="['tab', { active: activeTab === 'stats' }]" @click="activeTab = 'stats'">Сатистика</button>
			</div>

			<!-- Content -->
			<div class="modal-content">
				<!-- Stream Tab -->
				<div v-show="activeTab === 'stream'" class="tab-pane">
					<div class="iframe-container" v-if="streamUrl">
						<img :src="streamUrl" />
					</div>
				</div>

				<!-- Stats Tab -->
				<div v-show="activeTab === 'stats'" class="tab-pane">
					<DateRangePicker @submit="onDateSubmit" />
					<StatsChart :stats="currentStats" v-if="currentStats.length > 0" />
					<button @click="exportToExcel" class="export-button">📥 Экспорт данных</button>
				</div>
			</div>

			<button @click="close">Закрыть</button>
		</div>
	</div>
</template>

<script>
import DateRangePicker from "./DateRangePicker.vue";
import StatsChart from "./StatsChart.vue";
import axios from "axios";

export default {
	name: "MarkerModal",
	components: {
		DateRangePicker,
		StatsChart,
	},
	props: {
		show: Boolean,
		lat: [String, Number],
		lng: [String, Number],
		streamUrl: {
			type: String,
			default: null,
		},
		markerId: {
			type: [Number, String],
			required: true,
		},
	},
	data() {
		return {
			activeTab: "stream",
			currentStats: [],
			startDate: null,
			endDate: null,
		};
	},
	methods: {
		async fetchStats(start = null, end = null) {
			try {
				let url = `http://localhost:8000/api/v1/markers/stats/${this.markerId}`;
				if (start && end) {
					url += `?start_date=${start}&end_date=${end}`;
				}

				const response = await axios.get(url);
				this.currentStats = response.data.stats;
			} catch (error) {
				console.error("Failed to load stats:", error);
				this.currentStats = [];
			}
		},
		onDateSubmit({ start, end }) {
			this.startDate = start;
			this.endDate = end;
			this.fetchStats(start, end);
		},
		close() {
			this.$emit("update:show", false);
		},
		async exportToExcel() {
			const start = this.startDate;
			const end = this.endDate; // You can reuse your current range logic
			const token = localStorage.getItem("token");

			try {
				let url = `http://localhost:8000/api/v1/markers/stats/${this.markerId}/export`;
				if (start && end) {
					url += `?start_date=${start}&end_date=${end}`;
				}

				const response = await fetch(url, {
					method: "GET",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

				if (!response.ok) throw new Error("Export failed");

				const blob = await response.blob();
				const downloadUrl = window.URL.createObjectURL(blob);
				const a = document.createElement("a");
				a.href = downloadUrl;
				a.download = `camera_${this.markerId}_stats.xlsx`;
				document.body.appendChild(a);
				a.click();
				window.URL.revokeObjectURL(downloadUrl);
				a.remove();
			} catch (error) {
				console.error("Error exporting:", error);
				alert("Failed to export stats");
			}
		},
	},
	watch: {
		show(newVal) {
			if (newVal) {
				this.fetchStats();
			}
		},
		tabChange(newVal) {
			if (newVal) {
				this.activeTab = "stream";
				this.fetchStats();
			}
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

.tabs {
	display: flex;
	gap: 1rem;
	margin-bottom: 1rem;
}

.tab {
	background: none;
	border: none;
	padding: 0.5rem 1rem;
	font-size: 1rem;
	cursor: pointer;
	border-bottom: 2px solid transparent;
	transition: all 0.2s ease;
}

.tab.active {
	border-bottom: 2px solid #2c3e50;
	font-weight: bold;
	color: #2c3e50;
}

.modal-content {
	max-height: 60vh;
	overflow-y: auto;
	flex: 1;
}

.tab-pane {
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
	/* overflow: hidden; */
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

.export-button {
	background-color: #27ae60;
	color: white;
	border: none;
	padding: 0.5rem 1rem;
	font-size: 1rem;
	border-radius: 4px;
	cursor: pointer;
}

.export-button:hover {
	background-color: #2ecc71;
}
</style>
