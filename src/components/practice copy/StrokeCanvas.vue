<template>
  <div style="position: relative; width: 300px; height: 300px">
    <!-- SVG Referensi -->
    <svg
      :width="size"
      :height="size"
      :viewBox="`0 0 ${viewBox} ${viewBox}`"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path :d="currentStrokePath" stroke="#ccc" stroke-width="6" fill="none" />
    </svg>

    <!-- Canvas Gambar User -->
    <canvas
      ref="userCanvas"
      :width="size"
      :height="size"
      style="position: absolute; top: 0; left: 0; border: 1px solid #ddd"
      @mousedown="startDraw"
      @mousemove="drawing"
      @mouseup="endDraw"
      @mouseleave="endDraw"
    ></canvas>

    <!-- Canvas Offscreen (tidak terlihat) -->
    <canvas
      ref="referenceCanvas"
      :width="size"
      :height="size"
      style="display: none"
    ></canvas>

    <button @click="validateStroke">Cek Jawaban</button>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";

const size = 300;
const viewBox = 100;

const userCanvas = ref(null);
const referenceCanvas = ref(null);

const currentStrokePath = ref("M10,10 C20,10 20,30 30,30"); // contoh stroke

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
  ctx.lineWidth = 12;
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

  alert(`Tingkat kecocokan: ${(matchRatio * 100).toFixed(1)}%`);
}
</script>
