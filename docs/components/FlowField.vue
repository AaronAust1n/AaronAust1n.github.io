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

onMounted(() => {
  const el = canvas.value
  if (!el) return
  const ctx = el.getContext('2d')
  let width = 0
  let height = 0
  let dpr = 1
  let particles = []
  const pointer = { x: -9999, y: -9999, active: false }

  const resize = () => {
    const rect = el.getBoundingClientRect()
    dpr = Math.min(window.devicePixelRatio || 1, 2)
    width = Math.max(rect.width, 1)
    height = Math.max(rect.height, 1)
    el.width = Math.floor(width * dpr)
    el.height = Math.floor(height * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.fillStyle = '#151f1c'
    ctx.fillRect(0, 0, width, height)
  }

  const spawn = () => {
    const count = Math.round((width * height) / 14000)
    particles = Array.from({ length: Math.min(Math.max(count, 60), 220) }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: 0,
      vy: 0,
      life: Math.random() * 240
    }))
  }

  const onMove = (e) => {
    const rect = el.getBoundingClientRect()
    pointer.x = e.clientX - rect.left
    pointer.y = e.clientY - rect.top
    pointer.active = true
  }
  const onLeave = () => {
    pointer.active = false
    pointer.x = -9999
    pointer.y = -9999
  }

  let t = 0
  const draw = () => {
    t += 0.004
    ctx.fillStyle = 'rgba(21, 31, 28, 0.045)'
    ctx.fillRect(0, 0, width, height)
    ctx.lineCap = 'round'

    for (const p of particles) {
      const nx = p.x / width
      const ny = p.y / height
      const angle =
        Math.sin(nx * 3.1 + t) * 1.6 +
        Math.cos(ny * 3.4 - t * 1.3) * 1.6 +
        Math.sin((nx + ny) * 2.2 + t * 0.7) * 0.8

      p.vx += Math.cos(angle) * 0.16
      p.vy += Math.sin(angle) * 0.16

      if (pointer.active) {
        const dx = p.x - pointer.x
        const dy = p.y - pointer.y
        const d2 = dx * dx + dy * dy
        if (d2 < 16000 && d2 > 0.01) {
          const f = 34 / d2
          p.vx += dx * f
          p.vy += dy * f
        }
      }

      p.vx *= 0.94
      p.vy *= 0.94
      const px = p.x
      const py = p.y
      p.x += p.vx
      p.y += p.vy
      p.life += 1

      const speed = Math.min(Math.hypot(p.vx, p.vy) / 3, 1)
      const alpha = pointer.active ? 0.55 : 0.32
      ctx.strokeStyle = `rgba(${196 + speed * 20}, ${224 - speed * 30}, ${168}, ${alpha})`
      ctx.lineWidth = 0.7 + speed * 0.9
      ctx.beginPath()
      ctx.moveTo(px, py)
      ctx.lineTo(p.x, p.y)
      ctx.stroke()

      if (
        p.x < -20 ||
        p.x > width + 20 ||
        p.y < -20 ||
        p.y > height + 20 ||
        p.life > 620
      ) {
        p.x = Math.random() * width
        p.y = Math.random() * height
        p.vx = 0
        p.vy = 0
        p.life = 0
      }
    }

    if (!reduceMotion) {
      raf = requestAnimationFrame(draw)
    }
  }

  const onResize = () => {
    resize()
    spawn()
    if (reduceMotion) drawStatic()
  }

  // Static, full-length render of the field for users who prefer reduced motion.
  const drawStatic = () => {
    ctx.fillStyle = '#151f1c'
    ctx.fillRect(0, 0, width, height)
    ctx.lineCap = 'round'
    const t0 = 0.6
    const step = Math.max(14, Math.min(width, height) / 34)
    for (let x = step / 2; x < width; x += step) {
      for (let y = step / 2; y < height; y += step) {
        const nx = x / width
        const ny = y / height
        const angle =
          Math.sin(nx * 3.1 + t0) * 1.6 +
          Math.cos(ny * 3.4 - t0 * 1.3) * 1.6 +
          Math.sin((nx + ny) * 2.2 + t0 * 0.7) * 0.8
        const len = step * 0.72
        ctx.strokeStyle = `rgba(196, 224, 168, 0.42)`
        ctx.lineWidth = 0.8
        ctx.beginPath()
        ctx.moveTo(x - Math.cos(angle) * len * 0.5, y - Math.sin(angle) * len * 0.5)
        ctx.lineTo(x + Math.cos(angle) * len * 0.5, y + Math.sin(angle) * len * 0.5)
        ctx.stroke()
      }
    }
  }

  resize()
  spawn()

  if (reduceMotion) {
    drawStatic()
  } else {
    draw()
  }

  window.addEventListener('resize', onResize)
  el.addEventListener('pointermove', onMove)
  el.addEventListener('pointerleave', onLeave)

  cleanup = () => {
    cancelAnimationFrame(raf)
    window.removeEventListener('resize', onResize)
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