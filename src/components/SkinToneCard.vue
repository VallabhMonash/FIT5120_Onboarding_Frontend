<script setup>
const props = defineProps({
  tone: {
    type: Object,
    required: true
  },
  selected: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['select'])
</script>

<template>
  <button
    type="button"
    class="skin-tone-card"
    :class="{ selected: props.selected }"
    @click="emit('select', props.tone.id)"
  >
    <strong>{{ props.tone.label }}</strong>
    <span>{{ props.tone.description }}</span>
  </button>
</template>
