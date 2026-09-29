<script setup>
import { computed, onMounted, onBeforeUnmount, ref } from 'vue'
import { useData } from 'vitepress'
import stats from '../.vitepress/stats.json'

const { lang } = useData()
const isZh = computed(() => lang.value === 'zh' || lang.value === 'zh-CN')
const canvasLabel = computed(() =>
  isZh.value ? '随指针变化的流场' : 'Flow field that reacts to your pointer'
)
const footTitle = computed(() =>
  isZh.value
    ? `秩序之外 · OUTLINE ${stats.museum.exhibits}`
    : `Beyond Order · OUTLINE ${stats.museum.exhibits}`
)

const canvas = ref(null)
let raf = 0
let cleanup = null

const reduceMotion =
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/*
 * Same rendering as the museum's featured hero (app.js `featured-flow`):
 * a grid of short tangential strokes twisted around a rotating centre.
 */
function renderField(ctx, width, height, t, pointer) {
  ctx.fillStyle = '#17251f'
  ctx.fillRect(0, 0, width, height)

  const cx = width * 0.52 + pointer.nx * width * 0.1
  const cy = height * 0.47 + pointer.ny * height * 0.1
  const step = Math.max(8, width / 55)

  ctx.save()
  ctx.translate(cx, cy)
  ctx.rotate(-0.25)
  const sx = width * 0.4
  const sy = height * 0.37
  for (let x = -sx; x < sx; x += step) {
    for (let y = -sy; y < sy; y += step) {
      const nx = x / sx
      const ny = y / sy
      const d = Math.hypot(nx, ny)
      if (d > 1.06) continue
      const q = Math.atan2(ny, nx)
      const twist = q + Math.sin(d * 6 - t * 0.22) * 1.1
      const px = x + Math.cos(twist) * 18 * (1 - d)
      const py = y + Math.sin(twist) * 18
      const fade = Math.max(0, Math.min(1, (1.1 - d) * 3))
      ctx.strokeStyle = `hsla(${75 + Math.sin(q + t * 0.07) * 15} 52% ${
        55 + (1 - d) * 19
      }% / ${fade * 0.8})`
      ctx.lineWidth = 0.8
      const len = step * (0.65 + Math.sin(d * 8) * 0.35)
      ctx.beginPath()
      ctx.moveTo(px - (Math.cos(twist) * len) / 2, py - (Math.sin(twist) * len) / 2)
      ctx.lineTo(px + (Math.cos(twist) * len) / 2, py + (Math.sin(twist) * len) / 2)
      ctx.stroke()
    }
  }
  ctx.restore()
}

onMounted(() => {
  const el = canvas.value
  if (!el) return
  const ctx = el.getContext('2d')
  const pointer = { nx: 0, ny: 0 }
  let width = 0
  let height = 0
  let t = 1.2

  const paint = () => renderField(ctx, width, height, t, pointer)

  const resize = () => {
    const rect = el.getBoundingClientRect()
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    width = Math.max(rect.width, 1)
    height = Math.max(rect.height, 1)
    el.width = Math.floor(width * dpr)
    el.height = Math.floor(height * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    paint()
  }

  const onMove = (event) => {
    const rect = el.getBoundingClientRect()
    pointer.nx = ((event.clientX - rect.left) / rect.width) * 2 - 1
    pointer.ny = ((event.clientY - rect.top) / rect.height) * 2 - 1
    if (reduceMotion) paint()
  }

  const onLeave = () => {
    pointer.nx = 0
    pointer.ny = 0
    if (reduceMotion) paint()
  }

  const loop = () => {
    t += 0.016
    paint()
    raf = requestAnimationFrame(loop)
  }

  resize()
  if (!reduceMotion) loop()

  window.addEventListener('resize', resize)
  el.addEventListener('pointermove', onMove)
  el.addEventListener('pointerleave', onLeave)

  cleanup = () => {
    cancelAnimationFrame(raf)
    window.removeEventListener('resize', resize)
    el.removeEventListener('pointermove', onMove)
    el.removeEventListener('pointerleave', onLeave)
  }
})

onBeforeUnmount(() => cleanup && cleanup())
</script>

<template>
  <div class="ol-flow">
    <div class="ol-flow-label">
      <span><i class="dot"></i> LIVE EXPERIMENT</span>
      <span>027 / FLOW FIELD</span>
    </div>
    <canvas ref="canvas" :aria-label="canvasLabel" />
    <div class="ol-flow-foot">
      <span>{{ footTitle }}</span>
      <span>{{ isZh ? '↖ 移动指针' : '↖ Move your pointer' }}</span>
    </div>
  </div>
</template>