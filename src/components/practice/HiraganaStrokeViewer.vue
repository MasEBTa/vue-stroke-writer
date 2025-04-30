<!-- ./HiraganaStrokeViewer.vue -->
<template>
  <div>
    <svg
      :width="size"
      :height="size"
      :viewBox="`0 0 ${viewBox} ${viewBox}`"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <path
          v-for="(stroke, index) in strokes"
          :key="index"
          :d="stroke.path"
          :stroke="stroke.color"
          :stroke-width="strokeWidth"
          :stroke-linecap="lineCap"
          :stroke-linejoin="safeLineJoin"
          fill="none"
        />
      </g>
    </svg>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  strokes: { type: Array, required: true },
  viewBox: { type: [String, Number], default: 24 },
  size: { type: [String, Number], default: 256 },
  strokeWidth: { type: [String, Number], default: 2 },
  lineJoin: { type: String, default: "round" },
  lineCap: { type: String, default: "round" },
});

const validLineJoins = ["round", "bevel", "miter", "miter-clip"];
const safeLineJoin = computed(() =>
  validLineJoins.includes(props.lineJoin) ? props.lineJoin : "round"
);
</script>
