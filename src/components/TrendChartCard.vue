<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  data: {
    type: Array,
    required: true
  },
  xKey: {
    type: String,
    required: true
  },
  yKey: {
    type: String,
    required: true
  },
  yLabel: {
    type: String,
    required: true
  }
})

const maxValue = computed(() => {
  if (!props.data.length) return 1
  return Math.max(...props.data.map((row) => Number(row[props.yKey]) || 0), 1)
})

const yTicks = computed(() => [1, 0.75, 0.5, 0.25, 0].map((ratio) => Math.round(maxValue.value * ratio)))

function normalizedHeight(value) {
  return `${Math.max(8, Math.round((Number(value) / maxValue.value) * 100))}%`
}
</script>

<template>
  <section class="card chart-card">
    <h3>{{ props.title }}</h3>
    <div class="chart-layout">
      <div class="y-axis" aria-hidden="true">
        <span v-for="(tick, index) in yTicks" :key="`${tick}-${index}`">{{ tick }}</span>
      </div>
      <div class="bar-chart" role="img" :aria-label="props.title">
        <div
          v-for="row in props.data"
          :key="String(row[props.xKey])"
          class="bar-item"
        >
          <div class="bar" :style="{ height: normalizedHeight(row[props.yKey]) }"></div>
          <span class="bar-label">{{ row[props.xKey] }}</span>
        </div>
      </div>
    </div>
    <p class="chart-caption">Metric: {{ props.yLabel }}</p>
  </section>
</template>
