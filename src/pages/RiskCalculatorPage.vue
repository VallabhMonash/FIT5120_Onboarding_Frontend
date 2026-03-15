<script setup>
import { onMounted, ref } from 'vue'
import { getRiskGuidanceByTone, getSkinToneOptions } from '../services/riskService'

const tones = ref([])
const selectedTone = ref('')
const guidance = ref(null)
const educationModalOpen = ref(false)
const sourcesModalOpen = ref(false)

async function loadTones() {
  tones.value = await getSkinToneOptions()
}

async function selectTone(toneId) {
  selectedTone.value = toneId
  guidance.value = await getRiskGuidanceByTone(toneId)
}

onMounted(loadTones)
</script>

<template>
  <section class="page-panel">
    <header class="panel-header">
      <h2>Risk Calculator</h2>
      <p>Pick your Fitzpatrick skin tone to view tailored UV risk and prevention guidance.</p>
    </header>

    <section class="card scale-card">
      <div class="scale-row">
        <button
          v-for="tone in tones"
          :key="tone.id"
          type="button"
          class="scale-chip"
          :class="[`tone-${tone.id.toLowerCase()}`, { active: selectedTone === tone.id }]"
          :title="`${tone.label}: ${tone.riskLevel}. ${tone.description}`"
          @click="selectTone(tone.id)"
        >
          <span>{{ tone.label }}</span>
          <small>{{ tone.riskLevel }}</small>
        </button>
      </div>
      <p class="chart-caption">Tap any tone for details. Long press/hover shows quick explanation.</p>
    </section>

    <div v-if="guidance" class="card guidance-card">
      <h3>{{ guidance.title }}</h3>
      <p>{{ guidance.description }}</p>
      <ul>
        <li v-for="action in guidance.preventiveActions" :key="action">{{ action }}</li>
      </ul>
      <div class="figure-controls">
        <button type="button" class="secondary-btn" @click="educationModalOpen = true">Skin Tone Explanation</button>
        <button type="button" class="secondary-btn" @click="sourcesModalOpen = true">View Research Sources</button>
      </div>
    </div>

    <div v-if="educationModalOpen" class="modal-overlay" @click.self="educationModalOpen = false">
      <div class="modal-card">
        <h3>How skin tone relates to UV absorption</h3>
        <p>
          The Fitzpatrick scale estimates how skin reacts to UV exposure. More melanin can lower immediate burn risk, but every skin tone still needs UV protection to reduce long-term damage.
        </p>
        <button type="button" class="primary-btn" @click="educationModalOpen = false">Close</button>
      </div>
    </div>

    <div v-if="sourcesModalOpen" class="modal-overlay" @click.self="sourcesModalOpen = false">
      <div class="modal-card">
        <h3>Research sources</h3>
        <ul class="source-list">
          <li v-for="source in guidance?.sources || []" :key="source.url">
            <a :href="source.url" target="_blank" rel="noreferrer">{{ source.title }}</a>
          </li>
        </ul>
        <button type="button" class="primary-btn" @click="sourcesModalOpen = false">Close</button>
      </div>
    </div>
  </section>
</template>
