/*
 * OUTLINE museum · English exhibit data — Sound & Vision (audio)
 */
window.OUTLINE_I18N = window.OUTLINE_I18N || {}
window.OUTLINE_I18N.exhibits = window.OUTLINE_I18N.exhibits || {}

Object.assign(window.OUTLINE_I18N.exhibits, {
  spectrum: {
    name: 'Live Spectrum',
    action: 'Click to play an arpeggio',
    param: 'Volume',
    paramDetail: 'Exhibit-local gain 0.03–0.15, then a safe master volume.',
    principle: 'A synthesized arpeggio runs through a real AnalyserNode FFT to draw 40 spectrum bars with peak caps.',
    caution: 'Sound starts only on first click; no microphone, and audio stops when off-screen or paused.'
  },
  oscilloscope: {
    name: 'Oscilloscope',
    action: 'Click the four waveform buttons',
    param: 'Frequency',
    paramDetail: 'Base frequency 80–600Hz.',
    principle: 'Four Oscillator waveforms are selected and drawn from real getByteTimeDomainData.',
    caution: 'Switching waveforms can change loudness; output passes through bus dynamic compression.'
  },
  piano: {
    name: 'Synth Piano',
    action: 'Click / glide C4–C5',
    param: 'Note length',
    paramDetail: 'Note decay 0.18–1.0 s.',
    principle: '13 keys C4–C5 sound with a triangle wave and attack/decay envelope, supporting press-and-glide.',
    caution: 'Synthetic timbre, not piano recordings; keyboard note mapping is supported.'
  },
  turntable: {
    name: 'Synth Scratch',
    action: 'Press and scratch the record',
    param: 'Sensitivity',
    paramDetail: 'Angular speed to frequency ratio 18–70.',
    principle: 'Record rotation deltas map to continuous oscillator frequency, returning to a low idle speed on release.',
    caution: 'A synthesized scratch sound; no copyrighted records are sampled.'
  },
  sequencer: {
    name: 'Four-Track Sequencer',
    action: 'Light cells / play',
    param: 'Speed',
    paramDetail: 'Tempo 70–150BPM, default 110.',
    principle: 'A 4×8 editable rhythm drives a sine kick, band-pass snare, high-pass hi-hat and dual-oscillator bell.',
    caution: 'All drums are synthesized live; stopping and leaving the viewport cancel pending scheduling.'
  },
  vu: {
    name: 'RMS Meter',
    action: 'Click to feed a signal',
    param: 'Signal',
    paramDetail: 'Synthesized test frequency 90–430Hz.',
    principle: 'A real time-domain RMS maps the needle with a fast-attack, slow-release interpolation.',
    caution: 'An RMS meter language study; it does not claim to meet the calibrated 1939 standard.'
  },
  soundripples: {
    name: 'Sonic Ripples',
    action: 'Click anywhere on the dark field',
    param: 'Decay',
    paramDetail: 'Sound / ring decay 0.25–1.1 s.',
    principle: 'Click position maps to a pentatonic scale and triggers both an enveloped sound and two expanding rings.',
    caution: 'Enable sound first, then touch; mute and watch the ripples.'
  },
  equalizer5: {
    name: 'Five-Band EQ',
    action: 'Shape the faders / audition white noise',
    param: 'Source volume',
    paramDetail: 'White-noise source gain 0.04–0.16.',
    principle: 'Five BiquadFilters in series filter white noise, and getFrequencyResponse computes the real response.',
    caution: 'Sliders are keyboard operable, and noise plays only on an explicit audition.'
  },
  harmonics: {
    name: 'Harmonic Stack',
    action: 'Drag the slider 1→9 harmonics',
    param: 'Harmonics',
    paramDetail: 'Stacked terms 1–9.',
    principle: 'Odd sine components stack as 1/k, generating a matching PeriodicWave sound.',
    caution: 'Volume is normalized; summed pressure is never amplified without bound.'
  },
  metronome: {
    name: 'Metronome',
    action: 'Drag BPM / start',
    param: 'BPM',
    paramDetail: 'Tempo 40–180BPM.',
    principle: 'A real audio clock schedules strong and weak beats, and the pendulum and beat dots follow the phase.',
    caution: 'Visual refresh is not a professional real-time accuracy guarantee.'
  },
  pitchspiral: {
    name: 'Pitch Spiral',
    action: 'Click a spiral note point',
    param: 'Note length',
    paramDetail: 'Note decay 0.2–1.2 s.',
    principle: '36 note points sit on a logarithmic spiral; clicking sounds a semitone formula and highlights the same note name.',
    caution: 'Frequency is computed as 130.81×2^(i/12) with no audio files.'
  },
  noisecolors: {
    name: 'Noise Colors',
    action: 'Switch white / pink / brown',
    param: 'Volume',
    paramDetail: 'Local gain 0.03–0.13.',
    principle: 'White noise, Kellet-filtered pink noise and integrated brown noise are synthesized with matching visual grain.',
    caution: 'Start at low volume; particles only match the style and do not pretend to measure a spectrum.'
  },
  voiceorb: {
    name: 'Babbling Orb',
    action: 'Click “Let it speak”',
    param: 'Expression',
    paramDetail: 'Contour amplitude 0.03–0.16 of the radius.',
    principle: 'Three sinusoidal contours respond to babbling states; two oscillators and short envelopes combine into non-semantic syllables.',
    caution: 'Not TTS; it generates no understandable language and imitates no real person.'
  },
  stringwave: {
    name: 'Plucked String',
    action: 'Pull the string and release',
    param: 'Damping',
    paramDetail: 'Damping λ=0.4–2.2.',
    principle: 'A triangular pluck initial state becomes harmonic coefficients; the spatial standing wave decays by mode and synthesizes matching sound.',
    caution: 'Supports click/drag and button plucks; not high-precision instrument modeling.'
  },
  musicbox: {
    name: 'Paper Music Box',
    action: 'Play / poke holes to edit the score',
    param: 'Speed',
    paramDetail: 'Step interval 0.55–0.20 s.',
    principle: 'Paper-tape holes are edited and a playhead triggers dual-oscillator bell tones and gold highlights step by step.',
    caution: 'Preset traditional motifs; all timbres are synthesized live.'
  },
  finiteplayer: {
    name: 'Finite Track Player',
    action: 'Enable sound / pause / seek',
    param: 'Named parameters',
    paramDetail: 'See the named parameter table below.',
    principle: 'A finite locally synthesized track offers real play, pause, progress, seek and end; modern and retro skins share one model.',
    caution: 'Locally synthesized 8/12-second AudioBuffers; stop keeps the position and the end enters ended. All sound starts explicitly.',
    params: {
      volume: { label: 'Volume' },
      track: { label: 'Track', options: { dawn: 'Dawn / 8 s', night: 'Night flight / 12 s' } },
      skin: { label: 'Skin', options: { modern: 'Modern', retro: 'Retro' } }
    }
  }
})