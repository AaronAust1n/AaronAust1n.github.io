/*
 * OUTLINE museum · English exhibit data — Space & Layout (space)
 */
window.OUTLINE_I18N = window.OUTLINE_I18N || {}
window.OUTLINE_I18N.exhibits = window.OUTLINE_I18N.exhibits || {}

Object.assign(window.OUTLINE_I18N.exhibits, {
  flip: {
    name: 'Two Sides',
    action: 'Click to flip',
    param: 'Perspective',
    principle: 'preserve-3d and backface-visibility build a two-sided card.',
    caution: 'Avoid residual focusable controls when the back is hidden.'
  },
  cube: {
    name: 'Spatial Cube',
    action: 'Drag to rotate',
    param: 'Size',
    principle: 'Six planes are translated and rotated along 3D axes to form a CSS cube.',
    caution: 'Limit rotation speed to reduce dizziness.'
  },
  stack: {
    name: 'Layered Stories',
    action: 'Click to switch',
    param: 'Layer gap',
    principle: 'The index computes each card vertical offset, scale and stacking order.',
    caution: 'Visual order and click targets must agree.'
  },
  portal: {
    name: 'Infinite Portal',
    action: 'Move the pointer',
    param: 'Depth',
    principle: 'Repeated rectangles scale, rotate and fade with depth to create a tunnel illusion.',
    caution: 'Avoid fast, high-contrast scaling.'
  },
  isometric: {
    name: 'Isometric City',
    action: 'Click to rebuild',
    param: 'Height',
    principle: 'Isometric projection draws the top and side faces of 3D blocks onto a 2D canvas.',
    caution: 'Orthographic projection only, not a perspective camera.'
  },
  accordion: {
    name: 'Expanding Gallery',
    action: 'Click a panel',
    param: 'Expand',
    principle: 'flex-grow distributes space between the selected panel and the rest.',
    caution: 'Use buttons and expose the selected state.'
  },
  parallax: {
    name: 'Parallax Landscape',
    action: 'Move the pointer',
    param: 'Parallax',
    principle: 'Foreground, middle and background respond to the pointer with different coefficients for depth.',
    caution: 'Scale the scene slightly so movement never reveals blank edges.'
  },
  perspective: {
    name: 'Vanishing Point',
    action: 'Move the pointer',
    param: 'Density',
    principle: 'Radiating lines are drawn from the edges to the pointer vanishing point, over a perspective horizon.',
    caution: 'Limit grid density and contrast.'
  },
  coverflow: {
    name: 'Cover Flow',
    action: 'Click a record',
    param: 'Angle',
    principle: 'Distance from the current index decides position, rotation, scale and layer.',
    caution: 'Previous/next buttons must support the keyboard.'
  },
  bento: {
    name: 'Bento Shuffle',
    action: 'Switch layouts / enable swap, then click a tile',
    param: 'Gap',
    paramDetail: 'The original gap stays 3–15px; interaction mode and swap duration are additional.',
    principle: 'Three bento layouts are kept by default; swap mode really exchanges tile order and interpolates to the new cells with First/Last/Invert/Play.',
    caution: 'A quick second swap starts from the current visible positions; cancel, resize or destroy removes the temporary transforms. The upgrade adds no exhibit count.',
    params: {
      interaction: { label: 'Interaction mode', options: { layout: 'Original layout switch', swap: 'FLIP swap' } },
      duration: { label: 'Swap time' }
    }
  },
  mobius: {
    name: 'One-Sided Surface',
    action: 'Move the viewpoint',
    param: 'Twist',
    principle: 'A half-twist band is sampled as a parametric surface, rotated, projected and drawn depth-sorted as a mesh.',
    caution: 'Software projection suits small meshes; it is not a general 3D renderer.'
  },
  book: {
    name: 'Paper Hinge',
    action: 'Click to open and close',
    param: 'Open',
    principle: 'preserve-3d and a left transform origin build a double-sided cover that rotates around the spine.',
    caution: 'Reduced motion switches state directly while keeping button semantics.'
  },
  layoutxray: {
    name: 'Layout X-ray',
    action: 'Change columns / container response',
    param: 'Named parameters',
    paramDetail: 'See the named parameter table below.',
    principle: 'The real text area and column boxes are shown, with an adjustable baseline overlay, so you can watch layout change with the container.',
    caution: 'Measurement uses offset sizes; the ruler is CSS pixels, not device pixels or a true font baseline.',
    params: {
      columns: { label: 'Columns' },
      gap: { label: 'Gap' },
      baseline: { label: 'Baseline step' },
      overlay: { label: 'Show X-ray' }
    }
  }
})