/*
 * OUTLINE museum · runtime language layer
 *
 * The museum is a standalone document without i18n. This layer is injected by
 * scripts/generate-stats.js so the deployed museum can be replaced at any time:
 *  - Chinese visits keep the original museum untouched.
 *  - English visits get translated data (exhibits, categories) before app.js
 *    reads it, plus translated UI text/attributes as the DOM renders.
 *
 * Translations live in /museum-i18n/en.*.js, outside docs/public/museum/.
 */
;(() => {
  'use strict'

  const CJK = /[\u3400-\u9fff]/

  function detectLang() {
    try {
      const param = new URLSearchParams(location.search).get('lang')
      if (param === 'en' || param === 'zh') return param
      const referrer = document.referrer || ''
      if (referrer.indexOf(location.origin + '/zh') === 0) return 'zh'
      if (referrer.indexOf(location.origin + '/') === 0) return 'en'
      return /^zh/i.test(navigator.language || '') ? 'zh' : 'en'
    } catch (error) {
      return 'zh'
    }
  }

  const lang = detectLang()
  document.documentElement.setAttribute('lang', lang === 'zh' ? 'zh-CN' : 'en')
  const siteNav = document.querySelector('.site-nav')
  if (siteNav) siteNav.setAttribute('data-lang', lang)

  /* Both handbook editions stay reachable in either language. */
  ;(() => {
    const button = document.getElementById('download-guide')
    if (!button) return
    const count = (window.OUTLINE_DATA && window.OUTLINE_DATA.exhibits.length) || 183
    const enFile = `/museum-i18n/handbook-${count}-en.md`
    const zhFile = `/museum-i18n/handbook-${count}-zh.md`

    if (lang === 'en') {
      button.textContent = 'Download the English handbook ↓'
      button.addEventListener(
        'click',
        (event) => {
          event.preventDefault()
          event.stopImmediatePropagation()
          const link = document.createElement('a')
          link.href = enFile
          link.download = `OUTLINE-${count}-implementation-handbook-en.md`
          document.body.appendChild(link)
          link.click()
          link.remove()
        },
        true
      )
    }

    const alt = document.createElement('a')
    alt.className = 'handbook-alt'
    alt.href = lang === 'en' ? zhFile : enFile
    alt.setAttribute(
      'download',
      lang === 'en' ? `形外-${count}项效果实现手册.md` : `OUTLINE-${count}-implementation-handbook-en.md`
    )
    alt.textContent = lang === 'en' ? '中文版手册 ↓' : 'English handbook ↓'
    button.insertAdjacentElement('afterend', alt)
  })()

  if (lang !== 'en') return

  const i18n = window.OUTLINE_I18N || {}
  const dict = i18n.ui || {}
  const attrs = i18n.attrs || {}
  const patterns = (i18n.patterns || []).map(([source, replacement]) => [
    new RegExp(source),
    replacement
  ])
  const attrPatterns = (i18n.attrPatterns || []).map(([source, replacement]) => [
    new RegExp(source),
    replacement
  ])

  /* ------------------------------------------------------------------ */
  /* 1. Translate data before app.js consumes it                         */
  /* ------------------------------------------------------------------ */

  const data = window.OUTLINE_DATA
  if (data) {
    if (i18n.categories) {
      for (const category of data.categories || []) {
        const t = i18n.categories[category.id]
        if (!t) continue
        if (t.name) category.name = t.name
        if (t.description) category.description = t.description
      }
    }
    if (i18n.exhibits) {
      for (const exhibit of data.exhibits || []) {
        const t = i18n.exhibits[exhibit.key]
        if (!t) continue
        if (t.name) {
          const zhName = exhibit.name
          exhibit.name = t.name
          exhibit.en = zhName
        }
        if (t.action) exhibit.action = t.action
        if (t.param) exhibit.param = t.param
        if (t.principle) exhibit.principle = t.principle
        if (t.caution) exhibit.caution = t.caution
        if (t.paramDetail) exhibit.paramDetail = t.paramDetail
        if (Array.isArray(exhibit.params)) {
          const translations = t.params || {}
          for (const param of exhibit.params) {
            const pt = translations[param.key]
            if (!pt) continue
            if (pt.label) param.label = pt.label
            if (pt.options) {
              for (const option of param.options || []) {
                if (pt.options[option.value]) option.label = pt.options[option.value]
              }
            }
          }
        }
      }
    }
    if (i18n.title) document.title = i18n.title
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription && i18n.description) metaDescription.setAttribute('content', i18n.description)
  }

  /* ------------------------------------------------------------------ */
  /* 2. Translate text nodes and attributes as the UI renders            */
  /* ------------------------------------------------------------------ */

  const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'PRE', 'CODE', 'TEXTAREA'])

  function translateString(raw, patternList) {
    if (!raw || !CJK.test(raw)) return raw
    const parts = raw.match(/^(\s*)([\s\S]*?)(\s*)$/)
    const core = parts[2]
    if (!core) return raw
    let out = dict[core]
    if (out === undefined) {
      for (const [regex, replacement] of patternList) {
        if (regex.test(core)) {
          out = core.replace(regex, replacement)
          break
        }
      }
    }
    return out === undefined ? raw : parts[1] + out + parts[3]
  }

  function translateAttributes(root) {
    if (!root.querySelectorAll) return
    const elements = root.querySelectorAll('[placeholder],[aria-label],[title],[alt]')
    for (const element of elements) {
      for (const name of ['placeholder', 'aria-label', 'title', 'alt']) {
        const value = element.getAttribute(name)
        if (!value || !CJK.test(value)) continue
        const translated = attrs[value] || translateString(value, attrPatterns)
        if (translated) element.setAttribute(name, translated)
      }
    }
  }

  function translateTree(root) {
    if (!root) return
    if (root.nodeType === 3) {
      const translated = translateString(root.nodeValue, patterns)
      if (translated !== root.nodeValue) root.nodeValue = translated
      return
    }
    if (root.nodeType !== 1 && root.nodeType !== 9) return
    if (root.nodeType === 1 && SKIP_TAGS.has(root.tagName)) return

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue || !CJK.test(node.nodeValue)) return NodeFilter.FILTER_REJECT
        let parent = node.parentElement
        while (parent) {
          if (SKIP_TAGS.has(parent.tagName)) return NodeFilter.FILTER_REJECT
          parent = parent.parentElement
        }
        return NodeFilter.FILTER_ACCEPT
      }
    })

    const nodes = []
    let node
    while ((node = walker.nextNode())) nodes.push(node)
    for (const item of nodes) {
      const translated = translateString(item.nodeValue, patterns)
      if (translated !== item.nodeValue) item.nodeValue = translated
    }

    translateAttributes(root)
  }

  translateTree(document.body)

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        for (const added of mutation.addedNodes) translateTree(added)
      } else if (mutation.type === 'characterData') {
        const node = mutation.target
        const translated = translateString(node.nodeValue, patterns)
        /* Only write when it really changes: assigning the same value would
         * queue another characterData record and loop forever. */
        if (translated !== node.nodeValue) node.nodeValue = translated
      }
    }
  })
  observer.observe(document.body, { childList: true, subtree: true, characterData: true })
})()