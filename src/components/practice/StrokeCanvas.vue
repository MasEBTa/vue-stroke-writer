<!-- ./StrokeCanvas.vue -->
<template>
  <canvas
    ref="canvasRef"
    :width="size"
    :height="size"
    @mousedown="startDraw"
    @mousemove="draw"
    @mouseup="endDraw"
    @mouseleave="endDraw"
    style="position: absolute; top: 0; left: 0"
  ></canvas>
</template>

<script setup>
import { ref, onMounted } from "vue";

const props = defineProps({
  size: { type: Number, default: 256 },
  strokeWidth: { type: Number, default: 6 },
  strokeColor: { type: String, default: "black" },
  lineCap: { type: String, default: "round" },
  lineJoin: { type: String, default: "round" },
  onFinish: Function,
});

const canvasRef = ref(null);
let ctx = null;
let isDrawing = false;
let path = [];

onMounted(() => {
  ctx = canvasRef.value.getContext("2d", { willReadFrequently: true });
  ctx.lineWidth = props.strokeWidth;
  ctx.lineCap = props.lineCap;
  ctx.lineJoin = props.lineJoin;
  ctx.strokeStyle = props.strokeColor;
});

function startDraw(e) {
  isDrawing = true;
  path = [getMousePos(e)];
}

function draw(e) {
  if (!isDrawing) return;
  const pos = getMousePos(e);
  path.push(pos);
  redraw();
}

function endDraw() {
  if (!isDrawing) return;
  isDrawing = false;
  redraw();
  if (props.onFinish) props.onFinish(path);
}

function redraw() {
  ctx.clearRect(0, 0, props.size, props.size);
  ctx.beginPath();
  for (let i = 0; i < path.length; i++) {
    const pt = path[i];
    if (i === 0) ctx.moveTo(pt.x, pt.y);
    else ctx.lineTo(pt.x, pt.y);
  }
  ctx.stroke();
}

function getMousePos(e) {
  const rect = canvasRef.value.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
}

function clearCanvas() {
  ctx.clearRect(0, 0, props.size, props.size);
  path = [];
}

defineExpose({ clearCanvas });
</script>
