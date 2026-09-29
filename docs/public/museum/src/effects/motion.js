(() => {
  const { register, circle, path, clamp, palette } = Museum;
  // @effect orbit
  register('orbit', (root, a) => {
    a.background('#242637');
    let dir = 1;
    a.on(root, 'click', () => (dir *= -1));
    a.canvas((g, w, h, t) => {
      g.translate(w / 2, h / 2);
      g.rotate(-0.35);
      const n = 3 + Math.round(a.amount * 4);
      for (let i = 0; i < n; i++) {
        const rx = w * (0.13 + i * 0.039),
          ry = rx * 0.45;
        g.strokeStyle = '#c5bfde30';
        g.lineWidth = 0.7;
        g.beginPath();
        g.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        g.stroke();
        const phase = t * dir * (0.28 + i * 0.08) + i;
        circle(g, Math.cos(phase) * rx, Math.sin(phase) * ry, 3 + i * 0.4, palette[i % 5]);
      }
      circle(g, 0, 0, 8, '#e6dcae');
    });
  });
  // @effect spring
  register('spring', (root, a) => {
    a.background('#d9e0d2');
    let x = 0.3,
      v = 0;
    a.on(root, 'pointerdown', () => (v = -3));
    a.canvas((g, w, h, t, dt) => {
      v += (-x * 70 - v * (3 + a.amount * 14)) * dt;
      x += v * dt;
      const y = h * 0.56 + x * h * 0.34;
      g.strokeStyle = '#8c9f82';
      g.lineWidth = 1.5;
      g.beginPath();
      g.moveTo(w / 2, 35);
      for (let i = 1; i < 18; i++) g.lineTo(w / 2 + (i % 2 ? 10 : -10), 35 + ((y - 60) / 18) * i);
      g.lineTo(w / 2, y - 20);
      g.stroke();
      g.fillStyle = '#4e6b49';
      g.fillRect(w / 2 - 23, y - 20, 46, 40);
      g.fillStyle = '#84937b';
      g.fillRect(w / 2 - 22, 30, 44, 2);
    });
  });
  // @effect wave
  register('wave', (root, a) => {
    a.background('#ddd6e7');
    a.canvas((g, w, h, t) => {
      const n = 23,
        step = (w * 0.73) / n;
      for (let i = 0; i < n; i++) {
        const v = Math.sin(i * (0.18 + a.amount * 0.52) - t * 1.4 + a.pointer.nx);
        g.fillStyle = `hsl(${265 + i * 1.3} 24% ${44 + v * 12}%)`;
        g.beginPath();
        g.roundRect(
          w * 0.14 + i * step,
          h / 2 - (16 + v * 12) * 1.5,
          Math.max(3, step * 0.48),
          (16 + v * 12) * 3,
          5
        );
        g.fill();
      }
    });
  });
  // @effect loader
  register('loader', (root, a) => {
    a.background('#25342c');
    let fast = false;
    a.on(root, 'click', () => (fast = !fast));
    a.canvas((g, w, h, t) => {
      const n = 12;
      for (let i = 0; i < n; i++) {
        const angle = (i / n) * Math.PI * 2,
          v = (Math.sin(angle - t * (fast ? 4 : 2) * (0.5 + a.amount * 1.5)) + 1) / 2;
        circle(
          g,
          w / 2 + Math.cos(angle) * 35,
          h / 2 + Math.sin(angle) * 35,
          2 + v * 3,
          `rgba(215,230,173,${0.13 + v * 0.85})`
        );
      }
    });
  });
  // @effect morph
  register('morph', (root, a) => {
    a.background('#eeded0');
    let seed = 0;
    a.on(root, 'click', () => (seed += 2.4));
    a.canvas((g, w, h, t) => {
      const r = Math.min(w, h) * 0.27;
      g.translate(w / 2, h / 2);
      const grad = g.createLinearGradient(-r, -r, r, r);
      grad.addColorStop(0, '#b68378');
      grad.addColorStop(1, '#d6a38d');
      g.fillStyle = grad;
      g.beginPath();
      for (let i = 0; i <= 180; i++) {
        const angle = (i / 180) * Math.PI * 2,
          rr =
            r *
            (1 +
              Math.sin(angle * 3 + t * 0.6 + seed) * (0.08 + a.amount * 0.16) +
              Math.cos(angle * 5 - t * 0.3) * a.amount * 0.09),
          x = Math.cos(angle) * rr,
          y = Math.sin(angle) * rr;
        i ? g.lineTo(x, y) : g.moveTo(x, y);
      }
      g.closePath();
      g.fill();
    });
  });
  // @effect pendulum
  register('pendulum', (root, a) => {
    a.background('#1e2d31');
    let start = 0;
    a.on(root, 'click', () => (start = a.time));
    a.canvas((g, w, h, t) => {
      const n = 11;
      for (let i = 0; i < n; i++) {
        const x = w * 0.15 + i * w * 0.07,
          y = 36,
          len = h * 0.57,
          angle = Math.sin((t - start) * (1 + i * (0.018 + a.amount * 0.038))) * 0.48;
        g.strokeStyle = '#d0dfc52a';
        g.lineWidth = 1;
        path(g, [
          [x, y],
          [x + Math.sin(angle) * len, y + Math.cos(angle) * len]
        ]);
        g.stroke();
        circle(
          g,
          x + Math.sin(angle) * len,
          y + Math.cos(angle) * len,
          4,
          `hsl(${135 + i * 6} 25% ${67 + i}%)`
        );
      }
    });
  });
  // @effect path
  register('path', (root, a) => {
    a.background('#e0e5d3');
    a.canvas((g, w, h, t) => {
      const point = (q) => [
        w / 2 + Math.cos(q) * w * 0.32,
        h / 2 + Math.sin(q * 2) * h * (0.1 + a.amount * 0.17)
      ];
      g.strokeStyle = '#8e9f773f';
      g.setLineDash([3, 4]);
      g.lineWidth = 1;
      path(
        g,
        Array.from({ length: 181 }, (_, i) => point((i / 180) * Math.PI * 2))
      );
      g.stroke();
      g.setLineDash([]);
      const q = t * 0.7 + a.pointer.nx * 0.4,
        [x, y] = point(q),
        [xx, yy] = point(q + 0.01);
      g.translate(x, y);
      g.rotate(Math.atan2(yy - y, xx - x));
      g.fillStyle = '#657d4b';
      path(
        g,
        [
          [10, 0],
          [-8, -6],
          [-4, 0],
          [-8, 6]
        ],
        true
      );
      g.fill();
    });
  });
  // @effect stagger
  register('stagger', (root, a) => {
    a.background('#28263b');
    let start = 0;
    a.on(root, 'click', () => (start = a.time));
    a.canvas((g, w, h, t) => {
      const s = Math.min(w / 10, h / 7);
      for (let x = 0; x < 7; x++)
        for (let y = 0; y < 5; y++) {
          const d = Math.hypot(x - 3, y - 2),
            v = (Math.sin((t - start) * 1.4 - d * (0.3 + a.amount * 0.7)) + 1) / 2;
          g.fillStyle = `rgba(188,171,222,${0.2 + v * 0.7})`;
          g.save();
          g.translate(w / 2 + (x - 3) * s, h / 2 + (y - 2) * s);
          g.rotate(v * 0.3);
          g.fillRect(-s * v * 0.34, -s * v * 0.34, s * v * 0.68, s * v * 0.68);
          g.restore();
        }
    });
  });
  // @effect flipclock
  register('flipclock', (root, a) => {
    a.background('#252a27');
    let count = 24,
      changed = -10;
    a.html(
      '<button class="fx-type-button" aria-label="增加翻页计数"><div style="display:flex;gap:7px" data-digits></div><span class="fx-label">A MOMENT, COUNTED.</span></button>'
    );
    const draw = () => {
      a.$('[data-digits]').innerHTML = String(count)
        .padStart(2, '0')
        .split('')
        .map(
          (n) =>
            `<span style="position:relative;display:block;background:linear-gradient(#3b453b 49%,#172319 50%,#323e33 51%);border-radius:6px;padding:10px 13px;color:#d8dfcd;font:42px Georgia;box-shadow:0 5px 0 #19211b">${n}</span>`
        )
        .join('');
    };
    draw();
    a.on(a.$('button'), 'click', () => {
      count = (count + 1 + Math.round(a.amount * 8)) % 100;
      changed = a.time;
      draw();
    });
    a.loop((t) => {
      const p = clamp((t - changed) / 0.45);
      a.$('[data-digits]').style.transform =
        `perspective(400px) rotateX(${Math.sin(p * Math.PI) * -25}deg)`;
    });
  });
  // @effect equalizer
  register('equalizer', (root, a) => {
    a.background('#2e303f');
    let seed = 1;
    a.on(root, 'click', () => (seed += 1.7));
    a.canvas((g, w, h, t) => {
      for (let i = 0; i < 22; i++) {
        const v =
            (Math.sin(t * (1.6 + Math.sin(i * seed) * 0.7) + i * 0.7) +
              Math.cos(t * 0.9 + i * 1.3) +
              2) /
            4,
          bh = 12 + v * h * (0.15 + a.amount * 0.42),
          x = w * 0.15 + i * w * 0.032;
        const grad = g.createLinearGradient(0, h * 0.7 - bh, 0, h * 0.7);
        grad.addColorStop(0, '#d7c0de');
        grad.addColorStop(1, '#8a7cac');
        g.fillStyle = grad;
        g.beginPath();
        g.roundRect(x, h * 0.7 - bh, w * 0.016, bh, 3);
        g.fill();
      }
      g.fillStyle = '#a8a4b988';
      g.font = '7px monospace';
      g.textAlign = 'center';
      g.fillText('VISUAL RHYTHM / NO AUDIO', w / 2, h * 0.82);
    });
  });
  // @effect easingrace
  register('easingrace', (root, a) => {
    a.background('#283443');
    let start = -0.5;
    a.html('<button class="bc-race-replay">重跑五条曲线</button>');
    a.on(root, 'click', () => {
      start = a.time;
      a.repaint();
    });
    function bezier(x, p1, p2) {
      const sample = (t, a, b) =>
        3 * (1 - t) ** 2 * t * a + 3 * (1 - t) * t * t * b + t ** 3;
      let lo = 0,
        hi = 1;
      for (let i = 0; i < 18; i++) {
        const m = (lo + hi) / 2;
        if (sample(m, p1[0], p2[0]) < x) lo = m;
        else hi = m;
      }
      return sample((lo + hi) / 2, p1[1], p2[1]);
    }
    a.canvas((g, w, h, t) => {
      const duration = a.params.duration / 1000,
        x = clamp(((t - start) % (duration + 1)) / duration),
        k = 0.15 + a.amount * 0.7,
        positions = [
          x,
          bezier(x, [k, 0], [1, 1]),
          bezier(x, [0, 0], [1 - k, 1]),
          bezier(x, [0.42, 0], [0.58, 1]),
          bezier(x, [0.34, 1.56], [0.64, 1]),
        ],
        labels = [
          'LINEAR',
          'EASE IN',
          'EASE OUT',
          'EASE IN OUT',
          'BACK / OVERSHOOT',
        ];
      MuseumLab.state(a, { progress: x, positions });
      positions.forEach((v, i) => {
        const y = h * (0.24 + i * 0.145);
        g.strokeStyle = '#ffffff21';
        g.lineWidth = 1;
        path(g, [
          [w * 0.17, y],
          [w * 0.74, y],
        ]);
        g.stroke();
        circle(g, w * (0.17 + v * 0.57), y, 5, palette[i]);
        g.fillStyle = '#c6cdda88';
        g.font = `${Math.max(5, w * 0.023)}px monospace`;
        g.fillText(labels[i], w * 0.17, y - 12);
      });
    });
  });
  // @effect domino
  register('domino', (root, a) => {
    a.background('#dcc8b4');
    let start = -0.2,
      reverse = false;
    a.html(
      '<button class="fx-domino-scene" aria-label="改变倾倒方向">' +
        Array.from(
          { length: 10 },
          (_, i) =>
            `<span class="fx-domino" style="background:hsl(${24 + i * 2} 24% ${40 + i * 2}%)"><i></i></span>`
        ).join('') +
        '</button>'
    );
    a.on(a.$('button'), 'click', () => {
      start = a.time;
      reverse = !reverse;
    });
    a.loop((t) => {
      a.$$('.fx-domino').forEach((el, i) => {
        const order = reverse ? 9 - i : i,
          phase = (((t - start - order * (0.055 + a.amount * 0.13)) % 4) + 4) % 4,
          k =
            phase < 0.5
              ? Math.sin(((phase / 0.5) * Math.PI) / 2)
              : phase < 2.1
                ? 1
                : phase < 2.8
                  ? 1 - (phase - 2.1) / 0.7
                  : 0;
        el.style.transform = `rotateX(${k * -72}deg)`;
      });
    });
  });
  // @effect anticipation
  register('anticipation', (root, a) => {
    const X = MuseumExpansion;
    let start = -4;
    a.background('#dce3d6');
    a.html(
      '<button class="nx-anticipate" aria-label="同时发射两枚火箭"><div><span>WITHOUT</span><b data-rocket>↑<em class="nx-exhaust" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></em></b></div><div><span>WITH ANTICIPATION</span><b data-rocket>↑<em class="nx-exhaust" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></em></b></div><small>点击发令 / CLICK TO LAUNCH</small></button>'
    );
    a.on(a.$('button'), 'click', () => (start = a.time));
    a.loop((t) => {
      const dt = t - start,
        delay = 0.15 + a.amount * 0.5;
      a.$$('[data-rocket]').forEach((r, i) => {
        let x = 0,
          y = 0,
          scale = 1,
          alpha = 1;
        if (dt < 0 || dt > 3) {
        } else if (i === 1 && dt < delay) {
          const p = dt / delay;
          x = -p * 14;
          y = p * 14;
          scale = 1 - p * 0.1;
        } else {
          const p = clamp((dt - (i ? delay : 0)) / 0.9);
          x = p * 140;
          y = -p * 170;
          alpha = 1 - p;
          scale = 1 + p * 0.1;
        }
        r.style.transform = `translate(${x}px,${y}px) scale(${scale})`;
        r.style.opacity = alpha;
        r.style.textShadow =
          dt >= (i ? delay : 0) && dt < 2 ? '0 13px 0 #dd9943,0 22px 12px #e9b26f' : 'none';
        r.querySelectorAll('.nx-exhaust i').forEach((spark, j) => {
          const age = ((dt - (i ? delay : 0)) * 2 + j / 6 + 10) % 1;
          const active = dt >= (i ? delay : 0) && dt < (i ? delay : 0) + 1.1 && !X.reduced();
          spark.style.transform = `translate(${Math.sin(j * 13) * age * 9}px,${6 + age * 31}px) scale(${1 - age * 0.7})`;
          spark.style.opacity = active ? 1 - age : 0;
        });
      });
    });
  });
  // @effect iconmorph
  register('iconmorph', (root, a) => {
    let play = false,
      menu = false;
    a.background('#27353f');
    a.html(
      '<div class="nx-icons"><button data-play aria-label="播放或暂停" aria-pressed="false"><i class="nx-play-shape"></i><i class="nx-play-shape second"></i></button><button data-menu aria-label="菜单或关闭" aria-expanded="false"><i></i><i></i><i></i></button></div>'
    );
    a.on(a.$('[data-play]'), 'click', () => {
      play = !play;
      a.$('[data-play]').classList.toggle('on', play);
      a.$('[data-play]').setAttribute('aria-pressed', play);
    });
    a.on(a.$('[data-menu]'), 'click', () => {
      menu = !menu;
      a.$('[data-menu]').classList.toggle('on', menu);
      a.$('[data-menu]').setAttribute('aria-expanded', menu);
    });
    a.loop(() => root.style.setProperty('--icon-duration', (0.2 + a.amount * 0.7) / a.speed + 's'));
  });
  // @effect shared
  register('shared', (root, a) => {
    const X = MuseumExpansion;
    let flight = null;
    a.background('#e1dacc');
    a.html(
      '<div class="nx-shared"><div class="nx-thumbs">' +
        ['FORM', 'LIGHT', 'TIME']
          .map(
            (s, i) =>
              `<button data-pick="${i}" style="background:${['#98aa89', '#cbb58f', '#bba5bd'][i]}">${s}</button>`
          )
          .join('') +
        '</div><div class="nx-shared-detail"><span>CHOOSE A STUDY ↑</span></div></div>'
    );
    function clear() {
      if (flight) {
        flight.clone.remove();
        flight = null;
      }
    }
    a.cleanup(clear);
    a.on(window, 'resize', clear);
    a.$$('[data-pick]').forEach((b) =>
      a.on(b, 'click', () => {
        clear();
        const source = b.getBoundingClientRect(),
          dest = a.$('.nx-shared-detail').getBoundingClientRect(),
          clone = b.cloneNode(true);
        clone.className = 'nx-shared-fly';
        clone.tabIndex = -1;
        clone.setAttribute('aria-hidden', 'true');
        clone.style.cssText = `position:fixed;left:${dest.left}px;top:${dest.top}px;width:${dest.width}px;height:${dest.height}px;background:${b.style.background};transform-origin:0 0;z-index:100000;pointer-events:none;`;
        (root.closest('dialog') || document.body).append(clone);
        flight = {
          clone,
          start: a.time,
          source,
          dest,
          text: b.textContent,
          color: b.style.background
        };
        a.repaint();
      })
    );
    a.loop((t) => {
      if (!flight) return;
      const { clone, source, dest } = flight,
        p = X.reduced() ? 1 : X.ease((t - flight.start) / (0.3 + a.amount * 0.9));
      clone.style.transform = `translate(${(source.left - dest.left) * (1 - p)}px,${(source.top - dest.top) * (1 - p)}px) scale(${source.width / dest.width + (1 - source.width / dest.width) * p},${source.height / dest.height + (1 - source.height / dest.height) * p})`;
      if (p >= 1) {
        a.$('.nx-shared-detail').style.background = flight.color;
        a.$('.nx-shared-detail span').textContent = flight.text + ' / OPEN STUDY';
        root.dataset.selected = flight.text;
        clear();
      }
    });
  });
  // @effect skeleton
  register('skeleton', (root, a) => {
    let start = 0;
    a.background('#e1e5dd');
    a.html(
      '<div class="nx-skeleton"><button class="nx-reload">重新加载 ↻</button><div class="nx-sk-avatar"></div>' +
        ['A quieter interface.', '先等待，再让内容自然出现。', 'LOCAL LOADING DEMO']
          .map((s) => `<div class="nx-sk-row"><span>${s}</span></div>`)
          .join('') +
        '</div>'
    );
    a.on(a.$('button'), 'click', () => (start = a.time));
    a.loop((t) => {
      const dt = t - start,
        wait = 0.7 + a.amount * 1.4,
        loaded = dt >= wait || MuseumExpansion.reduced();
      root.dataset.loaded = loaded;
      root.style.setProperty('--shimmer-pos', ((t * 0.7) % 2) * 200 - 100 + '%');
      a.$('.nx-sk-avatar').classList.toggle('loaded', loaded);
      a.$$('.nx-sk-row').forEach((row, i) => {
        row.classList.toggle('loaded', loaded);
        const p = loaded ? clamp((dt - wait - i * 0.09) / 0.35) : 0;
        row.querySelector('span').style.opacity = MuseumExpansion.reduced() ? 1 : p;
        row.querySelector('span').style.transform = `translateY(${(1 - p) * 9}px)`;
      });
    });
  });
// @effect inertia
  register('inertia', (root, a) => {
    const K = MuseumMechanics;
    let w = 300,
      h = 200,
      x = 0,
      y = 0,
      vx = 0,
      vy = 0,
      initialized = false,
      dragging = false,
      offset = { x: 0, y: 0 },
      origin = null,
      trail = [];
    a.background('#21332e');
    a.html(
      '<button class="mx-throw-handle" aria-label="拖动抛掷圆点，也可用方向键移动">↗</button><div class="mx-tools"><button data-launch>发射 ↗</button><button data-reset>复位</button></div><output class="mx-readout"></output>'
    );
    const ball = a.$('.mx-throw-handle'),
      tracker = K.velocity(),
      R = 18;
    const bounds = () => ({
      left: 24 + R,
      right: Math.max(24 + R, w - 24 - R),
      top: 39 + R,
      bottom: Math.max(39 + R, h - 48 - R)
    });
    function contain() {
      const b = bounds();
      x = clamp(x, b.left, b.right);
      y = clamp(y, b.top, b.bottom);
    }
    function reset() {
      x = w * 0.38;
      y = h * 0.44;
      vx = vy = 0;
      trail = [];
      contain();
    }
    const physics = K.fixedStep(a, (dt) => {
      if (dragging) return;
      const p = a.params,
        b = bounds(),
        loss = Math.exp(-p.friction * dt);
      vx *= loss;
      vy *= loss;
      x += vx * dt;
      y += vy * dt;
      if (x < b.left) {
        x = b.left;
        vx = Math.abs(vx) * p.restitution;
      }
      if (x > b.right) {
        x = b.right;
        vx = -Math.abs(vx) * p.restitution;
      }
      if (y < b.top) {
        y = b.top;
        vy = Math.abs(vy) * p.restitution;
      }
      if (y > b.bottom) {
        y = b.bottom;
        vy = -Math.abs(vy) * p.restitution;
      }
    });
    K.pointers(a, ball, {
      start: (p) => {
        const q = K.point(root, p.event);
        dragging = true;
        origin = { x, y };
        offset = { x: q.x - x, y: q.y - y };
        vx = vy = 0;
        tracker.clear();
        tracker.push({ ...q, time: p.time });
      },
      move: (p) => {
        const q = K.point(root, p.event);
        x = q.x - offset.x;
        y = q.y - offset.y;
        contain();
        tracker.push({ ...q, time: p.time });
      },
      end: (p) => {
        dragging = false;
        if (p.cancelled) {
          if (origin) {
            x = origin.x;
            y = origin.y;
          }
          vx = vy = 0;
        } else {
          const v = tracker.read(),
            mag = Math.hypot(v.x, v.y),
            k = mag > a.params.maxSpeed ? a.params.maxSpeed / mag : 1;
          vx = v.x * k;
          vy = v.y * k;
        }
        physics.reset();
      },
      cancel: () => {
        dragging = false;
        if (origin) {
          x = origin.x;
          y = origin.y;
        }
        vx = vy = 0;
      }
    });
    a.on(ball, 'keydown', (e) => {
      if (e.key.startsWith('Arrow')) {
        e.preventDefault();
        vx = vy = 0;
        x += e.key === 'ArrowRight' ? 18 : e.key === 'ArrowLeft' ? -18 : 0;
        y += e.key === 'ArrowDown' ? 18 : e.key === 'ArrowUp' ? -18 : 0;
        contain();
        a.repaint();
      }
    });
    a.on(a.$('[data-launch]'), 'click', () => {
      vx = a.params.maxSpeed * 0.7;
      vy = -a.params.maxSpeed * 0.3;
    });
    a.on(a.$('[data-reset]'), 'click', () => {
      reset();
      physics.reset();
      a.repaint();
    });
    a.canvas((g, width, height, t, dt) => {
      if (initialized && (width !== w || height !== h)) {
        x *= width / w;
        y *= height / h;
      }
      w = width;
      h = height;
      if (!initialized) {
        initialized = true;
        reset();
      }
      contain();
      if (!dragging) physics.advance(dt);
      const mag = Math.hypot(vx, vy);
      if (mag > a.params.maxSpeed) {
        vx *= a.params.maxSpeed / mag;
        vy *= a.params.maxSpeed / mag;
      }
      const b = bounds();
      g.strokeStyle = '#a8c39732';
      g.lineWidth = 1;
      g.setLineDash([3, 5]);
      g.strokeRect(b.left - R, b.top - R, b.right - b.left + 2 * R, b.bottom - b.top + 2 * R);
      g.setLineDash([]);
      if (dt > 0) {
        trail.push([x, y]);
        trail = trail.slice(-35);
      }
      trail.forEach((p, i) =>
        circle(g, p[0], p[1], 1.5, `rgba(175,203,144,${(i / trail.length) * 0.4})`)
      );
      ball.style.left = x + 'px';
      ball.style.top = y + 'px';
      a.$('output').textContent =
        `v ${Math.round(Math.hypot(vx, vy))} px/s · ${dragging ? 'DRAG' : 'INERTIA'}`;
      root.dataset.state = JSON.stringify({ x, y, vx, vy, bounds: b, dragging });
    });
  });
  // @effect squash
  register('squash', (root, a) => {
    const K = MuseumMechanics;
    let w = 300,
      h = 200,
      R = 18,
      y = 45,
      v = 0,
      impact = 0,
      rest = false,
      restAt = 0,
      steps = 0,
      initialized = false;
    root.classList.add('mx-squash');
    a.background('#e5dccb');
    a.html(
      '<div class="mx-tools light"><button data-drop>再次落下</button><button data-step>单步</button></div><output class="mx-readout light"></output>'
    );
    const floor = () => h * 0.76;
    function reset() {
      y = h * 0.32;
      v = 0;
      impact = 0;
      rest = false;
      steps = 0;
    }
    const physics = K.fixedStep(a, (dt) => {
      steps++;
      impact *= Math.exp(-dt * 11);
      if (rest) return;
      v += a.params.gravity * dt;
      y += v * dt;
      if (y > floor() - R) {
        y = floor() - R;
        impact = Math.min(1, Math.abs(v) / 750);
        v = -Math.abs(v) * a.params.bounce;
        if (Math.abs(v) < 28) {
          v = 0;
          rest = true;
          restAt = a.time;
        }
      }
    });
    a.on(a.$('[data-drop]'), 'click', () => {
      reset();
      physics.reset();
      a.repaint();
    });
    a.on(a.$('[data-step]'), 'click', () => {
      if (rest) reset();
      physics.advance(1 / 60);
      a.repaint();
    });
    a.canvas((g, width, height, t, dt) => {
      if (!initialized) {
        w = width;
        h = height;
        reset();
        initialized = true;
      } else {
        if (w !== width || h !== height) y *= height / h;
        w = width;
        h = height;
      }
      R = Math.max(10, Math.min(23, w * 0.075));
      physics.advance(dt);
      if (rest && a.params.repeat && t - restAt > 1.1) reset();
      const stretch = 1 + a.params.deform * Math.min(1, Math.abs(v) / 800) * 0.45,
        sx = impact > 0.04 ? 1 + a.params.deform * impact : 1 / stretch,
        sy = 1 / sx;
      g.strokeStyle = '#8c957966';
      g.lineWidth = 1;
      path(g, [
        [w * 0.12, floor()],
        [w * 0.88, floor()]
      ]);
      g.stroke();
      g.font = `${Math.max(6, Math.min(11, w * 0.022))}px monospace`;
      g.textAlign = 'center';
      g.fillStyle = '#6b755e';
      g.fillText('SAME PHYSICS', w * 0.3, h * 0.2);
      g.fillText('+ SQUASH / STRETCH', w * 0.7, h * 0.2);
      [w * 0.3, w * 0.7].forEach((cx) => {
        g.fillStyle = '#68694918';
        g.beginPath();
        g.ellipse(cx, floor() + 3, R * (0.6 + clamp(y / floor()) * 0.5), 3, 0, 0, Math.PI * 2);
        g.fill();
      });
      circle(g, w * 0.3, y, R, '#879e88');
      g.save();
      g.translate(w * 0.7, y + R);
      g.scale(sx, sy);
      circle(g, 0, -R, R, '#b99074');
      g.restore();
      a.$('output').textContent = `y ${Math.round(y)} · v ${Math.round(v)} · 单步 ${steps}`;
      root.dataset.state = JSON.stringify({
        rigidY: y,
        softPhysicsY: y,
        velocity: v,
        scaleX: sx,
        scaleY: sy,
        floor: floor(),
        radius: R,
        steps,
        rest
      });
    });
  });

  // @effect originwipe
  register('originwipe', (root, a) => {
    const L = MuseumLab,
      M = MuseumMechanics;
    L.shell(
      a,
      'ORIGIN / 从一个点，进入下一幕',
      `<div class="bc-wipe" tabindex="0" role="button" aria-label="从点击点换场"><div class="bc-world"></div><div class="bc-world bc-incoming" aria-hidden="true"></div></div><div class="bc-toolbar"><button data-next>换场 ↗</button><output role="status"></output></div>`,
    );
    const themes = [
      ['BOTANIC', '慢慢生长', '#294939', '#d4e6a7'],
      ['ORBITAL', '越过边界', '#303154', '#baa8ef'],
      ['SOLAR', '光的另一面', '#724233', '#f0c889'],
    ];
    let active = 0,
      elapsed = 0,
      running = false,
      origin = { x: 0, y: 0 },
      queued = null;
    const area = a.$('.bc-wipe'),
      bottom = a.$('.bc-world'),
      top = a.$('.bc-incoming');
    function paint(el, n) {
      const t = themes[n];
      el.style.background = t[2];
      el.style.color = t[3];
      el.innerHTML = `<i></i><strong>${t[0]}</strong><span>${t[1]}</span>`;
    }
    function publish() {
      a.$('output').textContent =
        `${String(active + 1).padStart(2, '0')} / 03 · ${running ? '换场中' : '点击任意位置'}`;
      L.state(a, { active, running, queued: !!queued, origin });
    }
    function begin(p) {
      if (running) {
        queued = p;
        publish();
        return;
      }
      origin = p;
      elapsed = 0;
      running = true;
      paint(top, (active + 1) % 3);
      top.hidden = false;
      top.style.clipPath = `circle(0px at ${p.x}px ${p.y}px)`;
      if (M.reduced() || a.paused) finish();
      publish();
    }
    function finish() {
      active = (active + 1) % 3;
      paint(bottom, active);
      top.hidden = true;
      running = false;
      const q = queued;
      queued = null;
      publish();
      if (q) begin(q);
    }
    a.on(area, 'click', (e) =>
      begin(
        e.detail
          ? M.point(area, e)
          : { x: area.clientWidth / 2, y: area.clientHeight / 2 },
      ),
    );
    a.on(area, 'keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        begin({ x: area.clientWidth / 2, y: area.clientHeight / 2 });
      }
    });
    L.button(a, '[data-next]', () =>
      begin({ x: area.clientWidth / 2, y: area.clientHeight / 2 }),
    );
    paint(bottom, 0);
    top.hidden = true;
    publish();
    a.loop((t, dt) => {
      if (!running) return;
      elapsed += dt;
      const p = clamp(elapsed / (a.params.duration / 1000));
      const e = 1 - (1 - p) ** 3,
        w = area.clientWidth,
        h = area.clientHeight;
      if (a.params.shape === 'circle') {
        const r =
          Math.hypot(
            Math.max(origin.x, w - origin.x),
            Math.max(origin.y, h - origin.y),
          ) + 2;
        top.style.clipPath = `circle(${e * r}px at ${origin.x}px ${origin.y}px)`;
      } else {
        const r =
          (Math.max(origin.x, w - origin.x) +
            Math.max(origin.y, h - origin.y) +
            2) *
          e;
        top.style.clipPath = `polygon(${origin.x}px ${origin.y - r}px,${origin.x + r}px ${origin.y}px,${origin.x}px ${origin.y + r}px,${origin.x - r}px ${origin.y}px)`;
      }
      if (p >= 1) finish();
    });
  });
  // @effect odometer
  register('odometer', (root, a) => {
    const L = MuseumLab;
    L.shell(
      a,
      'CARRY / 数位沿时间滚动',
      `<div class="bc-odo" role="img" aria-label="当前数值 0">${[0, 1, 2].map(() => `<div class="bc-digit"><div>${Array.from({ length: 30 }, (_, i) => `<span>${i % 10}</span>`).join('')}</div></div>`).join('')}</div><div class="bc-toolbar"><button data-minus>−1</button><button data-plus>+1</button><button data-carry>99 → 100</button></div><output class="bc-note" role="status"></output>`,
      '#25293d',
    );
    let value = 0,
      from = [10, 10, 10],
      pos = [10, 10, 10],
      to = [10, 10, 10],
      elapsed = 0,
      moving = false;
    const strips = a.$$('.bc-digit>div');
    function render() {
      strips.forEach(
        (s, i) => (s.style.transform = `translateY(${-pos[i] * 1.2}em)`),
      );
      L.state(a, { value, positions: pos, moving });
    }
    function target(v) {
      v = ((Math.round(v) % 1000) + 1000) % 1000;
      const direction = v >= value ? 1 : -1;
      from = pos.map((v) => (((v % 10) + 10) % 10) + 10);
      pos = from.slice();
      to = String(v)
        .padStart(3, '0')
        .split('')
        .map((n, i) => {
          let q = Number(n) + 10;
          while (direction > 0 && q < from[i] - 0.001) q += 10;
          while (direction < 0 && q > from[i] + 0.001) q -= 10;
          return q;
        });
      value = v;
      elapsed = 0;
      moving = true;
      a.$('.bc-odo').setAttribute('aria-label', String(value));
      if (a.paused || MuseumMechanics.reduced()) finish();
      render();
    }
    function finish() {
      pos = String(value)
        .padStart(3, '0')
        .split('')
        .map((n) => Number(n) + 10);
      moving = false;
      a.$('output').textContent = `当前数值 ${value}`;
      render();
    }
    L.button(a, '[data-minus]', () => target(value - 1));
    L.button(a, '[data-plus]', () => target(value + 1));
    L.button(a, '[data-carry]', () => {
      value = 99;
      pos = [10, 19, 19];
      target(100);
    });
    a.onParamsChange((p) => target(p.target));
    a.loop((t, dt) => {
      if (!moving) return;
      elapsed += dt * 1000;
      pos = from.map((f, i) => {
        const p = clamp(
          (elapsed - (2 - i) * a.params.stagger) / a.params.duration,
        );
        return f + (to[i] - f) * (1 - (1 - p) ** 3);
      });
      render();
      if (elapsed >= a.params.duration + 2 * a.params.stagger) finish();
    });
  });

})();
