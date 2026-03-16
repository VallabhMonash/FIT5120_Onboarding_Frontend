<script setup>
import { ref } from 'vue'

const props = defineProps({
  expectedPassword: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['unlocked'])
const input = ref('')
const error = ref('')

function submit() {
  if (input.value === props.expectedPassword) {
    error.value = ''
    emit('unlocked')
    return
  }

  error.value = 'Incorrect password. Please try again.'
}
</script>

<template>
  <section class="gate-shell">
    <div class="gate-card">
      <p class="gate-kicker">Welcome</p>
      <h1>SunSafeCamp</h1>
      <p class="gate-subtext">Please enter password to continue.</p>

      <label class="gate-label">
        Password
        <input
          v-model="input"
          type="password"
          placeholder="Enter password"
          class="gate-input"
          @keyup.enter="submit"
        />
      </label>

      <button type="button" class="primary-btn gate-btn" @click="submit">Enter</button>
      <p v-if="error" class="status-message error">{{ error }}</p>
    </div>
  </section>
</template>
