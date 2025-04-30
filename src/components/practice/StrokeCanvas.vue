<!-- ./strokeCanvas.vue -->
<template>
  <!-- 
 * <canvas> adalah elemen HTML tempat user bisa menggambar.
 * ref="canvasRef": agar kita bisa akses elemen ini dari JavaScript (canvasRef.value).
 * :width dan :height: ukuran kanvas disesuaikan dengan properti size (default 256).
 * Event listener:
 * mousedown: mulai menggambar (startDraw)
 * mousemove: menggambar saat mouse bergerak (draw)
 * mouseup & mouseleave: selesai menggambar (endDraw)
 * style="...": posisinya diatur absolut agar menumpuk dengan stroke referensi (SVG).
-->
  <canvas
    ref="canvasRef"
    :width="size"
    :height="size"
    @mousedown="startDraw"
    @mousemove="draw"
    @mouseup="endDraw"
    @mouseleave="endDraw"
    style="position: absolute; top: 0; left: 0; border: 1px solid #ccc"
  ></canvas>
</template>

<script setup>
// ref, onMounted: Composition API dari Vue.
import { ref, onMounted } from "vue";

/** inisiasi
 * defineProps: menerima properti dari komponen induk:
 * - size: ukuran kanvas (default 256).
 * - onFinish: fungsi callback yang dipanggil saat user selesai menggambar.
 */
const props = defineProps({
  size: { type: Number, default: 256 },
  onFinish: Function,
});

/** variable global
 * canvasRef: referensi ke elemen <canvas>.
 * ctx: 2D rendering context (untuk menggambar di canvas).
 * isDrawing: status apakah user sedang menggambar.
 * path: array titik koordinat hasil gambar user.
 */
const canvasRef = ref(null);
let ctx = null;
let isDrawing = false;
let path = [];

/** Setup Saat Mount
 * Dijalankan saat komponen dimuat.
 * Inisialisasi ctx (konteks menggambar canvas).
 * lineWidth, lineCap, strokeStyle: mengatur tampilan garis saat menggambar.
 */
onMounted(() => {
  ctx = canvasRef.value.getContext("2d", { willReadFrequently: true });
  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  ctx.strokeStyle = "black";
});

/**
 * Event Menggambar: startDraw(e)
 * @param e
 * Dipanggil saat mouse diklik.
 * Set isDrawing = true dan simpan posisi pertama mouse ke path.
 */
function startDraw(e) {
  isDrawing = true;
  path = [getMousePos(e)];
}

/**
 * Event Menggambar: draw(e)
 * @param e
 * Dipanggil saat mouse bergerak.
 * Jika isDrawing aktif, tambahkan titik baru ke path dan gambar ulang jalur.
 */
function draw(e) {
  if (!isDrawing) return;
  const pos = getMousePos(e);
  path.push(pos);
  redraw();
}

/**
 * Event Menggambar: endDraw()
 * Dipanggil saat mouse dilepas atau keluar dari kanvas.
 * Menghentikan proses gambar.
 * Jalankan onFinish(path) untuk mengirim path ke induk (untuk dinilai).
 */
function endDraw() {
  if (!isDrawing) return;
  isDrawing = false;
  redraw();
  if (props.onFinish) props.onFinish(path);
}

/**
 * Fungsi Bantu: redraw()
 * Membersihkan canvas lalu menggambar ulang seluruh path.
 * Digunakan setiap kali ada titik baru ditambahkan.
 */
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

/**
 * Fungsi Bantu: getMousePos(e)
 * @param e
 * Konversi koordinat mouse dari layar ke posisi relatif di canvas.
 */
function getMousePos(e) {
  const rect = canvasRef.value.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
}

/**
 * Fungsi Bantu: clearCanvas()
 * Menghapus isi kanvas dan reset path pengguna.
 * Dipanggil ketika stroke salah atau berpindah ke stroke berikutnya.
 */
function clearCanvas() {
  ctx.clearRect(0, 0, props.size, props.size);
  path = [];
}

/** Ekspos Fungsi ke Luar
 * Memungkinkan komponen induk (yang pakai <StrokeCanvas />) untuk memanggil clearCanvas().
 */
defineExpose({ clearCanvas });
</script>
