<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  height: {
    type: Number,
    default: 320
  }
})

const palette = ['#E6194B', '#3CB44B', '#FFE119', '#4363D8', '#F58231', '#911EB4', '#46F0F0', '#F032E6', '#BCF60C', '#008080', '#F582C8', '#9A6324']
const maxSelection = 5
const selectedCities = ref([])

const years = computed(() => [...new Set(props.data.map((row) => Number(row.year)).filter(Number.isFinite))].sort((a, b) => a - b))
const cities = computed(() => [...new Set(props.data.map((row) => row.region))].sort())

watch(
  cities,
  (nextCities) => {
    if (!selectedCities.value.length) {
      selectedCities.value = nextCities.slice(0, maxSelection)
      return
    }

    selectedCities.value = selectedCities.value.filter((city) => nextCities.includes(city)).slice(0, maxSelection)

    if (!selectedCities.value.length) {
      selectedCities.value = nextCities.slice(0, maxSelection)
    }
  },
  { immediate: true }
)

const filteredData = computed(() =>
  props.data
    .filter((row) => selectedCities.value.includes(row.region))
    .map((row) => ({ year: Number(row.year), region: row.region, value: Number(row.avgUv ?? row.avgHotDays ?? 0) }))
)

const yMax = computed(() => {
  const max = Math.max(...filteredData.value.map((row) => row.value), 1)
  return Number((max * 1.1).toFixed(2))
})

const yTicks = computed(() => [1, 0.75, 0.5, 0.25, 0].map((ratio) => Number((yMax.value * ratio).toFixed(1))))

function colorForCity(city) {
  return palette[cities.value.indexOf(city) % palette.length]
}

function xForYear(year) {
  const index = years.value.indexOf(year)
  if (index < 0 || years.value.length <= 1) return 0
  return (index / (years.value.length - 1)) * 100
}

function yForValue(value) {
  return 100 - (value / yMax.value) * 100
}

function pointsForCity(city) {
  return filteredData.value
    .filter((row) => row.region === city)
    .sort((a, b) => a.year - b.year)
    .map((row) => `${xForYear(row.year)},${yForValue(row.value)}`)
    .join(' ')
}

function toggleCity(city) {
  if (selectedCities.value.includes(city)) {
    if (selectedCities.value.length === 1) return
    selectedCities.value = selectedCities.value.filter((name) => name !== city)
    return
  }

  if (selectedCities.value.length >= maxSelection) return
  selectedCities.value = [...selectedCities.value, city]
}

function isCityDisabled(city) {
  return !selectedCities.value.includes(city) && selectedCities.value.length >= maxSelection
}
</script>

<template>
  <div class="line-card">
    <div class="city-filter-row">
      <button
        v-for="city in cities"
        :key="city"
        type="button"
        class="city-chip"
        :class="{ selected: selectedCities.includes(city) }"
        :disabled="isCityDisabled(city)"
        :title="isCityDisabled(city) ? 'Maximum 5 cities selected' : city"
        @click="toggleCity(city)"
      >
        {{ city }}
      </button>
    </div>

    <div class="chart-layout chart-layout-tall">
      <div class="y-axis" aria-hidden="true">
        <span v-for="tick in yTicks" :key="tick">{{ tick }}</span>
      </div>
      <div class="line-chart-wrapper">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" class="line-chart" :style="{ height: `${props.height}px` }">
          <g v-for="tick in yTicks" :key="`grid-${tick}`">
            <line :x1="0" :x2="100" :y1="yForValue(tick)" :y2="yForValue(tick)" class="grid-line" />
          </g>
          <polyline
            v-for="city in selectedCities"
            :key="city"
            :points="pointsForCity(city)"
            fill="none"
            :stroke="colorForCity(city)"
            stroke-width="1.6"
          />
        </svg>
        <div class="x-axis">
          <span v-for="year in years" :key="year">{{ year }}</span>
        </div>
      </div>
    </div>

    <div class="chart-legend">
      <span v-for="city in selectedCities" :key="`legend-${city}`" class="legend-item">
        <span class="legend-dot" :style="{ backgroundColor: colorForCity(city) }"></span>
        {{ city }}
      </span>
    </div>
  </div>
</template>
