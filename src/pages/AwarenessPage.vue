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
    <section class="uv-intro card">
      <div class="uv-intro-copy">
        <p class="hero-kicker">Awareness</p>
        <h2>Understand UV patterns, myths, and prevention with clear visual guidance.</h2>
        <p>
          Learn why ozone depletion and high UV exposure matter, and use practical awareness tools to make safer outdoor decisions.
        </p>
      </div>
      <img src="/ozone-layer-depletion-pana.svg" alt="Ozone and UV awareness illustration" class="uv-intro-art" />
    </section>

    <div class="awareness-page-shell">
      <header class="panel-header awareness-head">
        <h2>Awareness</h2>
        <p>Swipe myth cards on mobile and explore trends with interactive visualisations.</p>
      </header>

      <section class="myth-carousel">
        <div class="myth-carousel-head">
          <div>
            <p class="myth-kicker">Myth vs Fact</p>
            <h3>Common UV misconceptions</h3>
          </div>
          <p class="myth-count">{{ myths.length }} cards</p>
        </div>
        <div class="myth-strip">
          <MythCard v-for="(item, index) in myths" :key="item.id" :item="item" :index="index" @share="shareMyth" />
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
    </div>
  </section>
</template>
