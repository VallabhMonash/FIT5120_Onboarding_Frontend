<script setup>
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

function normalizedHeight(value, max) {
  return `${Math.max(8, Math.round((value / max) * 100))}%`
}
</script>

<template>
  <section class="card chart-card">
    <h3>{{ props.title }}</h3>
    <div class="bar-chart" role="img" :aria-label="props.title">
      <div
        v-for="row in props.data"
        :key="String(row[props.xKey])"
        class="bar-item"
      >
        <div
          class="bar"
          :style="{ height: normalizedHeight(row[props.yKey], Math.max(...props.data.map((d) => d[props.yKey]))) }"
        ></div>
        <span class="bar-label">{{ row[props.xKey] }}</span>
      </div>
    </div>
    <p class="chart-caption">Metric: {{ props.yLabel }}</p>
  </section>
</template>
