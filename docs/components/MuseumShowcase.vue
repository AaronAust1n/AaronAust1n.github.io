<script setup>
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import stats from '../.vitepress/stats.json'

const { lang } = useData()
const isZh = computed(() => lang.value === 'zh' || lang.value === 'zh-CN')

const t = computed(() => {
  const museum = stats.museum
  return isZh.value
    ? {
        eyebrow: 'THE COLLECTION · 形外',
        title: `形外 OUTLINE —— ${museum.exhibits} 件交互与视觉博物馆`,
        desc: `一个永不闭馆的交互与视觉实验库：${museum.exhibits} 件展品、${museum.departments} 个展区，全部本地运行。每一件都能亲手操作、放大拆解、看到核心源码，再带走原理。`,
        cta: '进入博物馆',
        label: 'FEATURED EXHIBITS',
        exhibits: [
          { num: '027', name: '秩序之外', en: 'FLOW FIELD' },
          { num: '180', name: '沙水', en: 'BOUNDED SIMULATION' },
          { num: '183', name: '波面', en: 'PROPAGATION & INTERFERENCE' }
        ],
        stats: [
          { value: String(museum.exhibits), label: '件展品' },
          { value: String(museum.departments), label: '个展区' },
          { value: '00', label: '外部依赖' }
        ]
      }
    : {
        eyebrow: 'THE COLLECTION · OUTLINE',
        title: `OUTLINE — A Museum of ${museum.exhibits} Interactive & Visual Exhibits`,
        desc: `An ever-open playground of interaction and visual experiments: ${museum.exhibits} exhibits across ${museum.departments} departments, running entirely locally. Touch them, open the lab, read the core code, and take the principle with you.`,
        cta: 'Enter the museum',
        label: 'FEATURED EXHIBITS',
        exhibits: [
          { num: '027', name: 'Beyond Order', en: 'FLOW FIELD' },
          { num: '180', name: 'Sand & Water', en: 'BOUNDED SIMULATION' },
          { num: '183', name: 'Wavefront', en: 'PROPAGATION & INTERFERENCE' }
        ],
        stats: [
          { value: String(museum.exhibits), label: 'exhibits' },
          { value: String(museum.departments), label: 'departments' },
          { value: '00', label: 'external deps' }
        ]
      }
})
</script>

<template>
  <section class="ol-showcase">
    <div class="ol-showcase-copy">
      <div class="ol-eyebrow"><span class="ol-star">✳</span> {{ t.eyebrow }}</div>
      <h2>{{ t.title }}</h2>
      <p>{{ t.desc }}</p>
      <a class="VPButton medium brand" :href="withBase('/museum/')">
        {{ t.cta }} <span style="margin-left: 8px">↗</span>
      </a>
      <div class="ol-stats">
        <div v-for="s in t.stats" :key="s.label">
          <strong>{{ s.value }}</strong>
          <small>{{ s.label }}</small>
        </div>
      </div>
    </div>
    <div class="ol-showcase-art">
      <span class="ol-label">{{ t.label }}</span>
      <a
        v-for="ex in t.exhibits"
        :key="ex.num"
        class="ol-exhibit"
        :href="withBase('/museum/')"
      >
        <span class="num">{{ ex.num }}</span>
        <span class="meta">
          <strong>{{ ex.name }}</strong>
          <small>{{ ex.en }}</small>
        </span>
      </a>
    </div>
  </section>
</template>
