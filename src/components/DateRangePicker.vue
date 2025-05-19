<template>
	<div class="date-range-picker">
		<label>Start Date</label>
		<input type="date" v-model="startDate" />

		<label>End Date</label>
		<input type="date" v-model="endDate" />

		<button @click="submit">Apply</button>
	</div>
</template>

<script>
export default {
	name: "DateRangePicker",
	data() {
		return {
			startDate: null,
			endDate: null,
		};
	},
	methods: {
		submit() {
			this.$emit("submit", { start: this.startDate, end: this.endDate });
		},
	},
};
</script>

<style scoped>
.date-range-picker {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	margin-bottom: 1rem;
}

input[type="date"] {
	padding: 0.5rem;
	font-size: 1rem;
}

button {
	padding: 0.5rem;
	background-color: #2c3e50;
	color: white;
	border: none;
	cursor: pointer;
	border-radius: 4px;
}

button:hover {
	background-color: #1a252f;
}
</style>
