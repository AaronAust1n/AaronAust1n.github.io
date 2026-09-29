(() => {
  const { register, circle, path, rng, clamp } = Museum;
  const X = MuseumExpansion;
  // @effect bauhaus
  register('bauhaus', (root, a) => {
    let mode = 0;
    X.shell(
      a,
      '#e9dfc8',
      '<button class="nx-bauhaus" aria-label="轮换包豪斯构成"><i class="nx-ba-circle"></i><i class="nx-ba-square"></i><i class="nx-ba-triangle"></i><span data-label>01 / BALANCE</span></button>'
    );
    const poses = [
      [
        [20, 24, 0],
        [54, 38, 0],
        [40, 40, 0]
      ],
      [
        [52, 20, 0],
        [21, 47, 45],
        [31, 22, 90]
      ],
      [
        [30, 39, 0],
        [56, 25, 20],
        [16, 28, -90]
      ]
    ];
    a.on(a.$('button'), 'click', () => {
      mode = (mode + 1) % 3;
      root.dataset.composition = mode;
      a.$('[data-label]').textContent = ['01 / BALANCE', '02 / TENSION', '03 / RHYTHM'][mode];
      a.repaint();
    });
    a.loop(() =>
      a.$$('i').forEach((el, i) => {
        const p = poses[mode][i];
        el.style.left = p[0] + '%';
        el.style.top = p[1] + '%';
        el.style.transform = `rotate(${p[2]}deg) scale(${0.75 + a.amount * 0.4})`;
      })
    );
  });
  // @effect enso
  register('enso', (root, a) => {
    let start = -2;
    X.shell(a, '#eae6d8', '<span class="nx-season">春 · 风过留白</span>');
    X.onClick(a, () => (start = a.time));
    a.canvas((g, w, h, t) => {
      const p = X.reduced() ? 1 : clamp((t - start) / 1.6),
        R = Math.min(w, h) * 0.29;
      g.translate(w * 0.5, h * 0.47);
      for (let i = 0; i < 180 * p; i++) {
        const q = (i / 180) * Math.PI * 1.93,
          noise = (Math.sin(i * 91.71) + 1) / 2;
        g.beginPath();
        g.strokeStyle = `rgba(34,42,35,${0.22 + noise * 0.65})`;
        g.lineWidth = (3 + a.amount * 7) * (1 + 0.3 * Math.sin(q));
        g.arc(Math.sin(i * 3) * 0.7, Math.cos(i * 9) * 0.8, R + noise * 2, q, q + 0.034);
        if (noise > a.amount * 0.28) g.stroke();
      }
      a.$('.nx-season').textContent = [
        '春 · 风过留白',
        '夏 · 雨歇听蝉',
        '秋 · 一叶知时',
        '冬 · 雪落无声'
      ][Math.floor(t / 5.2) % 4];
    });
  });
  // @effect neubrutal
  register('neubrutal', (root, a) => {
    let count = 0;
    X.shell(
      a,
      '#f3d850',
      '<div class="nx-brutal"><span>NO SOFT EDGES.</span><button class="nx-hard">PRESS ME ↗</button><output>READY / 000</output></div>'
    );
    a.on(a.$('button'), 'click', () => {
      count++;
      a.$('output').textContent = 'CONFIRMED / ' + String(count).padStart(3, '0');
    });
    a.loop(() => a.$('.nx-hard').style.setProperty('--hard', 4 + a.amount * 8 + 'px'));
  });
  // @effect maximal
  register('maximal', (root, a) => {
    a.background('#d94f77');
    let particles = [],
      last = 0;
    const symbols = ['✳', '★', '☀', '♥', '↗', '✿', '◒'];
    const spawn = () => {
      const now = performance.now();
      if (now - last < 120 - a.amount * 85) return;
      last = now;
      particles.push({
        x: a.pointer.x,
        y: a.pointer.y,
        vx: (Math.random() - 0.5) * 90,
        vy: -20 - Math.random() * 50,
        rot: Math.random() * 4,
        t: a.time,
        s: symbols[Math.floor(Math.random() * symbols.length)]
      });
      particles = particles.slice(-90);
      a.repaint();
    };
    a.on(root, 'pointermove', spawn);
    a.on(root, 'pointerdown', spawn);
    a.canvas((g, w, h, t) => {
      g.fillStyle = '#f6d055';
      g.font = `bold ${w * 0.1}px Georgia`;
      g.textAlign = 'center';
      g.fillText('MORE IS MORE', w / 2, h * 0.53);
      particles = particles.filter((p) => t - p.t < 2.8);
      particles.forEach((p, i) => {
        const q = t - p.t;
        g.save();
        g.translate(p.x + p.vx * q, p.y + p.vy * q + 60 * q * q);
        g.rotate(p.rot + q);
        g.globalAlpha = 1 - q / 2.8;
        g.font = '26px serif';
        g.fillStyle = ['#fff2c2', '#634dc6', '#8dedc2'][i % 3];
        g.fillText(p.s, 0, 0);
        g.restore();
      });
    });
  });
  // @effect construct
  register('construct', (root, a) => {
    let seed = 1;
    X.shell(
      a,
      '#e6dcc4',
      '<button class="nx-construct" aria-label="重新构成"><i class="nx-con-circle"></i><i class="nx-con-bar"></i><i class="nx-con-wedge"></i><b>FORM<br>IS A FORCE.</b></button>'
    );
    function compose() {
      const r = rng(++seed * 117);
      a.$$('.nx-construct i').forEach((el) => {
        el.style.left = 10 + r() * 55 + '%';
        el.style.top = 15 + r() * 45 + '%';
      });
    }
    compose();
    a.on(a.$('button'), 'click', compose);
    a.loop(() => {
      a.$('.nx-con-bar').style.transform = `rotate(${-10 - a.amount * 35}deg)`;
    });
  });
  // @effect mondrian
  register('mondrian', (root, a) => {
    let seed = 4,
      prior = -1;
    X.shell(a, '#eadfc6', '<button class="nx-mondrian" aria-label="重新分割构图"></button>');
    function make() {
      const random = rng(seed);
      let rects = [[0, 0, 100, 100]];
      for (let i = 0; i < 4 + Math.round(a.amount * 6); i++) {
        const index = rects.reduce(
            (best, r, j) => (r[2] * r[3] > rects[best][2] * rects[best][3] ? j : best),
            0
          ),
          [x, y, w, h] = rects.splice(index, 1)[0],
          q = 0.3 + random() * 0.4;
        if (w > h * 1.2 || (w > h * 0.8 && random() > 0.5))
          rects.push([x, y, w * q, h], [x + w * q, y, w * (1 - q), h]);
        else rects.push([x, y, w, h * q], [x, y + h * q, w, h * (1 - q)]);
      }
      a.$('button').innerHTML = rects
        .map(
          (r, i) =>
            `<i style="left:${r[0]}%;top:${r[1]}%;width:${r[2]}%;height:${r[3]}%;background:${['#eee6d3', '#ce453a', '#dfb438', '#426583', '#eee6d3'][Math.floor(random() * 5)]};animation-delay:${i * 0.06}s"></i>`
        )
        .join('');
      root.dataset.cells = rects.length;
    }
    a.on(a.$('button'), 'click', () => {
      seed++;
      make();
    });
    a.loop(() => {
      if (prior !== a.amount) {
        prior = a.amount;
        make();
      }
    });
  });
  // @effect memphis
  register('memphis', (root, a) => {
    a.background('#e9c4c1');
    let seed = 17;
    X.onClick(a, () => seed++);
    a.canvas((g, w, h) => {
      const r = rng(seed);
      for (let i = 0; i < 10 + Math.round(a.amount * 18); i++) {
        const x = r() * w,
          y = r() * h,
          s = 8 + r() * 28,
          type = i % 4;
        g.save();
        g.translate(x, y);
        g.rotate(r() * 6);
        g.strokeStyle = ['#293c79', '#b94a73', '#397d81'][i % 3];
        g.fillStyle = ['#ebd066', '#617daf', '#b2597c'][i % 3];
        g.lineWidth = 2;
        if (type === 0) {
          g.beginPath();
          for (let j = 0; j <= 30; j++) {
            const xx = j * 1.4,
              yy = Math.sin(j * 0.5) * 5;
            j ? g.lineTo(xx, yy) : g.moveTo(xx, yy);
          }
          g.stroke();
        } else if (type === 1) {
          for (let x = 0; x < 4; x++)
            for (let y = 0; y < 3; y++) circle(g, x * 5, y * 5, 1.2, g.fillStyle);
        } else if (type === 2) {
          path(
            g,
            [
              [0, -s],
              [s, s],
              [-s, s]
            ],
            true
          );
          g.fill();
        } else {
          g.beginPath();
          g.rect(-s / 2, -s / 2, s, s);
          g.clip();
          for (let j = -s; j < s; j += 6) {
            path(g, [
              [j, -s],
              [j + s, s]
            ]);
            g.stroke();
          }
        }
        g.restore();
      }
    });
  });
  // @effect deco
  register('deco', (root, a) => {
    let start = -2;
    X.shell(
      a,
      '#232b2e',
      '<button class="nx-deco" aria-label="展开金扇">' +
        Array.from({ length: 13 }, () => '<i></i>').join('') +
        '<span>THE AGE OF ELEGANCE</span></button>'
    );
    a.on(a.$('button'), 'click', () => (start = a.time));
    a.loop((t) =>
      a.$$('i').forEach((el, i) => {
        const p = X.reduced() ? 1 : X.ease((t - start - i * 0.04) / 0.7);
        el.style.transform = `rotate(${((i - 6) / 6) * (32 + a.amount * 46)}deg) scaleY(${0.15 + p * 0.85})`;
      })
    );
  });
  // @effect poster
  register('poster', (root, a) => {
    let seed = 21;
    X.shell(
      a,
      '#f0e8d5',
      '<button class="nx-poster" aria-label="重新排一张海报"><span>OUTLINE / DESIGN STUDIES</span><i></i><b>FORM<br>FOLLOWS<br>CURIOSITY.</b><small>SWISS POSTER / 001</small></button>'
    );
    function shuffle() {
      const r = rng(++seed * 19),
        colors = [
          ['#e7e0cf', '#bd463a'],
          ['#e2ce52', '#27394b'],
          ['#e3a4ad', '#314449'],
          ['#b7c3a7', '#355044']
        ][seed % 4];
      root.style.background = colors[0];
      a.$('i').style.cssText =
        `left:${r() * 65}%;top:${15 + r() * 50}%;background:${colors[1]};border-radius:${seed % 2 ? '50%' : '0'}`;
      a.$('b').style.transform =
        `translate(${r() * 12}%,${r() * 18}%) rotate(${(r() - 0.5) * 12}deg)`;
      a.$('small').textContent = 'SWISS POSTER / ' + seed;
    }
    a.on(a.$('button'), 'click', shuffle);
    shuffle();
    a.loop(() => (a.$('b').style.fontSize = 12 + a.amount * 12 + 'cqw'));
  });
})();
