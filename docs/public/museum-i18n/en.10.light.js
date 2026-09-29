/*
 * OUTLINE museum · English exhibit data — Light & Material (light)
 * Part of /museum-i18n/. Keys match OUTLINE_DATA.exhibits[].key.
 */
window.OUTLINE_I18N = window.OUTLINE_I18N || {}
window.OUTLINE_I18N.exhibits = window.OUTLINE_I18N.exhibits || {}

Object.assign(window.OUTLINE_I18N.exhibits, {
  aurora: {
    name: 'Liquid Aurora',
    action: 'Move the pointer',
    param: 'Amplitude',
    principle: 'Layered sine curves stack translucent color bands; time and pointer offset shift the peaks.',
    caution: 'Limit sample points; avoid reading pixels every frame.'
  },
  glass: {
    name: 'Frosted Glass',
    action: 'Drag the glass',
    param: 'Blur',
    principle: 'backdrop-filter blurs the color blocks behind the glass, while a translucent border suggests thickness.',
    caution: 'Keep a translucent base color when backdrop-filter is unsupported.'
  },
  iridescent: {
    name: 'Iridescent Field',
    action: 'Move the pointer',
    param: 'Sheen',
    principle: 'The radial highlight follows the pointer; multi-color gradients approximate thin-film interference.',
    caution: 'A visual approximation, not a physical spectrum simulation.'
  },
  grain: {
    name: 'Analog Grain',
    action: 'Click to change color',
    param: 'Grain',
    principle: 'Random noise is generated on a low-resolution offscreen canvas, then blended with the gradient.',
    caution: 'Noise is generated once to avoid per-frame pixel cost.'
  },
  shadow: {
    name: 'Living Shadow',
    action: 'Move the light',
    param: 'Distance',
    principle: "The vector from pointer to object center sets the shadow's offset, blur and length.",
    caution: 'Clamp the shadow range to avoid oversized repaints.'
  },
  spotlight: {
    name: 'Spotlight',
    action: 'Move the pointer',
    param: 'Radius',
    principle: 'A radial mask follows the pointer to reveal a grid and lettering beneath.',
    caution: 'Touch uses drag; keep a dark outline outside the mask.'
  },
  chrome: {
    name: 'Liquid Chrome',
    action: 'Move the pointer',
    param: 'Warp',
    principle: 'High-contrast grayscale gradients stack, with a periodic curve shifting the metal bands.',
    caution: 'No remote textures; avoid high-frequency flicker.'
  },
  caustics: {
    name: 'Caustic Pool',
    action: 'Move the pointer',
    param: 'Refraction',
    principle: 'Several phase-shifted twisted line sets are drawn and screen-blended to approximate refracted light on water.',
    caution: 'Control line density and opacity.'
  },
  neon: {
    name: 'Neon Circuit',
    action: 'Click to power on',
    param: 'Brightness',
    principle: 'SVG strokes stack multiple glow filters; clicking toggles the powered state.',
    caution: 'Never simulate current with rapid on/off flashing.'
  },
  duotone: {
    name: 'Duotone Studio',
    action: 'Drag the divide',
    param: 'Contrast',
    principle: 'Two differently tinted layers are split by clip-path according to the pointer position.',
    caution: 'Keep the divider control visible.'
  },
  prism: {
    name: 'Prismatic Split',
    action: 'Move the incoming light',
    param: 'Dispersion',
    principle: 'A beam of white light splits into colored rays at different exit angles; the prism is built from stacked translucent triangles.',
    caution: 'A 2D diagram; it does not simulate real refractive indices or spectra.'
  },
  halftone: {
    name: 'Halftone Press',
    action: 'Move the light spot',
    param: 'Dot grid',
    principle: 'A continuous light field is sampled on a regular grid and mapped to dot radii.',
    caution: 'Cap the dot spacing to avoid moiré on small screens.'
  },
  rgbmix: {
    name: 'Additive Light',
    action: 'Move / click',
    param: 'Beams',
    principle: 'Three colored discs are screen-blended; overlaps show additive mixing.',
    caution: 'Demonstrates screen additive light, not pigment subtractive mixing.'
  },
  brushed: {
    name: 'Brushed Aluminum',
    action: 'Drag the knob',
    param: 'Reflection',
    paramDetail: 'Reverse highlight multiplier 0.7–2.1.',
    principle: 'The knob angle drives both reverse-direction conic reflections and the value; pointer capture allows continuous dragging.',
    caution: 'Arrow keys supported; the material is a gradient approximation.'
  },
  inkwash: {
    name: 'Ink on Paper',
    action: 'Click the paper to drop ink',
    param: 'Diffusion',
    paramDetail: 'Ink diffusion radius 12–48px.',
    principle: 'Each drop spawns 34 diffusion particles with bounded lifetimes, easing radius and fading opacity.',
    caution: 'Keep at most 16 ink blobs to avoid unbounded growth.'
  },
  wax: {
    name: 'Wax Seal',
    action: 'Click the letter to seal',
    param: 'Press',
    paramDetail: 'Compression 0.04–0.22.',
    principle: 'An irregular seal drops from a scaled, rotated state and settles after compression.',
    caution: 'Replay by button or paper click; never reads uploaded images.'
  },
  kintsugi: {
    name: 'Kintsugi Repair',
    action: 'Click the bowl: crack, then gold',
    param: 'Branches',
    paramDetail: '3–8 main cracks.',
    principle: 'A random walk grows branched cracks; dark fractures appear first, then gold lines trace the same paths.',
    caution: 'Graphic storytelling only; it does not simulate material failure.'
  },
  velvet: {
    name: 'Velvet Nap',
    action: 'Stroke to leave a trace',
    param: 'Lay-down',
    paramDetail: 'Stroke radius 25–85px.',
    principle: 'Local fibers turn with the pointer direction, interpolate back upright, and brighten by direction.',
    caution: 'Frame-by-frame recovery is a visual approximation.'
  },
  refraction: {
    name: 'Refraction Bench',
    action: 'Adjust refractive index and incidence',
    param: 'Named parameters',
    paramDetail: 'See the named parameter table below.',
    principle: 'Reflection and refraction directions are computed from the refractive indices and incidence angle, showing the total internal reflection threshold.',
    caution: 'A 2D teaching diagram of Snell’s law and specular reflection; no Fresnel energy or dispersion.',
    params: {
      n1: { label: 'Incident medium n₁' },
      n2: { label: 'Transmitting medium n₂' },
      angle: { label: 'Incidence angle from normal' }
    }
  }
})