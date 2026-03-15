<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import AlertBanner from '../components/AlertBanner.vue'
import UvIndexCard from '../components/UvIndexCard.vue'
import { australianCities } from '../data/mockData'
import { getUvByCityAndPostcode, getUvByCoordinates } from '../services/uvService'

const locationPermission = ref('prompt')
const manualCity = ref(australianCities[0].name)
const manualPostcode = ref(australianCities[0].postcode)
const uvData = ref(null)
const loadingUv = ref(false)
const locationLabel = ref('Awaiting location mode')
const alertMessage = ref('')
const statusMessage = ref('')
const statusType = ref('info')
const showPermissionPrompt = ref(false)
const alertPermission = ref('opted-in')

let refreshTimerId = null

const isDangerousUv = computed(() => (uvData.value?.uvIndex || 0) >= 6)
const showManualForm = computed(() => locationPermission.value !== 'granted')

const alertEnabled = computed({
  get: () => alertPermission.value === 'opted-in',
  set: (value) => {
    alertPermission.value = value ? 'opted-in' : 'opted-out'
    persistSessionPreference()
    sendUvAlertIfNeeded()
  }
})

const liveLocationEnabled = computed({
  get: () => locationPermission.value === 'granted',
  set: (value) => {
    if (value) {
      showPermissionPrompt.value = true
      statusMessage.value = 'Choose how you want to use live location.'
      statusType.value = 'info'
      return
    }

    locationPermission.value = 'denied'
    persistSessionPreference()
    statusMessage.value = 'Live location disabled. Manual location mode enabled.'
    statusType.value = 'info'
  }
})

const STORAGE_KEYS = {
  promptShownInSession: 'uv-location-prompt-shown-in-session',
  locationPermission: 'uv-location-permission',
  alertPermission: 'uv-custom-alert-permission',
  manualCity: 'uv-manual-city',
  manualPostcode: 'uv-manual-postcode'
}

function persistSessionPreference() {
  try {
    sessionStorage.setItem(STORAGE_KEYS.locationPermission, locationPermission.value)
    sessionStorage.setItem(STORAGE_KEYS.alertPermission, alertPermission.value)
    sessionStorage.setItem(STORAGE_KEYS.manualCity, manualCity.value)
    sessionStorage.setItem(STORAGE_KEYS.manualPostcode, manualPostcode.value)
  } catch (error) {
    // Ignore environments where storage is unavailable.
  }
}

function loadSessionPreference() {
  try {
    const savedLocationPermission = sessionStorage.getItem(STORAGE_KEYS.locationPermission)
    const savedAlertPermission = sessionStorage.getItem(STORAGE_KEYS.alertPermission)
    const savedManualCity = sessionStorage.getItem(STORAGE_KEYS.manualCity)
    const savedPostcode = sessionStorage.getItem(STORAGE_KEYS.manualPostcode)

    if (savedLocationPermission === 'granted' || savedLocationPermission === 'denied' || savedLocationPermission === 'prompt') {
      locationPermission.value = savedLocationPermission
    }

    if (savedAlertPermission === 'opted-in' || savedAlertPermission === 'opted-out') {
      alertPermission.value = savedAlertPermission
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

function fetchCurrentGeolocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported on this device.'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position.coords),
      () => reject(new Error('Unable to fetch your current location.')),
      { enableHighAccuracy: true, timeout: 10000 }
    )
  })
}

async function updateUvFromLiveMode() {
  loadingUv.value = true

  try {
    const coords = await fetchCurrentGeolocation()
    const result = await getUvByCoordinates(coords.latitude, coords.longitude)
    uvData.value = result
    locationLabel.value = `Live location (${coords.latitude.toFixed(2)}, ${coords.longitude.toFixed(2)})`
    statusMessage.value = 'Live UV updated from your current location.'
    statusType.value = 'info'
  } catch (error) {
    statusMessage.value = error.message || 'Could not load live UV.'
    statusType.value = 'error'
    locationPermission.value = 'denied'
    persistSessionPreference()
  } finally {
    loadingUv.value = false
  }
}

async function updateUvFromManual() {
  loadingUv.value = true
  try {
    const result = await getUvByCityAndPostcode(manualCity.value, manualPostcode.value)
    uvData.value = result
    locationLabel.value = `${manualCity.value} ${manualPostcode.value}`
    statusMessage.value = 'Manual location updated.'
    statusType.value = 'info'
    persistSessionPreference()
  } catch (error) {
    statusMessage.value = error.message || 'Please choose a valid city and postcode.'
    statusType.value = 'error'
  } finally {
    loadingUv.value = false
  }
}

async function chooseAllowPersistent() {
  showPermissionPrompt.value = false
  locationPermission.value = 'granted'
  persistSessionPreference()
  await updateUvFromLiveMode()
}

async function chooseAllowOnce() {
  showPermissionPrompt.value = false
  await updateUvFromLiveMode()
  locationPermission.value = 'denied'
  persistSessionPreference()
  statusMessage.value = 'Live location used once. Toggle on again when needed.'
  statusType.value = 'info'
}

function chooseAskLater() {
  showPermissionPrompt.value = false
  locationPermission.value = 'denied'
  persistSessionPreference()
  statusMessage.value = 'You can enable live location anytime using the toggle.'
  statusType.value = 'info'
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
  loadSessionPreference()

  const promptWasShown = sessionStorage.getItem(STORAGE_KEYS.promptShownInSession) === 'true'
  if (!promptWasShown) {
    locationPermission.value = 'prompt'
    persistSessionPreference()
    showPermissionPrompt.value = true
    statusMessage.value = 'Choose location mode to start.'
    statusType.value = 'info'
    sessionStorage.setItem(STORAGE_KEYS.promptShownInSession, 'true')
  } else if (locationPermission.value === 'granted') {
    statusMessage.value = 'Live location still active for this session.'
    statusType.value = 'info'
    updateUvFromLiveMode()
  }

  refreshTimerId = window.setInterval(() => {
    if (locationPermission.value === 'granted') {
      updateUvFromLiveMode()
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
      <div class="switch-stack">
        <label class="switch-row">
          <span>Live location</span>
          <input v-model="liveLocationEnabled" type="checkbox" class="switch-input" />
          <span class="switch-track" aria-hidden="true"></span>
        </label>
        <label class="switch-row">
          <span>In-app alerts</span>
          <input v-model="alertEnabled" type="checkbox" class="switch-input" />
          <span class="switch-track" aria-hidden="true"></span>
        </label>
      </div>
    </header>

    <UvIndexCard
      v-if="uvData && !loadingUv"
      :uv-index="uvData.uvIndex"
      :level="uvData.level"
      :recommendation="uvData.recommendation"
      :location-label="locationLabel"
    />
    <div v-else class="card uv-placeholder">
      <p>{{ loadingUv ? 'Loading UV index...' : 'Enable live location or use manual mode to fetch UV index.' }}</p>
    </div>

    <AlertBanner v-if="alertMessage" :message="alertMessage" />
    <p v-if="statusMessage" class="status-message" :class="{ error: statusType === 'error' }">
      {{ statusMessage }}
    </p>

    <section v-if="showManualForm" class="card mode-card">
      <details class="manual-panel" open>
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
            <input v-model="manualPostcode" type="text" placeholder="Must match selected city" maxlength="4" />
          </label>
          <button type="button" class="primary-btn" @click="updateUvFromManual">Use Manual Location</button>
        </div>
      </details>
    </section>

    <div v-if="showPermissionPrompt" class="modal-overlay" @click.self="chooseAskLater">
      <div class="modal-card compact-modal">
        <h3>Use live location?</h3>
        <p>Choose how you want to use location access for UV data.</p>
        <div class="figure-controls">
          <button type="button" class="primary-btn" @click="chooseAllowPersistent">Allow</button>
          <button type="button" class="secondary-btn" @click="chooseAllowOnce">Allow once</button>
          <button type="button" class="secondary-btn" @click="chooseAskLater">Ask later</button>
        </div>
      </div>
    </div>
  </section>
</template>
