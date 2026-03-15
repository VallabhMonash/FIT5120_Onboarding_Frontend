<script setup>
import { computed, onMounted, ref } from 'vue'
import HeatLineChart from '../components/HeatLineChart.vue'
import MythCard from '../components/MythCard.vue'
import TrendChartCard from '../components/TrendChartCard.vue'
import { getHeatTrend, getMythCards, getSkinCancerTrend } from '../services/awarenessService'

const myths = ref([])
const skinTrend = ref([])
const heatTrend = ref([])
const selectedFigure = ref('skin')
const shareStatus = ref('')
const activeMythIndex = ref(0)
const touchStartX = ref(0)

const activeMyth = computed(() => myths.value[activeMythIndex.value] || null)

const binnedSkinTrend = computed(() => {
  const groups = new Map()

  for (const row of skinTrend.value) {
    const year = Number(row.year)
    const cases = Number(row.cases)

    if (!Number.isFinite(year) || !Number.isFinite(cases)) continue

    const binStart = Math.floor(year / 5) * 5
    const binEnd = binStart + 4
    const key = `${binStart}-${binEnd}`

    if (!groups.has(key)) {
      groups.set(key, { period: key, total: 0, count: 0 })
    }

    const bucket = groups.get(key)
    bucket.total += cases
    bucket.count += 1
  }

  return [...groups.values()]
    .sort((a, b) => Number(a.period.slice(0, 4)) - Number(b.period.slice(0, 4)))
    .map((item) => ({ period: item.period, cases: Math.round(item.total / item.count) }))
})

async function loadData() {
  myths.value = await getMythCards()
  skinTrend.value = await getSkinCancerTrend()
  heatTrend.value = await getHeatTrend()
}

function nextMyth() {
  if (!myths.value.length) return
  activeMythIndex.value = (activeMythIndex.value + 1) % myths.value.length
}

function prevMyth() {
  if (!myths.value.length) return
  activeMythIndex.value = (activeMythIndex.value - 1 + myths.value.length) % myths.value.length
}

function setMyth(index) {
  activeMythIndex.value = index
}

function onTouchStart(event) {
  touchStartX.value = event.changedTouches[0].screenX
}

function onTouchEnd(event) {
  const delta = event.changedTouches[0].screenX - touchStartX.value
  if (delta > 45) prevMyth()
  if (delta < -45) nextMyth()
}

async function shareMyth(item) {
  const text = `${item.title}\n\n${item.explanation}`

  if (navigator.share) {
    await navigator.share({ title: 'Sun Safety Myth Card', text })
    shareStatus.value = 'Shared successfully.'
    return
  }

  await navigator.clipboard.writeText(text)
  shareStatus.value = 'Copied to clipboard.'
}

onMounted(loadData)
</script>

<template>
  <section class="page-panel">
    <header class="panel-header">
      <h2>Awareness</h2>
      <p>Swipe myth cards and explore trends with interactive visualisations.</p>
    </header>

    <section class="myth-carousel" @touchstart="onTouchStart" @touchend="onTouchEnd">
      <MythCard v-if="activeMyth" :item="activeMyth" @share="shareMyth" />
      <div class="carousel-controls">
        <button type="button" class="secondary-btn" @click="prevMyth">← Prev</button>
        <div class="carousel-dots">
          <button
            v-for="(item, index) in myths"
            :key="item.id"
            type="button"
            class="dot-btn"
            :class="{ active: index === activeMythIndex }"
            :aria-label="`Open myth card ${index + 1}`"
            @click="setMyth(index)"
          ></button>
        </div>
        <button type="button" class="secondary-btn" @click="nextMyth">Next →</button>
      </div>
    </section>

    <p v-if="shareStatus" class="status-message">{{ shareStatus }}</p>

    <div class="card figure-controls figures-row">
      <button
        type="button"
        class="secondary-btn"
        :class="{ active: selectedFigure === 'skin' }"
        title="Shows 5-year binned average skin cancer cases in Australia"
        @click="selectedFigure = 'skin'"
      >
        Skin Cancer Trend ⓘ
      </button>
      <button
        type="button"
        class="secondary-btn"
        :class="{ active: selectedFigure === 'heat' }"
        title="Shows city-level UV trend over years. Select up to 5 cities."
        @click="selectedFigure = 'heat'"
      >
        UV Heat Trend ⓘ
      </button>
    </div>

    <TrendChartCard
      v-if="selectedFigure === 'skin'"
      title="Skin Cancer Cases (5-year bins)"
      :data="binnedSkinTrend"
      x-key="period"
      y-key="cases"
      y-label="Average annual cases"
    />

    <section v-else class="card chart-card">
      <h3>Historical UV Trend by City</h3>
      <p class="chart-caption">Compare up to 5 cities at a time.</p>
      <HeatLineChart :data="heatTrend" :height="340" />
      <p class="chart-caption">Metric: Average UV index (yearly)</p>
    </section>
  </section>
</template>
