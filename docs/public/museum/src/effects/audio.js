(() => {
  const { register, circle, path, clamp } = Museum;
  const X = MuseumExpansion;
  function audioStage(a, title, markup = '', bg = '#1d3030') {
    a.background(bg);
    a.html(
      `<div class="nx-audio"><header><span>${title}</span><button data-audio aria-pressed="false">▷ 启声</button></header><div class="nx-audio-display">${markup}</div><footer data-audio-status role="status">点击才发声 · 离屏停音</footer></div>`
    );
    const s = MuseumAudio.scope(a);
    s.onChange((playing, message) => {
      a.$('[data-audio]').textContent = playing ? '■ 停声' : '▷ 启声';
      a.$('[data-audio]').setAttribute('aria-pressed', playing);
      a.$('[data-audio-status]').textContent =
        message || (playing ? '已启声 · 低音量本地合成' : '点击才发声 · 离屏停音');
      a.root.dataset.audio = playing ? 'active' : 'stopped';
    });
    return s;
  }
  function toggleSound(a, s, begin) {
    let pending = false;
    a.on(a.$('[data-audio]'), 'click', async () => {
      if (pending) return;
      if (s.playing) {
        s.stop();
        return;
      }
      pending = true;
      try {
        if (await s.start()) begin();
      } finally {
        pending = false;
      }
    });
  }
  function logFrequency(g, w, h) {
    g.fillStyle = '#b4c9b866';
    g.font = '7px monospace';
    g.fillText('20Hz', w * 0.1, h * 0.79);
    g.fillText('20kHz', w * 0.79, h * 0.79);
  }
  // @effect spectrum
  register('spectrum', (root, a) => {
    const s = audioStage(a, 'LIVE FFT / 1024');
    const peaks = new Float32Array(40);
    toggleSound(a, s, () =>
      s.pattern(
        () => 0.185 / a.speed,
        (at, i) =>
          s.tone([220, 277.18, 329.63, 440, 554.37, 659.25][i % 6], 0.32, 'triangle', at, 0.45)
      )
    );
    a.canvas((g, w, h) => {
      s.level(0.03 + a.amount * 0.12);
      const data = s.data();
      let energy = 0;
      for (let i = 0; i < 40; i++) {
        const index = 1 + Math.floor((i / 40) ** 2 * 220),
          v = data[index] / 255;
        energy += v;
        peaks[i] = Math.max(v, peaks[i] - 0.008);
        const x = w * 0.12 + i * w * 0.019,
          bh = v * h * 0.43;
        g.fillStyle = `hsl(${145 + i} 35% ${48 + v * 28}%)`;
        g.fillRect(x, h * 0.73 - bh, w * 0.012, Math.max(1, bh));
        g.fillStyle = '#d8e3ae';
        g.fillRect(x, h * 0.73 - peaks[i] * h * 0.43 - 3, w * 0.012, 1);
      }
      root.dataset.energy = energy.toFixed(3);
      logFrequency(g, w, h);
    });
  });
  // @effect oscilloscope
  register('oscilloscope', (root, a) => {
    const s = audioStage(
      a,
      'TIME DOMAIN',
      '<div class="nx-wave-types">' +
        ['sine', 'square', 'sawtooth', 'triangle']
          .map(
            (v, i) =>
              `<button data-wave="${v}" aria-pressed="${i === 0}">${['正弦', '方波', '锯齿', '三角'][i]}</button>`
          )
          .join('') +
        '</div>'
    );
    let type = 'sine',
      osc = null;
    toggleSound(a, s, () => {
      osc = s.oscillator(80 + a.amount * 520, type);
      s.level(0.08);
    });
    a.$$('[data-wave]').forEach((b) =>
      a.on(b, 'click', () => {
        type = b.dataset.wave;
        if (osc && s.playing) osc.type = type;
        a.$$('[data-wave]').forEach((v) => v.setAttribute('aria-pressed', v === b));
        root.dataset.wave = type;
      })
    );
    a.canvas((g, w, h) => {
      if (osc && s.playing)
        osc.frequency.setTargetAtTime(80 + a.amount * 520, s.context.currentTime, 0.02);
      const data = s.data('time');
      g.strokeStyle = '#85bbad33';
      g.lineWidth = 0.7;
      path(g, [
        [w * 0.1, h * 0.5],
        [w * 0.9, h * 0.5]
      ]);
      g.stroke();
      g.strokeStyle = '#a5e1b9';
      g.lineWidth = 1.5;
      g.beginPath();
      for (let i = 0; i < data.length; i += 3) {
        const x = w * 0.1 + (i / data.length) * w * 0.8,
          y = h * 0.5 + ((data[i] - 128) / 128) * h * 0.28;
        i ? g.lineTo(x, y) : g.moveTo(x, y);
      }
      g.stroke();
    });
  });
  // @effect piano
  register('piano', (root, a) => {
    const black = { 1: 1, 3: 2, 6: 4, 8: 5, 10: 6 };
    const s = audioStage(
      a,
      'C4 — C5 / TRIANGLE',
      '<div class="nx-piano">' +
        Array.from(
          { length: 13 },
          (_, i) =>
            `<button data-note="${i}" class="${i in black ? 'black' : 'white'}" style="${i in black ? 'left:' + (black[i] * 12.5 - 3.5) + '%;' : ''}" aria-label="${['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B', 'C'][i]} ${i === 12 ? '5' : '4'}">${i in black ? '' : ['C', '', 'D', '', 'E', 'F', '', 'G', '', 'A', '', 'B', 'C'][i]}</button>`
        ).join('') +
        '</div><span class="nx-piano-hint">A W S E D F T G Y H U J K</span>'
    );
    root.tabIndex = 0;
    let last = -1;
    async function note(n) {
      if (await s.start()) {
        s.level(0.13);
        s.tone(261.63 * 2 ** (n / 12), 0.18 + a.amount * 0.82, 'triangle', undefined, 0.6);
        root.dataset.note = n;
        a.$$('[data-note]').forEach((b) => b.classList.toggle('lit', Number(b.dataset.note) === n));
      }
    }
    toggleSound(a, s, () => {
      s.level(0.13);
      [0, 4, 7].forEach((n) => s.tone(261.63 * 2 ** (n / 12), 0.4, 'triangle', undefined, 0.25));
    });
    a.$$('[data-note]').forEach((b) => {
      a.on(b, 'pointerdown', () => {
        last = Number(b.dataset.note);
        note(last);
      });
      a.on(b, 'pointerenter', (e) => {
        if (e.buttons && last !== Number(b.dataset.note)) {
          last = Number(b.dataset.note);
          note(last);
        }
      });
      a.on(b, 'click', (e) => {
        if (e.detail === 0) note(Number(b.dataset.note));
      });
    });
    a.on(root, 'keydown', (e) => {
      const n = 'awsedftgyhujk'.indexOf(e.key.toLowerCase());
      if (n >= 0 && !e.repeat) {
        e.preventDefault();
        note(n);
      }
    });
  });
  // @effect turntable
  register('turntable', (root, a) => {
    const s = audioStage(
      a,
      'SYNTH SCRATCH',
      '<button class="nx-record" aria-label="按住唱片转动"><i></i><span>OUTLINE<br>33⅓</span></button>'
    );
    let osc = null,
      angle = 0,
      last = 0,
      time = 0,
      velocity = 0,
      drag = false;
    toggleSound(a, s, () => {
      osc = s.oscillator(65, 'sawtooth');
      s.level(0.07);
    });
    const disc = a.$('.nx-record');
    const get = (e) => {
      const r = disc.getBoundingClientRect();
      return Math.atan2(e.clientY - r.top - r.height / 2, e.clientX - r.left - r.width / 2);
    };
    X.pointerDrag(a, disc, {
      start: (e) => {
        drag = true;
        last = get(e);
        time = performance.now();
      },
      move: (e) => {
        const q = get(e),
          now = performance.now();
        let d = q - last;
        if (d > Math.PI) d -= Math.PI * 2;
        if (d < -Math.PI) d += Math.PI * 2;
        velocity = d / Math.max(0.008, (now - time) / 1000);
        angle += d;
        last = q;
        time = now;
        a.repaint();
      },
      end: () => (drag = false)
    });
    a.loop((t, dt) => {
      if (!drag) {
        velocity += (3.49 - velocity) * 0.1;
        angle += velocity * dt;
      }
      disc.style.transform = `rotate(${angle}rad)`;
      if (osc && s.playing)
        osc.frequency.setTargetAtTime(
          clamp(65 + Math.abs(velocity) * (18 + a.amount * 52), 40, 1800),
          s.context.currentTime,
          0.025
        );
    });
  });
  // @effect sequencer
  register('sequencer', (root, a) => {
    const notes = [
        [1, 0, 0, 0, 1, 0, 0, 0],
        [0, 0, 1, 0, 0, 0, 1, 0],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 1, 0, 0, 0, 1]
      ],
      s = audioStage(
        a,
        '4 × 8 / SYNTH DRUMS',
        '<div class="nx-seq">' +
          notes
            .map(
              (row, r) =>
                `<div><span>${['KICK', 'SNARE', 'HAT', 'BELL'][r]}</span>${row.map((v, c) => `<button data-row="${r}" data-col="${c}" aria-label="${['底鼓', '军鼓', '踩镲', '铃'][r]} 第${c + 1}步" aria-pressed="${!!v}"></button>`).join('')}</div>`
            )
            .join('') +
          '</div><span class="nx-audio-value" data-bpm>110 BPM</span>'
      );
    toggleSound(a, s, () => {
      s.level(0.13);
      s.pattern(
        () => 60 / (70 + a.amount * 80) / 2 / a.speed,
        (at, step) => {
          const c = step % 8;
          notes.forEach((row, r) => {
            if (row[c]) s.drum(r, at);
          });
          a.$$('[data-col]').forEach((b) =>
            b.classList.toggle('current', Number(b.dataset.col) === c)
          );
          root.dataset.step = c;
        }
      );
    });
    a.$$('[data-col]').forEach((b) =>
      a.on(b, 'click', () => {
        const r = Number(b.dataset.row),
          c = Number(b.dataset.col);
        notes[r][c] = 1 - notes[r][c];
        b.setAttribute('aria-pressed', !!notes[r][c]);
      })
    );
    a.loop(() => (a.$('[data-bpm]').textContent = Math.round(70 + a.amount * 80) + ' BPM'));
  });
  // @effect vu
  register('vu', (root, a) => {
    const s = audioStage(a, 'RMS / FAST UP · SLOW DOWN');
    let osc = null,
      value = 0;
    toggleSound(a, s, () => {
      osc = s.oscillator(90 + a.amount * 340, 'triangle');
      s.level(0.3);
    });
    a.canvas((g, w, h, t) => {
      if (osc && s.playing) {
        osc.frequency.setTargetAtTime(90 + a.amount * 340, s.context.currentTime, 0.02);
        s.level(0.03 + (0.27 * (Math.sin(t * 2) + 1)) / 2);
      }
      const rms = s.rms();
      value += (rms - value) * (rms > value ? 0.28 : 0.055);
      root.dataset.rms = rms.toFixed(5);
      const cx = w / 2,
        cy = h * 0.74,
        R = Math.min(w * 0.36, h * 0.43);
      g.strokeStyle = '#c7d5ad55';
      g.lineWidth = 2;
      g.beginPath();
      g.arc(cx, cy, R, Math.PI * 1.15, Math.PI * 1.85);
      g.stroke();
      for (let i = 0; i <= 10; i++) {
        const q = Math.PI * (1.15 + i * 0.07);
        path(g, [
          [cx + Math.cos(q) * R, cy + Math.sin(q) * R],
          [cx + Math.cos(q) * (R - 5), cy + Math.sin(q) * (R - 5)]
        ]);
        g.stroke();
      }
      const db = 20 * Math.log10(Math.max(value, 0.00001) / 0.15),
        p = clamp((db + 36) / 42),
        q = Math.PI * (1.15 + p * 0.7);
      g.strokeStyle = '#d9c08c';
      g.lineWidth = 2;
      path(g, [
        [cx, cy],
        [cx + Math.cos(q) * (R - 10), cy + Math.sin(q) * (R - 10)]
      ]);
      g.stroke();
      circle(g, cx, cy, 5, '#d6d6c0');
      g.fillStyle = db > 0 ? '#ea987f' : '#829f81';
      g.font = '9px monospace';
      g.textAlign = 'center';
      g.fillText(s.playing ? db.toFixed(1) + ' dB REL' : 'SILENT', cx, cy + 17);
    });
  });
  // @effect soundripples
  register('soundripples', (root, a) => {
    const s = audioStage(a, 'PENTATONIC TOUCH');
    let waves = [];
    toggleSound(a, s, () => {
      s.level(0.13);
      s.tone(261.63, 0.3);
    });
    a.on(root, 'pointerdown', (e) => {
      if (e.target.closest('button,input')) return;
      const x = a.pointer.x / root.clientWidth,
        y = a.pointer.y / root.clientHeight;
      waves.push({ x, y, t: a.time });
      waves = waves.slice(-20);
      if (s.playing) {
        const scale = [0, 2, 4, 7, 9],
          n = Math.min(9, Math.floor((1 - clamp(y)) * 10)),
          m = scale[n % 5] + Math.floor(n / 5) * 12;
        s.tone(261.63 * 2 ** (m / 12), 0.25 + a.amount * 0.85, 'sine', undefined, 0.6);
      }
      a.repaint();
    });
    a.canvas((g, w, h, t) => {
      const duration = 0.25 + a.amount * 0.85;
      waves = waves.filter((v) => t - v.t < duration * 2);
      for (const v of waves) {
        const p = clamp((t - v.t) / (duration * 2));
        for (let i = 0; i < 2; i++) {
          g.strokeStyle = `rgba(178,218,192,${(1 - p) * (0.8 - i * 0.3)})`;
          g.lineWidth = 1.2;
          circle(g, v.x * w, v.y * h, 4 + p * (80 - i * 19));
        }
      }
      if (!waves.length) {
        g.fillStyle = '#b9ceb277';
        g.textAlign = 'center';
        g.font = '10px monospace';
        g.fillText('TOUCH TO HEAR THE SPACE', w / 2, h * 0.52);
      }
    });
  });
  // @effect equalizer5
  register('equalizer5', (root, a) => {
    const bands = [60, 250, 1000, 4000, 12000],
      gains = Array(5).fill(0);
    let filters = [];
    const s = audioStage(
      a,
      'FIVE REAL BIQUAD FILTERS',
      '<div class="nx-eq-sliders">' +
        bands
          .map(
            (f, i) =>
              `<label>${f >= 1000 ? f / 1000 + 'k' : f}<input type="range" min="-12" max="12" value="0" step="1" data-band="${i}" aria-label="${f} Hz 增益"><output>0</output></label>`
          )
          .join('') +
        '</div>'
    );
    toggleSound(a, s, () => {
      filters = bands.map((f, i) => {
        const b = s.context.createBiquadFilter();
        b.type = i === 0 ? 'lowshelf' : i === 4 ? 'highshelf' : 'peaking';
        b.frequency.value = f;
        b.Q.value = 0.8;
        b.gain.value = gains[i];
        return b;
      });
      filters.forEach((f, i) => f.connect(filters[i + 1] || s.gain));
      s.noise('white', filters[0]);
      s.once(() => filters.forEach((f) => f.disconnect()));
      root.dataset.filters = filters.length;
    });
    a.$$('[data-band]').forEach((input) =>
      a.on(input, 'input', () => {
        const i = Number(input.dataset.band);
        gains[i] = Number(input.value);
        input.nextElementSibling.textContent = input.value;
        if (filters[i]) filters[i].gain.setTargetAtTime(gains[i], s.context.currentTime, 0.02);
        a.repaint();
      })
    );
    a.canvas((g, w, h) => {
      s.level(0.04 + a.amount * 0.12);
      const frequencies = Float32Array.from({ length: 100 }, (_, i) => 20 * 1000 ** (i / 99)),
        response = new Float32Array(100).fill(1),
        phase = new Float32Array(100);
      for (const f of filters) {
        const mag = new Float32Array(100);
        f.getFrequencyResponse(frequencies, mag, phase);
        for (let i = 0; i < 100; i++) response[i] *= mag[i];
      }
      const db = Array.from(response, (v) => 20 * Math.log10(Math.max(0.001, v)));
      root.dataset.lowResponse = db[18].toFixed(3);
      g.strokeStyle = '#aecb9988';
      g.lineWidth = 1.4;
      g.beginPath();
      db.forEach((v, i) => {
        const x = w * 0.1 + (i / 99) * w * 0.8,
          y = h * 0.36 - clamp(v / 24, -1, 1) * h * 0.12;
        i ? g.lineTo(x, y) : g.moveTo(x, y);
      });
      g.stroke();
    });
  });
  // @effect harmonics
  register('harmonics', (root, a) => {
    const s = audioStage(a, 'ODD HARMONICS');
    let osc = null,
      previous = -1;
    const count = () => 1 + Math.round(a.amount * 8);
    function setWave() {
      if (!osc || !s.playing) return;
      const real = new Float32Array(20),
        imag = new Float32Array(20);
      for (let n = 0; n < count(); n++) {
        const k = 2 * n + 1;
        imag[k] = 1 / k;
      }
      osc.setPeriodicWave(s.context.createPeriodicWave(real, imag));
      root.dataset.harmonics = count();
    }
    toggleSound(a, s, () => {
      osc = s.oscillator(130.81);
      s.level(0.11);
      setWave();
    });
    a.canvas((g, w, h) => {
      if (previous !== a.amount) {
        previous = a.amount;
        setWave();
      }
      const N = count();
      for (let n = 0; n <= N; n++) {
        g.beginPath();
        g.strokeStyle = n === N ? '#d9dfa5' : '#91b5a733';
        g.lineWidth = n === N ? 1.5 : 0.6;
        for (let x = 0; x <= 180; x++) {
          const q = (x / 180) * Math.PI * 4;
          let value = 0;
          if (n === N) {
            for (let j = 0; j < N; j++) {
              const k = 2 * j + 1;
              value += Math.sin(k * q) / k;
            }
          } else {
            const k = 2 * n + 1;
            value = Math.sin(k * q) / k;
          }
          const xx = w * 0.1 + (x / 180) * w * 0.8,
            yy = h * 0.52 - value * h * 0.15;
          x ? g.lineTo(xx, yy) : g.moveTo(xx, yy);
        }
        g.stroke();
      }
      g.fillStyle = '#c6d4b8';
      g.textAlign = 'center';
      g.font = '9px monospace';
      g.fillText(N + ' ODD PARTIALS', w / 2, h * 0.77);
    });
  });
  // @effect metronome
  register('metronome', (root, a) => {
    const s = audioStage(
      a,
      'AUDIO-CLOCK METRONOME',
      '<div class="nx-metronome"><i></i><span></span><div>' +
        Array.from({ length: 4 }, () => '<b></b>').join('') +
        '</div>'
    );
    let began = 0;
    toggleSound(a, s, () => {
      began = s.context.currentTime;
      s.level(0.1);
      s.pattern(
        () => 60 / (40 + a.amount * 140) / a.speed,
        (at, i) => {
          s.tone(i % 4 === 0 ? 1320 : 880, 0.045, 'square', at, 0.3);
          a.$$('.nx-metronome b').forEach((b, n) => b.classList.toggle('on', n === i % 4));
          root.dataset.beat = i;
        }
      );
    });
    a.loop(() => {
      const bpm = 40 + a.amount * 140,
        time = s.playing ? s.context.currentTime - began : 0;
      a.$('.nx-metronome i').style.transform =
        `rotate(${Math.cos((time / (60 / bpm / a.speed)) * Math.PI) * 26}deg)`;
      a.$('.nx-metronome span').textContent = Math.round(bpm) + ' BPM';
    });
  });
  // @effect pitchspiral
  register('pitchspiral', (root, a) => {
    let selected = 0;
    const names = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
    const s = audioStage(
      a,
      'THREE OCTAVES / 36 NOTES',
      '<div class="nx-pitch-tools"><select aria-label="选择螺旋音高">' +
        Array.from(
          { length: 36 },
          (_, i) => `<option value="${i}">${names[i % 12]}${3 + Math.floor(i / 12)}</option>`
        ).join('') +
        '</select><button data-note>发音</button></div>'
    );
    async function sound(n) {
      selected = n;
      a.$('select').value = String(n);
      root.dataset.note = n;
      if (await s.start()) {
        s.level(0.12);
        s.tone(130.81 * 2 ** (n / 12), 0.2 + a.amount, 'sine', undefined, 0.6);
      }
    }
    toggleSound(a, s, () => sound(selected));
    a.on(a.$('[data-note]'), 'click', () => sound(Number(a.$('select').value)));
    a.on(root, 'pointerdown', (e) => {
      if (e.target.closest('button,select')) return;
      let best = 0,
        d = Infinity;
      for (let i = 0; i < 36; i++) {
        const q = (i / 12) * Math.PI * 2 - Math.PI / 2,
          r = Math.min(root.clientWidth, root.clientHeight) * (0.12 + i * 0.005),
          x = root.clientWidth / 2 + Math.cos(q) * r,
          y = root.clientHeight * 0.49 + Math.sin(q) * r,
          dist = Math.hypot(x - a.pointer.x, y - a.pointer.y);
        if (dist < d) {
          d = dist;
          best = i;
        }
      }
      if (d < 24) sound(best);
    });
    a.canvas((g, w, h) => {
      const pts = [];
      for (let i = 0; i < 36; i++) {
        const q = (i / 12) * Math.PI * 2 - Math.PI / 2,
          r = Math.min(w, h) * (0.12 + i * 0.005);
        pts.push([w / 2 + Math.cos(q) * r, h * 0.49 + Math.sin(q) * r]);
      }
      g.strokeStyle = '#aec9b33b';
      g.lineWidth = 0.7;
      path(g, pts);
      g.stroke();
      pts.forEach(([x, y], i) =>
        circle(g, x, y, i === selected ? 5 : 3, i % 12 === selected % 12 ? '#e7d797' : '#6e9e98')
      );
    });
  });
  // @effect noisecolors
  register('noisecolors', (root, a) => {
    let color = 'white',
      seed = 0;
    const s = audioStage(
      a,
      'SYNTHETIC NOISE',
      '<div class="nx-noise-types">' +
        [
          ['white', '白噪'],
          ['pink', '粉噪'],
          ['brown', '棕噪']
        ]
          .map(
            ([v, n]) => `<button data-color="${v}" aria-pressed="${v === 'white'}">${n}</button>`
          )
          .join('') +
        '</div>'
    );
    function begin() {
      s.noise(color);
      root.dataset.noise = color;
    }
    toggleSound(a, s, begin);
    a.$$('[data-color]').forEach((b) =>
      a.on(b, 'click', async () => {
        color = b.dataset.color;
        a.$$('[data-color]').forEach((el) => el.setAttribute('aria-pressed', el === b));
        if (s.playing) {
          s.stop();
          if (await s.start()) begin();
        }
        a.repaint();
      })
    );
    a.canvas((g, w, h, t) => {
      s.level(0.03 + a.amount * 0.1);
      const n = { white: 260, pink: 150, brown: 80 }[color],
        hue = { white: 100, pink: 330, brown: 35 }[color];
      for (let i = 0; i < n; i++) {
        const x = (Math.sin(i * 192.71 + Math.floor(t * 5)) * 437.8) % 1,
          y = (Math.sin(i * 41.83 + Math.floor(t * 5)) * 169.4) % 1;
        g.fillStyle = `hsla(${hue} 25% ${55 + (i % 25)}%,.5)`;
        circle(
          g,
          w * 0.1 + Math.abs(x) * w * 0.8,
          h * 0.3 + Math.abs(y) * h * 0.34,
          1 + (i % 3) * 0.4,
          g.fillStyle
        );
      }
    });
  });
  // @effect voiceorb
  register('voiceorb', (root, a) => {
    const s = audioStage(
      a,
      'SYNTHETIC BABBLE / NOT TTS',
      '<span class="nx-audio-value">合成音节 · 无语义</span>',
      '#30283e'
    );
    let talking = false;
    toggleSound(a, s, () => {
      talking = true;
      s.level(0.11);
      s.pattern(
        () => 0.19 / a.speed,
        (at, i) => {
          if (i >= 14) {
            talking = false;
            s.stop();
            return;
          }
          const f = 105 + (i % 5) * 23;
          s.tone(f, 0.11, 'triangle', at, 0.45);
          s.tone(f * 4.3, 0.07, 'sine', at + 0.03, 0.07);
        }
      );
    });
    a.canvas((g, w, h, t) => {
      talking = s.playing;
      const R = Math.min(w, h) * 0.21;
      for (let layer = 0; layer < 3; layer++) {
        g.strokeStyle = ['#ceb8e7', '#ae9ac466', '#e6caa644'][layer];
        g.lineWidth = 1.2;
        g.beginPath();
        for (let i = 0; i <= 180; i++) {
          const q = (i / 180) * Math.PI * 2,
            v = (Math.sin(3 * q + t * 2) + Math.sin(5 * q - t) + Math.sin(2 * q + t * 0.7)) / 3,
            rr = R * (1 + v * (0.03 + a.amount * 0.13) * (talking ? 4 : 1)) + layer * 5,
            x = w / 2 + Math.cos(q) * rr,
            y = h * 0.49 + Math.sin(q) * rr;
          i ? g.lineTo(x, y) : g.moveTo(x, y);
        }
        g.closePath();
        g.stroke();
      }
    });
  });
  // @effect stringwave
  register('stringwave', (root, a) => {
    const s = audioStage(
      a,
      'PLUCK / STANDING WAVE',
      '<div class="nx-string-touch" aria-label="拖动琴弦"></div><button class="nx-pluck" data-pluck>拨一下 ↗</button>'
    );
    let rel = 0.37,
      height = 0.2,
      start = -8,
      drag = false;
    async function release() {
      start = a.time;
      drag = false;
      if (await s.start()) {
        const real = new Float32Array(14),
          imag = new Float32Array(14);
        for (let n = 1; n < 14; n++) imag[n] = Math.sin(n * Math.PI * rel) / (n * n);
        const wave = s.context.createPeriodicWave(real, imag);
        s.level(0.14);
        s.tone(
          146.83,
          Math.min(2, 1.6 / (0.4 + a.amount * 1.8)),
          'sine',
          undefined,
          clamp(Math.abs(height) * 2, 0.15, 0.8),
          { wave }
        );
      }
      a.repaint();
    }
    toggleSound(a, s, release);
    a.on(a.$('[data-pluck]'), 'click', () => {
      height = 0.22;
      release();
    });
    const touch = a.$('.nx-string-touch');
    X.pointerDrag(a, touch, {
      start: (e) => {
        drag = true;
        const p = X.spot(touch, e);
        rel = clamp(p.x, 0.08, 0.92);
        height = clamp((p.y - 0.5) * 0.7, -0.35, 0.35);
      },
      move: (e) => {
        const p = X.spot(touch, e);
        height = clamp((p.y - 0.5) * 0.7, -0.35, 0.35);
        a.repaint();
      },
      end: (e, cancel) => {
        if (cancel) {
          drag = false;
          height = 0;
        } else release();
      }
    });
    a.canvas((g, w, h, t) => {
      const elapsed = t - start,
        lambda = 0.4 + a.amount * 1.8;
      g.strokeStyle = '#d5dca7';
      g.lineWidth = 1.6;
      g.beginPath();
      for (let i = 0; i <= 160; i++) {
        const x = i / 160;
        let value = 0;
        if (drag) value = height * (x < rel ? x / rel : (1 - x) / (1 - rel));
        else
          for (let n = 1; n <= 12; n++) {
            const A =
              (2 * height * Math.sin(n * Math.PI * rel)) /
              (Math.PI * Math.PI * n * n * rel * (1 - rel));
            value +=
              A *
              Math.sin(n * Math.PI * x) *
              Math.cos(n * elapsed * 13) *
              Math.exp(-n * lambda * elapsed);
          }
        const xx = w * 0.12 + x * w * 0.76,
          y = h * 0.5 + value * h * 0.6;
        i ? g.lineTo(xx, y) : g.moveTo(xx, y);
      }
      g.stroke();
      circle(g, w * 0.12, h * 0.5, 3, '#9cb296');
      circle(g, w * 0.88, h * 0.5, 3, '#9cb296');
    });
  });
  // @effect musicbox
  register('musicbox', (root, a) => {
    const melody = [0, 0, 4, 4, 5, 5, 4, -1, 3, 3, 2, 2, 1, 1, 0, -1],
      scale = [0, 2, 4, 5, 7, 9, 11, 12];
    let score = Array.from({ length: 16 }, (_, i) =>
        Array.from({ length: 8 }, (_, j) => (melody[i] === j ? 1 : 0))
      ),
      beat = 0,
      started = 0;
    const s = audioStage(
      a,
      'PAPER SCORE / EDIT THE HOLES',
      '<div class="nx-musicbox"><div class="nx-paper-roll"></div><i class="nx-needle"></i></div>',
      '#3b342b'
    );
    function paper() {
      a.$('.nx-paper-roll').innerHTML = Array.from({ length: 2 }, () =>
        score
          .map(
            (row, r) =>
              `<div>${row.map((v, c) => `<button data-row="${r}" data-col="${c}" aria-label="第${r + 1}步 第${c + 1}音" aria-pressed="${!!v}"></button>`).join('')}</div>`
          )
          .join('')
      ).join('');
    }
    paper();
    a.on(a.$('.nx-paper-roll'), 'click', (e) => {
      const b = e.target.closest('[data-row]');
      if (!b) return;
      const r = Number(b.dataset.row),
        c = Number(b.dataset.col);
      score[r][c] = 1 - score[r][c];
      a.$$(`[data-row="${r}"][data-col="${c}"]`).forEach((el) =>
        el.setAttribute('aria-pressed', !!score[r][c])
      );
    });
    toggleSound(a, s, () => {
      s.level(0.11);
      beat = 0;
      started = s.context.currentTime;
      s.pattern(
        () => (0.55 - a.amount * 0.35) / a.speed,
        (at, i) => {
          beat = i % 16;
          started = at;
          score[beat].forEach((on, n) => {
            if (on) {
              const f = 261.63 * 2 ** (scale[n] / 12);
              s.tone(f * 2, 0.4, 'triangle', at, 0.35);
              s.tone(f * 5.4, 0.18, 'sine', at, 0.07);
            }
          });
          a.$$('[data-row]').forEach((b) =>
            b.classList.toggle('current', Number(b.dataset.row) === beat)
          );
          root.dataset.beat = beat;
        }
      );
    });
    a.loop(() => {
      const period = (0.55 - a.amount * 0.35) / a.speed,
        p = s.playing ? clamp((s.context.currentTime - started) / period) : 0;
      a.$('.nx-paper-roll').style.transform = `translateY(${-((beat + p) % 16) * 18 + 40}px)`;
    });
  });
  // @effect finiteplayer
  register('finiteplayer', (root, a) => {
    const L = MuseumLab;
    L.shell(
      a,
      'FINITE / 有终点的声音',
      `<div class="bc-player"><div class="bc-disc" aria-hidden="true"><i></i></div><div><small>LOCAL SYNTHESIS</small><h3>晨间 / DAWN</h3><output class="bc-time">0:00 / 0:08</output></div></div><label class="bc-seek-label">播放位置<input class="bc-seek" type="range" min="0" max="8" step="0.05" value="0" aria-label="播放位置（秒）"></label><div class="bc-toolbar"><button data-play>启声播放</button><button data-pause>暂停</button><button data-stop>停止归零</button></div><output role="status" class="bc-note">明确点击才启声；曲目在本地合成</output>`,
      '#243530',
    );
    const s = MuseumAudio.scope(a),
      seek = a.$('.bc-seek');
    let offset = 0,
      began = 0,
      source = null,
      status = 'idle',
      token = 0,
      track = a.params.track,
      duration = 8,
      buffer = null;
    const position = () =>
      status === 'playing'
        ? clamp(offset + s.context.currentTime - began, 0, duration)
        : offset;
    function render() {
      const pos = position();
      seek.value = pos;
      a.$('.bc-time').textContent =
        `${pos.toFixed(1)} / ${duration.toFixed(1)} s`;
      a.$('[data-pause]').disabled = status !== 'playing';
      a.$('[data-play]').disabled = status === 'starting' || status === 'playing';
      a.$('.bc-disc').classList.toggle('bc-spinning', status === 'playing');
      L.state(a, { status, position: pos, duration, track, playing: s.playing });
    }
    function halt(next = 'paused', zero = false) {
      const p = position();
      token++;
      source = null;
      offset = zero ? 0 : p;
      status = next;
      s.stop();
      a.$('.bc-note').textContent =
        next === 'ended'
          ? '自然结束 · 点击可重播'
          : next === 'idle'
            ? '已停止归零'
            : '已暂停 · 恢复需要主动点击';
      render();
    }
    s.onChange((playing, message) => {
      if (!playing && ['playing', 'starting'].includes(status)) {
        offset = position();
        status = 'paused';
        source = null;
        token++;
        a.$('.bc-note').textContent = message || '已停音 · 不会自动恢复';
        render();
      }
    });
    function synth(ctx) {
      const n = Math.round(duration * ctx.sampleRate),
        b = ctx.createBuffer(1, n, ctx.sampleRate),
        d = b.getChannelData(0),
        notes =
          track === 'dawn'
            ? [0, 4, 7, 12, 7, 4, 2, 7]
            : [0, 3, 7, 10, 7, 3, 5, 2];
      for (let i = 0; i < n; i++) {
        const t = i / ctx.sampleRate,
          beat = Math.floor(t / 0.5),
          local = t % 0.5,
          f = 196 * 2 ** (notes[beat % notes.length] / 12),
          env =
            Math.min(1, local / 0.015) *
            Math.exp(-local * 7) *
            Math.min(1, (duration - t) / 0.08);
        d[i] =
          (0.25 * Math.sin(2 * Math.PI * f * t) +
            0.06 * Math.sin(2 * Math.PI * f * 2 * t)) *
          env;
      }
      return b;
    }
    async function play() {
      if (status === 'playing' || status === 'starting') return;
      if (offset >= duration - 0.001) offset = 0;
      const ticket = ++token;
      status = 'starting';
      render();
      const started = await s.start();
      if (ticket !== token) return;
      if (!started) {
        status = 'paused';
        render();
        return;
      }
      buffer = buffer || synth(s.context);
      const n = s.context.createBufferSource();
      n.buffer = buffer;
      n.connect(s.gain);
      s.track(n);
      source = n;
      began = s.context.currentTime;
      status = 'playing';
      s.level((a.params.volume / 100) * 0.28);
      n.addEventListener(
        'ended',
        () => {
          if (source !== n || ticket !== token) return;
          offset = duration;
          status = 'ended';
          source = null;
          token++;
          s.stop();
          a.$('.bc-note').textContent = '自然结束 · 点击可重播';
          render();
        },
        { once: true },
      );
      n.start(0, offset);
      a.$('.bc-note').textContent = '播放真实有限音源 · 无循环';
      render();
    }
    L.button(a, '[data-play]', play);
    L.button(a, '[data-pause]', () => halt());
    L.button(a, '[data-stop]', () => halt('idle', true));
    a.on(seek, 'input', () => {
      const restart = ['playing', 'starting'].includes(status);
      const v = Number(seek.value);
      halt();
      offset = clamp(v, 0, duration);
      render();
      if (restart) play();
    });
    a.onParamsChange((p) => {
      a.$('.bc-shell').dataset.skin = p.skin;
      s.level((p.volume / 100) * 0.28);
      if (track !== p.track) {
        halt('idle', true);
        track = p.track;
        buffer = null;
      }
      duration = track === 'dawn' ? 8 : 12;
      seek.max = duration;
      a.$('h3').textContent = track === 'dawn' ? '晨间 / DAWN' : '夜航 / NIGHT';
      render();
    });
    a.onActivity((st) => {
      if (!st.visible || st.paused) halt();
    });
    a.cleanup(() => {
      token++;
      source = null;
      s.stop();
    });
    a.loop(render);
  });

})();
