<template>
  <div>
    <button @click="startAnimationHandler1">Start Animation 1</button>
    <StrokeWriter
      ref="writer1"
      :strokes="strokeData"
      :size="'4rem'"
      strokeColor="blue"
      :delayBetweenStrokes="0.5"
      :animationDuration="1"
    />

    <button @click="startAnimationHandler2">Start Animation 2</button>
    <StrokeWriter
      ref="writer2"
      :strokes="strokeData"
      :size="'4rem'"
      strokeColor="red"
      :delayBetweenStrokes="0.5"
      :animationDuration="1"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import StrokeWriter from "./components/StrokeWriter.vue";

const strokeData = [
  "M7.53125 6 C9 6 13 5.5 15.5352 5",
  "M11.5306 3 C10.5 7 9.5 10.5 11.5306 19",
  "M15.4862 9 C15.5559 9.45126 15.5119 10.0367 15.3595 10.7008",
  "M15.3595 10.7008 C19.6125 10.1058 23.899 12.8624 14.8758 21",
];

const writer1 = ref(null);
const writer2 = ref(null);

function startAnimationHandler1() {
  writer1.value?.restartAnimation();
}

function startAnimationHandler2() {
  writer2.value?.restartAnimation();
}
</script>
