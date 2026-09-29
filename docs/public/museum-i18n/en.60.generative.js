/*
 * OUTLINE museum · English exhibit data — Generative Art (generative)
 */
window.OUTLINE_I18N = window.OUTLINE_I18N || {}
window.OUTLINE_I18N.exhibits = window.OUTLINE_I18N.exhibits || {}

Object.assign(window.OUTLINE_I18N.exhibits, {
  particles: {
    name: 'Constellation',
    action: 'Move the pointer',
    param: 'Links',
    principle: 'Particles drift slowly; point pairs closer than a threshold draw translucent links by distance.',
    caution: 'Pair detection is O(n²); cap the particle count.'
  },
  flow: {
    name: 'Flow Field',
    action: 'Click to change style',
    param: 'Curvature',
    principle: 'A direction field is kept; thread mode advances 70 persistent particles along it while an offscreen canvas decays trails exponentially.',
    caution: 'Trail buffer max 900×600; particle life 5s and single-frame step capped at 0.04s. Replay, mode/seed change or resize clears trails; pause freezes.',
    params: {
      mode: { label: 'Render mode', options: { vectors: 'Vectors', threads: 'Threads' } }
    }
  },
  rings: {
    name: 'Contour Echoes',
    action: 'Move the pointer',
    param: 'Perturbation',
    principle: 'Angular noise is added at several concentric radii to produce contour textures.',
    caution: 'Keep radii spaced to reduce aliasing.'
  },
  rose: {
    name: 'Rhodonea',
    action: 'Click to change color',
    param: 'Petals',
    principle: 'The polar equation r=cos(kθ) draws a rose curve.',
    caution: 'The slider controls an integer petal parameter; the sample cap is fixed.'
  },
  noise: {
    name: 'Pixel Weather',
    action: 'Click to change color',
    param: 'Scale',
    principle: 'Spatial sine waves combine into an approximate continuous noise mapped to grid colors.',
    caution: 'A procedural wave field; it does not claim to be standard Perlin noise.'
  },
  tree: {
    name: 'Fractal Tree',
    action: 'Move the pointer',
    param: 'Fork',
    principle: 'Recursive branches shorten each level, with angle controlling the canopy shape.',
    caution: 'Limit recursion depth to avoid exponential growth.'
  },
  voronoi: {
    name: 'Cellular Garden',
    action: 'Click to seed',
    param: 'Spread',
    principle: 'Each seed is clipped by perpendicular bisectors from the canvas rectangle into Voronoi polygons.',
    caution: 'Exact half-plane clipping with few seeds keeps the cost manageable.'
  },
  spiro: {
    name: 'Spirograph',
    action: 'Click to change color',
    param: 'Gear ratio',
    principle: 'Two circular motions at different frequencies combine into hypotrochoid-style patterns.',
    caution: 'A fixed sample budget; changing parameters redraws directly.'
  },
  rain: {
    name: 'Digital Rain',
    action: 'Click to toggle',
    param: 'Density',
    principle: 'Each column keeps its own phase and draws a bright-to-dark character trail.',
    caution: 'Character count is capped by the density limit.'
  },
  terrain: {
    name: 'Wireframe Terrain',
    action: 'Move the pointer',
    param: 'Relief',
    principle: 'A height wave function is sampled on a regular grid and perspective-projected.',
    caution: 'Clip near and far ranges so the projection denominator never reaches zero.'
  },
  reaction: {
    name: 'Reaction Diffusion',
    action: 'Click to seed',
    param: 'Feed',
    principle: 'Gray–Scott two-component equations, a discrete Laplacian and ping-pong buffers iterate into patterns.',
    caution: 'The grid is fixed at 80×56; the feed parameter affects later evolution and never silently recomputes while paused. Not a chemical prediction.'
  },
  life: {
    name: 'Conway’s Garden',
    action: 'Click cells / step',
    param: 'Initial density',
    principle: 'A finite torus grid evolves by Conway B3/S23, reading only the old state and writing the new one.',
    caution: 'Changing density reseeds; single-step still works while paused.'
  },
  truchet: {
    name: 'Truchet Tiles',
    action: 'Click to reshuffle',
    param: 'Tile size',
    principle: 'Each cell randomly picks a pair of quarter-arc directions, forming endlessly connected curves.',
    caution: 'A fixed random seed keeps a layout reproducible when resized.'
  },
  asciitorus: {
    name: 'ASCII Torus',
    action: 'Rotate / change the character grid',
    param: 'Named parameters',
    paramDetail: 'See the named parameter table below.',
    principle: 'Normals, projection, depth and brightness map onto a character grid, rendering a 3D form in plain text.',
    caution: 'Fixed sample budget, at most 72×32 characters, refreshed at up to 12 Hz; the character image is not WebGL.',
    params: {
      columns: { label: 'Character columns' },
      rotation: { label: 'Rotation speed' },
      ramp: { label: 'Character ramp', options: { soft: 'Fine', block: 'Geometric' } }
    }
  },
  boids: {
    name: 'Flocking Laboratory',
    action: 'Tune forces / reset / step',
    param: 'Named parameters',
    paramDetail: 'See the named parameter table below.',
    principle: 'Separation, alignment and cohesion drive the flock; it is not a pre-baked sine path.',
    caution: 'Up to 96 particles with O(n²) neighborhoods; fixed seed, synchronized old-state computation, speed and force caps.',
    params: {
      separation: { label: 'Separation' },
      alignment: { label: 'Alignment' },
      cohesion: { label: 'Cohesion' },
      radius: { label: 'Neighbor radius' },
      count: { label: 'Population' }
    }
  },
  sandwater: {
    name: 'Sand and Water Cells',
    action: 'Draw / material / step',
    param: 'Named parameters',
    paramDetail: 'See the named parameter table below.',
    principle: 'Draw sand, water or walls and watch discrete movement and local rules under gravity.',
    caution: 'A closed 64×40 grid; sand and water can swap, walls do not move, and drawing replaces material. Not a fluid mechanics model.',
    params: {
      material: { label: 'Material', options: { sand: 'Sand', water: 'Water', wall: 'Wall', erase: 'Eraser' } },
      brush: { label: 'Brush radius' },
      rate: { label: 'Steps per second' }
    }
  },
  clothsolver: {
    name: 'Constraint Cloth',
    action: 'Drag nodes / wind / step',
    param: 'Named parameters',
    paramDetail: 'See the named parameter table below.',
    principle: 'Grid particles, distance constraints, pinned points and draggable nodes together form a wind-blown cloth.',
    caution: 'Verlet with 17×11 particles and distance constraints; no self-collision, tearing or rigid-body collision.',
    params: {
      wind: { label: 'Wind' },
      gravity: { label: 'Gravity' },
      iterations: { label: 'Constraint iterations' },
      pins: { label: 'Pins', options: { corners: 'Two corners', edge: 'Top edge' } }
    }
  },
  wavefield: {
    name: 'Propagating Wave Field',
    action: 'Click to inject / dual source / step',
    param: 'Named parameters',
    paramDetail: 'See the named parameter table below.',
    principle: 'A discrete wave equation produces propagation, interference and boundary reflection, not just several expanding rings.',
    caution: '64×40 discrete wave equation; wave speed ≤0.65 satisfies the 2D grid stability bound. No acoustic unit calibration.',
    params: {
      speed: { label: 'Discrete wave speed' },
      damping: { label: 'Velocity damping' },
      strength: { label: 'Source strength' },
      boundary: { label: 'Boundary', options: { fixed: 'Fixed edge', free: 'Free edge' } }
    }
  }
})