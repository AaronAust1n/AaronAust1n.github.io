(() => {
  const { register, circle, path, clamp, lerp, palette } = Museum;
  // @effect magnet
  register('magnet', (root, a) => {
    a.background('#e6ebdf');
    a.html(
      '<div class="fx-center"><div style="width:130px;height:130px;border:1px dashed #7c967b55;border-radius:50%;position:absolute"></div><button class="fx-button" style="background:#384d3b;color:#e6eed8;position:relative">靠近一点 ↗</button></div>'
    );
    const b = a.$('button');
    let x = 0,
      y = 0;
    a.on(b, 'click', () => {
      b.textContent = b.textContent.includes('你好') ? '靠近一点 ↗' : '你好，灵感 ✳';
    });
    a.loop(() => {
      x = lerp(x, a.pointer.inside ? a.pointer.nx * (15 + a.amount * 30) : 0, 0.12);
      y = lerp(y, a.pointer.inside ? a.pointer.ny * (15 + a.amount * 30) : 0, 0.12);
      b.style.transform = `translate(${x}px,${y}px)`;
    });
  });
  // @effect ripple
  register('ripple', (root, a) => {
    a.background('#183335');
    let waves = [{ x: 0.5, y: 0.5, t: -0.7 }];
    a.on(root, 'pointerdown', () => {
      waves.push({
        x: a.pointer.x / root.clientWidth,
        y: a.pointer.y / root.clientHeight,
        t: a.time
      });
      waves = waves.slice(-12);
    });
    a.canvas((g, w, h, t) => {
      waves = waves.filter((p) => t - p.t < 3);
      for (const p of waves) {
        const age = t - p.t;
        for (let i = 0; i < 3; i++) {
          const r = age * (35 + a.amount * 60) - i * 10;
          if (r > 0) {
            g.strokeStyle = `rgba(183,220,192,${clamp(1 - age / 3) * (0.65 - i * 0.13)})`;
            g.lineWidth = 1;
            circle(g, p.x * w, p.y * h, r);
          }
        }
      }
      if (!waves.length) {
        g.fillStyle = '#a3c1aa66';
        g.font = '10px monospace';
        g.textAlign = 'center';
        g.fillText('CLICK TO MAKE WAVES', w / 2, h / 2);
      }
    });
  });
  // @effect trail
  register('trail', (root, a) => {
    a.background('#262438');
    const points = [];
    a.canvas((g, w, h, t) => {
      if (!points.length)
        for (let i = -35; i < 0; i++) {
          const q = t + i * 0.025;
          points.push([
            w * 0.5 + Math.cos(q * 0.55) * w * 0.24,
            h * 0.5 + Math.sin(q * 1.1) * h * 0.18
          ]);
        }
      const x = a.pointer.inside ? a.pointer.x : w * 0.5 + Math.cos(t * 0.55) * w * 0.24,
        y = a.pointer.inside ? a.pointer.y : h * 0.5 + Math.sin(t * 1.1) * h * 0.18;
      points.push([x, y]);
      while (points.length > 12 + a.amount * 70) points.shift();
      points.forEach(([px, py], i) => {
        g.globalAlpha = i / points.length;
        circle(g, px, py, 1 + (i / points.length) * 4, `hsl(${245 + i * 0.9} 45% 76%)`);
      });
    });
  });
  // @effect elastic
  register('elastic', (root, a) => {
    a.background('#eadbc8');
    root.classList.add('fx-drag');
    let x = 0,
      y = 0,
      vx = 0,
      vy = 0;
    a.on(root, 'pointerdown', (e) => root.setPointerCapture(e.pointerId));
    a.canvas((g, w, h, t, dt) => {
      const tx = a.pointer.down ? a.pointer.x - w / 2 : 0,
        ty = a.pointer.down ? a.pointer.y - h / 2 : 0,
        k = 50 + a.amount * 150;
      vx += (tx - x) * k * dt;
      vy += (ty - y) * k * dt;
      vx *= Math.exp(-9 * dt);
      vy *= Math.exp(-9 * dt);
      x += vx * dt;
      y += vy * dt;
      g.strokeStyle = '#8d7b6544';
      g.setLineDash([3, 4]);
      path(g, [
        [w / 2, h / 2],
        [w / 2 + x, h / 2 + y]
      ]);
      g.stroke();
      g.setLineDash([]);
      circle(g, w / 2, h / 2, 31);
      circle(g, w / 2 + x, h / 2 + y, 25, '#96715e');
      circle(g, w / 2 + x - 6, h / 2 + y - 7, 4, '#cfb499');
    });
  });
  // @effect tilt
  register('tilt', (root, a) => {
    a.background('#282d3a');
    a.html(
      '<div class="fx-3d-scene"><div class="fx-tilt-card"><small>MEMBERSHIP / OUTLINE</small><b>Beyond<br>the surface.</b><span>✳ <small>CURIOUS BY DESIGN</small></span></div></div>'
    );
    a.loop(() => {
      const n = 8 + a.amount * 24;
      a.$('.fx-tilt-card').style.transform =
        `rotateX(${-a.pointer.ny * n}deg) rotateY(${a.pointer.nx * n}deg)`;
    });
  });
  // @effect scratch
  register('scratch', (root, a) => {
    a.background('#272840');
    a.html(
      '<div class="fx-center" style="background:radial-gradient(ellipse at 70% 40%,#806d9a,transparent 60%)"><span class="fx-label">YOU FOUND IT</span><div class="fx-word" style="color:#e3d8f0">HELLO, VOID.</div><span style="font-size:12px">✦　·　✧　·　✦</span></div>'
    );
    const c = document.createElement('canvas');
    c.className = 'effect-canvas fx-scratch-cover';
    root.append(c);
    const g = c.getContext('2d');
    const reset = () => {
      const w = root.clientWidth,
        h = root.clientHeight;
      c.width = w;
      c.height = h;
      g.globalCompositeOperation = 'source-over';
      g.fillStyle = '#acb4a4';
      g.fillRect(0, 0, w, h);
      g.fillStyle = '#53614e';
      g.textAlign = 'center';
      g.font = `italic ${w * 0.12}px Georgia`;
      g.fillText('scratch me', w / 2, h * 0.55);
    };
    const ro = new ResizeObserver(reset);
    ro.observe(root);
    a.cleanup(() => ro.disconnect());
    let prev = null;
    const erase = (e) => {
      const r = c.getBoundingClientRect(),
        x = ((e.clientX - r.left) / r.width) * c.width,
        y = ((e.clientY - r.top) / r.height) * c.height;
      g.globalCompositeOperation = 'destination-out';
      g.lineWidth = 12 + a.amount * 42;
      g.lineCap = 'round';
      g.beginPath();
      g.moveTo(prev ? prev[0] : x, prev ? prev[1] : y);
      g.lineTo(x, y);
      g.stroke();
      circle(g, x, y, g.lineWidth / 2, 'black');
      prev = [x, y];
    };
    a.on(c, 'pointerdown', (e) => {
      c.setPointerCapture(e.pointerId);
      prev = null;
      erase(e);
    });
    a.on(c, 'pointermove', (e) => {
      if (e.buttons) erase(e);
    });
    a.on(c, 'pointerup', () => (prev = null));
    reset();
  });
  // @effect eyes
  register('eyes', (root, a) => {
    a.background('#aabc95');
    a.html(
      '<div class="fx-center"><div class="fx-eyes"><div class="fx-eye"><div class="fx-pupil"></div></div><div class="fx-eye"><div class="fx-pupil"></div></div></div><span class="fx-label" style="color:#293c2a">OH, HELLO THERE.</span></div>'
    );
    a.loop(() => {
      const x = a.pointer.nx,
        y = a.pointer.ny,
        d = Math.max(1, Math.hypot(x, y));
      a.$$('.fx-pupil').forEach(
        (p) =>
          (p.style.transform = `translate(${(x / d) * (4 + a.amount * 11)}px,${(y / d) * (5 + a.amount * 12)}px)`)
      );
    });
  });
  // @effect repel
  register('repel', (root, a) => {
    a.background('#21322c');
    a.canvas((g, w, h, t) => {
      const s = 23,
        r = 30 + a.amount * 90;
      for (let x = 18; x < w; x += s)
        for (let y = 18; y < h; y += s) {
          let dx = x - a.pointer.x,
            dy = y - a.pointer.y,
            d = Math.hypot(dx, dy) || 1,
            k = a.pointer.inside ? Math.max(0, 1 - d / r) * 27 : 0;
          circle(g, x + (dx / d) * k, y + (dy / d) * k, 2.1, `rgba(202,220,166,${0.3 + k / 40})`);
        }
    });
  });
  // @effect connect
  register('connect', (root, a) => {
    a.background('#253343');
    let chosen = 0;
    const points = [
      [0.2, 0.62],
      [0.32, 0.27],
      [0.53, 0.5],
      [0.7, 0.24],
      [0.82, 0.63]
    ];
    a.html('<div class="fx-controls"><button class="fx-outline-btn">连接下一点</button></div>');
    const button = a.$('button');
    const next = () => {
      chosen = (chosen + 1) % 6;
      button.textContent = chosen === 5 ? '重新连线' : '连接下一点';
      a.repaint();
    };
    a.on(button, 'click', next);
    a.on(root, 'pointerdown', (e) => {
      if (e.target === button) return;
      const p = points[chosen];
      if (
        p &&
        Math.hypot(p[0] * root.clientWidth - a.pointer.x, p[1] * root.clientHeight - a.pointer.y) <
          10 + a.amount * 30
      )
        next();
    });
    a.canvas((g, w, h) => {
      g.strokeStyle = '#bcc6e3';
      g.lineWidth = 1.5;
      path(
        g,
        points.slice(0, chosen).map(([x, y]) => [x * w, y * h])
      );
      g.stroke();
      points.forEach(([x, y], i) => {
        circle(g, x * w, y * h, i < chosen ? 6 : 4, i < chosen ? '#d6e3b3' : '#6e8398');
        if (i === chosen) {
          g.strokeStyle = '#aabbcc44';
          circle(g, x * w, y * h, 13);
        }
        g.fillStyle = '#cad8e1';
        g.font = '8px monospace';
        g.fillText(i + 1, x * w + 9, y * h - 7);
      });
    });
  });
  // @effect cursor
  register('cursor', (root, a) => {
    a.background('#ead9d3');
    const points = Array.from({ length: 5 }, () => ({ x: 0, y: 0 }));
    a.canvas((g, w, h, t) => {
      const tx = a.pointer.inside ? a.pointer.x : w / 2 + Math.cos(t * 0.6) * w * 0.2,
        ty = a.pointer.inside ? a.pointer.y : h / 2 + Math.sin(t * 0.9) * h * 0.2;
      points.forEach((p, i) => {
        const k = (0.2 - i * 0.028) * (1.3 - a.amount * 0.8);
        p.x = lerp(p.x || w / 2, tx, k);
        p.y = lerp(p.y || h / 2, ty, k);
        g.strokeStyle = `rgba(136,82,85,${0.7 - i * 0.1})`;
        g.lineWidth = 1;
        circle(g, p.x, p.y, 8 + i * 7);
      });
    });
  });
  // @effect metaballs
  register('metaballs', (root, a) => {
    a.background('#242e36');
    const field = document.createElement('canvas');
    field.width = 100;
    field.height = 70;
    const fg = field.getContext('2d'),
      pixels = fg.createImageData(100, 70);
    a.canvas((g, w, h, t) => {
      const moving = a.pointer.inside
          ? [50 + a.pointer.nx * 36, 35 + a.pointer.ny * 24]
          : [63 + Math.sin(t * 0.5) * 14, 35 + Math.cos(t * 0.6) * 9],
        centers = [
          [36, 35, 12],
          [57, 38, 9],
          [...moving, 11]
        ],
        threshold = 1.15 - a.amount * 0.55;
      for (let y = 0; y < 70; y++)
        for (let x = 0; x < 100; x++) {
          const v = centers.reduce(
              (sum, [cx, cy, r]) => sum + (r * r) / (Math.pow(x - cx, 2) + Math.pow(y - cy, 2) + 1),
              0
            ),
            k = (x + y * 100) * 4,
            alpha = clamp((v - threshold) * 7);
          pixels.data[k] = 169 + clamp(v / 4) * 42;
          pixels.data[k + 1] = 199 + clamp(v / 4) * 20;
          pixels.data[k + 2] = 182;
          pixels.data[k + 3] = alpha * 255;
        }
      fg.putImageData(pixels, 0, 0);
      g.imageSmoothingEnabled = true;
      g.drawImage(field, 0, 0, w, h);
    });
  });
  // @effect doodle
  register('doodle', (root, a) => {
    a.background('#ede4d4');
    a.html(
      '<div class="fx-doodle-tools"><button data-replay aria-label="回放笔迹">▷ 回放</button><button data-undo aria-label="撤销最后一笔">↶</button><button data-clear aria-label="清空画布">清空</button><span data-count>示范笔迹</span></div>'
    );
    let strokes = [
        Array.from({ length: 90 }, (_, i) => {
          const q = (i / 89) * Math.PI * 3;
          return {
            x: 0.5 + Math.cos(q) * (0.03 + i * 0.002),
            y: 0.47 + Math.sin(q) * (0.03 + i * 0.0015),
            t: i * 0.014
          };
        })
      ],
      current = null,
      playing = false,
      start = 0,
      inkTime = 0;
    const canvas = a.canvas((g, w, h, t) => {
      const cutoff = playing ? (t - start) * 1.5 : Infinity;
      g.strokeStyle = '#7c658a';
      g.lineWidth = 1 + a.amount * 8;
      g.lineCap = g.lineJoin = 'round';
      for (const stroke of strokes) {
        g.beginPath();
        let seen = false;
        for (const p of stroke) {
          if (p.t > cutoff) break;
          seen ? g.lineTo(p.x * w, p.y * h) : g.moveTo(p.x * w, p.y * h);
          seen = true;
        }
        g.stroke();
        if (stroke.length === 1 && stroke[0].t <= cutoff)
          circle(g, stroke[0].x * w, stroke[0].y * h, g.lineWidth / 2, '#7c658a');
      }
      const last = strokes.at(-1)?.at(-1)?.t || 0;
      if (playing && cutoff >= last) playing = false;
      a.$('[data-replay]').textContent = playing ? '回放中…' : '▷ 回放';
      a.$('[data-count]').textContent = `${strokes.length} 笔`;
    });
    canvas.classList.add('fx-drawing-surface');
    const point = (e) => {
      const r = canvas.getBoundingClientRect();
      return {
        x: clamp((e.clientX - r.left) / r.width),
        y: clamp((e.clientY - r.top) / r.height),
        t: inkTime + (performance.now() - start) / 1000
      };
    };
    a.on(canvas, 'pointerdown', (e) => {
      canvas.setPointerCapture(e.pointerId);
      playing = false;
      inkTime = (strokes.at(-1)?.at(-1)?.t || 0) + 0.12;
      start = performance.now();
      current = [point(e)];
      strokes.push(current);
      if (strokes.length > 24) strokes.shift();
      a.repaint();
    });
    a.on(canvas, 'pointermove', (e) => {
      if (current && current.length < 1200) {
        current.push(point(e));
        a.repaint();
      }
    });
    const finish = () => {
      current = null;
    };
    a.on(canvas, 'pointerup', finish);
    a.on(canvas, 'pointercancel', finish);
    a.on(canvas, 'lostpointercapture', finish);
    a.on(a.$('[data-replay]'), 'click', () => {
      current = null;
      const offset = strokes[0]?.[0]?.t || 0;
      strokes = strokes.map((s) => s.map((p) => ({ ...p, t: p.t - offset })));
      playing = true;
      start = a.time;
      a.repaint();
    });
    a.on(a.$('[data-undo]'), 'click', () => {
      strokes.pop();
      playing = false;
      a.repaint();
    });
    a.on(a.$('[data-clear]'), 'click', () => {
      strokes = [];
      current = null;
      playing = false;
      a.repaint();
    });
  });
  // @effect snapgrid
  register('snapgrid', (root, a) => {
    a.background('#dce2d5');
    root.classList.add('fx-drag');
    a.html(
      '<button class="fx-snap-token" aria-label="可拖动网格圆点，也可按方向键移动">✳</button><span class="fx-snap-readout" role="status"></span>'
    );
    let x = 0.5,
      y = 0.5,
      drag = false,
      prior = a.amount;
    const token = a.$('button');
    const divisions = () => 4 + Math.round(a.amount * 7),
      snap = () => {
        const n = divisions();
        x = clamp(Math.round(x * n) / n, 1 / n, 1 - 1 / n);
        y = clamp(Math.round(y * n) / n, 1 / n, 1 - 1 / n);
      };
    a.canvas((g, w, h) => {
      if (prior !== a.amount) {
        prior = a.amount;
        snap();
      }
      const n = divisions();
      g.strokeStyle = '#81947545';
      g.lineWidth = 0.6;
      for (let i = 1; i < n; i++) {
        path(g, [
          [(w * i) / n, 0],
          [(w * i) / n, h]
        ]);
        g.stroke();
        path(g, [
          [0, (h * i) / n],
          [w, (h * i) / n]
        ]);
        g.stroke();
      }
      token.style.left = x * 100 + '%';
      token.style.top = y * 100 + '%';
      a.$('.fx-snap-readout').textContent =
        `${Math.round(x * n)} : ${Math.round(y * n)} / ${n} × ${n}`;
    });
    a.on(root, 'pointerdown', (e) => {
      if (e.target !== token) return;
      drag = true;
      root.setPointerCapture(e.pointerId);
    });
    a.on(root, 'pointermove', () => {
      if (drag) {
        x = clamp(a.pointer.x / root.clientWidth, 0.05, 0.95);
        y = clamp(a.pointer.y / root.clientHeight, 0.05, 0.9);
        a.repaint();
      }
    });
    const finish = () => {
      if (drag) {
        drag = false;
        snap();
        a.repaint();
      }
    };
    a.on(root, 'pointerup', finish);
    a.on(root, 'pointercancel', finish);
    a.on(token, 'keydown', (e) => {
      if (e.key.startsWith('Arrow')) {
        e.preventDefault();
        x += (e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0) / divisions();
        y += (e.key === 'ArrowDown' ? 1 : e.key === 'ArrowUp' ? -1 : 0) / divisions();
        snap();
        a.repaint();
      }
    });
  });
})();
