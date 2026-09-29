/*
 * OUTLINE museum · English exhibit data — Era Slices (eras)
 */
window.OUTLINE_I18N = window.OUTLINE_I18N || {}
window.OUTLINE_I18N.exhibits = window.OUTLINE_I18N.exhibits || {}

Object.assign(window.OUTLINE_I18N.exhibits, {
  win95: {
    name: 'Desktop 95',
    action: 'Drag windows; open the Start menu; shut down',
    param: 'Window scale',
    paramDetail: 'Window width 58–82%.',
    principle: 'Raised and sunken borders, a draggable title bar, a Start menu, and close/reopen form a desktop model.',
    caution: 'The taskbar shows local time; it is not a system emulator or file manager.'
  },
  aqua: {
    name: 'Aqua Study',
    action: 'Click Save; hover the traffic lights',
    param: 'Breathing',
    paramDetail: 'Button glow 3–16px.',
    principle: 'Striped panels, breathing Aqua buttons and traffic-light hover/focus build a retro interface.',
    caution: 'Save only changes demo feedback and writes no files.'
  },
  vhs: {
    name: 'VHS Tracking',
    action: 'Click PLAY⇌PAUSE',
    param: 'Noise',
    paramDetail: 'Noise band opacity 0.08–0.35.',
    principle: 'Scanning noise bands loop upward, and pause adds RGB misalignment and step jitter.',
    caution: 'Provides a low-motion static presentation and never makes high-contrast flashes.'
  },
  polaroid: {
    name: 'Polaroid Reveal',
    action: 'Press the shutter',
    param: 'Develop time',
    paramDetail: 'Development wait 1.5–4.5 s.',
    principle: 'A brief flash, then the paper ejects and a pure-CSS landscape gradually appears.',
    caution: 'No camera is accessed; the image is not a photo.'
  },
  teletext: {
    name: 'Teletext Page',
    action: 'Click to change page',
    param: 'Polling',
    paramDetail: 'Line delay 35–140ms.',
    principle: 'A mosaic page header and local body are generated; after a page change, lines appear one by one.',
    caution: 'Receives no broadcast or network news.'
  },
  flashintro: {
    name: 'Intro Ceremony',
    action: 'Wait for loading or click SKIP INTRO',
    param: 'Wait',
    paramDetail: 'Fake load time 1–4 s.',
    principle: 'When the demo percentage completes, the title bursts in; skipping and replaying are supported.',
    caution: 'Clearly an intro sample; it never fakes a backend request.'
  },
  grunge: {
    name: 'Grunge Collage',
    action: 'Hover elements to straighten them',
    param: 'Skew',
    paramDetail: 'Initial rotation 4–18°.',
    principle: 'Paper scraps, ticket stubs, tape and postmarks are built in CSS; hover/focus restores them upright and on top.',
    caution: 'All shapes are procedural graphics with original short lines.'
  },
  clickwheel: {
    name: 'Click Wheel',
    action: 'Circle the wheel to pick a song; press the center button',
    param: 'Sensitivity',
    paramDetail: 'Per-option angle threshold 0.55–0.18 rad.',
    principle: 'Angle deltas across ±π are corrected and accumulated; reaching a threshold moves the menu and the center button confirms.',
    caution: 'Arrow keys supported; no real music playback or device connection.'
  },
  filepanels: {
    name: 'Twin-Panel Files',
    action: 'Arrow keys / copy / move',
    param: 'Named parameters',
    paramDetail: 'See the named parameter table below.',
    principle: 'Two local fictional directory models support keyboard navigation, panel switching, copy and move.',
    caution: 'Only fictional file models; no real files are touched, F5 is not bound, and Tab can leave.',
    params: {
      sort: { label: 'Sort', options: { name: 'Name', size: 'Size' } },
      conflict: { label: 'Conflict policy', options: { skip: 'Skip', rename: 'Auto rename' } }
    }
  }
})