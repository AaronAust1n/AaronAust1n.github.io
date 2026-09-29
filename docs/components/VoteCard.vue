<script setup>
import { ref, computed, onMounted } from 'vue'
import { useData } from 'vitepress'

const { lang } = useData()

const props = defineProps({
  question: {
    type: String,
    required: true
  },
  options: {
    type: Array,
    required: true
  }
})

const t = (key) => {
  const messages = {
    'votes': {
      'en-US': 'votes',
      'zh-CN': '票'
    },
    'click_to_vote': {
      'en-US': 'Click to vote',
      'zh-CN': '点击投票'
    },
    'thanks_for_voting': {
      'en-US': 'Thanks for voting!',
      'zh-CN': '感谢投票！'
    }
  }
  // Fallback to en-US if lang not found or key not found
  const locale = lang.value === 'zh' || lang.value === 'zh-CN' ? 'zh-CN' : 'en-US'
  return messages[key][locale] || messages[key]['en-US']
}

const storageKey = computed(() => `votecard:${props.question}`)

// Deterministic seed so the displayed counts are stable across reloads
// instead of changing randomly on every visit.
const seedCount = (question, option) => {
  let h = 2166136261
  const s = question + '|' + option
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (Math.abs(h) % 9) + 1
}

const selectedOption = ref(null)
const hasVoted = ref(false)
const votes = ref({})

const initializeVotes = () => {
  votes.value = Object.fromEntries(
    props.options.map((opt) => [opt, seedCount(props.question, opt)])
  )
}

initializeVotes()

const totalVotes = computed(() => {
  return Object.values(votes.value).reduce((a, b) => a + b, 0)
})

const getPercentage = (opt) => {
  if (totalVotes.value === 0) return 0
  return Math.round((votes.value[opt] / totalVotes.value) * 100)
}

const persist = () => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(
      storageKey.value,
      JSON.stringify({ choice: selectedOption.value, votes: votes.value })
    )
  } catch {
    /* storage unavailable — vote is session-only */
  }
}

const castVote = (opt) => {
  if (hasVoted.value) return
  selectedOption.value = opt
  votes.value[opt]++
  hasVoted.value = true
  persist()
}

// Restore a previous vote (choice and counts) so the state is consistent
onMounted(() => {
  if (typeof window === 'undefined') return
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey.value) || 'null')
    if (saved && props.options.includes(saved.choice)) {
      selectedOption.value = saved.choice
      votes.value = saved.votes || votes.value
      hasVoted.value = true
    }
  } catch {
    /* corrupted entry — ignore */
  }
})
</script>

<template>
  <div class="vote-card">
    <h3 class="question">{{ question }}</h3>

    <div class="options">
      <button
        v-for="opt in options"
        :key="opt"
        type="button"
        class="option-container"
        :class="{ 'voted': hasVoted, 'selected': selectedOption === opt }"
        :disabled="hasVoted"
        :aria-label="t('click_to_vote') + ': ' + opt"
        @click="castVote(opt)"
      >
        <div class="progress-bar" :style="{ width: hasVoted ? getPercentage(opt) + '%' : '0%' }"></div>
        <div class="content">
          <span class="label">{{ opt }}</span>
          <span v-if="hasVoted" class="percentage">{{ getPercentage(opt) }}%</span>
        </div>
      </button>
    </div>

    <div class="footer">
      <span class="total">{{ totalVotes }} {{ t('votes') }}</span>
      <span v-if="!hasVoted" class="hint">{{ t('click_to_vote') }}</span>
      <span v-else class="hint">{{ t('thanks_for_voting') }}</span>
    </div>
  </div>
</template>

<style scoped>
.vote-card {
  background: var(--vp-c-bg-soft, #f9fafb);
  border: 1px solid var(--vp-c-divider, #e5e7eb);
  border-radius: 16px;
  padding: 1.5rem;
  color: var(--vp-c-text-1, #1f2937);
  width: 100%;
  transition: all 0.3s ease;
}

/* Dark mode glass effect */
:global(.dark) .vote-card {
  background: rgba(30, 41, 59, 0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  color: #fff;
}

.question {
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
  font-weight: 600;
  text-align: center;
  color: inherit;
}

.option-container {
  position: relative;
  display: block;
  width: 100%;
  margin-bottom: 0.8rem;
  height: 40px;
  background: var(--vp-c-bg-alt, #f3f4f6);
  border-radius: 8px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  font-family: inherit;
  font-size: inherit;
  padding: 0;
}

:global(.dark) .option-container {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.option-container:hover:not(.voted) {
  transform: translateX(2px);
  background: var(--vp-c-bg-mute, #e5e7eb);
}

:global(.dark) .option-container:hover:not(.voted) {
  background: rgba(255, 255, 255, 0.1);
}

.option-container:focus-visible {
  outline: 2px solid var(--vp-c-brand-1, #3b82f6);
  outline-offset: 2px;
}

.option-container.selected {
  border-color: var(--vp-c-brand-1, #3b82f6);
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.2);
}

.option-container:disabled {
  cursor: default;
}

.progress-bar {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  /* New Brand Colors: Blue to Cyan */
  background: linear-gradient(90deg, rgba(37, 99, 235, 0.15), rgba(8, 145, 178, 0.15));
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

:global(.dark) .progress-bar {
  background: linear-gradient(90deg, rgba(59, 130, 246, 0.4), rgba(34, 211, 238, 0.4));
}

.content {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 1rem;
  z-index: 1;
}

:global(.dark) .content {
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.label {
  font-weight: 500;
}

.percentage {
  font-family: monospace;
  font-weight: 700;
}

.footer {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  font-size: 0.8rem;
  color: var(--vp-c-text-2, #6b7280);
}

:global(.dark) .footer {
  color: rgba(255, 255, 255, 0.6);
}
</style>
