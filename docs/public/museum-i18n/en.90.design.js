/*
 * OUTLINE museum · English exhibit data — Design Language (design)
 */
window.OUTLINE_I18N = window.OUTLINE_I18N || {}
window.OUTLINE_I18N.exhibits = window.OUTLINE_I18N.exhibits || {}

Object.assign(window.OUTLINE_I18N.exhibits, {
  bauhaus: {
    name: 'Bauhaus Composition',
    action: 'Click the canvas to cycle three compositions',
    param: 'Composition scale',
    paramDetail: 'Geometry scales 0.75–1.15×.',
    principle: 'Circles, squares and triangles change together across three layouts; the button switches composition and updates the nameplate.',
    caution: 'A procedural homage; it does not claim to copy a specific historical work.'
  },
  enso: {
    name: 'Ma and Ensō',
    action: 'Redraw the ensō stroke; season words rotate every 5.2s',
    param: 'Dry brush',
    paramDetail: 'Stroke width and break threshold change together.',
    principle: 'Segmented arcs with deterministic breaks and grain replay the stroke by draw progress and rotate seasonal words.',
    caution: 'Season words are local text; no date or weather lookup.'
  },
  neubrutal: {
    name: 'Hard-Shadow Press',
    action: 'Press with a hard-shadow shift',
    param: 'Hard shadow',
    paramDetail: 'Hard shadow offset 4–12px.',
    principle: 'Thick borders, hard shadows and press displacement express real button states.',
    caution: 'The demo shows local state only and submits no data.'
  },
  maximal: {
    name: 'Maximal Confetti',
    action: 'Move the cursor to rain emoji',
    param: 'Density',
    paramDetail: 'Spawn interval 120–35ms, up to 90 particles.',
    principle: 'Throttled pointer input spawns limited shapes that spin and fall with initial velocity and gravity.',
    caution: 'The system cursor stays; reduced motion stops auto-falling.'
  },
  construct: {
    name: 'Constructivist Stage',
    action: 'Click to recompose',
    param: 'Tilt',
    paramDetail: 'Main diagonal tilt 10–45°.',
    principle: 'Red wedges, circles and black bars ease uniformly between random target layouts.',
    caution: 'Compositions are generated procedurally and do not impersonate historical originals.'
  },
  mondrian: {
    name: 'Mondrian Partition',
    action: 'Click to repartition',
    param: 'Split',
    paramDetail: 'Split count 4–10, default 7.',
    principle: 'Repeated binary splits carve the rectangle, assign primary color blocks and cross-fade them.',
    caution: 'Not random placement pretending to be a non-overlapping grid.'
  },
  memphis: {
    name: 'Memphis Dice',
    action: 'Click to reroll',
    param: 'Density',
    paramDetail: 'Visible vocabulary 10–28.',
    principle: 'Waves, dots, geometric blocks and patterns combine by seed; clicking generates a new image.',
    caution: 'Zero bitmaps; every pattern is drawn on canvas.'
  },
  deco: {
    name: 'Art Deco Fan',
    action: 'Click to unfold the golden fan',
    param: 'Fan spread',
    paramDetail: 'Unfold angle 32–78°.',
    principle: '13 gold lines open one by one with their own angles and time delays.',
    caution: 'Replay by button; no rapid flashing.'
  },
  poster: {
    name: 'Swiss Poster',
    action: 'Click to re-lay a poster',
    param: 'Type size',
    paramDetail: 'Headline size 12–24% of the container.',
    principle: 'Four palettes, geometric forms and headline positions re-arrange with the same easing.',
    caution: 'Procedural composition; no brand poster assets are used.'
  }
})