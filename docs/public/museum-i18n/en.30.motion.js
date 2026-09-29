/*
 * OUTLINE museum · English exhibit data — Motion & Rhythm (motion)
 */
window.OUTLINE_I18N = window.OUTLINE_I18N || {}
window.OUTLINE_I18N.exhibits = window.OUTLINE_I18N.exhibits || {}

Object.assign(window.OUTLINE_I18N.exhibits, {
  orbit: {
    name: 'Orbital Rhythm',
    action: 'Click to reverse',
    param: 'Orbits',
    principle: 'Sine and cosine generate elliptical paths; different periods create orbital resonance.',
    caution: 'Orbit count is capped to control drawing cost.'
  },
  spring: {
    name: 'Spring Study',
    action: 'Click to bounce',
    param: 'Damping',
    principle: 'A second-order spring equation updates displacement and velocity each frame.',
    caution: 'Clamp the time step so returning to the tab does not destabilize it.'
  },
  wave: {
    name: 'Sine Choreography',
    action: 'Move the pointer',
    param: 'Frequency',
    principle: 'A row of bars offsets phase by index, producing a continuously traveling wave.',
    caution: 'Never rebuild DOM nodes every frame.'
  },
  loader: {
    name: 'The Art of Waiting',
    action: 'Click to change speed',
    param: 'Tempo',
    principle: 'Equally spaced dots scale and fade by phase, forming a circular rhythm.',
    caution: 'An animation exhibit only; it never fakes real loading progress.'
  },
  morph: {
    name: 'Organic Morph',
    action: 'Click to change shape',
    param: 'Morph',
    principle: 'A periodic radial perturbation in polar coordinates draws a continuous organic outline.',
    caution: 'Keep the outline sample count moderate.'
  },
  pendulum: {
    name: 'Pendulum Waves',
    action: 'Click to reset',
    param: 'Detune',
    principle: 'Pendulums of different frequencies start together and gradually form converging patterns.',
    caution: 'A visual demo, not for precise physics computation.'
  },
  path: {
    name: 'Along the Path',
    action: 'Move the pointer',
    param: 'Path',
    principle: 'Position and tangent angle are sampled along a parametric figure-eight curve.',
    caution: 'Path progress is governed by the lab global speed.'
  },
  stagger: {
    name: 'Staggered Bloom',
    action: 'Click to replay',
    param: 'Delay',
    principle: 'Each grid cell gets a phase offset, forming a scaling wave that spreads from the center.',
    caution: 'Reduced motion shows a static composition.'
  },
  flipclock: {
    name: 'Flip Counter',
    action: 'Click to add one',
    param: 'Step',
    principle: 'Digits rotate with light and shadow changes to simulate a flip when updating.',
    caution: 'An interactive counter; it never reads or imitates system time.'
  },
  equalizer: {
    name: 'Silent Equalizer',
    action: 'Click to change rhythm',
    param: 'Amplitude',
    principle: 'Several frequency layers drive bar heights, evoking a music equalizer.',
    caution: 'There is no audio input; it must not be called a real spectrum.'
  },
  easingrace: {
    name: 'Easing Race',
    action: 'Click to rerun',
    param: 'Curve',
    principle: 'Bisection solves x(t) to compare linear, ease-in, ease-out, ease-in-out and back overshoot.',
    caution: 'X control points stay monotonic; back may overshoot vertically, so the track leaves room.',
    params: {
      duration: { label: 'Uniform duration' }
    }
  },
  domino: {
    name: 'Domino Cadence',
    action: 'Click to reverse',
    param: 'Spacing',
    principle: 'Each tile rotateX is delayed by index, creating a continuous topple and reset rhythm.',
    caution: 'A layout animation, not a rigid-body collision simulation.'
  },
  anticipation: {
    name: 'Ready, Set, Go',
    action: 'Click to launch both rockets',
    param: 'Anticipation',
    paramDetail: 'Anticipation time 0.15–0.65 s.',
    principle: 'Left and right rockets launch together; the right one crouches backwards first, then leaves with exhaust.',
    caution: 'Motion choreography, not a rocket physics model.'
  },
  iconmorph: {
    name: 'Icon Morph',
    action: 'Click ▶⇌⏸ and ☰⇌✕',
    param: 'Duration',
    paramDetail: 'Morph time 0.2–0.9 s.',
    principle: 'Matching-vertex clip-paths interpolate between play and pause, and three menu lines combine into a close cross.',
    caution: 'Both control sets keep button semantics and state.'
  },
  shared: {
    name: 'Shared Element FLIP',
    action: 'Click a thumbnail to fly into the detail area',
    param: 'Flight time',
    paramDetail: 'Flight time 0.3–1.2 s.',
    principle: 'Thumbnail and detail rectangles are read, then a fixed clone interpolates to the target with an inverse transform.',
    caution: 'Closing or replaying removes the clone immediately; it never stays on the page.'
  },
  skeleton: {
    name: 'Skeleton Choreography',
    action: 'Click reload',
    param: 'Load time',
    paramDetail: 'Demo wait 0.7–2.1 s.',
    principle: 'A local loading state sweeps first, then reveals real content row by row.',
    caution: 'A clearly labeled loading demo; it never sends network requests.'
  },
  inertia: {
    name: 'Throw, Glide, Collide',
    action: 'Drag and fling the dot / launch with the button',
    param: 'Named parameters',
    paramDetail: 'Uses the named parameters below; physical quantities are no longer merged into one percentage.',
    principle: 'Recent pointer samples estimate release velocity; a fixed step applies exponential friction, and collisions reflect the normal velocity.',
    caution: 'Local coordinates handle lab scaling and speed is capped. A teaching simulation, not precise material collision.',
    params: {
      friction: { label: 'Friction decay' },
      restitution: { label: 'Collision restitution' },
      maxSpeed: { label: 'Speed cap' }
    }
  },
  squash: {
    name: 'Same Motion, Different Feel',
    action: 'Drop again / step while paused',
    param: 'Named parameters',
    paramDetail: 'Uses the named parameters below; physical quantities are no longer merged into one percentage.',
    principle: 'Both balls share one gravity and collision state; only the right outline gets velocity stretch and landing squash, keeping the scale product at one.',
    caution: 'Compares the same physical path; the outline anchors at the contact point, so the visual center may shift slightly. Fixed-step budget, not a physics accuracy claim.',
    params: {
      gravity: { label: 'Gravity' },
      bounce: { label: 'Restitution' },
      deform: { label: 'Max squash' },
      repeat: { label: 'Auto repeat' }
    }
  },
  originwipe: {
    name: 'Origin Wipe',
    action: 'Click the scene / the wipe button',
    param: 'Named parameters',
    paramDetail: 'See the named parameter table below.',
    principle: 'A mask expands from the click point to hand over between two complete scenes.',
    caution: 'Fast input replaces the pending target with the last click; hidden layers contain no controls.',
    params: {
      duration: { label: 'Wipe duration' },
      shape: { label: 'Mask shape', options: { circle: 'Circle', diamond: 'Diamond' } }
    }
  },
  odometer: {
    name: 'Continuous Odometer',
    action: '±1 / target number',
    param: 'Named parameters',
    paramDetail: 'See the named parameter table below.',
    principle: 'Digits advance and retreat along a loop band, supporting carry, borrow and cyclic return rather than the existing flip counter.',
    caution: 'Value is limited to 0–999 and buttons wrap across bounds; the final accessible value shows during animation and is announced once at the end.',
    params: {
      target: { label: 'Target value' },
      duration: { label: 'Roll duration' },
      stagger: { label: 'Per-digit stagger' }
    }
  }
})