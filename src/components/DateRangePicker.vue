<template>
	<div class="date-range-picker">
		<label>Select Date Range</label>

		<div class="inputs">
			<input type="date" v-model="startDate" />
			<span>—</span>
			<input type="date" v-model="endDate" />
			<button @click="submit">Apply</button>
		</div>
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
			// Emit as ISO strings (YYYY-MM-DD)
			this.$emit("submit", {
				start: this.startDate,
				end: this.endDate,
			});
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

.inputs {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	margin-bottom: 0.5rem;
}

input[type="date"] {
	padding: 0.5rem;
	font-size: 1rem;
	border: 1px solid #ccc;
	border-radius: 4px;
}

span {
	color: #666;
}

button {
	padding: 0.5rem;
	background-color: #2c3e50;
	width: 100%;
	height: 100%;
	color: white;
	border: none;
	cursor: pointer;
	border-radius: 4px;
}

button:hover {
	background-color: #1a252f;
}
</style>
