(() => {
  const { register, clamp } = Museum;
  // A local, keyboard-focusable scroll root. Never reads window.scrollY.
  function scrollScene(a, markup, bg = '#283b32') {
    a.background(bg);
    a.html(
      `<div class="fx-scroll" tabindex="0" aria-label="独立滚动演示，可用上下键滚动">${markup}</div>`
    );
    const el = a.$('.fx-scroll');
    a.on(el, 'scroll', () => a.repaint(), { passive: true });
    return [el, () => clamp(el.scrollTop / Math.max(1, el.scrollHeight - el.clientHeight))];
  }
  const caption =
    '<div class="fx-scroll-caption"><span>SCROLL INSIDE ↓</span><span>LOCAL STORY</span></div>';
  // @effect progress
  register('progress', (root, a) => {
    const [el, progress] = scrollScene(
      a,
      '<div class="fx-progress"></div>' +
        ['开始阅读', '走进细节', '留住灵感', '带走方法']
          .map(
            (s, i) =>
              `<section class="fx-scroll-section"><b>0${i + 1}</b><h4>${s}</h4><p class="fx-scroll-p" style="margin:0">每一个小小的动作，都在讲述一段故事。<br>继续向下，让想法慢慢浮现。</p></section>`
          )
          .join('')
    );
    a.loop(() => {
      a.$('.fx-progress').style.transform = `scaleX(${Math.max(0.015, progress())})`;
      a.$('.fx-progress').style.height = `${2 + a.amount * 7}px`;
    });
  });
  // @effect reveal
  register('reveal', (root, a) => {
    const [el] = scrollScene(
      a,
      ['Observe.', 'Explore.', 'Create.', 'Repeat.']
        .map(
          (s, i) =>
            `<section class="fx-scroll-section" style="min-height:190px"><div data-reveal><span class="fx-label">CHAPTER 0${i + 1}</span><h4 style="font:italic 36px Georgia">${s}</h4><p class="fx-scroll-p" style="margin:0">随着滚动，新的想法进入视野。</p></div></section>`
        )
        .join(''),
      '#343044'
    );
    a.loop(() => {
      a.$$('[data-reveal]').forEach((item) => {
        const pos = item.parentElement.offsetTop - el.scrollTop,
          k = clamp((el.clientHeight - pos) / Math.min(120, el.clientHeight * 0.6));
        item.style.opacity = 0.08 + k * 0.92;
        item.style.transform = `translateY(${(1 - k) * (8 + a.amount * 42)}px)`;
      });
    });
  });
  // @effect sticky
  register('sticky', (root, a) => {
    scrollScene(
      a,
      ['起点', '过程', '抵达']
        .map(
          (s, i) =>
            `<section style="min-height:300px;position:relative;background:${['#303e34', '#46513c', '#65654b'][i]}"><h4 data-sticky style="position:sticky;top:0;margin:0;padding:50px 25px 18px;background:inherit;font-weight:400">0${i + 1} / ${s}</h4><p class="fx-scroll-p">章节标题停留在这里，<br>直到下一个故事到来。</p><p class="fx-scroll-p" style="padding-top:80px">继续向下 ↓</p></section>`
        )
        .join('')
    );
    a.loop(() =>
      a.$$('[data-sticky]').forEach((el) => (el.style.fontSize = `${18 + a.amount * 16}px`))
    );
  });
  // @effect scrollparallax
  register('scrollparallax', (root, a) => {
    const [el, p] = scrollScene(
      a,
      `<div class="fx-scroll-inner"><div class="fx-scroll-sticky"><div class="fx-landscape" style="inset:0"><div class="fx-sun"></div>${['#9eaf87', '#6c8a71', '#3e6b59'].map((c, i) => `<div class="fx-mountain" style="background:${c};top:${i * 15}%;inset-inline:-25%"></div>`).join('')}</div>${caption}<span style="z-index:2;font:italic 34px Georgia;color:#fff9">Far & away.</span></div></div>`
    );
    a.loop(() =>
      a
        .$$('.fx-mountain')
        .forEach(
          (item, i) =>
            (item.style.transform = `translateX(${-p() * (i + 1) * (12 + a.amount * 32)}px)`)
        )
    );
  });
  // @effect horizontal
  register('horizontal', (root, a) => {
    const [el, p] = scrollScene(
      a,
      `<div class="fx-scroll-inner"><div class="fx-scroll-sticky"><div class="fx-story-track">${['Look closer', 'Feel more', 'Think beyond'].map((s, i) => `<div style="background:${['#59506b', '#5e7180', '#798a6c'][i]}"><b>0${i + 1}</b><span>${s}</span></div>`).join('')}</div>${caption}</div></div>`
    );
    a.loop(
      () =>
        (a.$('.fx-story-track').style.transform =
          `translateX(${-Math.pow(p(), 0.5 + a.amount * 1.5) * 66.6667}%)`)
    );
  });
  // @effect scalestory
  register('scalestory', (root, a) => {
    const [el, p] = scrollScene(
      a,
      `<div class="fx-scroll-inner"><div class="fx-scroll-sticky" style="background:#d9d5c1">${caption}<div data-shape style="width:38px;height:38px;background:#778b66;border-radius:50%"></div><span style="position:absolute;mix-blend-mode:difference;color:white;font:italic 29px Georgia">Small beginnings.</span></div></div>`
    );
    a.loop(() => {
      const v = p();
      a.$('[data-shape]').style.transform =
        `scale(${1 + v * (5 + a.amount * 8)}) rotate(${v * 80}deg)`;
      a.$('[data-shape]').style.borderRadius = `${50 - v * 42}%`;
    });
  });
  // @effect reading
  register('reading', (root, a) => {
    const text = '好的设计，不只是被看见。它回应你的每一次靠近，让平凡的操作，也有值得停留的瞬间。';
    const [el, p] = scrollScene(
      a,
      `<div class="fx-scroll-inner"><div class="fx-scroll-sticky">${caption}<div class="fx-reading" aria-label="${text}">${[...text].map((c) => `<span aria-hidden="true">${c}</span>`).join('')}</div></div></div>`,
      '#353343'
    );
    a.loop(() =>
      a
        .$$('.fx-reading span')
        .forEach((s, i) => (s.style.opacity = i <= p() * text.length ? 1 : 0.05 + a.amount * 0.28))
    );
  });
  // @effect timeline
  register('timeline', (root, a) => {
    const [el, p] = scrollScene(
      a,
      `<div class="fx-scroll-inner"><div class="fx-scroll-sticky">${caption}<div style="position:relative;width:77%"><div style="position:absolute;left:12px;top:12px;bottom:12px;width:2px;background:#fff2"><div data-line style="height:100%;background:#cfdfa3;transform-origin:top"></div></div>${['好奇 / Curiosity', '试验 / Experiment', '发现 / Discovery', '创造 / Creation'].map((s, i) => `<div data-step style="display:flex;align-items:center;gap:15px;margin:15px 0;font-size:10px;position:relative"><i style="width:25px;height:25px;border-radius:50%;background:#3b5041;border:1px solid #b3c794;display:block"></i>${s}</div>`).join('')}</div></div></div>`
    );
    a.loop(() => {
      a.$('[data-line]').style.transform = `scaleY(${p()})`;
      a.$('[data-line]').parentElement.style.width = `${1 + a.amount * 5}px`;
      a.$$('[data-step]').forEach((item, i) => {
        item.style.opacity = p() * 3 + 0.1 >= i ? 1 : 0.35;
        item.querySelector('i').style.background = p() * 3 + 0.1 >= i ? '#bacb91' : '#3b5041';
      });
    });
  });
  // @effect cardscroll
  register('cardscroll', (root, a) => {
    scrollScene(
      a,
      `<div style="min-height:600%;padding:46px 20px 260px">${['一张白纸', '一个念头', '一次尝试', '一种可能'].map((s, i) => `<section data-card style="position:sticky;height:140px;margin-bottom:105px;padding:20px;background:${['#b8c6a4', '#a0b29a', '#869e8a', '#657f72'][i]};border:1px solid #fff3;border-radius:8px;color:#263e2c;box-shadow:0 5px 20px #0001"><span style="font:italic 27px Georgia">0${i + 1}</span><h4 style="font-size:15px;font-weight:400">${s}</h4></section>`).join('')}</div>`,
      '#d4d9c7'
    );
    a.loop(() =>
      a
        .$$('[data-card]')
        .forEach((item, i) => (item.style.top = `${35 + i * (4 + a.amount * 14)}px`))
    );
  });
  // @effect scrolldraw
  register('scrolldraw', (root, a) => {
    const [el, p] = scrollScene(
      a,
      `<div class="fx-scroll-inner"><div class="fx-scroll-sticky">${caption}<svg viewBox="0 0 300 190" style="width:90%;height:85%" aria-label="滚动绘制路径"><path d="M30 135C80 160 50 35 110 40S135 180 185 145S205 10 270 60" stroke="#ffffff16" fill="none" stroke-width="2"/><path data-draw d="M30 135C80 160 50 35 110 40S135 180 185 145S205 10 270 60" pathLength="1" stroke="#d2bfeb" fill="none" stroke-width="3" stroke-linecap="round" stroke-dasharray="1"/></svg></div></div>`,
      '#322c43'
    );
    a.loop(() => {
      a.$('[data-draw]').style.strokeDashoffset = 1 - Math.max(0.05, p());
      a.$('[data-draw]').style.strokeWidth = 1 + a.amount * 6;
    });
  });
  // @effect milestones
  register('milestones', (root, a) => {
    const [el, p] = scrollScene(
      a,
      `<div class="fx-scroll-inner"><div class="fx-scroll-sticky">${caption}<div class="fx-milestones"><span class="fx-label">DEMO DATA / 非真实统计</span>${['发现', '尝试', '创造'].map((s, i) => `<div class="fx-milestone"><strong data-value>0</strong><span>${s}<small>CHAPTER 0${i + 1}</small></span></div>`).join('')}</div></div></div>`,
      '#2e3040'
    );
    a.loop(() => {
      a.$$('[data-value]').forEach((item, i) => {
        const local = clamp(p() * 3 - i),
          target = Math.round((50 + a.amount * 450) / (i + 1));
        item.textContent = String(Math.round(local * target)).padStart(3, '0');
        item.parentElement.style.opacity = 0.25 + local * 0.75;
      });
    });
  });
  // @effect zoommap
  register('zoommap', (root, a) => {
    const [el, p] = scrollScene(
      a,
      `<div class="fx-scroll-inner"><div class="fx-scroll-sticky">${caption}<div class="fx-zoom-map"><div class="fx-map-district"><span>CITY / 城市</span><div class="fx-map-block"><span>BLOCK / 街区</span><div class="fx-map-room"><span>ROOM / 一间屋</span><i>✳</i></div></div></div></div><span class="fx-map-level"></span></div></div>`,
      '#d7decf'
    );
    a.loop(() => {
      const zoom = Math.pow(12 + a.amount * 12, p()),
        level =
          p() < 0.34
            ? '01 / FROM ABOVE'
            : p() < 0.7
              ? '02 / A LITTLE CLOSER'
              : '03 / FIND YOUR PLACE';
      a.$('.fx-map-district').style.transform = `scale(${zoom})`;
      a.$('.fx-map-level').textContent = level;
      a.$('.fx-map-room i').style.opacity = clamp((p() - 0.65) * 4);
    });
  });
})();
