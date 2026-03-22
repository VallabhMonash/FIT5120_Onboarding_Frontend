<script setup>
import { onMounted, ref } from 'vue'
import { getRiskGuidanceByTone, getSkinToneOptions } from '../services/riskService'

const tones = ref([])
const selectedTone = ref('')
const guidance = ref(null)
const activeInfoPanel = ref('')

async function loadTones() {
  tones.value = await getSkinToneOptions()
}

async function selectTone(toneId) {
  selectedTone.value = toneId
  guidance.value = await getRiskGuidanceByTone(toneId)
  activeInfoPanel.value = ''
}

function toggleInfoPanel(type) {
  activeInfoPanel.value = activeInfoPanel.value === type ? '' : type
}

onMounted(loadTones)
</script>

<template>
  <section class="page-panel">
    <section class="uv-intro card">
      <div class="uv-intro-copy">
        <p class="hero-kicker">Risk Calculator</p>
        <h2>Understand your skin response to UV and plan protection with confidence.</h2>
        <p>
          Select your Fitzpatrick skin tone to view practical, personalised guidance for reducing UV-related skin damage risk.
        </p>
      </div>
      <img src="/types-of-female-body-shapes-amico.svg" alt="Skin tone and risk illustration" class="uv-intro-art" />
    </section>

    <div class="risk-page-shell">
      <header class="panel-header risk-head">
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

      <div v-if="guidance" class="risk-guidance-layout">
        <div class="card guidance-card">
          <h3>{{ guidance.title }}</h3>
          <p>{{ guidance.description }}</p>
          <ul>
            <li v-for="action in guidance.preventiveActions" :key="action">{{ action }}</li>
          </ul>
          <div class="figure-controls">
            <button
              type="button"
              class="secondary-btn"
              :class="{ active: activeInfoPanel === 'education' }"
              @click="toggleInfoPanel('education')"
            >
              Skin Tone Explanation
            </button>
            <button
              type="button"
              class="secondary-btn"
              :class="{ active: activeInfoPanel === 'sources' }"
              @click="toggleInfoPanel('sources')"
            >
              View Research Sources
            </button>
          </div>
        </div>

        <transition name="slide-panel">
          <aside v-if="activeInfoPanel" class="info-side-panel">
            <h3 v-if="activeInfoPanel === 'education'">How skin tone relates to UV absorption</h3>
            <h3 v-else>Research sources</h3>

            <p v-if="activeInfoPanel === 'education'">{{ guidance?.education }}</p>

            <ul v-else class="source-list">
              <li v-for="source in guidance?.sources || []" :key="source.url">
                <a :href="source.url" target="_blank" rel="noreferrer">{{ source.title }}</a>
              </li>
            </ul>

            <button type="button" class="primary-btn" @click="activeInfoPanel = ''">Close</button>
          </aside>
        </transition>
      </div>
    </div>
  </section>
</template>
