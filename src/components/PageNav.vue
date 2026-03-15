<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const tabs = [
  { id: 'home', label: 'Home', icon: '⌂' },
  { id: 'awareness', label: 'Awareness', icon: '◉' },
  { id: 'risk', label: 'Risk', icon: '◎' }
]

function selectTab(id) {
  emit('update:modelValue', id)
}
</script>

<template>
  <nav class="page-nav" aria-label="Primary navigation">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      class="nav-tab"
      :class="{ active: tab.id === props.modelValue }"
      type="button"
      @click="selectTab(tab.id)"
    >
      <span class="nav-icon" aria-hidden="true">{{ tab.icon }}</span>
      <span class="nav-label">{{ tab.label }}</span>
    </button>
  </nav>
</template>
