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
const locationLabel = ref('Awaiting location mode')
const alertMessage = ref('')
const statusMessage = ref('')
const showPermissionPrompt = ref(false)
const alertPermission = ref('opted-in')

let refreshTimerId = null

const isDangerousUv = computed(() => (uvData.value?.uvIndex || 0) >= 6)
const showManualForm = computed(() => locationPermission.value === 'denied')
const showLiveControls = computed(() => locationPermission.value === 'granted')
const alertEnabled = computed({
  get: () => alertPermission.value === 'opted-in',
  set: (value) => {
    alertPermission.value = value ? 'opted-in' : 'opted-out'
    persistLocationPreference()
    sendUvAlertIfNeeded()
  }
})

const STORAGE_KEYS = {
  permission: 'uv-custom-location-permission',
  promptSeen: 'uv-location-prompt-seen',
  alertPermission: 'uv-custom-alert-permission',
  liveCity: 'uv-live-city',
  manualCity: 'uv-manual-city',
  manualPostcode: 'uv-manual-postcode'
}

function persistLocationPreference() {
  try {
    localStorage.setItem(STORAGE_KEYS.permission, locationPermission.value)
    localStorage.setItem(STORAGE_KEYS.promptSeen, 'true')
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
    const savedPromptSeen = localStorage.getItem(STORAGE_KEYS.promptSeen)
    const savedAlertPermission = localStorage.getItem(STORAGE_KEYS.alertPermission)
    const savedLiveCity = localStorage.getItem(STORAGE_KEYS.liveCity)
    const savedManualCity = localStorage.getItem(STORAGE_KEYS.manualCity)
    const savedPostcode = localStorage.getItem(STORAGE_KEYS.manualPostcode)

    if (savedPermission === 'prompt' || savedPermission === 'granted' || savedPermission === 'denied') {
      locationPermission.value = savedPermission
    }

    if (!savedPromptSeen) {
      showPermissionPrompt.value = true
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
  return `UV index ${index} detected for ${label}. Potential skin damage risk is elevated.`
}

function setPermissionFromPrompt(mode) {
  showPermissionPrompt.value = false
  setCustomPermission(mode)
}

async function updateUvFromLiveCoordinates(lat, lon) {
  loadingUv.value = true
  try {
    const result = await getUvByCoordinates(lat, lon)
    uvData.value = result
    locationLabel.value = `Live mode · ${liveCity.value}`
    statusMessage.value = 'Live mode updated.'
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
    statusMessage.value = 'Manual location updated.'
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
    statusMessage.value = 'Location access enabled.'
    await updateUvFromLiveMode()
  } else if (mode === 'denied') {
    statusMessage.value = 'Location access denied. Manual input enabled.'
    await updateUvFromManual()
  } else {
    statusMessage.value = 'Choose location mode to continue.'
    uvData.value = null
    locationLabel.value = 'Awaiting location mode'
  }
}

function sendUvAlertIfNeeded() {
  if (!isDangerousUv.value || !uvData.value || alertPermission.value !== 'opted-in') {
    alertMessage.value = ''
    return
  }

  alertMessage.value = buildAlertMessage(uvData.value.uvIndex, locationLabel.value)
}

watch([uvData, alertPermission], () => {
  sendUvAlertIfNeeded()
})

onMounted(() => {
  loadLocationPreference()

  if (locationPermission.value === 'granted') {
    statusMessage.value = 'Using saved live location mode.'
    updateUvFromLiveMode()
  } else if (locationPermission.value === 'denied') {
    statusMessage.value = 'Using saved manual location mode.'
    updateUvFromManual()
  } else {
    statusMessage.value = 'Select location mode to get UV index.'
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
  <section class="page-panel home-page">
    <header class="panel-header home-head">
      <h2>UV Index</h2>
      <label class="switch-row">
        <span>In-app alerts</span>
        <input v-model="alertEnabled" type="checkbox" class="switch-input" />
        <span class="switch-track" aria-hidden="true"></span>
      </label>
    </header>

    <UvIndexCard
      v-if="uvData && !loadingUv"
      :uv-index="uvData.uvIndex"
      :level="uvData.level"
      :recommendation="uvData.recommendation"
      :location-label="locationLabel"
    />
    <div v-else class="card uv-placeholder">
      <p>{{ loadingUv ? 'Loading UV index...' : 'Choose live or manual location to see UV index.' }}</p>
    </div>

    <AlertBanner v-if="alertMessage" :message="alertMessage" />
    <p v-if="statusMessage" class="status-message">{{ statusMessage }}</p>

    <section class="card mode-card">
      <div class="mode-buttons">
        <button type="button" class="secondary-btn" @click="setCustomPermission('granted')">Full Access</button>
        <button type="button" class="secondary-btn" @click="setCustomPermission('denied')">Denied Access</button>
      </div>

      <div v-if="showLiveControls" class="input-stack">
        <label>
          Live Mode City
          <select v-model="liveCity">
            <option v-for="city in australianCities" :key="city.name" :value="city.name">
              {{ city.name }} ({{ city.region }})
            </option>
          </select>
        </label>
        <button type="button" class="primary-btn" @click="updateUvFromLiveMode">Refresh Live UV</button>
      </div>

      <details v-if="showManualForm" class="manual-panel" open>
        <summary>Manual location input</summary>
        <div class="input-stack">
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
      </details>
    </section>

    <div v-if="showPermissionPrompt" class="modal-overlay" @click.self="showPermissionPrompt = false">
      <div class="modal-card compact-modal">
        <h3>Allow location access?</h3>
        <p>Choose full access for live UV or denied access for manual city and postcode entry.</p>
        <div class="figure-controls">
          <button type="button" class="primary-btn" @click="setPermissionFromPrompt('granted')">Allow</button>
          <button type="button" class="secondary-btn" @click="setPermissionFromPrompt('denied')">Deny</button>
          <button type="button" class="secondary-btn" @click="setPermissionFromPrompt('prompt')">Later</button>
        </div>
      </div>
    </div>
  </section>
</template>
