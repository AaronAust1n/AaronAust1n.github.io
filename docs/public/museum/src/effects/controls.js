(() => {
  const { register, clamp } = Museum;
  // @effect toggle
  register('toggle', (root, a) => {
    a.background('#e4e5d4');
    let night = false;
    a.html(
      '<div class="fx-center"><button class="fx-toggle" aria-label="切换日夜" aria-pressed="false"><span class="fx-toggle-stars">· ✦</span><span class="fx-toggle-knob"></span></button><span class="fx-control-caption" style="color:#516346">DAY MODE</span></div>'
    );
    a.on(a.$('button'), 'click', () => {
      night = !night;
      a.$('button').setAttribute('aria-pressed', night);
      a.$('.fx-control-caption').textContent = night ? 'NIGHT MODE' : 'DAY MODE';
    });
    a.loop(() => {
      root.style.background = night ? '#2d3543' : '#e4e5d4';
      a.$('button').style.background = night ? '#4c5473' : '#bed3d0';
      a.$('.fx-toggle-knob').style.transform = `translateX(${night ? 55 : 0}px)`;
      a.$('.fx-toggle-knob').style.background = night ? '#e0e1cb' : '#f3cf75';
      a.$('.fx-toggle-stars').style.opacity = night ? 0.3 + a.amount * 0.7 : 0;
      a.$('.fx-control-caption').style.color = night ? '#c4cce0' : '#516346';
    });
  });
  // @effect slider
  register('slider', (root, a) => {
    a.background('#3b3440');
    a.html(
      '<div class="fx-center"><div class="fx-temperature">24°</div><input class="fx-slider-control" type="range" min="0" max="100" value="55" aria-label="色温"><span class="fx-control-caption">COOL ← → WARM</span></div>'
    );
    a.on(a.$('input'), 'input', () => a.repaint());
    a.loop(() => {
      const v = Number(a.$('input').value),
        hue = 205 - v * 1.8;
      a.$('.fx-temperature').style.background = `hsl(${hue} ${25 + a.amount * 55}% 75%)`;
      a.$('.fx-temperature').style.boxShadow = `0 0 45px hsl(${hue} 40% 65% / .25)`;
      a.$('.fx-temperature').textContent = Math.round(5 + v * 0.35) + '°';
    });
  });
  // @effect hold
  register('hold', (root, a) => {
    a.background('#2e3c32');
    let start = null,
      done = false,
      elapsed = 0;
    a.html(
      '<div class="fx-center"><button class="fx-hold" aria-label="长按确认"><span class="fx-hold-fill"></span><span data-label>长按确认 →</span></button><span class="fx-control-caption">HOLD SPACE OR PRESS</span></div>'
    );
    const b = a.$('button');
    function begin() {
      if (done) {
        done = false;
        elapsed = 0;
      }
      start = a.time;
    }
    function cancel() {
      start = null;
      if (!done) elapsed = 0;
      paint(done ? 1 : 0);
      a.repaint();
    }
    a.on(b, 'pointerdown', (e) => {
      b.setPointerCapture(e.pointerId);
      begin();
    });
    a.on(b, 'pointerup', cancel);
    a.on(b, 'pointercancel', cancel);
    a.on(b, 'lostpointercapture', cancel);
    a.on(b, 'blur', cancel);
    a.on(b, 'keydown', (e) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        if (!e.repeat) begin();
      }
    });
    a.on(b, 'keyup', (e) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        cancel();
      }
    });
    // User-initiated confirmation works even when ambient animations are reduced.
    let last = performance.now();
    const timer = setInterval(() => {
      const now = performance.now(),
        dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      if (start !== null && !done && !a.paused && !a.suspended) {
        elapsed += dt * a.speed;
        const p = clamp(elapsed / (0.6 + a.amount * 2));
        if (p >= 1) {
          done = true;
          start = null;
        }
        paint(p);
      } else if (start === null) paint(done ? 1 : 0);
    }, 30);
    a.cleanup(() => clearInterval(timer));
    function paint(p) {
      a.$('.fx-hold-fill').style.transform = `scaleX(${p})`;
      a.$('[data-label]').textContent = done ? '✓ 已确认' : p > 0 ? '继续按住…' : '长按确认 →';
      b.setAttribute('aria-label', done ? '已确认，长按可再试一次' : '长按确认');
    }
  });
  // @effect like
  register('like', (root, a) => {
    a.background('#ebd9d6');
    let liked = false,
      start = -5;
    a.html(
      '<div class="fx-center"><button class="fx-heart" aria-label="喜欢" aria-pressed="false">♡</button><span class="fx-control-caption" style="color:#a0737d">A LITTLE MOMENT OF JOY</span>' +
        Array.from(
          { length: 18 },
          () => '<i class="fx-love-particle" aria-hidden="true"></i>'
        ).join('') +
        '</div>'
    );
    a.on(a.$('button'), 'click', () => {
      liked = !liked;
      a.$('button').setAttribute('aria-pressed', liked);
      a.$('button').textContent = liked ? '♥' : '♡';
      if (liked) start = a.time;
    });
    a.loop((t) => {
      const p = clamp((t - start) / 0.85),
        n = 5 + Math.round(a.amount * 13);
      a.$$('i').forEach((el, i) => {
        const q = (i / n) * Math.PI * 2;
        el.style.opacity = i < n ? Math.sin(p * Math.PI) : 0;
        el.style.transform = `translate(${Math.cos(q) * p * 70}px,${Math.sin(q) * p * 60 - 18 + p * p * 20}px) scale(${1 - p * 0.7})`;
      });
      a.$('button').style.transform = `scale(${1 + Math.sin(p * Math.PI) * 0.2})`;
    });
  });
  // @effect toast
  register('toast', (root, a) => {
    a.background('#dce2d1');
    let start = -10,
      count = 0;
    a.html(
      '<div class="fx-center"><button class="fx-button" style="background:#496045;color:#e3ecd3;margin-top:25px">发送一条好消息 ↗</button><div class="fx-toast" role="status" style="opacity:0"><b>✓</b><span></span></div></div>'
    );
    a.on(a.$('button'), 'click', () => {
      start = a.time;
      count++;
      a.$('.fx-toast span').textContent = `灵感已收到 · ${count}`;
    });
    a.loop((t) => {
      const visible = t - start < 1 + a.amount * 5;
      a.$('.fx-toast').style.opacity = visible ? 1 : 0;
      a.$('.fx-toast').style.transform = `translateY(${visible ? 0 : -12}px)`;
    });
  });
  // @effect dragorder
  register('dragorder', (root, a) => {
    a.background('#273a31');
    let items = ['收集灵感', '动手实验', '分享发现'],
      drag = null,
      origin = 0,
      activeEl = null;
    a.html(
      '<div class="fx-center"><div class="fx-sort-list" role="list" aria-label="可排序步骤"></div></div>'
    );
    function move(i, j) {
      if (j < 0 || j >= items.length || i === j) return;
      [items[i], items[j]] = [items[j], items[i]];
      draw();
    }
    function draw() {
      a.$('.fx-sort-list').innerHTML = items
        .map(
          (s, i) =>
            `<div class="fx-sort-row" role="listitem" data-index="${i}"><span class="fx-sort-handle">⠿</span><span>${s}</span><button data-delta="-1" aria-label="上移${s}" ${i === 0 ? 'disabled' : ''}>↑</button><button data-delta="1" aria-label="下移${s}" ${i === 2 ? 'disabled' : ''}>↓</button></div>`
        )
        .join('');
    }
    draw();
    const list = a.$('.fx-sort-list');
    a.on(list, 'click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      const i = Number(b.closest('[data-index]').dataset.index),
        j = i + Number(b.dataset.delta);
      move(i, j);
      list.querySelector(`[data-index="${j}"] button:not(:disabled)`)?.focus();
    });
    a.on(list, 'pointerdown', (e) => {
      if (e.target.closest('button')) return;
      const row = e.target.closest('[data-index]');
      if (!row) return;
      drag = Number(row.dataset.index);
      origin = e.clientY;
      activeEl = row;
      row.style.background = '#586c49';
      list.setPointerCapture(e.pointerId);
    });
    a.on(list, 'pointermove', (e) => {
      if (drag === null) return;
      activeEl.style.transform = `translateY(${(e.clientY - origin) * (0.7 + a.amount * 0.3)}px)`;
      activeEl.style.zIndex = 2;
    });
    a.on(list, 'pointerup', (e) => {
      if (drag === null) return;
      const delta = e.clientY - origin,
        threshold = activeEl.getBoundingClientRect().height * 0.45,
        j = clamp(
          drag +
            (Math.abs(delta) > threshold
              ? Math.sign(delta) * Math.max(1, Math.round(Math.abs(delta) / 40))
              : 0),
          0,
          2
        );
      move(drag, j);
      drag = null;
      draw();
    });
    a.on(list, 'pointercancel', () => {
      drag = null;
      draw();
    });
  });
  // @effect radial
  register('radial', (root, a) => {
    const K = MuseumMechanics;
    let open = false,
      progress = 0,
      prior = 'click',
      beganOpen = false;
    a.background('#2b3840');
    root.classList.add('mx-radial-upgraded');
    a.html(
      '<div class="fx-center"><button class="fx-radial-main" aria-label="展开环形菜单" aria-expanded="false"><span>+</span><svg class="mx-hold-ring" viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="21" pathLength="1" stroke-dasharray="1"/></svg></button>' +
        ['✳', '◇', '↗', '○', '≋']
          .map(
            (s, i) =>
              `<button class="fx-radial-option" tabindex="-1" aria-label="选择${['星花', '菱形', '箭头', '圆形', '波纹'][i]}">${s}</button>`
          )
          .join('') +
        '<div class="mx-radial-mode"><button data-activation="click" aria-pressed="true">点击</button><button data-activation="hold" aria-pressed="false">长按</button><button data-direct hidden>直接打开</button></div><span class="fx-control-caption" style="position:absolute;bottom:29px" role="status">OPEN TO EXPLORE</span></div>'
    );
    const main = a.$('.fx-radial-main'),
      options = a.$$('.fx-radial-option');
    function paint() {
      const holdMode = a.params.activation === 'hold',
        n = holdMode ? 3 : 5;
      main.setAttribute('aria-expanded', open);
      main.setAttribute(
        'aria-label',
        holdMode ? `按住 ${a.params.holdMs} 毫秒唤出菜单，或使用直接打开按钮` : '展开环形菜单'
      );
      main.style.transform = `rotate(${open ? 45 : 0}deg)`;
      a.$('.mx-hold-ring').hidden = !holdMode;
      a.$('circle').style.strokeDashoffset = 1 - progress;
      options.forEach((b, i) => {
        const shown = i < n;
        b.hidden = !shown;
        b.tabIndex = open && shown ? 0 : -1;
        const q = (i / n) * Math.PI * 2 - Math.PI / 2,
          r = 35 + a.amount * 37;
        b.style.transform = `translate(${open ? Math.cos(q) * r : 0}px,${open ? Math.sin(q) * r : 0}px)`;
        b.style.opacity = open && shown ? 1 : 0;
        b.style.pointerEvents = open && shown ? 'auto' : 'none';
      });
      a.$('[data-direct]').hidden = !holdMode;
      a.$('[data-direct]').textContent = open ? '收起菜单' : '直接打开';
      a.$$('[data-activation]').forEach((b) =>
        b.setAttribute('aria-pressed', b.dataset.activation === a.params.activation)
      );
      root.dataset.open = open;
      root.dataset.activation = a.params.activation;
      root.dataset.progress = progress.toFixed(3);
    }
    function expand(value) {
      open = value;
      progress = 0;
      paint();
      a.$('.fx-control-caption').textContent = value ? '选择一件灵感' : 'OPEN TO EXPLORE';
    }
    const hold = K.hold(a, main, {
      enabled: () => a.params.activation === 'hold' && !open,
      duration: () => a.params.holdMs,
      progress: (p) => {
        if (a.params.activation === 'hold') {
          progress = p;
          paint();
        }
      },
      complete: () => {
        if (a.params.activation === 'hold') expand(true);
      },
      cancelled: () => {
        progress = 0;
        paint();
      }
    });
    a.on(main, 'pointerdown', () => {
      beganOpen = open;
    });
    a.on(main, 'click', (e) => {
      if (a.params.activation === 'click') {
        hold.cancel('click', false);
        expand(!open);
      } else if (open && (beganOpen || e.detail === 0)) expand(false);
    });
    options.forEach((b) =>
      a.on(b, 'click', () => (a.$('.fx-control-caption').textContent = '已选择 ' + b.textContent))
    );
    a.$$('[data-activation]').forEach((b) =>
      a.on(b, 'click', () => a.setParams({ activation: b.dataset.activation }))
    );
    a.on(a.$('[data-direct]'), 'click', () => {
      hold.cancel('direct', false);
      expand(!open);
    });
    a.onParamsChange(() => {
      hold.cancel('parameters', false);
      if (prior !== a.params.activation) {
        prior = a.params.activation;
        expand(false);
      }
      paint();
    });
    a.loop(paint);
  });
  // @effect stepper
  register('stepper', (root, a) => {
    a.background('#e5dfcf');
    let step = 0;
    const names = ['发现灵感', '开始实验', '完成创作'];
    a.html(
      '<div class="fx-center" style="color:#4c6342"><div class="fx-step-row">' +
        [1, 2, 3]
          .map((n) => `<span class="fx-step" style="border-color:#83966e66">${n}</span>`)
          .join('') +
        '</div><span class="fx-step-label" role="status"></span><div style="display:flex;gap:8px"><button class="fx-button" data-prev>上一步</button><button class="fx-button" data-next>下一步 →</button></div></div>'
    );
    function paint() {
      a.$$('.fx-step').forEach((b, i) => {
        b.classList.toggle('current', i <= step);
        b.setAttribute('aria-current', i === step ? 'step' : 'false');
      });
      a.$('.fx-step-label').textContent = names[step];
      a.$('[data-prev]').disabled = step === 0;
      a.$('[data-next]').disabled = step === 2;
      a.$('[data-next]').textContent = step === 2 ? '已完成 ✓' : '下一步 →';
    }
    paint();
    a.on(a.$('[data-prev]'), 'click', () => {
      step = Math.max(0, step - 1);
      paint();
    });
    a.on(a.$('[data-next]'), 'click', () => {
      step = Math.min(2, step + 1);
      paint();
    });
    a.loop(() => (a.$('.fx-step-row').style.gap = `${16 + a.amount * 24}px`));
  });
  // @effect segmented
  register('segmented', (root, a) => {
    a.background('#2a3b30');
    let selected = 0;
    const symbols = ['☀', '✳', '☾'],
      names = ['清晨', '午后', '夜晚'];
    a.html(
      '<div class="fx-center"><div class="fx-tab-content" role="tabpanel" id="tab-content-' +
        a.uid +
        '">☀</div><div class="fx-tabs" role="tablist" aria-label="时间分段"><i class="fx-tab-indicator" aria-hidden="true"></i>' +
        names
          .map(
            (s, i) =>
              `<button role="tab" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" aria-controls="tab-content-${a.uid}">${s}</button>`,
          )
          .join('') +
        '</div></div>',
    );
    function select(i, focus = false) {
      selected = (i + 3) % 3;
      a.$$('button').forEach((b, j) => {
        b.setAttribute('aria-selected', j === selected);
        b.tabIndex = j === selected ? 0 : -1;
        if (j === selected && focus) b.focus();
      });
      a.$('.fx-tab-content').textContent = symbols[selected];
      measure();
    }
    function measure() {
      const b = a.$$('button')[selected],
        indicator = a.$('.fx-tab-indicator');
      indicator.style.left = '0px';
      indicator.style.width = b.offsetWidth + 'px';
      indicator.style.transform = `translateX(${b.offsetLeft}px)`;
      MuseumLab.state(a, { selected, width: b.offsetWidth, left: b.offsetLeft });
    }
    a.onParamsChange((p) => {
      const measured = p.labels === 'measured';
      a.$('.fx-tabs').classList.toggle('bc-measured', measured);
      a.$$('button').forEach(
        (b, i) =>
          (b.textContent = (measured ? ['晨', '悠长的午后', '夜色渐深'] : names)[
            i
          ]),
      );
      measure();
    });
    MuseumLab.observe(a, a.$('.fx-tabs'), measure);
    a.$$('button').forEach((b, i) => a.on(b, 'click', () => select(i)));
    a.on(a.$('.fx-tabs'), 'keydown', (e) => {
      if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
        e.preventDefault();
        select(
          e.key === 'Home'
            ? 0
            : e.key === 'End'
              ? 2
              : selected + (e.key === 'ArrowRight' ? 1 : -1),
          true,
        );
      }
    });
    a.loop(() => {
      a.$('.fx-tab-indicator').style.borderRadius = `${2 + a.amount * 16}px`;
    });
  });
  // @effect password
  register('password', (root, a) => {
    a.background('#26372e');
    let visible = false;
    const id = 'demo-password-' + a.uid;
    a.html(
      `<div class="fx-center"><div class="fx-password-wrap"><label class="fx-password-label" for="${id}">DEMO ONLY / 不要输入真实密码</label><div class="fx-password-field"><input id="${id}" type="password" placeholder="试试随意输入…" autocomplete="off" spellcheck="false" maxlength="40"><button aria-label="显示演示密码" aria-pressed="false">显示</button></div><div class="fx-password-note" role="status">仅在此展品内处理，不存储、不发送。</div></div></div>`
    );
    a.on(a.$('button'), 'click', () => {
      visible = !visible;
      a.$('input').type = visible ? 'text' : 'password';
      a.$('button').textContent = visible ? '隐藏' : '显示';
      a.$('button').setAttribute('aria-pressed', visible);
      a.$('button').setAttribute('aria-label', visible ? '隐藏演示密码' : '显示演示密码');
    });
    a.on(a.$('input'), 'input', () => {
      a.$('.fx-password-note').textContent =
        `已输入 ${[...a.$('input').value].length} 个字符 · 仅本地演示`;
    });
    a.loop(() => (a.$('input').style.fontSize = `${10 + a.amount * 8}px`));
  });
  // @effect undo
  register('undo', (root, a) => {
    a.background('#e3ded1');
    const colors = ['#acbfa4', '#bba4bc', '#dcbd8e', '#78989a'];
    let history = [Array(6).fill(0)],
      cursor = 0;
    a.html(
      '<div class="fx-undo-board">' +
        Array.from(
          { length: 6 },
          (_, i) => `<button data-tile="${i}" aria-label="改变第 ${i + 1} 格颜色"></button>`
        ).join('') +
        '</div><div class="fx-undo-tools"><button data-undo aria-label="撤销">↶ 撤销</button><span data-history role="status"></span><button data-redo aria-label="重做">重做 ↷</button></div>'
    );
    function paint() {
      const limit = 3 + Math.round(a.amount * 17);
      while (history.length > limit + 1) {
        if (cursor > 0) {
          history.shift();
          cursor--;
        } else history.pop();
      }
      a.$$('[data-tile]').forEach((b, i) => {
        b.style.background = colors[history[cursor][i]];
        b.textContent = ['○', '◇', '✳', '+'][history[cursor][i]];
      });
      a.$('[data-undo]').disabled = cursor === 0;
      a.$('[data-redo]').disabled = cursor === history.length - 1;
      a.$('[data-history]').textContent = `${cursor} / ${history.length - 1}`;
      root.dataset.historyLength = history.length;
    }
    a.$$('[data-tile]').forEach((b, i) =>
      a.on(b, 'click', () => {
        const next = history[cursor].slice();
        next[i] = (next[i] + 1) % 4;
        history = history.slice(0, cursor + 1);
        history.push(next);
        cursor++;
        paint();
      })
    );
    a.on(a.$('[data-undo]'), 'click', () => {
      if (cursor > 0) cursor--;
      paint();
    });
    a.on(a.$('[data-redo]'), 'click', () => {
      if (cursor < history.length - 1) cursor++;
      paint();
    });
    a.loop(paint);
  });
  // @effect range
  register('range', (root, a) => {
    a.background('#283b37');
    let lo = 25,
      hi = 75;
    const id = 'interval-' + a.uid;
    a.html(
      `<div class="fx-range-demo"><span class="fx-label">SELECT YOUR INTERVAL</span><div class="fx-range-values"><output data-lo>25</output><span>—</span><output data-hi>75</output></div><div class="fx-dual-track"><div class="fx-dual-fill"></div><input id="${id}-low" data-low type="range" min="0" max="100" value="25" aria-label="区间下限"><input id="${id}-high" data-high type="range" min="0" max="100" value="75" aria-label="区间上限"></div><div class="fx-range-caption"><span>0</span><span data-gap></span><span>100</span></div></div>`
    );
    function paint() {
      const gap = Math.round(a.amount * 30);
      if (hi - lo < gap) {
        hi = Math.min(100, lo + gap);
        lo = Math.min(lo, hi - gap);
      }
      a.$('[data-low]').value = lo;
      a.$('[data-high]').value = hi;
      a.$('[data-lo]').textContent = lo;
      a.$('[data-hi]').textContent = hi;
      a.$('[data-gap]').textContent = `间隔 ≥ ${gap}`;
      a.$('.fx-dual-fill').style.left = lo + '%';
      a.$('.fx-dual-fill').style.width = hi - lo + '%';
      a.$('[data-low]').setAttribute('aria-valuetext', '下限 ' + lo);
      a.$('[data-high]').setAttribute('aria-valuetext', '上限 ' + hi);
    }
    a.on(a.$('[data-low]'), 'input', (e) => {
      lo = Math.max(0, Math.min(Number(e.target.value), hi - Math.round(a.amount * 30)));
      paint();
    });
    a.on(a.$('[data-high]'), 'input', (e) => {
      hi = Math.min(100, Math.max(Number(e.target.value), lo + Math.round(a.amount * 30)));
      paint();
    });
    a.loop(paint);
  });
  // @effect command
  register('command', (root, a) => {
    a.background('#2a2d3d');
    const commands = [
      ['晨雾', 'morning', '#d5dfcd', '#52624a'],
      ['深林', 'forest', '#213d32', '#c8dcae'],
      ['暮紫', 'violet', '#3a2f49', '#dbc3ea'],
      ['砂岩', 'sand', '#d7bea2', '#6b4d3c'],
      ['海湾', 'ocean', '#254951', '#b8d7d9']
    ];
    let active = 0,
      query = '',
      previous = -1;
    const uid = 'commands-' + a.uid;
    a.html(
      `<div class="fx-command"><input role="combobox" aria-label="搜索本地配色命令" aria-autocomplete="list" aria-expanded="true" aria-controls="${uid}" placeholder="搜索配色 / 输入 morning…" autocomplete="off"><div id="${uid}" role="listbox" aria-label="配色指令"></div><div class="fx-command-status" role="status">↑ ↓ 选择 · Enter 应用</div></div>`
    );
    const input = a.$('input'),
      list = a.$('[role=listbox]');
    let visible = [];
    function refresh() {
      visible = commands
        .filter((c) => (c[0] + ' ' + c[1]).includes(query))
        .slice(0, 2 + Math.round(a.amount * 3));
      active = clamp(active, 0, Math.max(0, visible.length - 1));
      list.innerHTML = visible.length
        ? visible
            .map(
              (c, i) =>
                `<button role="option" tabindex="-1" id="${uid}-${i}" data-index="${i}" aria-selected="${i === active}"><i style="background:${c[2]}"></i><span>${c[0]}<small>${c[1]}</small></span><b>↵</b></button>`
            )
            .join('')
        : '<p class="fx-command-empty">没有匹配的本地配色</p>';
      if (visible.length) input.setAttribute('aria-activedescendant', `${uid}-${active}`);
      else input.removeAttribute('aria-activedescendant');
    }
    function apply(i) {
      const c = visible[i];
      if (!c) return;
      root.style.background = c[2];
      a.$('.fx-command-status').textContent = '已应用：' + c[0];
      a.$('.fx-command').style.setProperty('--command-accent', c[3]);
    }
    a.on(input, 'input', () => {
      query = input.value.trim().toLowerCase();
      active = 0;
      refresh();
    });
    a.on(input, 'keydown', (e) => {
      if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) {
        e.preventDefault();
        active =
          e.key === 'Home'
            ? 0
            : e.key === 'End'
              ? visible.length - 1
              : (active + (e.key === 'ArrowDown' ? 1 : -1) + Math.max(1, visible.length)) %
                Math.max(1, visible.length);
        refresh();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        apply(active);
      }
    });
    a.on(list, 'click', (e) => {
      const b = e.target.closest('[data-index]');
      if (b) {
        active = Number(b.dataset.index);
        apply(active);
        refresh();
        input.focus();
      }
    });
    a.loop(() => {
      if (previous !== a.amount) {
        previous = a.amount;
        refresh();
      }
    });
  });
  // @effect giantform
  register('giantform', (root, a) => {
    a.background('#dedcbd');
    a.html(
      '<form class="nx-giant"><label>YOUR NEXT IDEA<input aria-label="你的下一项灵感" placeholder="写一个小想法…" maxlength="32" autocomplete="off"></label><button type="submit">MAKE IT REAL ↗</button><output role="status">只留在此处，不发送。</output></form>'
    );
    a.on(a.$('form'), 'submit', (e) => {
      e.preventDefault();
      a.$('output').textContent = a.$('input').value.trim()
        ? '灵感已就位，开始动手吧。'
        : '先写下一个小想法。';
    });
    a.loop(() => root.style.setProperty('--hard', 4 + a.amount * 8 + 'px'));
  });
  // @effect buttonscope
  register('buttonscope', (root, a) => {
    const L = MuseumLab;
    L.shell(
      a,
      'STATE / 真正的伪类，不是播放动画',
      `<div class="bc-scope-pad"><button class="bc-probe">按下，看看变化 ↘</button></div><div class="bc-meters"><div>HOVER <b data-hover>0</b></div><div>ACTIVE <b data-active>0</b></div><div>FOCUS-VISIBLE <b data-focus>0</b></div></div><output class="bc-note">Tab 聚焦 / 指针悬停 / 按住</output>`,
      '#333128',
    );
    const b = a.$('.bc-probe');
    let count = 0;
    function read() {
      const s = {
        hover: b.matches(':hover'),
        active: b.matches(':active'),
        focus: b.matches(':focus-visible'),
        clicks: count,
      };
      for (const k of ['hover', 'active', 'focus'])
        a.$('[data-' + k + ']').textContent = s[k] ? '1' : '0';
      L.state(a, s);
    }
    for (const type of [
      'pointerenter',
      'pointerleave',
      'pointerdown',
      'pointerup',
      'pointercancel',
      'focus',
      'blur',
      'keydown',
      'keyup',
    ])
      a.on(b, type, read);
    a.on(window, 'blur', read);
    a.on(b, 'click', () => {
      count++;
      a.$('output').textContent = `已激活 ${count} 次 · 触屏不模拟 hover`;
      read();
    });
    a.onParamsChange((p) => {
      b.style.setProperty('--press', p.depth + 'px');
      b.style.setProperty('--duration', p.duration + 'ms');
      b.classList.toggle('bc-extra-ring', p.ring);
    });
    a.loop(read);
  });
  // @effect formstates
  register('formstates', (root, a) => {
    const L = MuseumLab,
      id = 'bc-form-' + a.uid;
    L.shell(
      a,
      'FORM / 只在本地发生',
      `<form class="bc-form" novalidate><label>展签名称<input name="title" maxlength="32" autocomplete="off" aria-describedby="${id}-title" placeholder="至少 2 个字符"></label><small id="${id}-title"></small><label>演示邮箱<input name="email" maxlength="80" autocomplete="off" aria-describedby="${id}-email" placeholder="hello@example.test"></label><small id="${id}-email"></small><div class="bc-toolbar"><button type="submit">本地提交</button><button type="reset">重置</button></div><output role="status">未触碰 · 不上传，请勿填真实资料</output></form>`,
      '#293832',
    );
    const form = a.$('form'),
      fields = ['title', 'email'],
      touched = new Set();
    let timer = null,
      epoch = 0,
      status = 'untouched';
    function publish() {
      L.state(a, {
        status,
        touched: [...touched],
        errors: fields.filter(
          (k) => form.elements[k].getAttribute('aria-invalid') === 'true',
        ),
      });
    }
    function cancel() {
      epoch++;
      clearTimeout(timer);
      timer = null;
      if (status === 'submitting') {
        status = 'cancelled';
        a.$('output').textContent = '提交已取消，请重新提交';
      }
      form.querySelector('[type=submit]').disabled = false;
      fields.forEach((k) => (form.elements[k].readOnly = false));
      publish();
    }
    function validate(k) {
      const input = form.elements[k],
        v = input.value.trim(),
        error =
          k === 'title'
            ? v.length < 2
              ? '请填写至少 2 个字符'
              : ''
            : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
              ? '请填写演示邮箱，如 a@example.test'
              : '';
      input.setAttribute('aria-invalid', String(!!error));
      a.$('#' + id + '-' + k).textContent = error;
      return !error;
    }
    for (const k of fields) {
      const f = form.elements[k];
      a.on(f, 'input', () => {
        if (status === 'submitting') cancel();
        status = 'editing';
        if (touched.has(k) || a.params.when === 'input') {
          touched.add(k);
          validate(k);
        }
        a.$('output').textContent = '编辑中 · 仅本地';
        publish();
      });
      a.on(f, 'blur', () => {
        touched.add(k);
        validate(k);
        publish();
      });
    }
    a.on(form, 'submit', (e) => {
      e.preventDefault();
      if (status === 'submitting') return;
      fields.forEach((k) => touched.add(k));
      const errors = fields.filter((k) => !validate(k));
      if (errors.length) {
        status = 'error';
        a.$('output').textContent = '请先修正标记的字段';
        form.elements[errors[0]].focus();
        publish();
        return;
      }
      status = 'submitting';
      const ticket = ++epoch;
      form.querySelector('[type=submit]').disabled = true;
      fields.forEach((k) => (form.elements[k].readOnly = true));
      a.$('output').textContent = '校验通过，本地演示提交中…';
      publish();
      timer = setTimeout(
        () =>
          a.invoke(() => {
            if (ticket !== epoch) return;
            timer = null;
            status = 'success';
            form.querySelector('[type=submit]').disabled = false;
            fields.forEach((k) => (form.elements[k].readOnly = false));
            a.$('output').textContent = '成功 · 没有发送任何数据';
            publish();
          }),
        a.params.delay,
      );
    });
    a.on(form, 'reset', () => {
      cancel();
      touched.clear();
      status = 'untouched';
      fields.forEach((k) => {
        form.elements[k].removeAttribute('aria-invalid');
        a.$('#' + id + '-' + k).textContent = '';
      });
      a.$('output').textContent = '已重置 · 仅本地';
      publish();
    });
    a.onActivity((s) => {
      if (!s.visible || s.paused) cancel();
    });
    a.cleanup(() => {
      epoch++;
      clearTimeout(timer);
    });
    publish();
  });

})();
