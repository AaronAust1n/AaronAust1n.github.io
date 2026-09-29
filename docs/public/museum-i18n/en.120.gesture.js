/*
 * OUTLINE museum · English exhibit data — Gesture & Haptics (gesture)
 */
window.OUTLINE_I18N = window.OUTLINE_I18N || {}
window.OUTLINE_I18N.exhibits = window.OUTLINE_I18N.exhibits || {}

Object.assign(window.OUTLINE_I18N.exhibits, {
  pullrefresh: {
    name: 'Pull to Refresh',
    action: 'Pull the list and release',
    param: 'Threshold',
    paramDetail: 'Trigger distance 50–110px.',
    principle: 'Damped drag displacement drives a rotating indicator; past the threshold and released, it rests at a loading position, then resets.',
    caution: 'Data is added locally; a refresh button is the keyboard alternative.'
  },
  swipepage: {
    name: 'Swipe Paging',
    action: 'Drag / fling the cards',
    param: 'Snap',
    paramDetail: 'Snap time 0.25–0.65 s.',
    principle: 'Displacement plus release velocity decides the target page; a spring transition snaps and updates the dots.',
    caution: 'Only a local region is captured; previous/next buttons remain.'
  },
  bottomsheet: {
    name: 'Three-Stop Sheet',
    action: 'Drag the handle',
    param: 'Damping',
    paramDetail: 'Transition 0.2–0.6 s.',
    principle: 'The nearest stop and release velocity choose among 70%, 38% and 4% positions.',
    caution: 'Drag the handle or pick a stop directly; the local sheet never covers the whole site.'
  },
  edgeback: {
    name: 'Edge Back',
    action: 'Drag right from the left edge',
    param: 'Threshold',
    paramDetail: 'Completion threshold is 0.3–0.7 of the width.',
    principle: 'Only gestures starting within 28px of the left edge count; dragging reveals the previous page and past the threshold returns, otherwise it resets.',
    caution: 'State stays inside the stage; browser history is untouched.'
  },
  haptics: {
    name: 'Haptic Patterns',
    action: 'Click the six patterns',
    param: 'Amplitude',
    paramDetail: 'Visual amplitude 0.08–0.30.',
    principle: 'Six pulse groups drive circular feedback through amplitude, count and interval, with optional device vibration.',
    caution: 'Vibration is off by default; without navigator.vibrate it is a visual demo only.'
  },
  pinch: {
    name: 'Pinch Around a Point',
    action: 'Two-finger / wheel zoom, drag to pan',
    param: 'Named parameters',
    paramDetail: 'Uses the named parameters below; physical quantities are no longer merged into one percentage.',
    principle: 'Two pointers and the initial world anchor are recorded; the distance ratio sets zoom and the anchor follows the pointer center; changing the pointer count rebuilds the baseline.',
    caution: 'Boundary clamping takes priority over anchor keeping; when the image is smaller than the window it centers. Keyboard +/−, arrow keys and 0 replace the gesture.',
    params: {
      minScale: { label: 'Minimum scale' },
      maxScale: { label: 'Maximum scale' },
      resetMs: { label: 'Reset time' }
    }
  },
  archive: {
    name: 'Drop into Place',
    action: 'Drag into a slot / select a card and press Move',
    param: 'Named parameters',
    paramDetail: 'Uses the named parameters below; physical quantities are no longer merged into one percentage.',
    principle: 'A drop first validates slot rules and updates real array ownership, then FLIPs the rectangles; illegal drops never change the model.',
    caution: 'Keyboard selection plus move buttons work. The floating clone is decoration only; replay, cancel and destroy remove it.',
    params: {
      policy: { label: 'Drop policy', options: { typed: 'By type', free: 'Free drop' } },
      duration: { label: 'Landing animation' },
      hitSlop: { label: 'Edge hit tolerance' }
    }
  },
  swipedelete: {
    name: 'Swipe, Remove, Undo',
    action: 'Swipe left / undo after deleting',
    param: 'Named parameters',
    paramDetail: 'Uses the named parameters below; physical quantities are no longer merged into one percentage.',
    principle: 'Dragging past a distance threshold commits deletion, the foreground slides out and the slot collapses; the model from before the last delete is kept for in-place undo.',
    caution: 'The undo window uses real time and is not extended by pausing the animation; deleting the same item twice does not commit again. Fictional items only.',
    params: {
      threshold: { label: 'Delete threshold' },
      undoSeconds: { label: 'Undo window' },
      autoDelete: { label: 'Long swipe deletes directly' },
      resistance: { label: 'Follow factor' }
    }
  },
  swipedecision: {
    name: 'Make a Gesture',
    action: 'Fling cards left or right / keep and skip',
    param: 'Named parameters',
    paramDetail: 'Uses the named parameters below; physical quantities are no longer merged into one percentage.',
    principle: 'Displacement or recent velocity together decide the choice; rotation and stamp feedback follow position, and the next card opens only after the exit finishes.',
    caution: 'One release commits once; pointercancel does not consume the card and every decision lives only inside this exhibit.',
    params: {
      distance: { label: 'Distance threshold' },
      velocity: { label: 'Fling threshold' },
      rotation: { label: 'Max tilt' }
    }
  },
  peekpop: {
    name: 'Peek, Hold, Pop',
    action: 'Hold to preview / release or move to cancel',
    param: 'Named parameters',
    paramDetail: 'Uses the named parameters below; physical quantities are no longer merged into one percentage.',
    principle: 'A sustained press advances the preview and, at the deadline, enters a separate expanded state; release, movement, blur or a broken lifecycle cancels unfinished operations.',
    caution: 'Driven by hold time, not hardware pressure. Enter/Space hold or a direct open button replace it; Escape closes the local preview first.',
    params: {
      holdMs: { label: 'Time to expand' },
      cancelRadius: { label: 'Move-cancel radius' },
      previewScale: { label: 'Preview scale' }
    }
  },
  rubberbound: {
    name: 'Elastic Boundaries',
    action: 'Drag the list / arrow-key scroll',
    param: 'Named parameters',
    paramDetail: 'Uses the named parameters below; physical quantities are no longer merged into one percentage.',
    principle: 'Drag beyond bounds is compressed by a bounded nonlinear function, then a fixed-step spring and damping return it to the valid range.',
    caution: 'A short list has zero scrollable distance yet still shows overscroll return; all scrolling stays inside the isolated region.',
    params: {
      elasticity: { label: 'Overscroll elasticity' },
      limit: { label: 'Overscroll cap' },
      damping: { label: 'Return damping ratio' },
      content: { label: 'List length', options: { long: 'Long list', short: 'Short list' } }
    }
  }
})