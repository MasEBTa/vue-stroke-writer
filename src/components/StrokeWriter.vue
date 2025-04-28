<template>
  <div>
    <svg
      :width="size"
      :height="size"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        v-for="(stroke, index) in strokes"
        :key="index"
        :d="stroke"
        class="stroke-path"
        :style="getStrokeStyle(index)"
        :stroke="strokeColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        fill="none"
      />
    </svg>
  </div>
</template>

<script setup>
import { onMounted } from "vue";

const props = defineProps({
  strokes: {
    type: Array,
    required: true,
  },
  size: {
    type: [String, Number],
    default: 256,
  },
  strokeColor: {
    type: String,
    default: "#000000",
  },
  delayBetweenStrokes: {
    type: Number,
    default: 1.5,
  },
});

let keyframesInjected = false;

function injectKeyframesOnce() {
  if (keyframesInjected) return;
  const style = document.createElement("style");
  style.innerHTML = `
    @keyframes draw {
      to {
        stroke-dashoffset: 0;
      }
    }
  `;
  document.head.appendChild(style);
  keyframesInjected = true;
}

function getStrokeStyle(index) {
  return {
    strokeDasharray: 300,
    strokeDashoffset: 300,
    animation: `draw 1.5s linear ${
      index * props.delayBetweenStrokes
    }s forwards`,
  };
}

onMounted(() => {
  injectKeyframesOnce();
});
</script>

<style scoped>
.stroke-path {
  /* Optional, fallback */
}
</style>
