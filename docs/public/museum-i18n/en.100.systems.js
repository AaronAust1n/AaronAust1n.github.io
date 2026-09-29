/*
 * OUTLINE museum · English exhibit data — Systems & State (systems)
 */
window.OUTLINE_I18N = window.OUTLINE_I18N || {}
window.OUTLINE_I18N.exhibits = window.OUTLINE_I18N.exhibits || {}

Object.assign(window.OUTLINE_I18N.exhibits, {
  hud: {
    name: 'Cyber HUD',
    action: 'Data jumps every 0.7s; radar sweep',
    param: 'Sweep speed',
    paramDetail: 'Sweep angular speed 0.25–1.25 turns per exhibit-second.',
    principle: 'A canvas radar sector sweep, with independent cycles accumulating readings and targets.',
    caution: 'All data is labeled as simulated readings.'
  },
  island: {
    name: 'Dynamic Island Study',
    action: 'Click to cycle three states',
    param: 'Elasticity',
    paramDetail: 'Container transition 0.25–0.75 s.',
    principle: 'Pill, call and timer states switch container size, corner radius and delayed content.',
    caution: 'Demonstrates interface language only; it never reads real calls or timer services.'
  },
  heatmap: {
    name: 'Contribution Wall',
    action: 'Hover to read; click to rewrite a life',
    param: 'Activity',
    paramDetail: 'Non-zero activity probability 0.15–0.85.',
    principle: 'A 26×7 grid is tinted column by column; hover/focus reads values and clicking regenerates simulated data.',
    caution: 'All contribution data is simulated; no GitHub connection.'
  },
  carbon: {
    name: 'Carbon-Style Rows',
    action: 'Click refresh / select a row',
    param: 'Stagger',
    paramDetail: 'Adjacent row delay 20–120ms.',
    principle: 'Rows enter with per-row delays on refresh, and the selected row is emphasized with a left marker and semantic state.',
    caution: 'A local demo table; no business API is called.'
  },
  blockeditor: {
    name: 'Block State Editor',
    action: 'Edit / add / remove / reorder / undo',
    param: 'Named parameters',
    paramDetail: 'See the named parameter table below.',
    principle: 'Add, delete and reorder text blocks while keeping stable block IDs and local undo.',
    caution: 'Plain-text textarea; memory only, up to 30 history entries and 240 characters per block.',
    params: {
      limit: { label: 'Block limit' },
      kind: { label: 'New block type', options: { text: 'Paragraph', heading: 'Heading', quote: 'Quote' } }
    }
  },
  taskboard: {
    name: 'Cancellable Tasks',
    action: 'Start / cancel / retry',
    param: 'Named parameters',
    paramDetail: 'See the named parameter table below.',
    principle: 'A finite state machine of queued, running, failed, canceled, retrying and done.',
    caution: 'Locally simulated tasks with no network or real backend; leaving the viewport cancels the running one and does not auto-restart.',
    params: {
      duration: { label: 'Phase duration' },
      failure: { label: 'Fault injection', options: { none: 'None', 2: 'Fail in phase two' } }
    }
  },
  localcursors: {
    name: 'Local Cursor Simulation',
    action: 'Adjust latency / pause to observe',
    param: 'Named parameters',
    paramDetail: 'See the named parameter table below.',
    principle: 'Three locally simulated collaborator cursors and selections show latency, jitter and interpolation.',
    caution: 'All three cursors are local simulations; the queue holds up to 96 entries and sequence numbers reject stale packets.',
    params: {
      latency: { label: 'Simulated latency' },
      jitter: { label: 'Simulated jitter' },
      loss: { label: 'Simulated packet loss' }
    }
  }
})