<script setup>
import { onMounted, ref } from 'vue'
import MythCard from '../components/MythCard.vue'
import TrendChartCard from '../components/TrendChartCard.vue'
import { getHeatTrend, getMythCards, getSkinCancerTrend } from '../services/awarenessService'

const myths = ref([])
const skinTrend = ref([])
const heatTrend = ref([])
const selectedFigure = ref('skin')
const shareStatus = ref('')

async function loadData() {
  myths.value = await getMythCards()
  skinTrend.value = await getSkinCancerTrend()
  heatTrend.value = await getHeatTrend()
}

async function shareMyth(item) {
  const text = `${item.title}\n\n${item.explanation}`

  if (navigator.share) {
    await navigator.share({
      title: 'Sun Safety Myth Card',
      text
    })
    shareStatus.value = 'Shared successfully.'
    return
  }

  await navigator.clipboard.writeText(text)
  shareStatus.value = 'Share not supported here. Myth copied to clipboard.'
}

onMounted(loadData)
</script>

<template>
  <section class="page-panel">
    <header class="panel-header">
      <h2>Awareness Hub</h2>
      <p>Explore myths and visual snapshots of Australian skin cancer and heat trends.</p>
    </header>

    <div class="myth-grid">
      <MythCard v-for="item in myths" :key="item.id" :item="item" @share="shareMyth" />
    </div>

    <p v-if="shareStatus" class="status-message">{{ shareStatus }}</p>

    <div class="card figure-controls">
      <button
        type="button"
        class="secondary-btn"
        :class="{ active: selectedFigure === 'skin' }"
        @click="selectedFigure = 'skin'"
      >
        Skin Cancer Trend Visualisation
      </button>
      <button
        type="button"
        class="secondary-btn"
        :class="{ active: selectedFigure === 'heat' }"
        @click="selectedFigure = 'heat'"
      >
        Heat Trend Visualisation
      </button>
    </div>

    <TrendChartCard
      v-if="selectedFigure === 'skin'"
      title="Estimated Skin Cancer Cases in Australia"
      :data="skinTrend"
      x-key="year"
      y-key="cases"
      y-label="Estimated annual cases"
    />

    <TrendChartCard
      v-else
      title="Historical Heat Trend Across Regions"
      :data="heatTrend"
      x-key="region"
      y-key="avgHotDays"
      y-label="Average very hot days per year"
    />
  </section>
</template>
