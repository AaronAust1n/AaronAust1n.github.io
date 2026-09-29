/*
 * OUTLINE museum · English exhibit data — Type Experiments (type)
 */
window.OUTLINE_I18N = window.OUTLINE_I18N || {}
window.OUTLINE_I18N.exhibits = window.OUTLINE_I18N.exhibits || {}

Object.assign(window.OUTLINE_I18N.exhibits, {
  decode: {
    name: 'Text Decryption',
    action: 'Click to decode',
    param: 'Rounds',
    principle: 'Target characters lock in one by one while the rest are sampled from a random pool.',
    caution: 'Screen readers read the stable target text, not the random characters.'
  },
  marquee: {
    name: 'Infinite Marquee',
    action: 'Press to pause',
    param: 'Spacing',
    principle: 'The same text is duplicated and translated in a seamless loop.',
    caution: 'Repeated copies should be aria-hidden.'
  },
  outline: {
    name: 'Outline Typography',
    action: 'Move the pointer',
    param: 'Stroke',
    principle: 'Outlined and solid text overlap; a circular clip reveals the filled layer.',
    caution: 'Keep the underlying text readable at all times.'
  },
  split: {
    name: 'Letter Playground',
    action: 'Move the pointer',
    param: 'Scatter',
    principle: 'Each letter measures its distance to the pointer and gets an elastic offset and rotation.',
    caution: 'Provide one complete readable label for the text content.'
  },
  typewriter: {
    name: 'Typewriter Moment',
    action: 'Click to change sentence',
    param: 'Pause',
    principle: 'Accumulated time drives a state machine of typing, holding and backspacing.',
    caution: 'Reduced motion shows the full sentence.'
  },
  kinetic: {
    name: 'Kinetic Type',
    action: 'Move the pointer',
    param: 'Amplitude',
    principle: 'Each character gets a sine displacement with a different phase.',
    caution: 'Display only; not for long-form reading.'
  },
  gradienttext: {
    name: 'Chromatic Letters',
    action: 'Move the pointer',
    param: 'Color distance',
    principle: 'background-clip:text clips a live gradient inside the glyphs.',
    caution: 'Falls back to solid color when text clipping is unsupported.'
  },
  textshadow: {
    name: 'Extruded Type',
    action: 'Move the pointer',
    param: 'Depth',
    principle: 'Layered, progressively offset text-shadows simulate extruded letterforms.',
    caution: 'Cap the shadow layers to control paint cost.'
  },
  scramble: {
    name: 'Word Shuffle',
    action: 'Click to change word',
    param: 'Speed',
    principle: 'Characters swap within a time limit, then settle into the next target word.',
    caution: 'The stage avoids aria-live so every change is not announced.'
  },
  typepath: {
    name: 'Circular Verse',
    action: 'Click to reverse',
    param: 'Radius',
    principle: 'SVG textPath arranges text on a circular path and rotates as a whole.',
    caution: 'Path IDs must be unique per instance.'
  },
  pixeltype: {
    name: 'Pixel Lettering',
    action: 'Click to change glyph',
    param: 'Grain',
    principle: 'The grid dot matrix is kept; particle mode stores positions, re-pairs targets after a glyph change, and converges exponentially.',
    caution: 'Local sampling of system fonts; up to 1100 particles, and pause or reduced motion completes instantly.',
    params: {
      mode: { label: 'Glyph mode', options: { dots: 'Original dot matrix', particles: 'Particle reassembly' } },
      settle: { label: 'Settle rate' }
    }
  },
  curtain: {
    name: 'Type Curtain',
    action: 'Click to reveal',
    param: 'Stagger',
    principle: 'Each line sits in its own clipping window, with delays mapping vertical position and opacity.',
    caution: 'With reduced motion, clicking shows the full text immediately.'
  },
  broadsheet: {
    name: 'Broadsheet',
    action: 'Click the headline to change; hover paragraphs for a highlighter',
    param: 'Column gap',
    paramDetail: 'Multi-column gap 6–22px.',
    principle: 'A double-rule masthead, multi-column body and drop cap form a newspaper structure, with rotating headlines.',
    caution: 'Headlines are fictional museum news, not real reporting.'
  },
  underlines: {
    name: 'Twelve Underlines',
    action: 'Hover one by one',
    param: 'Line width',
    paramDetail: 'Line thickness 1–4px.',
    principle: 'Twelve independent hover/focus grammars show slide-in, rise, wave, inverse, brackets and arrows.',
    caution: 'On touch, tapping toggles a locked state; keyboard focus works too.'
  },
  vertical: {
    name: 'Vertical CJK',
    action: 'Hover a verse to show its note',
    param: 'Line gap',
    paramDetail: 'Vertical column gap 8–26px.',
    principle: 'vertical-rl arranges text and vermilion rules; hovering or focusing a verse shows a local note.',
    caution: 'Does not depend on external CJK fonts.'
  },
  shapewrap: {
    name: 'Shape Outside',
    action: 'Click the island to morph it',
    param: 'Island size',
    paramDetail: 'Island width takes 30–52% of the container.',
    principle: 'The float shape-outside switches between circle, inset and ellipse, and the body text reflows.',
    caution: 'Degrades to a normal float when the CSS is unsupported.'
  },
  dropcap: {
    name: 'Illuminated Initial',
    action: 'Hover the initial',
    param: 'Cap size',
    paramDetail: 'Initial size clamp(32px, (10+4A)cqw, 110px), about three lines by default.',
    principle: 'A large initial floats across several lines; hover/focus adds a stroke and a gold accent to strengthen the glyph.',
    caution: 'The real glyph depends on local fonts.'
  },
  counters: {
    name: 'CSS Counters',
    action: 'Add / remove chapters',
    param: 'Layer gap',
    paramDetail: 'Chapter gap 3–12px.',
    principle: 'CSS counters renumber Roman numerals automatically after chapters are added or removed.',
    caution: 'At most 8 chapters and at least 1; numbers are not hard-coded JS text.'
  },
  hanging: {
    name: 'Hanging Punctuation',
    action: 'Toggle to compare',
    param: 'Hang amount',
    paramDetail: 'Quotes shift out 0.42–0.82em.',
    principle: 'The toggle controls a negative quote margin while a fixed baseline shows the text-block edge shift.',
    caution: 'An observable CSS typography approximation; it does not rely on the experimental hanging-punctuation property.'
  },
  glitch: {
    name: 'Glitch Burst',
    action: 'Click to stage a signal accident',
    param: 'Slices',
    paramDetail: 'Slice shift 2–12px.',
    principle: 'A click triggers a bounded burst of RGB ghosts and sliced displacement, then restores stable text.',
    caution: 'Lasts about 0.5 s; it never flickers endlessly on its own.'
  }
})