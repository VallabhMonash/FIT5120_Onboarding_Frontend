<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const tabs = [
  { id: 'home', label: 'Home' },
  { id: 'awareness', label: 'Awareness' },
  { id: 'risk', label: 'Risk Calculator' }
]

function selectTab(id) {
  emit('update:modelValue', id)
}
</script>

<template>
  <nav class="page-nav" aria-label="Primary">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      class="nav-tab"
      :class="{ active: tab.id === props.modelValue }"
      type="button"
      @click="selectTab(tab.id)"
    >
      {{ tab.label }}
    </button>
  </nav>
</template>
