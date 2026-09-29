(() => {
  const { register, circle, path, clamp, rng } = Museum;
  // @effect aurora
  register('aurora', (root, a) => {
    a.background('#111c26');
    a.canvas((g, w, h, t) => {
      g.globalCompositeOperation = 'screen';
      for (let band = 0; band < 4; band++) {
        const grad = g.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, ['#198d9670', '#75974970', '#3049a870', '#8060a970'][band]);
        grad.addColorStop(1, '#1f243500');
        g.fillStyle = grad;
        g.beginPath();
        g.moveTo(0, h);
        for (let x = 0; x <= w + 4; x += 4) {
          const y =
            h * 0.45 +
            Math.sin((x / w) * 5 + t * 0.55 + band) * h * (0.1 + a.amount * 0.15) +
            Math.sin((x / w) * 9 - t * 0.3) * h * 0.09 +
            band * 11 +
            a.pointer.ny * 18;
          g.lineTo(x, y);
        }
        g.lineTo(w, h);
        g.closePath();
        g.fill();
      }
      g.fillStyle = '#d6efcf';
      g.font = `${Math.max(5, w * 0.027)}px monospace`;
      g.textAlign = 'center';
      g.fillText('B R E A T H E   I N   C O L O R', w / 2, h * 0.8);
    });
  });
  // @effect glass
  register('glass', (root, a) => {
    a.background('#b3a5b2');
    a.html(
      '<div class="fx-orb" style="width:70%;height:100%;left:-15%;top:18%;background:#ffb695"></div><div class="fx-orb" style="width:65%;height:105%;right:-10%;top:-24%;background:#aba5e2"></div><div class="fx-orb" style="width:45%;height:60%;right:10%;bottom:-20%;background:#d7ecc0"></div><div class="fx-glass fx-drag" tabindex="0" aria-label="可拖动磨砂玻璃"><b>glass.</b><span>SEE THROUGH IDEAS</span></div>'
    );
    const glass = a.$('.fx-glass');
    let x = 0,
      y = 0;
    a.on(glass, 'pointerdown', (e) => {
      glass.setPointerCapture(e.pointerId);
    });
    a.on(glass, 'pointermove', (e) => {
      if (e.buttons) {
        x = a.pointer.nx * root.clientWidth * 0.25;
        y = a.pointer.ny * root.clientHeight * 0.23;
      }
    });
    a.on(glass, 'keydown', (e) => {
      if (e.key.startsWith('Arrow')) {
        e.preventDefault();
        x += e.key === 'ArrowRight' ? 8 : e.key === 'ArrowLeft' ? -8 : 0;
        y += e.key === 'ArrowDown' ? 8 : e.key === 'ArrowUp' ? -8 : 0;
      }
    });
    a.loop(() => {
      glass.style.transform = `translate(${x}px,${y}px)`;
      glass.style.backdropFilter = `blur(${3 + a.amount * 23}px)`;
    });
  });
  // @effect iridescent
  register('iridescent', (root, a) => {
    a.html(
      '<div class="fx-center"><span class="fx-badge">SPECTRUM / 003</span><div class="fx-title" style="font-weight:300;letter-spacing:4px">光的另一面</div></div>'
    );
    a.loop((t) => {
      const x = 50 + a.pointer.nx * 35,
        y = 50 + a.pointer.ny * 35;
      root.style.background = `radial-gradient(ellipse at ${x}% ${y}%,#ffffff${Math.round(
        30 + a.amount * 130
      )
        .toString(16)
        .padStart(
          2,
          '0'
        )},transparent 55%),conic-gradient(from ${t * 9 + a.pointer.nx * 35}deg at 38% 60%,#848ec2,#c7a7b6,#e9cba5,#9ac6b4,#869ccd,#c3a8d4,#848ec2)`;
    });
  });
  // @effect grain
  register('grain', (root, a) => {
    let color = 0;
    const noise = document.createElement('canvas');
    noise.width = 180;
    noise.height = 130;
    const ng = noise.getContext('2d'),
      data = ng.createImageData(180, 130),
      random = rng(42);
    for (let i = 0; i < data.data.length; i += 4) {
      const v = random() * 255;
      data.data.set([v, v, v, 125], i);
    }
    ng.putImageData(data, 0, 0);
    a.on(root, 'click', () => (color = (color + 1) % 3));
    a.canvas((g, w, h, t) => {
      const colors = [
        ['#f09568', '#684d84', '#c6ceb0'],
        ['#789697', '#333c66', '#c4c7a0'],
        ['#bc8692', '#794d52', '#e0cda6']
      ][color];
      const grad = g.createLinearGradient(0, h, w, 0);
      colors.forEach((c, i) => grad.addColorStop(i / 2, c));
      g.fillStyle = grad;
      g.fillRect(0, 0, w, h);
      g.globalAlpha = 0.08 + a.amount * 0.45;
      g.globalCompositeOperation = 'soft-light';
      g.drawImage(noise, 0, 0, w, h);
      g.globalAlpha = 1;
      g.globalCompositeOperation = 'source-over';
      g.fillStyle = '#fff8';
      g.font = `italic ${w * 0.12}px Georgia`;
      g.textAlign = 'center';
      g.fillText('imperfect.', w / 2, h * 0.55);
    });
  });
  // @effect shadow
  register('shadow', (root, a) => {
    a.background('#dfd6c5');
    a.html(
      '<div class="fx-center"><div class="fx-shadow-block"></div></div><div class="fx-light-point"></div>'
    );
    const block = a.$('.fx-shadow-block'),
      light = a.$('.fx-light-point');
    a.loop(() => {
      const x = a.pointer.inside ? a.pointer.nx : -0.6,
        y = a.pointer.inside ? a.pointer.ny : -0.6,
        k = 15 + a.amount * 35;
      block.style.boxShadow = `${-x * k}px ${-y * k}px ${12 + Math.hypot(x, y) * 20}px #59432d45,inset 1px 1px 0 #fff8`;
      light.style.left = `${50 + x * 40}%`;
      light.style.top = `${50 + y * 40}%`;
    });
  });
  // @effect spotlight
  register('spotlight', (root, a) => {
    a.background('#14231e');
    a.html(
      '<div class="fx-center fx-grid-bg"><div class="fx-word" style="color:#ffffff0f;letter-spacing:5px">DISCOVER</div></div><div class="fx-center fx-grid-bg" data-lit style="background-color:#b8d59a;color:#273d2b"><div class="fx-word" style="letter-spacing:5px">DISCOVER</div></div>'
    );
    a.loop(() => {
      a.$('[data-lit]').style.clipPath =
        `circle(${25 + a.amount * 70}px at ${50 + a.pointer.nx * 48}% ${50 + a.pointer.ny * 48}%)`;
    });
  });
  // @effect chrome
  register('chrome', (root, a) => {
    a.background('#232323');
    a.canvas((g, w, h, t) => {
      for (let x = 0; x < w; x += 2) {
        const v = Math.sin(
          (x / w) * 11 + Math.sin((x / w) * 6 + t * 0.35 + a.pointer.nx) * (0.5 + a.amount * 4)
        );
        const c = Math.round(35 + Math.pow((v + 1) / 2, 3) * 208);
        g.fillStyle = `rgb(${c},${c + 2},${c + 5})`;
        g.fillRect(x, 0, 3, h);
      }
      g.fillStyle = '#ffffffc0';
      g.textAlign = 'center';
      g.font = `italic ${w * 0.18}px Georgia`;
      g.fillText('liquid', w / 2, h * 0.59);
    });
  });
  // @effect caustics
  register('caustics', (root, a) => {
    a.background('#194c55');
    a.canvas((g, w, h, t) => {
      g.globalCompositeOperation = 'screen';
      for (let layer = 0; layer < 3; layer++) {
        g.strokeStyle = ['#92d9b943', '#72b3b340', '#e6e9b82b'][layer];
        g.lineWidth = 1.3;
        for (let j = -4; j < 15; j++) {
          g.beginPath();
          for (let i = -4; i < 28; i++) {
            const x = (i * w) / 22 + Math.sin(j * 0.8 + t * 0.5 + layer) * 12,
              y =
                (j * h) / 11 +
                Math.sin(i * 0.65 + j * 0.45 + t * (0.2 + layer * 0.09) + a.pointer.nx) *
                  (8 + a.amount * 20);
            i === -4 ? g.moveTo(x, y) : g.lineTo(x, y);
          }
          g.stroke();
        }
      }
    });
  });
  // @effect neon
  register('neon', (root, a) => {
    a.background('#242031');
    let on = true;
    a.html(
      '<button class="fx-type-button" aria-pressed="true" aria-label="霓虹灯电源"><svg viewBox="0 0 260 150" style="width:80%;height:75%;overflow:visible" aria-hidden="true"><path d="M30 105V45Q30 25 50 25H210Q230 25 230 45V105Q230 125 210 125H50Q30 125 30 105Z" fill="none" stroke="#c5a7e6" stroke-width="1.5"/><text x="130" y="88" fill="none" stroke="#d6bae9" stroke-width=".8" font-family="Arial" font-size="43" text-anchor="middle" letter-spacing="4">OPEN</text></svg></button>'
    );
    a.on(a.$('button'), 'click', () => {
      on = !on;
      a.$('button').setAttribute('aria-pressed', on);
    });
    a.loop(() => {
      a.$('svg').style.filter = on
        ? `drop-shadow(0 0 ${2 + a.amount * 7}px #b597ea) drop-shadow(0 0 ${8 + a.amount * 10}px #ad74dc)`
        : 'none';
      a.$('svg').style.opacity = on ? 1 : 0.16;
    });
  });
  // @effect duotone
  register('duotone', (root, a) => {
    a.background('#ddbf8f');
    const markup =
      '<div class="fx-center" style="overflow:hidden"><div style="width:130px;height:130px;border-radius:50%;border:30px solid currentColor;transform:rotate(-25deg);box-shadow:65px 60px 0 -10px currentColor,-70px -75px 0 -25px currentColor"></div><div style="position:absolute;font-size:10px;letter-spacing:5px">TWO / TONES</div></div>';
    a.html(
      `<div data-base style="position:absolute;inset:0;background:#dcb988;color:#755257">${markup}</div><div data-top style="position:absolute;inset:0;background:#94bdba;color:#284647">${markup}</div><div data-divider style="position:absolute;inset:0 auto 0 50%;border-left:1px solid #fff8"></div>`
    );
    a.loop(() => {
      const x = 50 + a.pointer.nx * 48;
      a.$('[data-top]').style.clipPath = `inset(0 ${100 - x}% 0 0)`;
      a.$('[data-divider]').style.left = x + '%';
      root.style.filter = `contrast(${0.8 + a.amount * 0.8})`;
    });
  });
  // @effect prism
  register('prism', (root, a) => {
    a.background('#181e30');
    a.canvas((g, w, h, t) => {
      const left = [w * 0.42, h * 0.6],
        out = [w * 0.63, h * 0.54],
        tip = [w * 0.51, h * 0.2],
        base = [w * 0.75, h * 0.79];
      const y = h * (0.38 + a.pointer.ny * 0.2);
      g.lineWidth = 2.5;
      g.strokeStyle = '#f8ecd6';
      path(g, [[0, y], left]);
      g.stroke();
      const grad = g.createLinearGradient(w * 0.3, 0, w * 0.8, h);
      grad.addColorStop(0, '#c3d2ff24');
      grad.addColorStop(1, '#9aaed805');
      g.fillStyle = grad;
      g.strokeStyle = '#d0deee66';
      g.lineWidth = 1;
      path(g, [tip, [w * 0.28, h * 0.79], base], true);
      g.fill();
      g.stroke();
      g.strokeStyle = '#eef4db88';
      path(g, [left, out]);
      g.stroke();
      g.globalCompositeOperation = 'screen';
      for (let i = 0; i < 7; i++) {
        const yy = h * (0.5 + (i - 3) * (0.025 + a.amount * 0.025)) + a.pointer.ny * h * 0.1;
        g.strokeStyle = `hsla(${i * 45},85%,67%,.85)`;
        g.lineWidth = 2;
        path(g, [out, [w, yy]]);
        g.stroke();
      }
      g.globalCompositeOperation = 'source-over';
      g.fillStyle = '#c8d4db88';
      g.font = `${Math.max(6, w * 0.025)}px monospace`;
      g.textAlign = 'center';
      g.fillText('ONE LIGHT / MANY POSSIBILITIES', w * 0.5, h * 0.88);
    });
  });
  // @effect halftone
  register('halftone', (root, a) => {
    a.background('#ebdbc5');
    a.canvas((g, w, h) => {
      const step = 5 + a.amount * 10,
        cx = w * (0.5 + a.pointer.nx * 0.23),
        cy = h * (0.5 + a.pointer.ny * 0.23);
      g.fillStyle = '#584b4c';
      for (let y = 0; y < h + step; y += step)
        for (let x = 0; x < w + step; x += step) {
          const d = Math.hypot((x - cx) / (w * 0.34), (y - cy) / (h * 0.42)),
            tone = clamp(1 - d) * 0.85 + 0.09 + Math.sin(x * 0.02 + y * 0.014) * 0.04;
          circle(g, x, y, step * 0.48 * Math.sqrt(Math.max(0, tone)), '#5b5052');
        }
    });
  });
  // @effect rgbmix
  register('rgbmix', (root, a) => {
    a.background('#171d25');
    let turn = 0;
    a.on(root, 'click', () => {
      turn += Math.PI / 3;
      a.repaint();
    });
    a.canvas((g, w, h, t) => {
      g.globalCompositeOperation = 'screen';
      const radius = Math.min(w, h) * (0.19 + a.amount * 0.16),
        gap = radius * 0.66;
      ['#ef263b', '#23cf7b', '#245fee'].forEach((color, i) => {
        const q = (i / 3) * Math.PI * 2 - Math.PI / 2 + turn;
        circle(
          g,
          w / 2 + Math.cos(q) * gap + a.pointer.nx * gap * (i === 0 ? 1 : -0.3),
          h * 0.49 + Math.sin(q) * gap + a.pointer.ny * gap * (i === 2 ? 1 : -0.3),
          radius,
          color
        );
      });
      g.globalCompositeOperation = 'source-over';
      g.fillStyle = '#b5becf80';
      g.font = '8px monospace';
      g.textAlign = 'center';
      g.fillText('R + G + B', w / 2, h * 0.86);
    });
  });
  // @effect brushed
  register('brushed', (root, a) => {
    const X = MuseumExpansion;
    let angle = 0,
      last = 0;
    a.background('#3c4345');
    a.html(
      '<div class="nx-metal"><button class="nx-metal-knob" aria-label="拖动或方向键调整铝旋钮"><i></i><b></b></button><output>50 / LEVEL</output></div>'
    );
    const knob = a.$('button');
    const get = (e) => {
      const r = knob.getBoundingClientRect();
      return Math.atan2(e.clientY - r.top - r.height / 2, e.clientX - r.left - r.width / 2);
    };
    X.pointerDrag(a, knob, {
      start: (e) => (last = get(e)),
      move: (e) => {
        const q = get(e);
        let d = q - last;
        if (d > Math.PI) d -= Math.PI * 2;
        if (d < -Math.PI) d += Math.PI * 2;
        angle = clamp(angle + (d * 180) / Math.PI, -135, 135);
        last = q;
        a.repaint();
      }
    });
    a.on(knob, 'keydown', (e) => {
      if (e.key.startsWith('Arrow')) {
        e.preventDefault();
        angle = clamp(angle + (e.key === 'ArrowLeft' || e.key === 'ArrowDown' ? -5 : 5), -135, 135);
        a.repaint();
      }
    });
    a.loop(() => {
      knob.style.setProperty('--ba', angle + 'deg');
      knob.style.setProperty('--inner', -angle * (0.7 + a.amount * 1.4) + 'deg');
      a.$('output').textContent = Math.round(((angle + 135) / 270) * 100) + ' / LEVEL';
    });
  });
  // @effect inkwash
  register('inkwash', (root, a) => {
    a.background('#e9e3d3');
    let drops = [];
    function drop(x, y) {
      drops.push({
        x,
        y,
        t: a.time,
        p: Array.from({ length: 34 }, () => ({
          q: Math.random() * Math.PI * 2,
          r: Math.random(),
          s: 0.5 + Math.random()
        }))
      });
      drops = drops.slice(-16);
    }
    drop(0.5, 0.46);
    a.on(root, 'pointerdown', () => {
      drop(a.pointer.x / root.clientWidth, a.pointer.y / root.clientHeight);
      a.repaint();
    });
    a.canvas((g, w, h, t) => {
      for (const d of drops) {
        const age = clamp((t - d.t) / 2.3),
          spread = (1 - (1 - age) ** 3) * (12 + a.amount * 36);
        d.p.forEach((p) => {
          g.fillStyle = `rgba(41,45,40,${(0.1 + 0.2 * p.r) * (1 - age * 0.6)})`;
          circle(
            g,
            d.x * w + Math.cos(p.q) * spread * p.r,
            d.y * h + Math.sin(p.q) * spread * p.r,
            3 + spread * p.s * 0.4,
            g.fillStyle
          );
        });
      }
    });
  });
  // @effect wax
  register('wax', (root, a) => {
    let start = -4;
    a.background('#baaca0');
    a.html(
      '<button class="nx-letter" aria-label="在信纸上落印"><span>To the curious.</span><i class="nx-seal">O</i><small>SEALED WITH AN IDEA</small></button>'
    );
    a.on(a.$('button'), 'click', () => (start = a.time));
    a.loop((t) => {
      const p = clamp((t - start) / 1.1),
        landing =
          p < 0.55
            ? 2.2 - 1.2 * (p / 0.55)
            : 1 - Math.sin(((p - 0.55) / 0.45) * Math.PI) * (0.04 + a.amount * 0.18);
      a.$('.nx-seal').style.transform =
        `translate(-50%,-50%) scale(${landing}) rotate(${(1 - p) * -28}deg)`;
      a.$('.nx-seal').style.opacity = clamp(p * 4);
    });
  });
  // @effect kintsugi
  register('kintsugi', (root, a) => {
    a.background('#323b35');
    let lines = [],
      start = -4,
      prior = -1,
      seed = 31;
    function crack() {
      const r = rng(++seed);
      lines = [];
      for (let n = 0; n < 3 + Math.round(a.amount * 5); n++) {
        let x = 0.5,
          y = 0.48,
          q = (n / (3 + Math.round(a.amount * 5))) * Math.PI * 2;
        const branch = [[x, y]];
        for (let j = 0; j < 12; j++) {
          q += (r() - 0.5) * 0.65;
          x += Math.cos(q) * 0.026;
          y += Math.sin(q) * 0.026;
          branch.push([x, y]);
          if (j === 6) {
            lines.push([
              [x, y],
              [x + Math.cos(q + 0.8) * 0.06, y + Math.sin(q + 0.8) * 0.06],
              [x + Math.cos(q + 1) * 0.1, y + Math.sin(q + 1) * 0.1]
            ]);
          }
        }
        lines.push(branch);
      }
    }
    crack();
    a.on(root, 'click', () => {
      crack();
      start = a.time;
    });
    a.canvas((g, w, h, t) => {
      const R = Math.min(w, h) * 0.35;
      circle(g, w / 2, h * 0.48, R, '#ddd9c6');
      g.save();
      g.beginPath();
      g.arc(w / 2, h * 0.48, R, 0, Math.PI * 2);
      g.clip();
      if (prior !== a.amount) {
        prior = a.amount;
        crack();
      }
      const dt = t - start,
        p = clamp(dt / 0.7),
        gold = clamp((dt - 0.7) / 1.9);
      for (const points of lines) {
        const px = points.map(([x, y]) => [
          w / 2 + (x - 0.5) * R * 3,
          h * 0.48 + (y - 0.48) * R * 3
        ]);
        g.strokeStyle = '#655e4c';
        g.lineWidth = 1;
        path(g, px.slice(0, Math.max(1, Math.ceil(px.length * p))));
        g.stroke();
        g.strokeStyle = '#cda655';
        g.lineWidth = 2;
        g.shadowColor = '#edc878';
        g.shadowBlur = gold * 5;
        path(g, px.slice(0, Math.max(1, Math.ceil(px.length * gold))));
        g.stroke();
      }
      g.restore();
    });
  });
  // @effect velvet
  register('velvet', (root, a) => {
    a.background('#3c3444');
    const hairs = Array.from({ length: 24 * 16 }, () => 0);
    let last = { x: 0, y: 0 },
      direction = 0;
    a.on(root, 'pointermove', () => {
      direction = Math.atan2(a.pointer.y - last.y, a.pointer.x - last.x);
      last = { x: a.pointer.x, y: a.pointer.y };
    });
    a.canvas((g, w, h) => {
      const r = 25 + a.amount * 60;
      for (let x = 0; x < 24; x++)
        for (let y = 0; y < 16; y++) {
          const i = x * 16 + y,
            px = ((x + 0.5) * w) / 24,
            py = ((y + 0.5) * h) / 16,
            d = Math.hypot(px - a.pointer.x, py - a.pointer.y);
          if (a.pointer.inside && d < r) hairs[i] += (direction - hairs[i]) * 0.2;
          else hairs[i] += (0 - hairs[i]) * 0.018;
          const q = hairs[i];
          g.strokeStyle = `hsl(${278 + Math.cos(q) * 9} 19% ${25 + Math.abs(Math.sin(q)) * 32}%)`;
          g.lineWidth = 2;
          path(g, [
            [px, py],
            [px + Math.sin(q) * 7, py - Math.cos(q) * 7]
          ]);
          g.stroke();
        }
    });
  });
  // @effect refraction
  register('refraction', (root, a) => {
    const L = MuseumLab;
    L.shell(
      a,
      'SNELL / 光线在介质之间',
      `<output class="bc-note bc-bottom" role="status"></output>`,
      '#243541',
    );
    a.canvas((g, w, h) => {
      const p = a.params,
        r = L.refraction(p.n1, p.n2, p.angle),
        cx = w / 2,
        cy = h * 0.48,
        len = Math.min(w * 0.38, h * 0.35),
        th = r.incident;
      g.fillStyle = '#9bcacd16';
      g.fillRect(0, cy, w, h - cy);
      g.strokeStyle = '#e4e3cf66';
      g.lineWidth = 1;
      g.beginPath();
      g.moveTo(0, cy);
      g.lineTo(w, cy);
      g.stroke();
      g.setLineDash([4, 5]);
      g.beginPath();
      g.moveTo(cx, 35);
      g.lineTo(cx, h - 36);
      g.stroke();
      g.setLineDash([]);
      function ray(x, y, color) {
        g.strokeStyle = color;
        g.lineWidth = 2;
        g.beginPath();
        g.moveTo(cx, cy);
        g.lineTo(x, y);
        g.stroke();
        circle(g, x, y, 3, color);
      }
      ray(cx - len * Math.sin(th), cy - len * Math.cos(th), '#f3d276');
      ray(cx + len * Math.sin(th), cy - len * Math.cos(th), '#efa880');
      if (!r.tir)
        ray(
          cx + len * Math.sin(r.transmitted),
          cy + len * Math.cos(r.transmitted),
          '#9fdbd6',
        );
      g.font = '12px monospace';
      g.fillStyle = '#e0e2d8';
      g.fillText(`n₁ ${p.n1.toFixed(2)}`, 12, 54);
      g.fillText(`n₂ ${p.n2.toFixed(2)}`, 12, cy + 24);
      g.fillText('入射 / 反射', w * 0.62, 52);
      a.$('output').textContent =
        `${r.tir ? '全反射 · 无透射线' : '折射角 ' + ((r.transmitted * 180) / Math.PI).toFixed(2) + '°'} · ${r.critical === null ? '无全反射阈值' : '临界角 ' + r.critical.toFixed(2) + '°'} · 不计算能量分配`;
      L.state(a, r);
    });
  });

})();
