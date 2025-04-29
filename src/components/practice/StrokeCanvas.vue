<template>
  <div style="position: relative; width: 300px; height: 300px">
    <!-- SVG Referensi -->
    <!-- Penjelasan:
    - Elemen <svg> digunakan untuk menampilkan bentuk stroke huruf asli (referensi).
    - Atribut :d adalah path SVG yang digambar berdasarkan nilai currentStrokePath.
    - Ukuran canvas adalah 300x300px, tapi skala internalnya 100x100 (viewBox).
    - Warna stroke adalah abu-abu. -->
    <svg
      :width="size"
      :height="size"
      :viewBox="`0 0 ${viewBox} ${viewBox}`"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        :d="currentStrokePath"
        :stroke="strokeColor"
        stroke-width="6"
        fill="none"
      />
    </svg>

    <!-- Canvas Gambar User -->
    <!-- Penjelasan:
     - Ini canvas tempat user menggambar dengan mouse.
     - Event mouse digunakan untuk menggambar: mousedown mulai, mousemove menggambar, mouseup/mouseleave selesai.
     - ref="userCanvas" membuat kita bisa akses canvas ini lewat JavaScript.
     -jika showCanvas true maka dia akan muncul jika false dihilangkan -->
    <canvas
      v-if="showCanvas"
      ref="userCanvas"
      :width="size"
      :height="size"
      style="position: absolute; top: 0; left: 0; border: 1px solid #ddd"
      @mousedown="startDraw"
      @mousemove="drawing"
      @mouseup="endDraw"
    ></canvas>

    <!-- Canvas Offscreen (tidak terlihat) -->
    <!-- Penjelasan:
      - Ini canvas tersembunyi (offscreen) untuk menggambar stroke referensi.
      - Nanti digunakan untuk ambil piksel stroke asli dan membandingkannya dengan gambar user. -->
    <canvas
      ref="referenceCanvas"
      :width="size"
      :height="size"
      style="display: none"
    ></canvas>
  </div>
</template>

<script setup>
// Menggunakan Composition API dari Vue 3.
// ref untuk state reactive, seperti canvas, path, drawingData, dll.
import { ref } from "vue";

// 📌 Variabel awal:
const size = 300;
const viewBox = 100;

// Ukuran canvas dalam pixel dan skala viewBox SVG.
const userCanvas = ref(null);
const referenceCanvas = ref(null);

// currentStrokePath = path SVG yang digunakan sebagai referensi.
const currentStrokePath = ref("M10,10 C20,10 20,30 30,30"); // contoh stroke
const strokeColor = ref("#ccc");
const showCanvas = ref(true);

// drawingData = array untuk menyimpan posisi mouse user (jejak gambar).
const drawingData = ref([]);
// isDrawing = boolean untuk tahu apakah user sedang menggambar atau tidak.
let isDrawing = false;

// 📌 Fungsi menggambar:
// Dipanggil saat mousedown — mulai stroke baru.
function startDraw(e) {
  isDrawing = true;
  drawingData.value = [[getMousePos(e)]];
}

// Dipanggil saat mousemove — menambahkan titik ke stroke terakhir.
function drawing(e) {
  if (!isDrawing) return;
  drawingData.value[drawingData.value.length - 1].push(getMousePos(e));
  // Memanggil drawUserPath() untuk gambar ulang canvas.
  drawUserPath();
}

// Dipanggil saat mouseup atau mouseleave — mengakhiri stroke. (@mouseleave tidak jadi digunakan)
function endDraw() {
  isDrawing = false;
  const hasil = istrueEnught(validateStroke());
  if (hasil) {
    strokeColor.value = "black"; // ubah warna stroke referensi
    clearUserCanvas();
    showCanvas.value = false; // sembunyikan canvas kalau benar
  } else {
    strokeColor.value = "#ccc";
    clearUserCanvas();
  }
  console.log(hasil);
}

// mengecek apakah presentase kebenaran sudah cukup
function istrueEnught(presesntase) {
  return parseFloat(presesntase) >= 1;
}

// membersihkan canvas
function clearUserCanvas() {
  drawingData.value = [];
  const ctx = userCanvas.value.getContext("2d");
  ctx.clearRect(0, 0, size, size);
}

// 📌 Fungsi posisi:
// Mengubah koordinat mouse (pixel) ke koordinat skala viewBox SVG.
function getMousePos(e) {
  const rect = userCanvas.value.getBoundingClientRect();
  return {
    x: ((e.clientX - rect.left) / rect.width) * viewBox,
    y: ((e.clientY - rect.top) / rect.height) * viewBox,
  };
}

// 📌 Menggambar ulang stroke user:
// Menggambar semua stroke user berdasarkan data yang terkumpul.
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

// 📌 Menggambar stroke referensi (offscreen canvas):
// Menggambar stroke referensi agar bisa dibaca pikselnya.
function drawReferencePath() {
  const ctx = referenceCanvas.value.getContext("2d");
  ctx.clearRect(0, 0, size, size);

  const path = new Path2D(currentStrokePath.value);
  ctx.strokeStyle = "red";
  ctx.lineWidth = 6;
  ctx.stroke(path);
}

// 📌 Fungsi Validasi:

/*
Ambil piksel dari kedua canvas.
Cek berapa banyak piksel user yang tumpang tindih dengan stroke referensi.
Tampilkan presentase kecocokan (kemiripan bentuk).
*/
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

  const tingkatKecocokan = (matchRatio * 100).toFixed(1);

  return tingkatKecocokan;
  // alert(`Tingkat kecocokan: ${(matchRatio * 100).toFixed(1)}%`);
}
</script>
