/*
 * OUTLINE museum · English exhibit data — Pointer & Touch (pointer)
 */
window.OUTLINE_I18N = window.OUTLINE_I18N || {}
window.OUTLINE_I18N.exhibits = window.OUTLINE_I18N.exhibits || {}

Object.assign(window.OUTLINE_I18N.exhibits, {
  magnet: {
    name: 'Magnetic Button',
    action: 'Approach / click',
    param: 'Magnetism',
    principle: 'The distance from pointer to button center drives an attraction offset within a limited range.',
    caution: 'Keep real button semantics and keyboard activation.'
  },
  ripple: {
    name: 'Ripple Echo',
    action: 'Click the canvas',
    param: 'Spread',
    principle: 'Each click stores time and position; every frame expands a ring and fades it.',
    caution: 'Delete expired ripples promptly and cap the count.'
  },
  trail: {
    name: 'Comet Trail',
    action: 'Move the pointer',
    param: 'Trail length',
    principle: 'Pointer history points are connected with decreasing radius and opacity.',
    caution: 'Cap history length to avoid an unbounded array.'
  },
  elastic: {
    name: 'Elastic Drag',
    action: 'Drag the dot',
    param: 'Elasticity',
    principle: 'Spring acceleration and damping are integrated to simulate the rebound after release.',
    caution: 'Use pointer capture and release listeners on destroy.'
  },
  tilt: {
    name: 'Hover Tilt',
    action: 'Move the pointer',
    param: 'Tilt',
    principle: 'Normalized pointer coordinates map to rotateX and rotateY.',
    caution: 'Do not auto-rotate when motion is reduced.'
  },
  scratch: {
    name: 'Scratch to Reveal',
    action: 'Press and scratch',
    param: 'Brush',
    principle: 'destination-out erases the cover canvas along the path, revealing the text beneath.',
    caution: 'Set touch-action:none so gestures do not interrupt; replay restores the cover.'
  },
  eyes: {
    name: 'Curious Eyes',
    action: 'Move the pointer',
    param: 'Sight range',
    principle: 'The pointer direction vector is clamped to the eye-white radius to place both pupils.',
    caution: 'Never let pupils leave the eye-white bounds.'
  },
  repel: {
    name: 'Repulsion Field',
    action: 'Move the pointer',
    param: 'Radius',
    principle: 'Particles shift away by distance from the pointer, then ease back to the grid.',
    caution: 'Guard against zero distance to avoid division by zero.'
  },
  connect: {
    name: 'Connect the Dots',
    action: 'Click in order',
    param: 'Tolerance',
    principle: 'Selected node indices are stored; drawn paths and the next-node hint follow.',
    caution: 'Provide an ordered connect button for keyboard users.'
  },
  cursor: {
    name: 'Elastic Cursor',
    action: 'Move the pointer',
    param: 'Lag',
    principle: 'Several rings chase the pointer at different interpolation speeds for a delayed follow.',
    caution: 'Never hide the system cursor; keep it usable.'
  },
  metaballs: {
    name: 'Metaball Touch',
    action: 'Move the pointer',
    param: 'Viscosity',
    principle: 'Inverse-square distance fields from several centers are summed and thresholded into a merged outline.',
    caution: 'The low-resolution field is smoothed up; it is not a fluid solver.'
  },
  doodle: {
    name: 'Draw & Replay',
    action: 'Draw / replay',
    param: 'Stroke width',
    principle: 'Normalized stroke coordinates and relative times are recorded and rebuilt over time, with undo and clear.',
    caution: 'Cap points and strokes; end strokes on pointer cancel and never upload data.'
  },
  snapgrid: {
    name: 'Snap to Grid',
    action: 'Drag / arrow keys',
    param: 'Grid step',
    principle: 'Dragging follows the pointer continuously; release quantizes to the grid, and arrow keys move cell by cell.',
    caution: 'Use local coordinates and pointer capture, clamped to the grid bounds.'
  }
})