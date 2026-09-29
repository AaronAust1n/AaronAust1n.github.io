(() => {
  const { register, circle, path, rng, clamp, palette } = Museum;
  // @effect particles
  register('particles', (root, a) => {
    a.background('#222b38');
    const random = rng(51),
      pts = Array.from({ length: 36 }, () => ({ x: random(), y: random(), phase: random() * 6 }));
    a.canvas((g, w, h, t) => {
      const p = pts.map((p) => [
        p.x * w + Math.sin(t * 0.2 + p.phase) * 15,
        p.y * h + Math.cos(t * 0.17 + p.phase) * 12
      ]);
      if (a.pointer.inside) p.push([a.pointer.x, a.pointer.y]);
      const limit = 35 + a.amount * 75;
      for (let i = 0; i < p.length; i++) {
        circle(g, ...p[i], 1.7, '#c6d9d6');
        for (let j = i + 1; j < p.length; j++) {
          const d = Math.hypot(p[i][0] - p[j][0], p[i][1] - p[j][1]);
          if (d < limit) {
            g.strokeStyle = `rgba(155,189,196,${(1 - d / limit) * 0.48})`;
            g.lineWidth = 0.6;
            path(g, [p[i], p[j]]);
            g.stroke();
          }
        }
      }
    });
  });
  // @effect flow
  register('flow', (root, a) => {
    a.background('#1d3029');
    let seed = 0.2,
      particles = [],
      steps = 0;
    const trail = document.createElement('canvas'),
      ink = trail.getContext('2d');
    function reset() {
      particles = [];
      steps = 0;
      ink.clearRect(0, 0, trail.width, trail.height);
    }
    a.on(root, 'click', () => {
      seed += 3.7;
      reset();
    });
    a.onParamsChange(reset);
    a.cleanup(() => {
      trail.width = trail.height = 1;
      particles = [];
    });
    a.canvas((g, w, h, t, dt) => {
      const step = Math.max(10, w / 32),
        len = step * 0.63;
      if (a.params.mode === 'threads') {
        const tw = Math.max(1, Math.min(900, Math.round(w))),
          th = Math.max(1, Math.min(600, Math.round(h)));
        if (trail.width !== tw || trail.height !== th) {
          trail.width = tw;
          trail.height = th;
          reset();
        }
        if (!particles.length)
          particles = Array.from({ length: 70 }, (_, j) => ({
            x: (((j * 73) % 101) / 101) * w,
            y: (((j * 37) % 97) / 97) * h,
            age: j / 14,
          }));
        const advance =
          a.paused || MuseumMechanics.reduced() ? 0 : Math.min(dt, 0.04);
        if (advance > 0) {
          ink.save();
          ink.globalCompositeOperation = 'destination-out';
          ink.fillStyle = `rgba(0,0,0,${1 - Math.exp(-advance * 1.8)})`;
          ink.fillRect(0, 0, tw, th);
          ink.restore();
          ink.save();
          ink.scale(tw / w, th / h);
          ink.lineWidth = 1.3;
          particles.forEach((p, j) => {
            const angle =
              Math.sin((p.x / w) * 5 + seed + t * 0.1) +
              Math.cos((p.y / h) * 5 - seed) +
              Math.atan2(
                p.y - h / 2 - a.pointer.ny * h * 0.25,
                p.x - w / 2 - a.pointer.nx * w * 0.25,
              ) *
                (1 + a.amount * 2);
            const x = p.x + Math.cos(angle) * 60 * advance,
              y = p.y + Math.sin(angle) * 60 * advance;
            ink.strokeStyle = `hsla(${65 + (j % 35)},38%,68%,.75)`;
            ink.beginPath();
            ink.moveTo(p.x, p.y);
            ink.lineTo(x, y);
            ink.stroke();
            p.x = x;
            p.y = y;
            p.age += advance;
            if (x < 0 || y < 0 || x > w || y > h || p.age > 5) {
              p.x = (((j * 73 + steps * 7) % 101) / 101) * w;
              p.y = (((j * 37 + steps * 3) % 97) / 97) * h;
              p.age = 0;
            }
          });
          ink.restore();
          steps++;
        }
        g.drawImage(trail, 0, 0, w, h);
        root.dataset.mode = 'threads';
        MuseumLab.state(a, {
          mode: 'threads',
          count: particles.length,
          steps,
          buffer: [tw, th],
          first: { ...particles[0] },
        });
        return;
      }
      root.dataset.mode = 'vectors';
      for (let x = step; x < w; x += step)
        for (let y = step; y < h; y += step) {
          const angle =
            Math.sin((x / w) * 5 + seed + t * 0.1) +
            Math.cos((y / h) * 5 - seed) +
            Math.atan2(
              y - h / 2 - a.pointer.ny * h * 0.25,
              x - w / 2 - a.pointer.nx * w * 0.25,
            ) *
              (1 + a.amount * 2);
          g.strokeStyle = `hsla(${65 + Math.sin(angle) * 35},38%,${53 + Math.sin((y / h) * 3) * 20}%,.8)`;
          g.lineWidth = 1;
          path(g, [
            [x - (Math.cos(angle) * len) / 2, y - (Math.sin(angle) * len) / 2],
            [x + (Math.cos(angle) * len) / 2, y + (Math.sin(angle) * len) / 2],
          ]);
          g.stroke();
        }
    });
  });
  // @effect rings
  register('rings', (root, a) => {
    a.background('#dcd0bf');
    a.canvas((g, w, h, t) => {
      g.translate(w / 2, h / 2);
      for (let j = 0; j < 18; j++) {
        const r = 9 + j * Math.min(w, h) * 0.018;
        g.strokeStyle = `rgba(131,100,73,${0.28 + j * 0.023})`;
        g.lineWidth = 0.7;
        g.beginPath();
        for (let i = 0; i <= 180; i++) {
          const q = (i / 180) * Math.PI * 2,
            rr =
              r +
              Math.sin(q * 3 + t * 0.25 + j * 0.15 + a.pointer.nx) * (3 + a.amount * 9) +
              Math.cos(q * 7 - t * 0.12) * a.amount * 3;
          const x = Math.cos(q) * rr,
            y = Math.sin(q) * rr * 0.85;
          i ? g.lineTo(x, y) : g.moveTo(x, y);
        }
        g.closePath();
        g.stroke();
      }
    });
  });
  // @effect rose
  register('rose', (root, a) => {
    a.background('#2d293d');
    let color = 0;
    a.on(root, 'click', () => (color = (color + 1) % 5));
    a.canvas((g, w, h, t) => {
      g.translate(w / 2, h / 2);
      g.rotate(t * 0.045);
      const k = 2 + Math.round(a.amount * 7),
        r = Math.min(w, h) * 0.37;
      g.strokeStyle = palette[color];
      g.lineWidth = 0.8;
      g.beginPath();
      for (let i = 0; i <= 1100; i++) {
        const q = (i / 1100) * Math.PI * 2,
          rr = Math.cos(k * q) * r;
        const x = Math.cos(q) * rr,
          y = Math.sin(q) * rr;
        i ? g.lineTo(x, y) : g.moveTo(x, y);
      }
      g.stroke();
    });
  });
  // @effect noise
  register('noise', (root, a) => {
    a.background('#394b3b');
    let hue = 0;
    a.on(root, 'click', () => (hue = (hue + 50) % 240));
    a.canvas((g, w, h, t) => {
      const s = 6 + Math.round(a.amount * 15);
      for (let x = 0; x < w; x += s)
        for (let y = 0; y < h; y += s) {
          const n =
            (Math.sin(x * 0.03 + t * 0.2) +
              Math.cos(y * 0.035 - t * 0.3) +
              Math.sin((x + y) * 0.02 + t * 0.15)) /
            3;
          g.fillStyle = `hsl(${82 + hue + n * 18} 22% ${39 + n * 22}%)`;
          g.fillRect(x, y, s - 1, s - 1);
        }
    });
  });
  // @effect tree
  register('tree', (root, a) => {
    a.background('#e5e3d5');
    a.canvas((g, w, h, t) => {
      const angle = 0.22 + a.amount * 0.65 + a.pointer.nx * 0.15;
      function branch(x, y, len, theta, depth) {
        if (!depth) return;
        const xx = x + Math.sin(theta) * len,
          yy = y - Math.cos(theta) * len;
        g.strokeStyle = depth < 3 ? '#8c9c76' : '#606e54';
        g.lineWidth = depth * 0.52;
        path(g, [
          [x, y],
          [xx, yy]
        ]);
        g.stroke();
        branch(xx, yy, len * 0.71, theta - angle, depth - 1);
        branch(xx, yy, len * 0.71, theta + angle * 0.91, depth - 1);
      }
      branch(w / 2, h * 0.88, h * 0.23, Math.sin(t * 0.2) * 0.025, 8);
    });
  });
  // @effect voronoi
  register('voronoi', (root, a) => {
    a.background('#aebfa4');
    let seeds = [];
    function reset() {
      const r = rng(Math.random() * 1e6);
      seeds = Array.from({ length: 16 }, () => [r(), r()]);
    }
    reset();
    a.on(root, 'click', reset);
    a.canvas((g, w, h, t) => {
      const points = seeds.map(([x, y], i) => [
        x * w + Math.sin(t * 0.12 + i) * a.amount * 12,
        y * h + Math.cos(t * 0.14 + i) * a.amount * 12
      ]);
      points.forEach((s, i) => {
        let poly = [
          [0, 0],
          [w, 0],
          [w, h],
          [0, h]
        ];
        points.forEach((p, j) => {
          if (j === i || !poly.length) return;
          const nx = p[0] - s[0],
            ny = p[1] - s[1],
            limit = (p[0] * p[0] + p[1] * p[1] - s[0] * s[0] - s[1] * s[1]) / 2;
          const next = [];
          for (let k = 0; k < poly.length; k++) {
            const A = poly[k],
              B = poly[(k + 1) % poly.length],
              da = A[0] * nx + A[1] * ny - limit,
              db = B[0] * nx + B[1] * ny - limit;
            if (da <= 0) next.push(A);
            if (da <= 0 !== db <= 0) {
              const q = da / (da - db);
              next.push([A[0] + (B[0] - A[0]) * q, A[1] + (B[1] - A[1]) * q]);
            }
          }
          poly = next;
        });
        g.fillStyle = `hsl(${83 + i * 2} 18% ${48 + (i % 5) * 7}%)`;
        g.strokeStyle = '#dce6c288';
        g.lineWidth = 1.4;
        path(g, poly, true);
        g.fill();
        g.stroke();
        circle(g, s[0], s[1], 1.5, '#f0f2cf99');
      });
    });
  });
  // @effect spiro
  register('spiro', (root, a) => {
    a.background('#23303f');
    let hue = 0;
    a.on(root, 'click', () => (hue += 45));
    a.canvas((g, w, h, t) => {
      const R = Math.min(w, h) * 0.29,
        k = 3 + Math.round(a.amount * 9);
      g.translate(w / 2, h / 2);
      g.rotate(t * 0.035);
      g.strokeStyle = `hsl(${185 + hue} 35% 74%)`;
      g.lineWidth = 0.65;
      g.beginPath();
      for (let i = 0; i <= 1600; i++) {
        const q = (i / 1600) * Math.PI * 2,
          x = R * Math.cos(q) + R * 0.38 * Math.cos(k * q),
          y = R * Math.sin(q) - R * 0.38 * Math.sin(k * q);
        i ? g.lineTo(x, y) : g.moveTo(x, y);
      }
      g.stroke();
    });
  });
  // @effect rain
  register('rain', (root, a) => {
    a.background('#162a22');
    let alt = false;
    const chars = ['01アイウエオカキクケコ', 'FORM0123456789'];
    a.on(root, 'click', () => (alt = !alt));
    a.canvas((g, w, h, t) => {
      const size = 11 + Math.round((1 - a.amount) * 10),
        cols = Math.floor(w / size);
      g.font = `${size - 2}px monospace`;
      for (let i = 0; i < cols; i++) {
        const y = ((t * (18 + (i % 5) * 7) + i * 53) % (h + 160)) - 80;
        for (let j = 0; j < 9; j++) {
          g.fillStyle = j === 0 ? '#e1efc7' : `rgba(141,183,123,${0.7 - j * 0.075})`;
          const s = chars[alt ? 1 : 0];
          g.fillText(s[(i * 7 + j + Math.floor(t * 2)) % s.length], i * size, y - j * size);
        }
      }
    });
  });
  // @effect terrain
  register('terrain', (root, a) => {
    a.background('#222c36');
    a.canvas((g, w, h, t) => {
      const project = (x, z) => {
        const height =
            (Math.sin(x * 0.55 + t * 0.25) +
              Math.cos(z * 0.6 + t * 0.3) +
              Math.sin(x * 0.3 + z * 0.4)) *
            (3 + a.amount * 20),
          f = 1 / (0.7 + z * 0.055);
        return [
          w / 2 + x * w * 0.033 * f + a.pointer.nx * z * 0.15,
          h * 0.39 + (h * 0.43 - z * 5 - height) * f
        ];
      };
      g.strokeStyle = '#96bca87a';
      g.lineWidth = 0.65;
      for (let z = 1; z < 25; z++) {
        path(
          g,
          Array.from({ length: 27 }, (_, i) => project(i - 13, z))
        );
        g.stroke();
      }
      for (let x = -13; x <= 13; x++) {
        path(
          g,
          Array.from({ length: 24 }, (_, i) => project(x, i + 1))
        );
        g.stroke();
      }
    });
  });
  // @effect reaction
  register('reaction', (root, a) => {
    a.background('#182b27');
    const W = 80,
      H = 56,
      N = W * H,
      buffer = document.createElement('canvas');
    buffer.width = W;
    buffer.height = H;
    const bg = buffer.getContext('2d'),
      image = bg.createImageData(W, H);
    let A = new Float32Array(N).fill(1),
      B = new Float32Array(N),
      nextA = new Float32Array(N),
      nextB = new Float32Array(N),
      acc = 0;
    function seed(x, y) {
      for (let yy = -3; yy <= 3; yy++)
        for (let xx = -3; xx <= 3; xx++) {
          const i = ((y + yy + H) % H) * W + ((x + xx + W) % W);
          A[i] = 0.45;
          B[i] = 0.9;
        }
    }
    for (const [x, y] of [
      [14, 12],
      [39, 11],
      [65, 12],
      [25, 29],
      [55, 30],
      [12, 44],
      [39, 44],
      [68, 44]
    ])
      seed(x, y);
    function step() {
      const feed = 0.027 + a.amount * 0.026,
        kill = 0.061;
      for (let y = 0; y < H; y++)
        for (let x = 0; x < W; x++) {
          const i = y * W + x,
            l = y * W + ((x + W - 1) % W),
            r = y * W + ((x + 1) % W),
            u = ((y + H - 1) % H) * W + x,
            d = ((y + 1) % H) * W + x;
          let lapA = -A[i] + 0.2 * (A[l] + A[r] + A[u] + A[d]),
            lapB = -B[i] + 0.2 * (B[l] + B[r] + B[u] + B[d]);
          for (const yy of [-1, 1])
            for (const xx of [-1, 1]) {
              const j = ((y + yy + H) % H) * W + ((x + xx + W) % W);
              lapA += 0.05 * A[j];
              lapB += 0.05 * B[j];
            }
          const react = A[i] * B[i] * B[i];
          nextA[i] = clamp(A[i] + lapA - react + feed * (1 - A[i]));
          nextB[i] = clamp(B[i] + 0.5 * lapB + react - (kill + feed) * B[i]);
        }
      [A, nextA] = [nextA, A];
      [B, nextB] = [nextB, B];
    }
    for (let n = 0; n < 280; n++) step();
    a.on(root, 'pointerdown', () => {
      seed(
        Math.floor(clamp(a.pointer.x / root.clientWidth, 0, 0.999) * W),
        Math.floor(clamp(a.pointer.y / root.clientHeight, 0, 0.999) * H)
      );
      a.repaint();
    });
    a.canvas((g, w, h, t, dt) => {
      acc += dt * 140;
      const steps = Math.min(8, Math.floor(acc));
      acc -= steps;
      for (let i = 0; i < steps; i++) step();
      for (let i = 0; i < N; i++) {
        const v = clamp((B[i] - 0.045) * 3.2),
          j = i * 4;
        image.data[j] = 23 + v * 182;
        image.data[j + 1] = 48 + v * 177;
        image.data[j + 2] = 42 + v * 109;
        image.data[j + 3] = 255;
      }
      bg.putImageData(image, 0, 0);
      g.imageSmoothingEnabled = true;
      g.drawImage(buffer, 0, 0, w, h);
    });
  });
  // @effect life
  register('life', (root, a) => {
    a.background('#192b24');
    const W = 32,
      H = 20;
    let cells = new Uint8Array(W * H),
      next = new Uint8Array(W * H),
      running = false,
      generation = 0,
      last = 0,
      previousAmount = a.amount;
    a.html(
      '<div class="fx-life-tools"><button data-run aria-pressed="false">▷ 演化</button><button data-step>单步</button><button data-seed>播种</button><button data-clear>清空</button><span data-generation>G 0</span></div>'
    );
    function reseed() {
      const random = rng(17);
      cells = Uint8Array.from({ length: W * H }, () => (random() < 0.12 + a.amount * 0.4 ? 1 : 0));
      generation = 0;
    }
    reseed();
    function step() {
      for (let y = 0; y < H; y++)
        for (let x = 0; x < W; x++) {
          let n = 0;
          for (let dy = -1; dy <= 1; dy++)
            for (let dx = -1; dx <= 1; dx++)
              if (dx || dy) n += cells[((y + dy + H) % H) * W + ((x + dx + W) % W)];
          const i = y * W + x;
          next[i] = n === 3 || (n === 2 && cells[i]) ? 1 : 0;
        }
      [cells, next] = [next, cells];
      generation++;
    }
    const canvas = a.canvas((g, w, h, t, dt) => {
      if (previousAmount !== a.amount) {
        previousAmount = a.amount;
        reseed();
      }
      if (running && dt > 0 && t - last > 0.17) {
        step();
        last = t;
      }
      const sx = w / W,
        sy = (h - 40) / H;
      for (let y = 0; y < H; y++)
        for (let x = 0; x < W; x++) {
          g.fillStyle = cells[y * W + x] ? '#c0d99d' : '#68856215';
          g.fillRect(x * sx + 1, y * sy + 1, Math.max(1, sx - 2), Math.max(1, sy - 2));
        }
      a.$('[data-generation]').textContent = 'G ' + generation;
      root.dataset.generation = generation;
      root.dataset.population = cells.reduce((s, v) => s + v, 0);
    });
    a.on(canvas, 'pointerdown', (e) => {
      const r = canvas.getBoundingClientRect(),
        x = Math.floor(((e.clientX - r.left) / r.width) * W),
        y = Math.floor(
          ((((e.clientY - r.top) / r.height) * root.clientHeight) / (root.clientHeight - 40)) * H
        );
      if (x >= 0 && x < W && y >= 0 && y < H) {
        const i = y * W + x;
        cells[i] = 1 - cells[i];
        a.repaint();
      }
    });
    a.on(a.$('[data-step]'), 'click', () => {
      step();
      a.repaint();
    });
    a.on(a.$('[data-seed]'), 'click', () => {
      reseed();
      a.repaint();
    });
    a.on(a.$('[data-clear]'), 'click', () => {
      cells.fill(0);
      generation = 0;
      a.repaint();
    });
    a.on(a.$('[data-run]'), 'click', () => {
      running = !running;
      last = a.time;
      a.$('[data-run]').textContent = running ? 'Ⅱ 暂停' : '▷ 演化';
      a.$('[data-run]').setAttribute('aria-pressed', running);
    });
  });
  // @effect truchet
  register('truchet', (root, a) => {
    a.background('#e7decb');
    let seed = 64;
    a.on(root, 'click', () => {
      seed += 29;
      a.repaint();
    });
    a.canvas((g, w, h) => {
      const size = 18 + a.amount * 40,
        random = rng(seed);
      g.strokeStyle = '#617d6b';
      g.lineWidth = Math.max(1, size * 0.12);
      for (let y = 0; y < h; y += size)
        for (let x = 0; x < w; x += size) {
          g.save();
          g.beginPath();
          g.rect(x, y, size, size);
          g.clip();
          if (random() > 0.5) {
            g.beginPath();
            g.arc(x, y, size / 2, 0, Math.PI / 2);
            g.stroke();
            g.beginPath();
            g.arc(x + size, y + size, size / 2, Math.PI, Math.PI * 1.5);
            g.stroke();
          } else {
            g.beginPath();
            g.arc(x + size, y, size / 2, Math.PI / 2, Math.PI);
            g.stroke();
            g.beginPath();
            g.arc(x, y + size, size / 2, -Math.PI / 2, 0);
            g.stroke();
          }
          g.restore();
        }
    });
  });
  // @effect asciitorus
  register('asciitorus', (root, a) => {
    const L = MuseumLab;
    L.shell(
      a,
      'ASCII / 光与深度，变成字符',
      `<pre class="bc-ascii" role="img" aria-label="旋转的字符环面"></pre><output class="bc-note"></output>`,
      '#151e25',
    );
    let last = -1,
      angle = 0;
    a.loop((t, dt) => {
      angle += dt * a.params.rotation;
      if (t - last < 1 / 12 && dt > 0) return;
      last = t;
      const w = Math.round(a.params.columns),
        h = Math.round(w * 0.44),
        z = new Float32Array(w * h).fill(-Infinity),
        out = Array(w * h).fill(' '),
        ramp = a.params.ramp === 'soft' ? ' .,:;irsXA253hMHGS#9B&@' : ' .-+*#@';
      const ca = Math.cos(angle),
        sa = Math.sin(angle),
        cb = Math.cos(angle * 0.7),
        sb = Math.sin(angle * 0.7);
      function rotate(x, y, z) {
        const yy = y * ca - z * sa,
          zz = y * sa + z * ca;
        return [x * cb - yy * sb, x * sb + yy * cb, zz];
      }
      for (let u = 0; u < 6.2832; u += 0.07)
        for (let v = 0; v < 6.2832; v += 0.11) {
          const cv = Math.cos(v),
            sv = Math.sin(v),
            cu = Math.cos(u),
            su = Math.sin(u),
            [x, y, zz] = rotate((2 + cv) * cu, (2 + cv) * su, sv),
            [nx, ny, nz] = rotate(cv * cu, cv * su, sv),
            depth = 1 / (zz + 6),
            px = Math.round(w / 2 + x * depth * w * 0.8),
            py = Math.round(h / 2 + y * depth * w * 0.36);
          if (px < 0 || py < 0 || px >= w || py >= h) continue;
          const i = py * w + px;
          if (depth > z[i]) {
            z[i] = depth;
            const light = clamp(0.15 + (-nx * 0.2 - ny * 0.5 - nz * 0.8));
            out[i] = ramp[Math.floor(light * (ramp.length - 1))];
          }
        }
      a.$('pre').textContent = Array.from({ length: h }, (_, i) =>
        out.slice(i * w, (i + 1) * w).join(''),
      ).join('\n');
      a.$('pre').style.fontSize =
        Math.min(
          (root.clientWidth - 32) / (w * 0.61),
          (root.clientHeight - 66) / (h * 1.04),
        ) + 'px';
      a.$('output').textContent = `${w} × ${h} · z-buffer · ≤12 Hz`;
      L.state(a, { w, h, angle, occupied: out.filter((c) => c !== ' ').length });
    });
  });
  // @effect boids
  register('boids', (root, a) => {
    const L = MuseumLab,
      M = MuseumMechanics;
    L.shell(
      a,
      'FLOCK / 分离 · 对齐 · 聚合',
      `<div class="bc-toolbar bc-floating"><button data-reset>同种重置</button><button data-step>单步</button></div><output class="bc-note bc-bottom"></output>`,
      '#1c3235',
    );
    const model = L.boids(() => a.params),
      fixed = M.fixedStep(a, (dt) => model.step(dt));
    L.button(a, '[data-reset]', () => {
      model.reset();
      a.repaint();
    });
    L.button(a, '[data-step]', () => {
      model.step(1 / 60);
      a.repaint();
    });
    a.canvas((g, w, h, t, dt) => {
      fixed.advance(dt);
      g.save();
      g.translate(0, 35);
      g.scale(w / 600, (h - 70) / 360);
      model.points.forEach((p, i) => {
        const q = Math.atan2(p.vy, p.vx);
        g.save();
        g.translate(p.x, p.y);
        g.rotate(q);
        g.fillStyle = i % 7 === 0 ? '#e9bb84' : '#aacfb6';
        g.beginPath();
        g.moveTo(7, 0);
        g.lineTo(-4, -3);
        g.lineTo(-2, 0);
        g.lineTo(-4, 3);
        g.closePath();
        g.fill();
        g.restore();
      });
      g.restore();
      const max = Math.max(...model.points.map((p) => Math.hypot(p.vx, p.vy)));
      a.$('output').textContent =
        `${model.points.length} 个体 · 速度上限 95 · 当前 ${max.toFixed(1)}`;
      L.state(a, {
        count: model.points.length,
        maxSpeed: max,
        first: model.points[0],
      });
    });
  });
  // @effect sandwater
  register('sandwater', (root, a) => {
    const L = MuseumLab,
      M = MuseumMechanics;
    L.shell(
      a,
      'CELLS / 沙、水、墙的离散世界',
      `<div class="bc-toolbar bc-floating"><button data-reset>重置</button><button data-clear>清空</button><button data-step>单步</button><button data-pour>中央投料</button></div><output class="bc-note bc-bottom"></output>`,
      '#202c34',
    );
    const model = L.sand();
    let acc = 0;
    const off = document.createElement('canvas');
    off.width = model.w;
    off.height = model.h;
    const ctx = off.getContext('2d'),
      im = ctx.createImageData(model.w, model.h),
      colors = [
        [28, 39, 48],
        [232, 193, 122],
        [98, 166, 197],
        [130, 142, 143],
      ];
    function paint(x, y) {
      model.paint(
        clamp(Math.floor((x / root.clientWidth) * 64), 0, 63),
        clamp(Math.floor(((y - 38) / (root.clientHeight - 76)) * 40), 0, 39),
        Math.round(a.params.brush),
        { sand: 1, water: 2, wall: 3, erase: 0 }[a.params.material],
      );
      a.repaint();
    }
    L.button(a, '[data-reset]', () => {
      model.reset();
      a.repaint();
    });
    L.button(a, '[data-clear]', () => {
      model.cells.fill(0);
      a.repaint();
    });
    L.button(a, '[data-step]', () => {
      model.step();
      a.repaint();
    });
    L.button(a, '[data-pour]', () => paint(root.clientWidth / 2, 52));
    const canvas = a.canvas((g, w, h, t, dt) => {
      acc = Math.min(acc + dt * a.params.rate, 8);
      while (acc >= 1) {
        model.step();
        acc--;
      }
      for (let i = 0; i < model.cells.length; i++) {
        const c = colors[model.cells[i]];
        im.data.set([...c, 255], i * 4);
      }
      ctx.putImageData(im, 0, 0);
      g.imageSmoothingEnabled = false;
      g.drawImage(off, 0, 38, w, h - 76);
      const counts = model.counts();
      a.$('output').textContent =
        `沙 ${counts[1]} · 水 ${counts[2]} · 墙 ${counts[3]} / 封闭边界`;
      L.state(a, { counts });
    });
    canvas.style.touchAction = 'none';
    canvas.tabIndex = 0;
    canvas.setAttribute('aria-label', '材料画布；键盘请用中央投料与单步按钮');
    M.pointers(a, canvas, {
      start: (p) => paint(p.x, p.y),
      move: (p) => paint(p.x, p.y),
    });
    a.onActivity((s) => {
      if (!s.visible || s.paused) acc = 0;
    });
  });
  // @effect clothsolver
  register('clothsolver', (root, a) => {
    const L = MuseumLab,
      M = MuseumMechanics;
    L.shell(
      a,
      'CLOTH / 距离约束，而不是正弦旗帜',
      `<div class="bc-toolbar bc-floating"><button data-reset>复位</button><button data-step>单步</button><button data-tug>拉动中点</button></div><output class="bc-note bc-bottom"></output>`,
      '#322c3e',
    );
    const model = L.cloth(() => a.params),
      fixed = M.fixedStep(a, (dt) => model.step(dt));
    L.button(a, '[data-reset]', () => {
      model.reset();
      a.repaint();
    });
    L.button(a, '[data-step]', () => {
      model.step(1 / 120);
      a.repaint();
    });
    L.button(a, '[data-tug]', () => {
      const p = model.points[93];
      model.grab(p.x, p.y);
      model.move(p.x + 25, p.y + 20);
      model.release();
      a.repaint();
    });
    const canvas = a.canvas((g, w, h, t, dt) => {
      fixed.advance(dt);
      g.save();
      g.translate(0, 35);
      g.scale(w / 600, (h - 70) / 360);
      g.strokeStyle = '#c7b2de90';
      g.lineWidth = 0.85;
      for (const [i, j] of model.links) {
        g.beginPath();
        g.moveTo(model.points[i].x, model.points[i].y);
        g.lineTo(model.points[j].x, model.points[j].y);
        g.stroke();
      }
      model.points.forEach((p, i) => {
        if (model.pinned(i)) circle(g, p.x, p.y, 4, '#f0bd82');
      });
      g.restore();
      a.$('output').textContent =
        `187 质点 · ${model.links.length} 约束 · 拖动节点 / 无自碰撞`;
      L.state(a, {
        held: model.held,
        first: model.points[0],
        last: model.points.at(-1),
        finite: model.points.every(
          (p) => Number.isFinite(p.x) && Number.isFinite(p.y),
        ),
      });
    });
    canvas.style.touchAction = 'none';
    const local = (p) => ({
      x: (p.x / root.clientWidth) * 600,
      y: ((p.y - 35) / (root.clientHeight - 70)) * 360,
    });
    M.pointers(a, canvas, {
      start: (p) => {
        const q = local(p);
        model.grab(q.x, q.y);
      },
      move: (p) => {
        const q = local(p);
        model.move(q.x, q.y);
      },
      end: () => model.release(),
      cancel: () => model.release(),
    });
    a.onActivity((s) => {
      if (!s.visible || s.paused) model.release();
    });
  });
  // @effect wavefield
  register('wavefield', (root, a) => {
    const L = MuseumLab,
      M = MuseumMechanics;
    L.shell(
      a,
      'WAVE / 传播、干涉与边界',
      `<div class="bc-toolbar bc-floating"><button data-source>中央波源</button><button data-double>双源</button><button data-step>单步</button><button data-reset>清空</button></div><output class="bc-note bc-bottom"></output>`,
      '#142d3c',
    );
    const model = L.wave(() => a.params),
      fixed = M.fixedStep(a, () => model.step(), { step: 1 / 60, maxSteps: 8 });
    model.excite(32, 20);
    const off = document.createElement('canvas');
    off.width = 64;
    off.height = 40;
    const ctx = off.getContext('2d'),
      image = ctx.createImageData(64, 40);
    function source(x, y) {
      model.excite(x, y);
      a.repaint();
    }
    L.button(a, '[data-source]', () => source(32, 20));
    L.button(a, '[data-double]', () => {
      source(22, 20);
      source(42, 20);
    });
    L.button(a, '[data-step]', () => {
      model.step();
      a.repaint();
    });
    L.button(a, '[data-reset]', () => {
      model.reset();
      a.repaint();
    });
    let prior = JSON.stringify(a.params);
    a.onParamsChange(() => {
      const next = JSON.stringify(a.params);
      if (next !== prior) {
        model.reset();
        fixed.reset();
        prior = next;
      }
    });
    const canvas = a.canvas((g, w, h, t, dt) => {
      fixed.advance(dt);
      for (let i = 0; i < model.values.length; i++) {
        const v = Math.tanh(model.values[i] * 2);
        image.data.set(
          v >= 0
            ? [24 + v * 185, 54 + v * 151, 70 + v * 91, 255]
            : [24 - v * 69, 54 - v * 52, 70 - v * 159, 255],
          i * 4,
        );
      }
      ctx.putImageData(image, 0, 0);
      g.imageSmoothingEnabled = true;
      g.drawImage(off, 0, 38, w, h - 76);
      a.$('output').textContent =
        `64 × 40 · 能量指标 ${model.energy().toFixed(3)} · 调参清场`;
      L.state(a, {
        energy: model.energy(),
        max: Math.max(...model.values.map(Math.abs)),
      });
    });
    a.on(canvas, 'click', (e) => {
      const p = M.point(canvas, e);
      source(
        (p.x / root.clientWidth) * 64,
        ((p.y - 38) / (root.clientHeight - 76)) * 40,
      );
    });
  });

})();
