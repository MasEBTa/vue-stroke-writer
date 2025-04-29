<template>
  <div class="relative w-[300px] h-[300px]">
    <!-- Reference Stroke Display -->
    <svg
      :width="size"
      :height="size"
      :viewBox="`0 0 ${viewBox} ${viewBox}`"
      class="absolute top-0 left-0 z-0"
    >
      <path
        v-for="(path, index) in revealedStrokes.map((i) => strokes[i])"
        :key="index"
        :d="path"
        stroke="black"
        stroke-width="6"
        fill="none"
      />
      <path
        v-if="showGuide"
        :d="currentStrokePath"
        stroke="blue"
        stroke-width="3"
        fill="none"
        stroke-dasharray="5 5"
      />
    </svg>

    <!-- User Drawing Canvas -->
    <canvas
      ref="userCanvas"
      :width="size"
      :height="size"
      class="absolute top-0 left-0 z-10"
      @mousedown="startDraw"
      @mousemove="drawing"
      @mouseup="endDraw"
      @mouseleave="endDraw"
    ></canvas>

    <!-- Hidden reference canvas for pixel validation -->
    <canvas
      ref="referenceCanvas"
      :width="size"
      :height="size"
      class="hidden"
    ></canvas>
  </div>

  <div class="mt-2 flex gap-2">
    <button
      @click="validateStroke"
      class="px-4 py-1 bg-green-500 text-white rounded"
    >
      Cek
    </button>
    <button
      @click="clearUserCanvas"
      class="px-4 py-1 bg-gray-400 text-white rounded"
    >
      Reset
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const size = 300;
const viewBox = 100;

const userCanvas = ref(null);
const referenceCanvas = ref(null);

const strokes = ref(["M10,10 C20,10 20,30 30,30", "M30,30 C40,40 50,20 60,30"]);

const currentStrokeIndex = ref(0);
const maxAttempts = 3;
const attemptCount = ref(0);
const revealedStrokes = ref([]);
const showGuide = ref(false);

const currentStrokePath = computed(
  () => strokes.value[currentStrokeIndex.value]
);

const drawingData = ref([]);
let isDrawing = false;
function startDraw(e) {
  isDrawing = true;
  drawingData.value = [[getMousePos(e)]];
}
function drawing(e) {
  if (!isDrawing) return;
  drawingData.value[drawingData.value.length - 1].push(getMousePos(e));
  drawUserPath();
}
function endDraw() {
  isDrawing = false;
}

function getMousePos(e) {
  const rect = userCanvas.value.getBoundingClientRect();
  return {
    x: ((e.clientX - rect.left) / rect.width) * viewBox,
    y: ((e.clientY - rect.top) / rect.height) * viewBox,
  };
}

function drawUserPath() {
  const ctx = userCanvas.value.getContext("2d");
  ctx.clearRect(0, 0, size, size);
  ctx.strokeStyle = "black";
  ctx.lineWidth = 6;
  ctx.lineCap = "round";

  for (const stroke of drawingData.value) {
    ctx.beginPath();
    for (let i = 0; i < stroke.length; i++) {
      const pt = stroke[i];
      if (i === 0) ctx.moveTo(pt.x * (size / viewBox), pt.y * (size / viewBox));
      else ctx.lineTo(pt.x * (size / viewBox), pt.y * (size / viewBox));
    }
    ctx.stroke();
  }
}

function drawReferencePath() {
  const ctx = referenceCanvas.value.getContext("2d");
  ctx.clearRect(0, 0, size, size);
  const path = new Path2D(currentStrokePath.value);
  ctx.strokeStyle = "red";
  ctx.lineWidth = 6;
  ctx.stroke(path);
}

function clearUserCanvas() {
  const ctx = userCanvas.value.getContext("2d");
  ctx.clearRect(0, 0, size, size);
  drawingData.value = [];
}

function validateStroke() {
  drawReferencePath();

  const refCtx = referenceCanvas.value.getContext("2d");
  const userCtx = userCanvas.value.getContext("2d");

  const refPixels = refCtx.getImageData(0, 0, size, size).data;
  const userPixels = userCtx.getImageData(0, 0, size, size).data;

  let overlap = 0;
  let userCount = 0;

  for (let i = 0; i < refPixels.length; i += 4) {
    const userAlpha = userPixels[i + 3];
    const refAlpha = refPixels[i + 3];

    if (userAlpha > 0) {
      userCount++;
      if (refAlpha > 0) overlap++;
    }
  }

  const matchRatio = overlap / userCount;

  if (matchRatio > 0.6) {
    revealedStrokes.value.push(currentStrokeIndex.value);
    currentStrokeIndex.value++;
    attemptCount.value = 0;
    showGuide.value = false;
    clearUserCanvas();
  } else {
    attemptCount.value++;
    if (attemptCount.value >= maxAttempts) {
      showGuide.value = true;
    }
    clearUserCanvas();
  }
}
</script>

<style scoped>
canvas {
  touch-action: none;
}
</style>
