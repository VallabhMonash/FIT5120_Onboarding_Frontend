<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import AlertBanner from '../components/AlertBanner.vue'
import UvIndexCard from '../components/UvIndexCard.vue'
import { australianCities } from '../data/mockData'
import { getUvByCityAndPostcode, getUvByCoordinates } from '../services/uvService'

const locationPermission = ref('prompt')
const manualCity = ref(australianCities[0].name)
const manualPostcode = ref(australianCities[0].postcode)
const liveCity = ref(australianCities[0].name)
const uvData = ref(null)
const loadingUv = ref(false)
const locationLabel = ref('Choose location permission mode')
const alertMessage = ref('')
const statusMessage = ref('')
const alertPermission = ref('opted-in')

let refreshTimerId = null

const isDangerousUv = computed(() => (uvData.value?.uvIndex || 0) >= 6)
const showManualForm = computed(() => locationPermission.value === 'denied')
const showLiveControls = computed(() => locationPermission.value === 'granted')

const STORAGE_KEYS = {
  permission: 'uv-custom-location-permission',
  alertPermission: 'uv-custom-alert-permission',
  liveCity: 'uv-live-city',
  manualCity: 'uv-manual-city',
  manualPostcode: 'uv-manual-postcode'
}

function persistLocationPreference() {
  try {
    localStorage.setItem(STORAGE_KEYS.permission, locationPermission.value)
    localStorage.setItem(STORAGE_KEYS.alertPermission, alertPermission.value)
    localStorage.setItem(STORAGE_KEYS.liveCity, liveCity.value)
    localStorage.setItem(STORAGE_KEYS.manualCity, manualCity.value)
    localStorage.setItem(STORAGE_KEYS.manualPostcode, manualPostcode.value)
  } catch (error) {
    // Ignore environments where storage is unavailable.
  }
}

function loadLocationPreference() {
  try {
    const savedPermission = localStorage.getItem(STORAGE_KEYS.permission)
    const savedAlertPermission = localStorage.getItem(STORAGE_KEYS.alertPermission)
    const savedLiveCity = localStorage.getItem(STORAGE_KEYS.liveCity)
    const savedManualCity = localStorage.getItem(STORAGE_KEYS.manualCity)
    const savedPostcode = localStorage.getItem(STORAGE_KEYS.manualPostcode)

    if (savedPermission === 'prompt' || savedPermission === 'granted' || savedPermission === 'denied') {
      locationPermission.value = savedPermission
    }

    if (savedAlertPermission === 'opted-in' || savedAlertPermission === 'opted-out') {
      alertPermission.value = savedAlertPermission
    }

    if (savedLiveCity && australianCities.some((city) => city.name === savedLiveCity)) {
      liveCity.value = savedLiveCity
    }

    if (savedManualCity && australianCities.some((city) => city.name === savedManualCity)) {
      manualCity.value = savedManualCity
    }

    if (savedPostcode && /^\d{4}$/.test(savedPostcode)) {
      manualPostcode.value = savedPostcode
    }
  } catch (error) {
    // Ignore environments where storage is unavailable.
  }
}

function buildAlertMessage(index, label) {
  return `UV index ${index} detected for ${label}. Potential skin damage risk is elevated. Use protective measures.`
}

async function updateUvFromLiveCoordinates(lat, lon) {
  loadingUv.value = true
  try {
    const result = await getUvByCoordinates(lat, lon)
    uvData.value = result
    locationLabel.value = `Live mode: ${liveCity.value}`
    statusMessage.value = 'Live-mode UV loaded from your selected city.'
    persistLocationPreference()
  } catch (error) {
    statusMessage.value = 'Could not load UV for live mode.'
  } finally {
    loadingUv.value = false
  }
}

async function updateUvFromLiveMode() {
  const city = australianCities.find((item) => item.name === liveCity.value)
  if (!city) {
    statusMessage.value = 'Please choose a valid city for live mode.'
    return
  }

  await updateUvFromLiveCoordinates(city.lat, city.lon)
}

async function updateUvFromManual() {
  loadingUv.value = true
  try {
    const result = await getUvByCityAndPostcode(manualCity.value, manualPostcode.value)
    uvData.value = result
    locationLabel.value = `${manualCity.value} ${manualPostcode.value}`
    statusMessage.value = 'Manual location UV loaded.'
    persistLocationPreference()
  } catch (error) {
    statusMessage.value = 'Please choose a valid city and postcode.'
  } finally {
    loadingUv.value = false
  }
}

async function setCustomPermission(mode) {
  locationPermission.value = mode
  persistLocationPreference()

  if (mode === 'granted') {
    statusMessage.value = 'Custom permission set to full access.'
    await updateUvFromLiveMode()
  } else if (mode === 'denied') {
    statusMessage.value = 'Custom permission set to denied. Use manual location entry.'
    await updateUvFromManual()
  } else {
    statusMessage.value = 'Custom permission set to ask later. Choose a mode to continue.'
    uvData.value = null
    locationLabel.value = 'Waiting for custom permission choice'
  }
}

function setAlertPermission(mode) {
  alertPermission.value = mode
  persistLocationPreference()
  sendUvAlertIfNeeded()
  statusMessage.value =
    mode === 'opted-in'
      ? 'In-app UV alerts are enabled.'
      : 'In-app UV alerts are disabled until you opt in again.'
}

function sendUvAlertIfNeeded() {
  if (!isDangerousUv.value || !uvData.value || alertPermission.value !== 'opted-in') {
    alertMessage.value = ''
    return
  }

  const message = buildAlertMessage(uvData.value.uvIndex, locationLabel.value)
  alertMessage.value = message
}

watch([uvData, alertPermission], () => {
  sendUvAlertIfNeeded()
})

onMounted(() => {
  loadLocationPreference()

  if (locationPermission.value === 'granted') {
    statusMessage.value = 'Using saved preference: full location access.'
    updateUvFromLiveMode()
  } else if (locationPermission.value === 'denied') {
    statusMessage.value = 'Using saved preference: denied location access.'
    updateUvFromManual()
  } else {
    statusMessage.value = 'Select a custom location permission option to begin.'
  }

  refreshTimerId = window.setInterval(() => {
    if (locationPermission.value === 'granted') {
      updateUvFromLiveMode()
    } else if (locationPermission.value === 'denied') {
      updateUvFromManual()
    }
    sendUvAlertIfNeeded()
  }, 120000)
})

onUnmounted(() => {
  if (refreshTimerId) {
    window.clearInterval(refreshTimerId)
  }
})
</script>

<template>
  <section class="page-panel">
    <header class="panel-header">
      <h2>UV Risk Dashboard</h2>
      <p>Get UV index insights for your live or manually entered Australian location.</p>
    </header>

    <div class="card controls-grid">
      <div>
        <p class="label">Custom Location Permission</p>
        <p>
          <strong>{{ locationPermission.toUpperCase() }}</strong>
        </p>
      </div>
      <div class="figure-controls">
        <button type="button" class="secondary-btn" @click="setCustomPermission('granted')">
          Full Access
        </button>
        <button type="button" class="secondary-btn" @click="setCustomPermission('denied')">
          Deny Access
        </button>
        <button type="button" class="secondary-btn" @click="setCustomPermission('prompt')">
          Ask Later
        </button>
      </div>
    </div>

    <div v-if="showLiveControls" class="card form-grid">
      <label>
        Live Mode City
        <select v-model="liveCity">
          <option v-for="city in australianCities" :key="city.name" :value="city.name">
            {{ city.name }} ({{ city.region }})
          </option>
        </select>
      </label>
      <label>
        Postcode
        <input :value="australianCities.find((c) => c.name === liveCity)?.postcode || ''" type="text" disabled />
      </label>
      <button type="button" class="primary-btn" @click="updateUvFromLiveMode">
        Refresh Live Mode UV
      </button>
    </div>

    <div v-if="showManualForm" class="card form-grid">
      <label>
        City
        <select v-model="manualCity">
          <option v-for="city in australianCities" :key="city.name" :value="city.name">
            {{ city.name }} ({{ city.region }})
          </option>
        </select>
      </label>
      <label>
        Postcode
        <input v-model="manualPostcode" type="text" placeholder="e.g. 3000" maxlength="4" />
      </label>
      <button type="button" class="primary-btn" @click="updateUvFromManual">Use Manual Location</button>
    </div>

    <div class="card controls-grid">
      <div>
        <p class="label">In-App Alert Permission</p>
        <p>
          Status: <strong>{{ alertPermission }}</strong>
        </p>
      </div>
      <div class="figure-controls">
        <button type="button" class="secondary-btn" @click="setAlertPermission('opted-in')">
          Opt In For Alerts
        </button>
        <button type="button" class="secondary-btn" @click="setAlertPermission('opted-out')">
          Opt Out Of Alerts
        </button>
      </div>
    </div>

    <p v-if="statusMessage" class="status-message">{{ statusMessage }}</p>
    <AlertBanner v-if="alertMessage" :message="alertMessage" />

    <p v-if="loadingUv" class="status-message">Loading UV index...</p>
    <UvIndexCard
      v-else-if="uvData"
      :uv-index="uvData.uvIndex"
      :level="uvData.level"
      :recommendation="uvData.recommendation"
      :location-label="locationLabel"
    />
  </section>
</template>
