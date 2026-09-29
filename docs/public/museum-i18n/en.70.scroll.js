/*
 * OUTLINE museum · English exhibit data — Scroll & Narrative (scroll)
 */
window.OUTLINE_I18N = window.OUTLINE_I18N || {}
window.OUTLINE_I18N.exhibits = window.OUTLINE_I18N.exhibits || {}

Object.assign(window.OUTLINE_I18N.exhibits, {
  progress: {
    name: 'Reading Progress',
    action: 'Scroll inside',
    param: 'Thickness',
    principle: 'scrollTop divided by scrollable distance drives the top progress bar.',
    caution: 'Handle the zero denominator when content is shorter than one screen.'
  },
  reveal: {
    name: 'Scroll Reveal',
    action: 'Scroll inside',
    param: 'Offset',
    principle: 'Each child position relative to the local scroll container sets opacity and offset.',
    caution: 'The observed target must be the inner container, never the whole page scroll.'
  },
  sticky: {
    name: 'Sticky Chapter',
    action: 'Scroll inside',
    param: 'Font size',
    principle: 'position:sticky pins section titles inside a local scroll container.',
    caution: 'The sticky ancestor scroll context must be explicit.'
  },
  scrollparallax: {
    name: 'Scrolling Landscape',
    action: 'Scroll inside',
    param: 'Parallax',
    principle: 'Local scroll progress drives layers at different depths.',
    caution: 'overscroll-behavior:contain prevents scroll chaining.'
  },
  horizontal: {
    name: 'Horizontal Story',
    action: 'Scroll inside',
    param: 'Travel',
    principle: 'Vertical scroll is normalized into a translateX track.',
    caution: 'Only an isolated region is intercepted; page scrolling is never hijacked.'
  },
  scalestory: {
    name: 'Scale Story',
    action: 'Scroll inside',
    param: 'Scale',
    principle: 'Local scroll progress maps to shape scale and corner radius.',
    caution: 'Scaling stays inside the demo window and never covers the page.'
  },
  reading: {
    name: 'Reading Light',
    action: 'Scroll inside',
    param: 'Afterglow',
    principle: 'Scroll progress decides how many characters light up while inactive outlines remain.',
    caution: 'The full text always exists; reading order is never split or rewritten.'
  },
  timeline: {
    name: 'Scroll Timeline',
    action: 'Scroll inside',
    param: 'Line width',
    principle: 'Local scroll drives both the timeline fill and node activation states.',
    caution: 'The timeline uses semantic order; progress is not real time.'
  },
  cardscroll: {
    name: 'Stacked Chapters',
    action: 'Scroll inside',
    param: 'Layer gap',
    principle: 'Several sticky cards stack using different top values.',
    caution: 'Make sure the container has enough scroll distance.'
  },
  scrolldraw: {
    name: 'Draw on Scroll',
    action: 'Scroll inside',
    param: 'Line width',
    principle: 'Scroll progress maps to SVG stroke-dashoffset.',
    caution: 'Read the length after the SVG path exists, or use pathLength.'
  },
  milestones: {
    name: 'Counting Chapters',
    action: 'Scroll inside',
    param: 'Target value',
    principle: 'Local scroll progress maps in segments to three demo counters and activates matching chapters.',
    caution: 'These numbers are demo data, not real statistics.'
  },
  zoommap: {
    name: 'Nested Worlds',
    action: 'Scroll inside',
    param: 'Depth',
    principle: 'Local scroll progress drives exponential camera zoom so nested regions fill the frame one by one.',
    caution: 'The camera moves only inside its own window; browser page zoom is untouched.'
  }
})