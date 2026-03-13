<script setup>
const props = defineProps({
  message: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="alert-banner" role="alert">
    <strong>UV Alert:</strong>
    <span>{{ props.message }}</span>
  </div>
</template>
