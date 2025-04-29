<!-- components/StrokeDisplay.vue -->
<template>
  <svg
    :width="size"
    :height="size"
    :viewBox="`0 0 ${viewBox} ${viewBox}`"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      v-for="(stroke, i) in strokes"
      :key="i"
      :d="stroke"
      stroke="#cccccc"
      stroke-width="4"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<script setup>
const props = defineProps({
  strokes: Array, // array of SVG path strings
  viewBox: {
    type: [Number, String],
    default: 100,
  },
  size: {
    type: [Number, String],
    default: 300,
  },
});
</script>
