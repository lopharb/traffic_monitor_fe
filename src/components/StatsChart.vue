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

      const sortedDates = Object.values(grouped).sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );

      const labels = sortedDates.map((d) => d.date);
      const carData = sortedDates.map((d) => d.car_count);
      const truckData = sortedDates.map((d) => d.truck_count);
      const motorcycleData = sortedDates.map((d) => d.motorcycle_count);
      const busData = sortedDates.map((d) => d.bus_count);
      const pickupData = sortedDates.map((d) => d.pickup_count);
      const unknownData = sortedDates.map((d) => d.unknown_count);

      // Calculate means for each vehicle type
      const calculateMean = (data) => {
        const sum = data.reduce((acc, val) => acc + val, 0);
        return sum / data.length || 0;
      };

      const carMean = calculateMean(carData);
      const truckMean = calculateMean(truckData);
      const motorcycleMean = calculateMean(motorcycleData);
      const busMean = calculateMean(busData);
      const pickupMean = calculateMean(pickupData);
      const unknownMean = calculateMean(unknownData);

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
              id: "cars",
            },
            {
              label: "Среднее (Легковые)",
              data: Array(labels.length).fill(carMean),
              borderColor: "#3498db",
              borderDash: [5, 5],
              borderWidth: 1,
              pointRadius: 0,
              tension: 0,
              fill: false,
              backgroundColor: "rgba(52, 152, 219, 0.3)",
              hidden: false,
              id: "cars-mean",
            },
            {
              label: "Грузовые автомобили",
              data: truckData,
              borderColor: "#e74c3c",
              tension: 0.3,
              fill: false,
              id: "trucks",
            },
            {
              label: "Среднее (Грузовые)",
              data: Array(labels.length).fill(truckMean),
              borderColor: "#e74c3c",
              borderDash: [5, 5],
              borderWidth: 1,
              pointRadius: 0,
              tension: 0,
              fill: false,
              backgroundColor: "rgba(231, 76, 60, 0.3)",
              hidden: false,
              id: "trucks-mean",
            },
            {
              label: "Мотоциклы",
              data: motorcycleData,
              borderColor: "#2ecc71",
              tension: 0.3,
              fill: false,
              id: "motorcycles",
            },
            {
              label: "Среднее (Мотоциклы)",
              data: Array(labels.length).fill(motorcycleMean),
              borderColor: "#2ecc71",
              borderDash: [5, 5],
              borderWidth: 1,
              pointRadius: 0,
              tension: 0,
              fill: false,
              backgroundColor: "rgba(46, 204, 113, 0.3)",
              hidden: false,
              id: "motorcycles-mean",
            },
            {
              label: "Автобусы",
              data: busData,
              borderColor: "#f1c40f",
              tension: 0.3,
              fill: false,
              id: "buses",
            },
            {
              label: "Среднее (Автобусы)",
              data: Array(labels.length).fill(busMean),
              borderColor: "#f1c40f",
              borderDash: [5, 5],
              borderWidth: 1,
              pointRadius: 0,
              tension: 0,
              fill: false,
              backgroundColor: "rgba(241, 196, 15, 0.3)",
              hidden: false,
              id: "buses-mean",
            },
            {
              label: "Прицепы",
              data: pickupData,
              borderColor: "#9b59b6",
              tension: 0.3,
              fill: false,
              id: "pickups",
            },
            {
              label: "Среднее (Прицепы)",
              data: Array(labels.length).fill(pickupMean),
              borderColor: "#9b59b6",
              borderDash: [5, 5],
              borderWidth: 1,
              pointRadius: 0,
              tension: 0,
              fill: false,
              backgroundColor: "rgba(155, 89, 182, 0.3)",
              hidden: false,
              id: "pickups-mean",
            },
            {
              label: "Прочее",
              data: unknownData,
              borderColor: "#34495e",
              tension: 0.3,
              fill: false,
              id: "unknown",
            },
            {
              label: "Среднее (Прочее)",
              data: Array(labels.length).fill(unknownMean),
              borderColor: "#34495e",
              borderDash: [5, 5],
              borderWidth: 1,
              pointRadius: 0,
              tension: 0,
              fill: false,
              backgroundColor: "rgba(52, 73, 94, 0.3)",
              hidden: false,
              id: "unknown-mean",
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "top",
              onClick: (evt, legendItem, legend) => {
                const index = legendItem.datasetIndex;
                const ci = legend.chart;
                const meta = ci.getDatasetMeta(index);

                // Get the id of the clicked dataset
                const datasetId = ci.data.datasets[index].id;

                // Toggle the dataset visibility
                meta.hidden =
                  meta.hidden === false
                    ? !ci.data.datasets[index].hidden
                    : false;

                // Find and toggle the corresponding mean dataset
                if (!datasetId.includes("-mean")) {
                  const meanId = datasetId + "-mean";
                  const meanIndex = ci.data.datasets.findIndex(
                    (ds) => ds.id === meanId
                  );

                  if (meanIndex !== -1) {
                    const meanMeta = ci.getDatasetMeta(meanIndex);
                    meanMeta.hidden = meta.hidden;
                    console.log("Clicked legend item:", meta.hidden);
                  }
                }

                ci.update();
              },
              labels: {
                filter: function (item) {
                  // Only show primary labels, hide mean labels
                  return !item.text.includes("Среднее");
                },
              },
            },
            tooltip: {
              callbacks: {
                footer: function (tooltipItems) {
                  const label = tooltipItems[0].dataset.label;
                  // const datasetId = tooltipItems[0].dataset.id;

                  // Only show mean in tooltip for non-mean datasets
                  if (!label.includes("Среднее")) {
                    const vehicleType = label;
                    let meanValue;

                    if (vehicleType === "Легковые автомобили")
                      meanValue = carMean;
                    else if (vehicleType === "Грузовые автомобили")
                      meanValue = truckMean;
                    else if (vehicleType === "Мотоциклы")
                      meanValue = motorcycleMean;
                    else if (vehicleType === "Автобусы") meanValue = busMean;
                    else if (vehicleType === "Прицепы") meanValue = pickupMean;
                    else if (vehicleType === "Прочее") meanValue = unknownMean;

                    // Get the meta for this dataset to check if it's hidden
                    const chart = tooltipItems[0].chart;
                    const datasetIndex = tooltipItems[0].datasetIndex;
                    const meta = chart.getDatasetMeta(datasetIndex);

                    // Only show mean if dataset is visible
                    if (!meta.hidden) {
                      return `Среднее: ${meanValue.toFixed(2)}`;
                    }
                  }
                  return null;
                },
              },
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
