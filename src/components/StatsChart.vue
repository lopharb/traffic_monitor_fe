<template>
	<div class="chart-container">
		<canvas ref="chartCanvas"></canvas>
	</div>
</template>

<script>
import Chart from "chart.js/auto";

export default {
	name: "StatsChart",
	props: {
		stats: {
			type: Array,
			required: true,
		},
	},
	watch: {
		stats: {
			deep: true,
			handler(newStats) {
				this.renderChart(newStats);
			},
		},
	},
	mounted() {
		this.renderChart(this.stats);
	},
	beforeUnmount() {
		if (this.chart) {
			this.chart.destroy();
		}
	},
	methods: {
		renderChart(stats) {
			const ctx = this.$refs.chartCanvas.getContext("2d");

			// Clean up existing chart
			if (this.chart) {
				this.chart.destroy();
			}

			// Aggregate by date
			const grouped = stats.reduce((acc, stat) => {
				acc[stat.date] = acc[stat.date] || {
					date: stat.date,
					car_count: 0,
					truck_count: 0,
					motorcycle_count: 0,
					pickup_count: 0,
					bus_count: 0,
					unknown_count: 0,
				};

				acc[stat.date].car_count += stat.car_count;
				acc[stat.date].truck_count += stat.truck_count;
				acc[stat.date].motorcycle_count += stat.motorcycle_count;
				acc[stat.date].pickup_count += stat.pickup_count;
				acc[stat.date].bus_count += stat.bus_count;
				acc[stat.date].unknown_count += stat.unknown_count;

				return acc;
			}, {});

			const sortedDates = Object.values(grouped).sort((a, b) => new Date(a.date) - new Date(b.date));

			const labels = sortedDates.map((d) => d.date);
			const carData = sortedDates.map((d) => d.car_count);
			const truckData = sortedDates.map((d) => d.truck_count);
			const motorcycleData = sortedDates.map((d) => d.motorcycle_count);
			const busData = sortedDates.map((d) => d.bus_count);
			const pickupData = sortedDates.map((d) => d.pickup_count);
			const unknownData = sortedDates.map((d) => d.unknown_count);

			this.chart = new Chart(ctx, {
				type: "line",
				data: {
					labels,
					datasets: [
						{
							label: "Легковые автомобили",
							data: carData,
							borderColor: "#3498db",
							tension: 0.3,
							fill: false,
						},
						{
							label: "Грузовые автомобили",
							data: truckData,
							borderColor: "#e74c3c",
							tension: 0.3,
							fill: false,
						},
						{
							label: "Мотоциклы",
							data: motorcycleData,
							borderColor: "#2ecc71",
							tension: 0.3,
							fill: false,
						},
						{
							label: "Автобусы",
							data: busData,
							borderColor: "#f1c40f",
							tension: 0.3,
							fill: false,
						},
						{
							label: "Прицепы",
							data: pickupData,
							borderColor: "#9b59b6",
							tension: 0.3,
							fill: false,
						},
						{
							label: "Прочее",
							data: unknownData,
							borderColor: "#34495e",
							tension: 0.3,
							fill: false,
						},
					],
				},
				options: {
					responsive: true,
					plugins: {
						legend: {
							position: "top",
						},
					},
					scales: {
						y: {
							beginAtZero: true,
						},
					},
				},
			});
		},
	},
};
</script>

<style scoped>
.chart-container {
	height: 300px;
	width: 100%;
}
</style>
