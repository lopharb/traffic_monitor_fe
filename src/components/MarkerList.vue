<template>
	<div class="marker-list-container">
		<h2>Камеры</h2>
		<input v-model="searchQuery" placeholder="Поиск..." class="search-input" />

		<ul class="marker-list">
			<li
				v-for="(marker, index) in filteredMarkers"
				:key="index"
				class="marker-item"
				:class="{ highlighted: marker.isCrash }"
				@click="selectMarker(marker)"
			>
				{{ marker.name || `Marker ${index + 1}` }}
			</li>
		</ul>
	</div>
</template>

<script>
export default {
	name: "MarkerList",
	props: {
		markers: {
			type: Array,
			required: true,
		},
	},
	data() {
		return {
			searchQuery: "",
		};
	},
	computed: {
		filteredMarkers() {
			if (!this.searchQuery) return this.markers;

			const query = this.searchQuery.toLowerCase();
			return this.markers.filter((marker) => {
				const name = marker.name ? marker.name.toLowerCase() : "";
				return name.includes(query);
			});
		},
	},
	methods: {
		selectMarker(marker) {
			this.$emit("marker-selected", marker);
		},
	},
};
</script>

<style scoped>
.marker-list-container {
	padding: 1rem;
	background-color: #f0f0f095;
	border-radius: 10px;
}

.search-input {
	width: 100%;
	padding: 0.5rem;
	margin-bottom: 1rem;
	font-size: 1rem;
	border-radius: 5px;
}

.marker-list {
	list-style: none;
	padding: 0;
	margin: 0;
	max-height: calc(100vh - 160px);
	overflow-y: auto;
}

.marker-item {
	padding: 0.5rem;
	cursor: pointer;
	border-bottom: 1px solid #eee;
	border-radius: 5px;
}
.marker-item.highlighted {
	color: #d63031;
	background-color: #f5a8a8;
	border-left: 4px solid #d63031;

	color: white;
	font-weight: bold;
}
.marker-item.highlighted:hover {
	color: #d63031;
	background-color: #f4cdcd;
	border-left: 4px solid #d63031;

	color: white;
	font-weight: bold;
}

.marker-item:hover {
	background-color: #f0f0f0;
}
</style>
