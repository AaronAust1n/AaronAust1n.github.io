(() => {
  const { register, clamp } = Museum;
  // @effect decode
  register('decode', (root, a) => {
    a.background('#202f28');
    const target = 'STAY CURIOUS',
      chars = '01XK#*+/?';
    let start = -0.15;
    a.html(
      '<button class="fx-type-button" aria-label="解码 STAY CURIOUS"><span class="fx-word fx-mono" aria-hidden="true"></span><span class="fx-label">DECODING THE UNKNOWN</span></button>'
    );
    a.on(a.$('button'), 'click', () => (start = a.time));
    a.loop((t) => {
      const progress = ((t - start) / (1 + a.amount * 3)) * target.length;
      a.$('.fx-word').textContent = [...target]
        .map((c, i) =>
          c === ' ' || i < progress ? c : chars[Math.floor((t * 21 + i * 3) % chars.length)]
        )
        .join('');
    });
  });
  // @effect marquee
  register('marquee', (root, a) => {
    a.background('#b3c09c');
    a.html(
      '<div class="fx-marquee" style="color:#334330;transform:rotate(-8deg)" aria-label="IDEAS IN MOTION"><span>IDEAS IN MOTION ↗ </span><span aria-hidden="true">IDEAS IN MOTION ↗ </span></div>'
    );
    let position = 0;
    a.on(root, 'pointerdown', (e) => root.setPointerCapture(e.pointerId));
    a.loop((t, dt) => {
      const span = a.$('span'),
        width = span.getBoundingClientRect().width;
      if (!a.pointer.down) position = (position + dt * 35) % Math.max(1, width);
      span.style.paddingRight = `${15 + a.amount * 60}px`;
      a.$('.fx-marquee').style.transform = `rotate(-8deg) translateX(${-position}px)`;
    });
  });
  // @effect outline
  register('outline', (root, a) => {
    a.background('#363043');
    a.html(
      '<div class="fx-outline-text">FORM</div><div class="fx-outline-text" data-fill style="color:#ded0e9" aria-hidden="true">FORM</div>'
    );
    a.loop(() => {
      const x = 50 + a.pointer.nx * 45,
        y = 50 + a.pointer.ny * 45;
      a.$('[data-fill]').style.clipPath = `circle(49% at ${x}% ${y}%)`;
      a.$$('.fx-outline-text').forEach(
        (el) => (el.style.webkitTextStrokeWidth = `${0.4 + a.amount * 2}px`)
      );
    });
  });
  // @effect split
  register('split', (root, a) => {
    a.background('#e7d4c1');
    a.html(
      '<div class="fx-word fx-letters" style="color:#826249" aria-label="PLAYFUL">' +
        [...'PLAYFUL'].map((c) => `<span aria-hidden="true">${c}</span>`).join('') +
        '</div>'
    );
    a.loop(() => {
      const chars = a.$$('span');
      chars.forEach((el, i) => {
        const x = (i - (chars.length - 1) / 2) * root.clientWidth * 0.065,
          d = x - a.pointer.nx * root.clientWidth * 0.5,
          k = a.pointer.inside ? Math.max(0, 1 - Math.abs(d) / (40 + a.amount * 60)) : 0;
        el.style.transform = `translateY(${-k * (8 + a.amount * 30)}px) rotate(${k * Math.sign(d) * 15}deg)`;
      });
    });
  });
  // @effect typewriter
  register('typewriter', (root, a) => {
    a.background('#deded0');
    const lines = ['把好奇心，留给世界。', 'Make room for wonder.', '今天，也想试试新东西。'];
    let index = 0,
      start = 0;
    a.html(
      '<button class="fx-type-button" style="color:#566447" aria-label="切换打字内容"><span class="fx-word" style="font-size:clamp(12px,5.5cqw,34px)"><span data-text></span><i class="fx-cursor"></i></span><span class="fx-label">ONE LETTER AT A TIME</span></button>'
    );
    a.on(a.$('button'), 'click', () => {
      index = (index + 1) % lines.length;
      start = a.time;
    });
    a.loop((t) => {
      const s = lines[index],
        elapsed = t - start,
        write = s.length / 8,
        hold = 1 + a.amount * 4,
        total = write * 2 + hold,
        p = elapsed % total;
      const n =
        p < write
          ? Math.floor(p * 8)
          : p < write + hold
            ? s.length
            : Math.max(0, s.length - Math.floor((p - write - hold) * 8));
      a.$('[data-text]').textContent = document.body.classList.contains('reduce-motion')
        ? s
        : s.slice(0, n);
      a.$('.fx-cursor').style.opacity = Math.sin(t * 4) > 0 ? 1 : 0.2;
    });
  });
  // @effect kinetic
  register('kinetic', (root, a) => {
    a.background('#2a3144');
    a.html(
      '<div class="fx-word fx-letters" style="color:#b6c4e5" aria-label="WAVELENGTH">' +
        [...'WAVELENGTH'].map((c) => `<span aria-hidden="true">${c}</span>`).join('') +
        '</div>'
    );
    a.loop((t) => {
      a.$$('span').forEach(
        (el, i) =>
          (el.style.transform = `translateY(${Math.sin(i * 0.5 - t * 1.7 + a.pointer.nx) * (3 + a.amount * 23)}px)`)
      );
    });
  });
  // @effect gradienttext
  register('gradienttext', (root, a) => {
    a.background('#28252f');
    a.html(
      '<div class="fx-word" style="font-size:clamp(28px,15cqw,95px);color:#d7bddd;background-clip:text;-webkit-background-clip:text">CHROMA</div>'
    );
    a.loop((t) => {
      const h = 260 + a.pointer.nx * 40;
      a.$('.fx-word').style.backgroundImage =
        `linear-gradient(${t * 12 + 90}deg,hsl(${h} 55% 78%),hsl(${h + 40 + a.amount * 150} 70% 79%),hsl(${h + 80} 65% 65%))`;
      if (
        CSS.supports('background-clip', 'text') ||
        CSS.supports('-webkit-background-clip', 'text')
      )
        a.$('.fx-word').style.color = 'transparent';
    });
  });
  // @effect textshadow
  register('textshadow', (root, a) => {
    a.background('#d7c9b6');
    a.html(
      '<div class="fx-word" style="font-size:clamp(30px,18cqw,110px);color:#f1e7d5;transform:rotate(-8deg)">DEPTH</div>'
    );
    a.loop(() => {
      const x = (a.pointer.nx || 0.5) * (1 + a.amount * 2),
        y = (a.pointer.ny || 0.5) * (1 + a.amount * 2);
      a.$('.fx-word').style.textShadow = Array.from(
        { length: 18 },
        (_, i) => `${x * i}px ${y * i}px 0 hsl(27 22% ${62 - i * 0.7}%)`
      ).join(',');
    });
  });
  // @effect scramble
  register('scramble', (root, a) => {
    a.background('#d4dfd9');
    const words = ['想象之外', '灵感发生', '动手试试', '保持好奇'];
    let index = 0,
      start = -4;
    a.html(
      '<button class="fx-type-button" style="color:#3b5b4e" aria-label="切换词语"><span class="fx-word" aria-hidden="true"></span><span class="fx-label">REMIX YOUR THOUGHTS ↗</span></button>'
    );
    a.$('.fx-word').textContent = words[0];
    a.on(a.$('button'), 'click', () => {
      index = (index + 1) % words.length;
      start = a.time;
      a.$('button').setAttribute('aria-label', '切换词语，当前：' + words[index]);
    });
    a.loop((t) => {
      const elapsed = (t - start) * (0.6 + a.amount * 2),
        s = words[index];
      a.$('.fx-word').textContent =
        elapsed > 1
          ? s
          : [...s]
              .map((_, i) => words[Math.floor(t * 18 + i) % 4][(i + Math.floor(t * 9)) % 4])
              .join('');
    });
  });
  // @effect typepath
  register('typepath', (root, a) => {
    a.background('#ece2cb');
    let direction = 1;
    const id = 'verse-path-' + a.uid;
    a.html(
      `<svg viewBox="0 0 240 210" style="width:85%;height:85%;overflow:visible" aria-label="WONDER IS ALL AROUND YOU"><defs><path id="${id}" d="M120,36a69,69 0 1,1 0,138a69,69 0 1,1 0,-138"/></defs><g><text fill="#7d7657" font-size="12.5" font-family="Georgia" letter-spacing="2"><textPath href="#${id}">WONDER IS ALL AROUND YOU · KEEP LOOKING · </textPath></text></g><text x="120" y="118" text-anchor="middle" font-size="39" fill="#9b946f">✳</text></svg>`
    );
    a.on(root, 'click', () => (direction *= -1));
    a.loop((t) => {
      const r = 52 + a.amount * 32;
      a.$('path').setAttribute(
        'd',
        `M120,${105 - r}a${r},${r} 0 1,1 0,${r * 2}a${r},${r} 0 1,1 0,-${r * 2}`
      );
      a.$('g').setAttribute('transform', `rotate(${t * 9 * direction} 120 105)`);
    });
  });
  // @effect pixeltype
  register('pixeltype', (root, a) => {
    a.background('#211d31');
    const sample = document.createElement('canvas');
    sample.width = 160;
    sample.height = 60;
    const sg = sample.getContext('2d');
    let particles = [],
      dots = [],
      word = 0;
    function raster() {
      sg.clearRect(0, 0, 160, 60);
      sg.fillStyle = '#fff';
      sg.font = 'bold 48px sans-serif';
      sg.textAlign = 'center';
      sg.textBaseline = 'middle';
      sg.fillText(['PLAY', 'TYPE', 'IDEA'][word], 80, 32, 150);
      const data = sg.getImageData(0, 0, 160, 60).data;
      dots = [];
      for (let y = 0; y < 60; y += 3)
        for (let x = 0; x < 160; x += 3)
          if (data[(y * 160 + x) * 4 + 3] > 100) dots.push([x, y]);
      const previous = particles;
      particles = dots.slice(0, 1100).map(([x, y], i) => ({
        x: previous[i]?.x ?? 80,
        y: previous[i]?.y ?? 30,
        tx: x,
        ty: y,
      }));
    }
    raster();
    a.on(root, 'click', () => {
      word = (word + 1) % 3;
      raster();
      a.repaint();
    });
    a.canvas((g, w, h, t, dt) => {
      const scale = (w * 0.86) / 160;
      let drawing = dots;
      if (a.params.mode === 'particles') {
        const k =
          a.paused || MuseumMechanics.reduced()
            ? 1
            : 1 - Math.exp(-dt * a.params.settle);
        particles.forEach((p) => {
          p.x += (p.tx - p.x) * k;
          p.y += (p.ty - p.y) * k;
        });
        drawing = particles.map((p) => [p.x, p.y]);
      }
      MuseumLab.state(a, {
        mode: a.params.mode,
        word,
        count: particles.length,
        error:
          particles.reduce((v, p) => v + Math.hypot(p.tx - p.x, p.ty - p.y), 0) /
          Math.max(1, particles.length),
      });
      for (const [x, y] of drawing) {
        const px = w * 0.07 + x * scale,
          py = h / 2 + (y - 30) * scale,
          d = Math.hypot(px - a.pointer.x, py - a.pointer.y),
          glow = a.pointer.inside ? Math.max(0, 1 - d / 65) : 0;
        g.fillStyle = `hsl(${270 + x * 0.3} 42% ${66 + glow * 22}%)`;
        g.beginPath();
        g.arc(
          px,
          py,
          scale * (0.55 + a.amount * 0.95) * (1 + glow * 0.3),
          0,
          Math.PI * 2,
        );
        g.fill();
      }
    });
  });
  // @effect curtain
  register('curtain', (root, a) => {
    a.background('#b7c6a6');
    let start = -2;
    a.html(
      '<button class="fx-curtain" aria-label="重新揭幕：MAKE ROOM FOR WONDER">' +
        ['MAKE ROOM', 'FOR', 'WONDER.']
          .map(
            (s, i) =>
              `<span class="fx-curtain-row"><b style="font-style:${i === 1 ? 'italic' : 'normal'}">${s}</b></span>`
          )
          .join('') +
        '</button>'
    );
    a.on(a.$('button'), 'click', () => {
      start = a.time;
      a.repaint();
    });
    a.loop((t) => {
      const reduced = document.body.classList.contains('reduce-motion');
      a.$$('b').forEach((el, i) => {
        const p = reduced ? 1 : clamp((t - start - i * (0.05 + a.amount * 0.45)) / 0.8),
          eased = 1 - (1 - p) ** 3;
        el.style.transform = `translateY(${(1 - eased) * 110}%)`;
        el.style.opacity = 0.15 + eased * 0.85;
      });
    });
  });
  // @effect broadsheet
  register('broadsheet', (root, a) => {
    let n = 0;
    a.background('#e8e1d1');
    a.html(
      '<div class="nx-news"><header>THE OUTLINE TIMES</header><button class="nx-headline">好奇心，今日重新开馆。</button><div class="nx-columns"><p>一座不写“请勿触摸”的展馆，把想法变成可以试验的形状。每一次点击，都为画面添上一种可能。</p><p>设计不只在远处被观看。让手指进入现场，看看节奏如何回应动作，秩序又如何容纳变化。</p><p>这是本地演示新闻，没有实时资讯。邀请你带走原理，继续写下自己的下一页。</p></div></div>'
    );
    a.on(
      a.$('button'),
      'click',
      () =>
        (a.$('button').textContent = [
          '好奇心，今日重新开馆。',
          '灵感抵达，不设截止日期。',
          '把观看，变成一次动手。'
        ][++n % 3])
    );
    a.loop(() => (a.$('.nx-columns').style.columnGap = 6 + a.amount * 16 + 'px'));
  });
  // @effect underlines
  register('underlines', (root, a) => {
    a.background('#dbe4d3');
    const labels = [
      '滑入',
      '生长',
      '荧光',
      '虚点',
      '波浪',
      '辉光',
      '居中',
      '描框',
      '括号',
      '反色',
      '箭头',
      '双线'
    ];
    a.html(
      '<div class="nx-underlines">' +
        labels
          .map(
            (s, i) =>
              `<button class="nx-u nx-u${i}" aria-pressed="false"><span>${s}</span><i>${i === 4 ? '<svg viewBox="0 0 120 6" preserveAspectRatio="none"><path d="M0 3Q5 0 10 3T20 3T30 3T40 3T50 3T60 3T70 3T80 3T90 3T100 3T110 3T120 3"/></svg>' : ''}</i></button>`
          )
          .join('') +
        '</div>'
    );
    a.$$('button').forEach((b) =>
      a.on(b, 'click', () => {
        const on = b.getAttribute('aria-pressed') !== 'true';
        b.setAttribute('aria-pressed', on);
        b.classList.toggle('on', on);
      })
    );
    a.loop((t) => {
      root.style.setProperty('--underline', 1 + a.amount * 3 + 'px');
      root.style.setProperty('--wave-shift', -(t % 1) * 16 + 'px');
    });
  });
  // @effect vertical
  register('vertical', (root, a) => {
    a.background('#e6deca');
    a.html(
      '<div class="nx-vertical">' +
        [
          ['风过竹林', '看见留白，也听见风。'],
          ['雨停苔上', '让时间，停在字里。'],
          ['月落纸间', '一行文字，一次呼吸。']
        ]
          .map(([s, n]) => `<button><span>${s}</span><i>${n}</i></button>`)
          .join('') +
        '</div>'
    );
    a.$$('button').forEach((b) => a.on(b, 'click', () => b.classList.toggle('on')));
    a.loop(() => (a.$('.nx-vertical').style.gap = 8 + a.amount * 18 + 'px'));
  });
  // @effect shapewrap
  register('shapewrap', (root, a) => {
    let mode = 0;
    a.background('#dedbc8');
    a.html(
      '<button class="nx-wrap" aria-label="切换文字绕排形状"><i></i><p>文字沿着一座小岛慢慢流动。形状变化时，句子会自动寻找新的岸线。这里没有手工给每一行写坐标，浏览器替我们完成空间里的排布。让想法在空白之间呼吸，让阅读成为另一种风景。文字沿着小岛继续流动。</p></button>'
    );
    a.on(a.$('button'), 'click', () => {
      mode = (mode + 1) % 3;
      root.dataset.shape = mode;
      a.repaint();
    });
    a.loop(() => {
      const el = a.$('i');
      el.style.width = 30 + a.amount * 22 + '%';
      el.style.shapeOutside = ['circle(50%)', 'inset(0 round 8px)', 'ellipse(45% 50%)'][mode];
      el.style.borderRadius = ['50%', '8px', '45% 50%'][mode];
    });
  });
  // @effect dropcap
  register('dropcap', (root, a) => {
    a.background('#e8dfca');
    a.html(
      '<div class="nx-dropcap"><button aria-label="照亮首字">观</button><p>看，是想法的开始。把一个字放大，让它落进三行文字之间，版面就有了可以停留的起点。此处使用浮动布局，而不是将文字画在图片上。试着靠近首字，再沿着段落继续阅读。</p></div>'
    );
    a.on(a.$('button'), 'click', () => a.$('button').classList.toggle('on'));
    a.loop(() => (a.$('button').style.fontSize = `clamp(32px, ${10 + a.amount * 4}cqw, 110px)`));
  });
  // @effect counters
  register('counters', (root, a) => {
    let chapters = ['观察', '试验', '发现'];
    a.background('#dce1d1');
    a.html(
      '<div class="nx-counters"><ol></ol><div><button data-add>+ 章节</button><button data-remove>− 章节</button></div></div>'
    );
    function paint() {
      a.$('ol').innerHTML = chapters.map((s) => `<li>${s}</li>`).join('');
      a.$('[data-add]').disabled = chapters.length >= 8;
      a.$('[data-remove]').disabled = chapters.length <= 1;
      root.dataset.chapters = chapters.length;
    }
    paint();
    a.on(a.$('[data-add]'), 'click', () => {
      if (chapters.length < 8) chapters.push('新的可能');
      paint();
    });
    a.on(a.$('[data-remove]'), 'click', () => {
      if (chapters.length > 1) chapters.pop();
      paint();
    });
    a.loop(() => root.style.setProperty('--chapter-gap', 3 + a.amount * 9 + 'px'));
  });
  // @effect hanging
  register('hanging', (root, a) => {
    let on = false;
    a.background('#e3dbca');
    a.html(
      '<div class="nx-hanging"><div class="nx-quote"><b>“</b>秩序，也可以<br>从边缘开始。</div><button aria-pressed="false">开启悬挂 →</button></div>'
    );
    a.on(a.$('button'), 'click', () => {
      on = !on;
      a.$('button').setAttribute('aria-pressed', on);
      a.$('button').textContent = on ? '关闭悬挂 ←' : '开启悬挂 →';
      a.repaint();
    });
    a.loop(
      () => (a.$('.nx-quote b').style.marginLeft = on ? -(0.42 + a.amount * 0.4) + 'em' : '0')
    );
  });
  // @effect glitch
  register('glitch', (root, a) => {
    let start = -1;
    a.background('#282135');
    a.html(
      '<button class="nx-glitch" aria-label="制造一次信号事故"><span>SIGNAL</span><i aria-hidden="true">SIGNAL</i><b aria-hidden="true">SIGNAL</b><small>CLICK / DISRUPT / RECOVER</small></button>'
    );
    a.on(a.$('button'), 'click', () => (start = a.time));
    a.loop((t) => {
      const active = t - start < 0.5 && !MuseumExpansion.reduced(),
        step = Math.floor((t - start) * 12),
        d = active ? (2 + a.amount * 10) * Math.sin(step * 17) : 0;
      a.$('i').style.transform = `translate(${d}px,${-d * 0.2}px)`;
      a.$('b').style.transform = `translate(${-d}px,${d * 0.3}px)`;
      a.$('i').style.clipPath = `inset(${active ? (step % 4) * 15 : 0}% 0 ${active ? 35 : 0}% 0)`;
      a.$('i').style.opacity = a.$('b').style.opacity = active ? 0.8 : 0;
      root.dataset.glitch = active;
    });
  });
})();
