<script setup>
import { onMounted, ref } from 'vue'
import SkinToneCard from '../components/SkinToneCard.vue'
import { getRiskGuidanceByTone, getSkinToneOptions } from '../services/riskService'

const tones = ref([])
const selectedTone = ref('')
const guidance = ref(null)
const educationModalOpen = ref(false)

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
      <h2>Personalised Risk Calculator</h2>
      <p>Select a Fitzpatrick skin type to view tailored UV prevention guidance.</p>
    </header>

    <div class="skin-tone-grid">
      <SkinToneCard
        v-for="tone in tones"
        :key="tone.id"
        :tone="tone"
        :selected="tone.id === selectedTone"
        @select="selectTone"
      />
    </div>

    <div v-if="guidance" class="card guidance-card">
      <h3>{{ guidance.title }}</h3>
      <p>{{ guidance.description }}</p>
      <ul>
        <li v-for="action in guidance.preventiveActions" :key="action">{{ action }}</li>
      </ul>
      <button type="button" class="secondary-btn" @click="educationModalOpen = true">
        Skin Tone Explanation
      </button>
    </div>

    <div v-if="educationModalOpen" class="modal-overlay" @click.self="educationModalOpen = false">
      <div class="modal-card">
        <h3>How skin tone relates to UV absorption</h3>
        <p>
          The Fitzpatrick scale helps estimate how skin responds to UV exposure. Melanin can reduce the chance of immediate sunburn, but all skin tones remain vulnerable to UV-induced skin and eye damage.
        </p>
        <p>
          Personalised guidance combines skin response patterns with UV index intensity to support safer outdoor behaviour.
        </p>
        <button type="button" class="primary-btn" @click="educationModalOpen = false">Close</button>
      </div>
    </div>
  </section>
</template>
