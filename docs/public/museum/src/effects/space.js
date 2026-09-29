(() => {
  const { register, circle, path, rng, clamp, palette } = Museum;
  // @effect flip
  register('flip', (root, a) => {
    a.background('#e7e2d8');
    let flipped = false;
    a.html(
      '<button class="fx-3d-scene" aria-label="翻转卡片" aria-pressed="false"><div class="fx-flip"><div class="fx-flip-front"><small>EVERY IDEA HAS</small><b>two</b><small>CLICK TO FLIP ↗</small></div><div class="fx-flip-back"><small>ANOTHER SIDE</small><b>sides.</b><small>KEEP EXPLORING ✳</small></div></div></button>'
    );
    a.on(a.$('button'), 'click', () => {
      flipped = !flipped;
      a.$('button').setAttribute('aria-pressed', flipped);
      a.$('.fx-flip').style.transform = `rotateY(${flipped ? 180 : 0}deg)`;
    });
    a.loop(() => {
      a.$('.fx-3d-scene').style.perspective = `${300 + a.amount * 700}px`;
      a.$('.fx-flip').style.transitionDuration = `${0.7 / a.speed}s`;
    });
  });
  // @effect cube
  register('cube', (root, a) => {
    a.background('#27392f');
    root.classList.add('fx-drag');
    a.html(
      '<div class="fx-3d-scene"><div class="fx-cube">' +
        ['✳', '○', '+', '◇', '↗', '∞']
          .map((c) => `<div class="fx-cube-face">${c}</div>`)
          .join('') +
        '</div></div>'
    );
    let rx = -24,
      ry = 34,
      last = null;
    a.on(root, 'pointerdown', (e) => {
      root.setPointerCapture(e.pointerId);
      last = [e.clientX, e.clientY];
    });
    a.on(root, 'pointermove', (e) => {
      if (e.buttons && last) {
        ry += (e.clientX - last[0]) * 0.6;
        rx -= (e.clientY - last[1]) * 0.6;
        last = [e.clientX, e.clientY];
      }
    });
    a.loop((t, dt) => {
      if (!a.pointer.down) ry += dt * 9;
      const size = 55 + a.amount * 65,
        c = a.$('.fx-cube');
      c.style.width = c.style.height = size + 'px';
      c.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
      a.$$('.fx-cube-face').forEach(
        (f, i) =>
          (f.style.transform = [
            `translateZ(${size / 2}px)`,
            `rotateY(180deg) translateZ(${size / 2}px)`,
            `rotateY(90deg) translateZ(${size / 2}px)`,
            `rotateY(-90deg) translateZ(${size / 2}px)`,
            `rotateX(90deg) translateZ(${size / 2}px)`,
            `rotateX(-90deg) translateZ(${size / 2}px)`
          ][i])
      );
    });
  });
  // @effect stack
  register('stack', (root, a) => {
    a.background('#dedbcf');
    let index = 0;
    a.html(
      '<button class="fx-center" aria-label="轮换卡片">' +
        ['FORM', 'COLOR', 'MOTION']
          .map(
            (s, i) =>
              `<div class="fx-stack-card" style="background:${['#859c80', '#b1baa0', '#d2d7ba'][i]};color:#2d422e"><small>EXPERIMENT / 0${i + 1}</small><b>${s}</b><small>IDEAS WORTH KEEPING ↗</small></div>`
          )
          .join('') +
        '</button>'
    );
    a.on(a.$('button'), 'click', () => {
      index = (index + 1) % 3;
    });
    a.loop(() => {
      a.$$('.fx-stack-card').forEach((c, i) => {
        const d = (i - index + 3) % 3;
        c.style.transform = `translateY(${(d - 1) * (5 + a.amount * 16)}px) rotate(${(d - 1) * -6}deg) scale(${1 - d * 0.07})`;
        c.style.zIndex = 3 - d;
      });
    });
  });
  // @effect portal
  register('portal', (root, a) => {
    a.background('#272539');
    a.canvas((g, w, h, t) => {
      g.translate(w / 2 + a.pointer.nx * 16, h / 2 + a.pointer.ny * 12);
      const n = 12;
      for (let i = n; i > 0; i--) {
        const k = i / n,
          r = k * Math.min(w, h) * 0.44;
        g.save();
        g.rotate(t * 0.035 + (1 - k) * (0.3 + a.amount * 1.3));
        g.strokeStyle = `rgba(185,172,225,${0.18 + k * 0.6})`;
        g.lineWidth = 0.8;
        g.strokeRect(-r, -r, r * 2, r * 2);
        g.restore();
      }
    });
  });
  // @effect isometric
  register('isometric', (root, a) => {
    a.background('#e1dfd0');
    let heights = [];
    const seed = () => {
      const r = rng(Math.random() * 1e6);
      heights = Array.from({ length: 25 }, () => r());
    };
    seed();
    a.on(root, 'click', seed);
    a.canvas((g, w, h) => {
      const s = Math.min(w / 12, h / 7);
      for (let x = 0; x < 5; x++)
        for (let y = 0; y < 5; y++) {
          const px = w / 2 + (x - y) * s,
            py = h * 0.3 + (x + y) * s * 0.48,
            z = (0.3 + heights[x * 5 + y]) * (10 + a.amount * 38);
          const top = [
            [px, py - z],
            [px + s, py + s * 0.5 - z],
            [px, py + s - z],
            [px - s, py + s * 0.5 - z]
          ];
          g.fillStyle = '#afbb94';
          path(g, top, true);
          g.fill();
          g.fillStyle = '#6e866b';
          path(g, [top[2], top[3], [px - s, py + s * 0.5], [px, py + s]], true);
          g.fill();
          g.fillStyle = '#889d7c';
          path(g, [top[1], top[2], [px, py + s], [px + s, py + s * 0.5]], true);
          g.fill();
        }
    });
  });
  // @effect accordion
  register('accordion', (root, a) => {
    a.background('#323b31');
    let active = 1;
    a.html(
      '<div class="fx-accordion">' +
        ['EARTH', 'MOSS', 'STONE', 'SAND']
          .map(
            (name, i) =>
              `<button style="background:${['#a6b294', '#c9d8ae', '#82977f', '#ded3b4'][i]}" aria-pressed="${i === active}"><span>0${i + 1}</span><small>${name}</small></button>`
          )
          .join('') +
        '</div>'
    );
    a.$$('button').forEach((b, i) =>
      a.on(b, 'click', () => {
        active = i;
        a.$$('button').forEach((el, j) => el.setAttribute('aria-pressed', i === j));
      })
    );
    a.loop(() =>
      a.$$('button').forEach((b, i) => (b.style.flexGrow = i === active ? 2 + a.amount * 5 : 1))
    );
  });
  // @effect parallax
  register('parallax', (root, a) => {
    a.html(
      '<div class="fx-landscape"><div class="fx-sun"></div>' +
        ['#91b3a1', '#648e7b', '#3c6a5c']
          .map((c, i) => `<div class="fx-mountain" style="background:${c};top:${i * 17}%"></div>`)
          .join('') +
        '</div>'
    );
    a.loop(() =>
      a
        .$$('.fx-mountain')
        .forEach(
          (el, i) =>
            (el.style.transform = `translate(${a.pointer.nx * (i + 1) * (3 + a.amount * 8)}px,${a.pointer.ny * (i + 1) * 3}px)`)
        )
    );
  });
  // @effect perspective
  register('perspective', (root, a) => {
    a.background('#212e3a');
    a.canvas((g, w, h, t) => {
      const vx = w / 2 + a.pointer.nx * w * 0.25,
        vy = h * 0.4 + a.pointer.ny * h * 0.2,
        n = 8 + Math.round(a.amount * 14);
      g.strokeStyle = '#879faa55';
      g.lineWidth = 0.7;
      for (let i = 0; i <= n; i++) {
        path(g, [
          [(i * w) / n, h],
          [vx, vy],
          [(i * w) / n, 0]
        ]);
        g.stroke();
      }
      for (let i = 1; i <= 9; i++) {
        const q = (i / 9) ** 2;
        path(g, [
          [0, vy + (h - vy) * q],
          [w, vy + (h - vy) * q]
        ]);
        g.stroke();
      }
      circle(g, vx, vy, 3, '#c2d5ba');
    });
  });
  // @effect coverflow
  register('coverflow', (root, a) => {
    a.background('#d6d0c4');
    let current = 2;
    a.html(
      '<div class="fx-3d-scene">' +
        ['NATURE', 'AMBIENT', 'AFTERHOURS', 'DAYLIGHT', 'SLOW LIFE']
          .map(
            (s, i) =>
              `<button class="fx-cover" aria-label="选择唱片 ${s}" style="background:${palette[i]}"><span>0${i + 1}</span><small>${s}</small></button>`
          )
          .join('') +
        '</div><div class="fx-controls"><button class="fx-outline-btn" style="color:#3d4b37;border-color:#3d4b3744" data-prev aria-label="上一张唱片">←</button><button class="fx-outline-btn" style="color:#3d4b37;border-color:#3d4b3744" data-next aria-label="下一张唱片">→</button></div>'
    );
    a.$$('.fx-cover').forEach((b, i) => a.on(b, 'click', () => (current = i)));
    a.on(a.$('[data-prev]'), 'click', () => (current = (current + 4) % 5));
    a.on(a.$('[data-next]'), 'click', () => (current = (current + 1) % 5));
    a.loop(() =>
      a.$$('.fx-cover').forEach((b, i) => {
        const d = i - current;
        b.style.transform = `translateX(${d * Math.min(55, root.clientWidth * 0.16)}px) rotateY(${-Math.sign(d) * (20 + a.amount * 40)}deg) scale(${1 - Math.min(Math.abs(d), 3) * 0.13})`;
        b.style.zIndex = 5 - Math.abs(d);
        b.setAttribute('aria-pressed', i === current);
      })
    );
  });
  // @effect bento
  register('bento', (root, a) => {
    const K = MuseumMechanics;
    let layout = 0,
      order = [0, 1, 2, 3],
      priorMode = 'layout';
    root.classList.add('mx-bento-upgraded');
    a.background('#27382e');
    a.html(
      '<div class="fx-bento">' +
        ['✳', '↗', '○', '◇']
          .map(
            (s, i) =>
              `<button data-tile="${i}" data-stable-id="${i}" style="background:${['#c7d6ae', '#819b7b', '#ded9bd', '#a9bba0'][i]}" aria-label="色块${i + 1}，重排或与首位换位">${s}</button>`
          )
          .join('') +
        '</div><div class="mx-mode-tabs"><button data-interaction="layout" aria-pressed="true">原布局</button><button data-interaction="swap" aria-pressed="false">FLIP 换位</button></div>'
    );
    const board = a.$('.fx-bento'),
      tiles = a.$$('[data-tile]');
    const layouts = [
      ['1 / 1 / 3 / 2', '1 / 2 / 2 / 4', '2 / 2 / 3 / 3', '2 / 3 / 3 / 4'],
      ['1 / 1 / 2 / 3', '2 / 1 / 3 / 2', '2 / 2 / 3 / 3', '1 / 3 / 3 / 4'],
      ['1 / 1 / 2 / 2', '1 / 2 / 3 / 3', '1 / 3 / 2 / 4', '2 / 1 / 3 / 2']
    ];
    function paint() {
      board.style.gap = `${3 + a.amount * 12}px`;
      [...board.children].forEach((tile, i) => (tile.style.gridArea = layouts[layout][i]));
      root.dataset.order = JSON.stringify(order);
      root.dataset.layout = layout;
      root.dataset.interaction = a.params.interaction;
      a.$$('[data-interaction]').forEach((b) =>
        b.setAttribute('aria-pressed', b.dataset.interaction === a.params.interaction)
      );
    }
    const flip = K.flipGroup(a, () => [...board.children], { duration: () => a.params.duration });
    tiles.forEach((tile) =>
      a.on(tile, 'click', () => {
        if (a.params.interaction === 'layout') {
          layout = (layout + 1) % 3;
          paint();
          return;
        }
        const index = order.indexOf(Number(tile.dataset.tile));
        if (index <= 0) return;
        flip.play(() => {
          [order[0], order[index]] = [order[index], order[0]];
          board.replaceChildren(...order.map((id) => tiles[id]));
          paint();
        });
        tile.focus({ preventScroll: true });
      })
    );
    a.$$('[data-interaction]').forEach((b) =>
      a.on(b, 'click', () => a.setParams({ interaction: b.dataset.interaction }))
    );
    a.onParamsChange(() => {
      if (priorMode !== a.params.interaction) {
        flip.clear();
        priorMode = a.params.interaction;
      }
      paint();
    });
    a.loop(paint);
  });
  // @effect mobius
  register('mobius', (root, a) => {
    a.background('#2a273a');
    a.canvas((g, w, h, t) => {
      const twist = 1 + 2 * Math.round(a.amount * 2),
        spin = t * 0.1 + a.pointer.nx * 0.6,
        tilt = 0.6 + a.pointer.ny * 0.45,
        R = Math.min(w, h) * 0.28;
      const vertex = (u, v) => {
        let x = (1 + v * Math.cos((twist * u) / 2)) * Math.cos(u),
          y = (1 + v * Math.cos((twist * u) / 2)) * Math.sin(u),
          z = v * Math.sin((twist * u) / 2);
        const xx = x * Math.cos(spin) - y * Math.sin(spin),
          yy = x * Math.sin(spin) + y * Math.cos(spin),
          zz = yy * Math.sin(tilt) + z * Math.cos(tilt),
          py = yy * Math.cos(tilt) - z * Math.sin(tilt),
          s = 1 / (1 + zz * 0.18);
        return [w / 2 + xx * R * s, h / 2 + py * R * s, zz];
      };
      const faces = [];
      for (let i = 0; i < 96; i++)
        for (let j = 0; j < 4; j++) {
          const u = (i / 96) * Math.PI * 2,
            un = ((i + 1) / 96) * Math.PI * 2,
            v = -0.32 + j * 0.16,
            pts = [vertex(u, v), vertex(un, v), vertex(un, v + 0.16), vertex(u, v + 0.16)];
          faces.push({ pts, z: pts.reduce((s, p) => s + p[2], 0) / 4, i, j });
        }
      faces.sort((x, y) => y.z - x.z);
      for (const f of faces) {
        g.fillStyle = `hsl(${266 + f.j * 5} 25% ${48 - f.z * 13 + f.j * 3}%)`;
        g.strokeStyle = '#d5c9e74a';
        g.lineWidth = 0.5;
        path(
          g,
          f.pts.map((p) => p.slice(0, 2)),
          true
        );
        g.fill();
        g.stroke();
      }
    });
  });
  // @effect book
  register('book', (root, a) => {
    a.background('#e1d7c6');
    let open = false;
    a.html(
      '<button class="fx-book-scene" aria-label="打开立体书页" aria-pressed="false"><span class="fx-book"><span class="fx-book-page"><small>01 / BEGIN</small><b>Every idea<br>starts here.</b><i>WRITE YOUR OWN STORY</i></span><span class="fx-book-cover"><span><small>OUTLINE EDITIONS</small><b>A little<br>wonder.</b><i>VOL. 03 ↗</i></span><span class="fx-book-inner">Keep<br>turning.</span></span></span></button>'
    );
    a.on(a.$('button'), 'click', () => {
      open = !open;
      a.$('button').setAttribute('aria-pressed', open);
      a.$('button').setAttribute('aria-label', open ? '合上立体书页' : '打开立体书页');
      a.repaint();
    });
    a.loop(() => {
      a.$('.fx-book-cover').style.transform = `rotateY(${open ? -(65 + a.amount * 65) : 0}deg)`;
      a.$('.fx-book-cover').style.transitionDuration = `${0.8 / a.speed}s`;
    });
  });
  // @effect layoutxray
  register('layoutxray', (root, a) => {
    const L = MuseumLab;
    L.shell(
      a,
      'LAYOUT / 看见布局的骨架',
      `<div class="bc-xray"><div class="bc-grid">${['01', '02', '03', '04', '05', '06'].map((v, i) => `<article><small>${v} / GRID</small><b>${['版心', '秩序', '留白', '比例', '节奏', '对齐'][i]}</b><p>每一列，都有真实的边界。</p></article>`).join('')}</div><div class="bc-rulers" aria-hidden="true"></div></div><output class="bc-note"></output>`,
      '#233237',
    );
    const grid = a.$('.bc-grid'),
      overlay = a.$('.bc-rulers');
    function measure() {
      const rects = [...grid.children].map((el) => ({
        x: el.offsetLeft,
        y: el.offsetTop,
        w: el.offsetWidth,
        h: el.offsetHeight,
      }));
      overlay.replaceChildren();
      for (const r of rects) {
        const el = document.createElement('i');
        Object.assign(el.style, {
          left: r.x + 'px',
          top: r.y + 'px',
          width: r.w + 'px',
          height: r.h + 'px',
        });
        el.textContent = r.w + ' px';
        overlay.append(el);
      }
      overlay.hidden = !a.params.overlay;
      a.$('output').textContent =
        `版心 ${grid.clientWidth} px · ${a.params.columns} 列 · 参考线 ${a.params.baseline} px（非字体基线）`;
      L.state(a, { width: grid.clientWidth, rects });
    }
    a.onParamsChange((p) => {
      grid.style.gridTemplateColumns = `repeat(${Math.round(p.columns)},minmax(0,1fr))`;
      grid.style.gap = p.gap + 'px';
      overlay.style.backgroundSize = `100% ${p.baseline}px`;
      measure();
    });
    L.observe(a, grid, measure);
  });

})();
