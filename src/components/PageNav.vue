<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const tabs = [
  { id: 'landing', label: 'Home', icon: '☀' },
  { id: 'uv', label: 'UV Index', icon: '◐' },
  { id: 'awareness', label: 'Awareness', icon: '◉' },
  { id: 'risk', label: 'Risk', icon: '◎' },
]

function selectTab(id) {
  emit('update:modelValue', id)
}
</script>

<template>
  <nav class="page-nav" aria-label="Primary navigation">
    <button type="button" class="nav-brand" @click="selectTab('landing')">
      <img src="/sun.svg" alt="" class="nav-brand-icon" />
      <span>Sun Safe Camp</span>
    </button>
    <div class="nav-tabs">
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
    </div>
  </nav>
</template>
