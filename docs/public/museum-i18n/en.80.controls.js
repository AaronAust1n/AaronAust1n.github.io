/*
 * OUTLINE museum · English exhibit data — Controls & Feedback (controls)
 */
window.OUTLINE_I18N = window.OUTLINE_I18N || {}
window.OUTLINE_I18N.exhibits = window.OUTLINE_I18N.exhibits || {}

Object.assign(window.OUTLINE_I18N.exhibits, {
  toggle: {
    name: 'Day & Night',
    action: 'Click to toggle',
    param: 'Starlight',
    principle: 'aria-pressed and the sun/moon positions together express the state.',
    caution: 'State also needs text, not color alone.'
  },
  slider: {
    name: 'Color Temperature',
    action: 'Drag the slider',
    param: 'Saturation',
    principle: 'The native range value updates the numeric label, gradient and color-temperature circle at once.',
    caution: 'Keep native keyboard arrow-key operation.'
  },
  hold: {
    name: 'Hold to Confirm',
    action: 'Press and hold the button',
    param: 'Duration',
    principle: 'Pointer or space key starts a timer; reaching the threshold enters a confirmed state.',
    caution: 'Pointer cancel, blur and early release must all clear the timer.'
  },
  like: {
    name: 'A Little Love',
    action: 'Click the heart',
    param: 'Particles',
    principle: 'aria-pressed toggles and a limited particle burst scatters radially.',
    caution: 'Particles are decoration only and must not steal focus.'
  },
  toast: {
    name: 'Gentle Toast',
    action: 'Click to send',
    param: 'Dwell',
    principle: 'A state update shows a non-blocking notification announced via role=status.',
    caution: 'Pause only freezes visual time; no real request is sent.'
  },
  dragorder: {
    name: 'Tactile Sorting',
    action: 'Drag / arrow keys',
    param: 'Elasticity',
    principle: 'Pointer drag reorders list data; up/down buttons give an equivalent keyboard path.',
    caution: 'Re-render from data order instead of moving only visual positions.'
  },
  radial: {
    name: 'Radial Menu',
    action: 'Click to open / switch to hold to summon',
    param: 'Radius',
    paramDetail: 'The original radius stays 35–72px; hold mode trigger time is configurable separately.',
    principle: 'Click opens five options by default; hold mode runs a cancelable progress ring and only opens three options at the threshold.',
    caution: 'Early release, movement, blur, pause or leaving the viewport cancels; collapsed options are out of the tab order, with a direct-open alternative button.',
    params: {
      activation: { label: 'Summon mode', options: { click: 'Original click-open', hold: 'Hold to summon' } },
      holdMs: { label: 'Hold threshold' }
    }
  },
  stepper: {
    name: 'Step by Step',
    action: 'Click next',
    param: 'Spacing',
    principle: 'A finite state index drives the step bar, labels and back/next buttons.',
    caution: 'Disable the matching button at the boundaries.'
  },
  segmented: {
    name: 'Sliding Tabs',
    action: 'Click an option',
    param: 'Radius',
    principle: 'The original three segments remain; optional unequal labels drive the indicator from offsetLeft/offsetWidth with a ResizeObserver remeasure.',
    caution: 'Original names and keys are unchanged; the reference width is the CSS layout width, not an estimated character count.',
    params: {
      labels: { label: 'Label mode', options: { classic: 'Original equal width', measured: 'Measured unequal width' } }
    }
  },
  password: {
    name: 'Reveal Gently',
    action: 'Type / toggle visibility',
    param: 'Font size',
    principle: 'The input type toggles locally between password and text and shows a length hint.',
    caution: 'The demo never sends or persists input; never type a real password.'
  },
  undo: {
    name: 'Undo & Redo',
    action: 'Click cells / undo',
    param: 'History capacity',
    principle: 'Each change stores an immutable snapshot and keeps a history cursor; new edits after undo drop the future branch.',
    caution: 'History capacity is capped and button disabled states track the cursor.'
  },
  range: {
    name: 'Range Selection',
    action: 'Dual sliders / arrow keys',
    param: 'Minimum gap',
    principle: 'Two native sliders share a track, enforce endpoint order and minimum gap, and update the selected fill.',
    caution: 'Each endpoint is named and keyboard operable; value must not be color-only.'
  },
  command: {
    name: 'Command Palette',
    action: 'Search / arrow keys / Enter',
    param: 'Candidate count',
    principle: 'Input filters a local command list; an active index, ARIA wiring and keyboard navigation pick operations.',
    caution: 'Only changes this exhibit colors; runs no system commands and sends no search text.'
  },
  giantform: {
    name: 'Bold Form',
    action: 'Focus / press',
    param: 'Hard shadow',
    paramDetail: 'Hard shadow offset 4–12px.',
    principle: 'Focus lifts and tints the thick-bordered input, while button press offset cancels the hard shadow.',
    caution: 'Feedback stays inside the exhibit; nothing is uploaded or persisted.'
  },
  buttonscope: {
    name: 'Button Microscope',
    action: 'Hover / press / Tab',
    param: 'Named parameters',
    paramDetail: 'See the named parameter table below.',
    principle: 'Hover, active, focus-visible and transforms are read side by side to explain pointer versus keyboard differences.',
    caution: 'Reads real CSS pseudo-classes; no fake touch hover is provided.',
    params: {
      depth: { label: 'Press offset' },
      duration: { label: 'Transition time' },
      ring: { label: 'Extra focus ring' }
    }
  },
  formstates: {
    name: 'Form State Machine',
    action: 'Fill / submit / reset',
    param: 'Named parameters',
    paramDetail: 'See the named parameter table below.',
    principle: 'Untouched, typing, validating, error, submitting and success states across fields, with accessible feedback.',
    caution: 'Demo fields only, no network requests; leaving the viewport cancels an in-flight submit and returning requires a new submit.',
    params: {
      when: { label: 'Validation timing', options: { blur: 'On field blur', input: 'While typing' } },
      delay: { label: 'Local submit delay' }
    }
  }
})