<script setup>
import { getUvThemeClass } from '../services/uvService'

const props = defineProps({
  uvIndex: {
    type: Number,
    required: true
  },
  level: {
    type: String,
    required: true
  },
  recommendation: {
    type: String,
    required: true
  },
  locationLabel: {
    type: String,
    required: true
  }
})
</script>

<template>
  <section class="card uv-card" :class="getUvThemeClass(props.uvIndex)">
    <p class="label">Current UV Index</p>
    <p class="uv-value">{{ props.uvIndex }}</p>
    <p class="level">{{ props.level }}</p>
    <p class="location">Location: {{ props.locationLabel }}</p>
    <p class="recommendation">{{ props.recommendation }}</p>
  </section>
</template>
