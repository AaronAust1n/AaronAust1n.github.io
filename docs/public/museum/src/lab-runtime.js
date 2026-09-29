/* B/C: bounded local models. No network, storage, timers or audio here. */
window.MuseumLab = (() => {
  const { clamp, rng } = Museum;
  function shell(a, title, markup, color = '#182b30') {
    a.background(color);
    a.html(
      `<section class="bc-shell"><header class="bc-heading">${title}</header>${markup}</section>`,
    );
  }
  function state(a, value) {
    a.root.dataset.state = JSON.stringify(value);
  }
  function button(a, selector, fn) {
    a.on(a.$(selector), 'click', fn);
  }
  function observe(a, element, fn) {
    const ro = new ResizeObserver(() => a.invoke(fn));
    ro.observe(element);
    a.cleanup(() => ro.disconnect());
  }
  function boids(params) {
    let birds = [],
      seed = 53;
    function reset() {
      const random = rng(seed);
      birds = Array.from({ length: Math.round(params().count) }, () => ({
        x: random() * 600,
        y: random() * 360,
        vx: (random() - 0.5) * 90,
        vy: (random() - 0.5) * 90,
      }));
    }
    reset();
    function step(dt) {
      const p = params();
      if (birds.length !== Math.round(p.count)) reset();
      const forces = birds.map((b, i) => {
        let sx = 0,
          sy = 0,
          ax = 0,
          ay = 0,
          cx = 0,
          cy = 0,
          n = 0;
        birds.forEach((o, j) => {
          if (i === j) return;
          // Minimum image on a periodic domain.
          const dx = ((o.x - b.x + 900) % 600) - 300,
            dy = ((o.y - b.y + 540) % 360) - 180,
            d = Math.hypot(dx, dy);
          if (d > 0 && d < p.radius) {
            n++;
            ax += o.vx;
            ay += o.vy;
            cx += dx;
            cy += dy;
            if (d < 30) {
              sx -= dx / (d * d);
              sy -= dy / (d * d);
            }
          }
          if (d === 0) {
            sx += i < j ? -1 : 1;
          }
        });
        let x =
          p.separation * sx * 260 +
          (n
            ? p.alignment * (ax / n - b.vx) * 1.5 +
              ((p.cohesion * cx) / n) * 0.8
            : 0);
        let y =
          p.separation * sy * 260 +
          (n
            ? p.alignment * (ay / n - b.vy) * 1.5 +
              ((p.cohesion * cy) / n) * 0.8
            : 0);
        const len = Math.hypot(x, y);
        if (len > 140) {
          x *= 140 / len;
          y *= 140 / len;
        }
        return { x, y };
      });
      birds.forEach((b, i) => {
        b.vx += forces[i].x * dt;
        b.vy += forces[i].y * dt;
        const v = Math.hypot(b.vx, b.vy);
        if (v > 95) {
          b.vx *= 95 / v;
          b.vy *= 95 / v;
        }
        b.x = (b.x + b.vx * dt + 600) % 600;
        b.y = (b.y + b.vy * dt + 360) % 360;
      });
    }
    return {
      reset,
      step,
      get points() {
        return birds;
      },
    };
  }
  function sand() {
    const w = 64,
      h = 40;
    let cells = new Uint8Array(w * h),
      parity = 0;
    function reset() {
      cells.fill(0);
      for (let y = 4; y < 12; y++)
        for (let x = 21; x < 43; x++) cells[y * w + x] = x < 32 ? 1 : 2;
      for (let x = 14; x < 50; x++) cells[29 * w + x] = 3;
      parity = 0;
    }
    reset();
    function paint(x, y, r, material) {
      for (let j = -r; j <= r; j++)
        for (let i = -r; i <= r; i++)
          if (
            i * i + j * j <= r * r &&
            x + i >= 0 &&
            x + i < w &&
            y + j >= 0 &&
            y + j < h
          )
            cells[(y + j) * w + x + i] = material;
    }
    function step() {
      const moved = new Uint8Array(w * h);
      parity++;
      const swap = (i, j) => {
        [cells[i], cells[j]] = [cells[j], cells[i]];
        moved[i] = moved[j] = 1;
      };
      for (let y = h - 1; y >= 0; y--)
        for (let k = 0; k < w; k++) {
          const x = parity % 2 ? k : w - 1 - k,
            i = y * w + x,
            m = cells[i];
          if (moved[i] || m === 0 || m === 3) continue;
          const dir = (x + y + parity) % 2 ? 1 : -1,
            candidates = [
              [x, y + 1],
              [x + dir, y + 1],
              [x - dir, y + 1],
            ];
          if (m === 2) candidates.push([x + dir, y], [x - dir, y]);
          for (const [nx, ny] of candidates) {
            if (nx < 0 || nx >= w || ny >= h) continue;
            const j = ny * w + nx;
            if (moved[j]) continue;
            if (cells[j] === 0 || (m === 1 && cells[j] === 2 && ny > y)) {
              swap(i, j);
              break;
            }
          }
        }
    }
    return {
      w,
      h,
      reset,
      step,
      paint,
      get cells() {
        return cells;
      },
      counts() {
        return cells.reduce((n, v) => (n[v]++, n), [0, 0, 0, 0]);
      },
    };
  }
  function cloth(params) {
    const cols = 17,
      rows = 11,
      points = [],
      links = [];
    let held = -1,
      time = 0;
    for (let y = 0; y < rows; y++)
      for (let x = 0; x < cols; x++)
        points.push({
          x: 100 + x * 25,
          y: 45 + y * 21,
          ox: 100 + x * 25,
          oy: 45 + y * 21,
          px: 100 + x * 25,
          py: 45 + y * 21,
        });
    for (let y = 0; y < rows; y++)
      for (let x = 0; x < cols; x++) {
        const i = y * cols + x;
        if (x) links.push([i, i - 1, 25]);
        if (y) links.push([i, i - cols, 21]);
      }
    const pinned = (i) =>
      i === held ||
      (i < cols && (params().pins === 'edge' || i === 0 || i === cols - 1));
    function reset() {
      time = 0;
      held = -1;
      points.forEach((p) => {
        p.x = p.px = p.ox;
        p.y = p.py = p.oy;
      });
    }
    function step(dt) {
      time += dt;
      const p = params();
      points.forEach((b, i) => {
        if (pinned(i)) {
          if (i !== held) {
            b.x = b.ox;
            b.y = b.oy;
          }
          b.px = b.x;
          b.py = b.y;
          return;
        }
        const vx = clamp(b.x - b.px, -8, 8) * 0.995,
          vy = clamp(b.y - b.py, -8, 8) * 0.995;
        b.px = b.x;
        b.py = b.y;
        b.x +=
          vx + p.wind * (1 + 0.25 * Math.sin(time * 2 + b.oy * 0.03)) * dt * dt;
        b.y += vy + p.gravity * dt * dt;
      });
      for (let k = 0; k < Math.round(p.iterations); k++) {
        for (const [i, j, l] of links) {
          const b = points[i],
            c = points[j],
            dx = c.x - b.x,
            dy = c.y - b.y,
            d = Math.hypot(dx, dy) || 1,
            wi = pinned(i) ? 0 : 1,
            wj = pinned(j) ? 0 : 1,
            total = wi + wj;
          if (!total) continue;
          const f = (d - l) / d / total;
          b.x += dx * f * wi;
          b.y += dy * f * wi;
          c.x -= dx * f * wj;
          c.y -= dy * f * wj;
        }
        points.forEach((b, i) => {
          if (!pinned(i)) {
            b.x = clamp(b.x, 4, 596);
            b.y = clamp(b.y, 4, 354);
          }
        });
      }
    }
    function grab(x, y) {
      let d = 32;
      held = -1;
      points.forEach((p, i) => {
        const q = Math.hypot(p.x - x, p.y - y);
        if (q < d) {
          d = q;
          held = i;
        }
      });
      move(x, y);
    }
    function move(x, y) {
      if (held >= 0) {
        const p = points[held];
        p.x = p.px = clamp(x, 4, 596);
        p.y = p.py = clamp(y, 4, 354);
      }
    }
    function release() {
      held = -1;
      points.forEach((p) => {
        p.px = p.x;
        p.py = p.y;
      });
    }
    return {
      points,
      links,
      step,
      reset,
      grab,
      move,
      release,
      pinned,
      get held() {
        return held;
      },
    };
  }
  function wave(params) {
    const w = 64,
      h = 40;
    let u = new Float64Array(w * h),
      v = new Float64Array(w * h),
      next = new Float64Array(w * h);
    function reset() {
      u.fill(0);
      v.fill(0);
      next.fill(0);
    }
    function excite(x, y) {
      x = clamp(Math.round(x), 2, w - 3);
      y = clamp(Math.round(y), 2, h - 3);
      for (let j = -1; j <= 1; j++)
        for (let i = -1; i <= 1; i++) {
          const n = (y + j) * w + x + i;
          v[n] = clamp(
            v[n] + params().strength * Math.exp(-(i * i + j * j)),
            -4,
            4,
          );
        }
    }
    function step() {
      const p = params(),
        c2 = p.speed * p.speed;
      for (let y = 0; y < h; y++)
        for (let x = 0; x < w; x++) {
          const i = y * w + x;
          if (
            p.boundary === 'fixed' &&
            (x === 0 || y === 0 || x === w - 1 || y === h - 1)
          ) {
            v[i] = 0;
            next[i] = 0;
            continue;
          }
          const lap =
            u[y * w + Math.max(0, x - 1)] +
            u[y * w + Math.min(w - 1, x + 1)] +
            u[Math.max(0, y - 1) * w + x] +
            u[Math.min(h - 1, y + 1) * w + x] -
            4 * u[i];
          v[i] = (v[i] + c2 * lap) * p.damping;
          next[i] = u[i] + v[i];
        }
      [u, next] = [next, u];
    }
    function energy() {
      let e = 0;
      const c2 = params().speed ** 2;
      for (let y = 0; y < h; y++)
        for (let x = 0; x < w; x++) {
          const i = y * w + x;
          e += v[i] * v[i];
          if (x + 1 < w) e += c2 * (u[i + 1] - u[i]) ** 2;
          if (y + 1 < h) e += c2 * (u[i + w] - u[i]) ** 2;
        }
      return e / 2;
    }
    return {
      w,
      h,
      reset,
      excite,
      step,
      energy,
      get values() {
        return u;
      },
      get velocities() {
        return v;
      },
    };
  }
  function refraction(n1, n2, degrees) {
    const theta = (degrees * Math.PI) / 180,
      s = (n1 / n2) * Math.sin(theta);
    return {
      tir: s > 1,
      incident: theta,
      transmitted: s > 1 ? null : Math.asin(clamp(s, -1, 1)),
      critical: n1 > n2 ? (Math.asin(n2 / n1) * 180) / Math.PI : null,
    };
  }
  return {
    shell,
    state,
    button,
    observe,
    boids,
    sand,
    cloth,
    wave,
    refraction,
  };
})();
