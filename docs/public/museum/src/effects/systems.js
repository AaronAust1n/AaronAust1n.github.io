(() => {
  const { register, circle, path, clamp, rng } = Museum;
  const X = MuseumExpansion;
  // @effect hud
  register('hud', (root, a) => {
    X.shell(
      a,
      '#102731',
      '<div class="nx-hud-label">SCAN / SIMULATED</div><div class="nx-hud-data"></div>'
    );
    let phase = -1,
      seed = 0;
    X.onClick(a, () => seed++);
    a.canvas((g, w, h, t) => {
      const R = Math.min(w * 0.32, h * 0.35),
        cx = w * 0.4,
        cy = h * 0.5;
      g.strokeStyle = '#5bb8b044';
      g.lineWidth = 0.7;
      for (let r = 1; r <= 3; r++) circle(g, cx, cy, (R * r) / 3);
      path(g, [
        [cx - R, cy],
        [cx + R, cy]
      ]);
      g.stroke();
      path(g, [
        [cx, cy - R],
        [cx, cy + R]
      ]);
      g.stroke();
      const q = t * (0.25 + a.amount) * Math.PI * 2;
      g.fillStyle = '#6ee6c42a';
      g.beginPath();
      g.moveTo(cx, cy);
      g.arc(cx, cy, R, q - 0.4, q);
      g.closePath();
      g.fill();
      g.strokeStyle = '#8cefc3';
      path(g, [
        [cx, cy],
        [cx + Math.cos(q) * R, cy + Math.sin(q) * R]
      ]);
      g.stroke();
      const rand = rng(71 + seed);
      for (let i = 0; i < 7; i++)
        circle(g, cx + (rand() - 0.5) * R * 1.6, cy + (rand() - 0.5) * R * 1.6, 2, '#b4e2ae');
      const tick = Math.floor(t / 0.7);
      if (tick !== phase) {
        phase = tick;
        root.dataset.tick = tick;
        a.$('.nx-hud-data').innerHTML =
          `<b>${String(147 + (tick % 39)).padStart(3, '0')}</b><span>RANGE / m</span><b>${(97 + Math.sin(tick) * 2).toFixed(1)}</b><span>QUALITY / %</span>`;
      }
    });
  });
  // @effect island
  register('island', (root, a) => {
    let state = 0;
    X.shell(
      a,
      '#c8cdd4',
      '<div class="nx-island-stage"><span class="nx-island-caption">A STUDY IN STATES</span><button class="nx-island" aria-label="轮换灵动容器状态"><span></span></button><div class="nx-island-dots">● ○ ○</div></div>'
    );
    const content = [
      '<i>●</i> 正在漫游',
      '<i>☎</i><b>茶室来电<small>LOCAL UI DEMO</small></b><em>↗</em>',
      '<i>◷</i><b>00:28<small>演示计时状态</small></b>'
    ];
    function paint() {
      const b = a.$('button');
      b.dataset.state = state;
      b.innerHTML = content[state];
      root.dataset.state = state;
      a.$('.nx-island-dots').textContent = [0, 1, 2]
        .map((i) => (i === state ? '●' : '○'))
        .join(' ');
    }
    paint();
    a.on(a.$('button'), 'click', () => {
      state = (state + 1) % 3;
      paint();
    });
    a.loop(
      () => (a.$('button').style.transitionDuration = (0.25 + a.amount * 0.5) / a.speed + 's')
    );
  });
  // @effect heatmap
  register('heatmap', (root, a) => {
    let seed = 13,
      prior = -1,
      start = 0,
      values = [];
    X.shell(
      a,
      '#182b23',
      '<div class="nx-heatmap"><span>26 WEEKS / SIMULATED</span><div class="nx-heat-grid"></div><output>移动或聚焦，读取一格</output><button data-shuffle>重新书写 ↻</button></div>'
    );
    function make() {
      const random = rng(++seed);
      values = Array.from({ length: 182 }, () =>
        random() < 0.15 + a.amount * 0.7 ? 1 + Math.floor(random() * 15) : 0
      );
      a.$('.nx-heat-grid').innerHTML = values
        .map(
          (v, i) =>
            `<button data-cell="${i}" aria-label="第${i + 1}天：${v}次模拟贡献" style="background:${['#344537', '#53754b', '#78985c', '#a6be75', '#d4df99'][v ? Math.min(4, 1 + Math.floor(v / 4)) : 0]}"></button>`
        )
        .join('');
      start = a.time;
      root.dataset.total = values.reduce((s, v) => s + v, 0);
    }
    const read = (e) => {
      const b = e.target.closest('[data-cell]');
      if (b)
        a.$('output').textContent =
          `DAY ${Number(b.dataset.cell) + 1} / ${values[b.dataset.cell]} 次 · 模拟数据`;
    };
    a.on(a.$('.nx-heat-grid'), 'pointerover', read);
    a.on(a.$('.nx-heat-grid'), 'focusin', read);
    a.on(a.$('[data-shuffle]'), 'click', make);
    a.loop((t) => {
      if (prior !== a.amount) {
        prior = a.amount;
        make();
      }
      a.$$('[data-cell]').forEach(
        (b, i) =>
          (b.style.opacity = X.reduced() ? 1 : clamp((t - start - Math.floor(i / 7) * 0.022) / 0.3))
      );
    });
  });
  // @effect carbon
  register('carbon', (root, a) => {
    let chosen = -1,
      start = -3,
      revision = 0;
    X.shell(
      a,
      '#242b32',
      '<div class="nx-carbon"><header>EXPERIMENTS <button data-refresh aria-label="刷新表格">↻</button></header><table><thead><tr><th>名称</th><th>状态</th><th>编号</th></tr></thead><tbody></tbody></table></div>'
    );
    function fill() {
      a.$('tbody').innerHTML = ['Aurora', 'Field', 'Signal', 'Matter']
        .map(
          (v, i) =>
            `<tr tabindex="0" aria-selected="${chosen === i}" data-row="${i}"><td>${v}</td><td>${(i + revision) % 3 === 0 ? '● READY' : '○ STUDY'}</td><td>${String(101 + i + revision).padStart(3, '0')}</td></tr>`
        )
        .join('');
    }
    fill();
    const select = (e) => {
      const row = e.target.closest('[data-row]');
      if (row) {
        chosen = Number(row.dataset.row);
        a.$$('[data-row]').forEach((el, i) => el.setAttribute('aria-selected', i === chosen));
        root.dataset.selected = chosen;
      }
    };
    a.on(a.$('tbody'), 'click', select);
    a.on(a.$('tbody'), 'keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        select(e);
      }
    });
    a.on(a.$('[data-refresh]'), 'click', () => {
      revision++;
      start = a.time;
      fill();
    });
    a.loop((t) =>
      a.$$('[data-row]').forEach((row, i) => {
        const p = X.reduced() ? 1 : clamp((t - start - i * (0.02 + a.amount * 0.1)) / 0.35);
        row.style.opacity = p;
        row.style.transform = `translateY(${(1 - p) * 12}px)`;
      })
    );
  });
  // @effect blockeditor
  register('blockeditor', (root, a) => {
    const L = MuseumLab;
    L.shell(
      a,
      'BLOCKS / 内容与顺序是同一个模型',
      `<div class="bc-toolbar"><button data-add>＋ 文本块</button><button data-undo>撤销</button><span>纯文本 · 不保存</span></div><div class="bc-blocks"></div><output class="bc-note" role="status"></output>`,
      '#302e35',
    );
    let next = 3,
      blocks = [
        { id: 1, kind: 'heading', text: '把想法，分成小块。' },
        { id: 2, kind: 'text', text: '编辑后重排，文字仍属于原来的块。' },
      ],
      history = [],
      editId = null,
      composing = false;
    const list = a.$('.bc-blocks');
    function snapshot() {
      history.push(blocks.map((b) => ({ ...b })));
      if (history.length > 30) history.shift();
    }
    function publish() {
      L.state(a, { blocks, history: history.length });
      a.$('[data-add]').disabled = blocks.length >= a.params.limit;
      a.$('[data-undo]').disabled = !history.length;
    }
    function render(focus) {
      list.replaceChildren();
      blocks.forEach((b, i) => {
        const row = document.createElement('div');
        row.className = 'bc-block';
        row.dataset.id = b.id;
        row.innerHTML = `<span>${String(b.id).padStart(2, '0')} / ${b.kind}</span><textarea rows="2" maxlength="240" aria-label="块 ${b.id}"></textarea><nav><button data-op="up" aria-label="块 ${b.id} 上移" ${i === 0 ? 'disabled' : ''}>↑</button><button data-op="down" aria-label="块 ${b.id} 下移" ${i === blocks.length - 1 ? 'disabled' : ''}>↓</button><button data-op="delete" aria-label="删除块 ${b.id}">×</button></nav>`;
        row.querySelector('textarea').value = b.text;
        list.append(row);
      });
      if (focus) list.querySelector(`[data-id="${focus}"] textarea`)?.focus();
      publish();
    }
    a.on(list, 'focusin', (e) => {
      if (e.target.matches('textarea')) editId = null;
    });
    a.on(list, 'compositionstart', () => (composing = true));
    a.on(list, 'compositionend', () => (composing = false));
    a.on(list, 'input', (e) => {
      if (!e.target.matches('textarea')) return;
      const id = Number(e.target.closest('[data-id]').dataset.id);
      if (editId !== id) {
        snapshot();
        editId = id;
      }
      blocks.find((b) => b.id === id).text = e.target.value.slice(0, 240);
      publish();
    });
    a.on(list, 'click', (e) => {
      const btn = e.target.closest('[data-op]');
      if (!btn || composing) return;
      const id = Number(btn.closest('[data-id]').dataset.id),
        i = blocks.findIndex((b) => b.id === id),
        op = btn.dataset.op;
      if (i < 0) return;
      snapshot();
      editId = null;
      if (op === 'delete') blocks.splice(i, 1);
      else {
        const j = i + (op === 'up' ? -1 : 1);
        if (j >= 0 && j < blocks.length)
          [blocks[i], blocks[j]] = [blocks[j], blocks[i]];
      }
      render(op === 'delete' ? blocks[Math.min(i, blocks.length - 1)]?.id : id);
      if (!blocks.length) a.$('[data-add]').focus();
      a.$('output').textContent = '模型已更新';
    });
    L.button(a, '[data-add]', () => {
      if (composing || blocks.length >= a.params.limit) return;
      snapshot();
      const b = { id: next++, kind: a.params.kind, text: '' };
      blocks.push(b);
      editId = null;
      render(b.id);
    });
    L.button(a, '[data-undo]', () => {
      if (composing || !history.length) return;
      blocks = history.pop();
      editId = null;
      render(blocks[0]?.id);
      a.$('output').textContent = '已撤销；块 ID 保持稳定';
    });
    a.onParamsChange(publish);
    render();
  });
  // @effect taskboard
  register('taskboard', (root, a) => {
    const L = MuseumLab;
    L.shell(
      a,
      'TASK / 每一次重试，都是新的事务',
      `<ol class="bc-tasks">${['排队', '准备', '处理', '归档'].map((s) => `<li><span>${s}</span><b>等待</b></li>`).join('')}</ol><progress max="4" value="0"></progress><div class="bc-toolbar"><button data-start>开始</button><button data-cancel>取消</button><button data-retry>重试</button></div><output role="status" class="bc-note"></output>`,
      '#23323c',
    );
    let status = 'idle',
      step = 0,
      epoch = 0,
      timer = null,
      attempt = 0;
    function render() {
      a.$$('li').forEach((el, i) => {
        el.dataset.current = i === step;
        el.querySelector('b').textContent =
          i < step
            ? '完成'
            : i === step
              ? {
                  running: '执行中',
                  queued: '排队中',
                  failed: '失败',
                  cancelled: '已取消',
                }[status] || '等待'
              : '等待';
      });
      a.$('progress').value = step;
      a.$('[data-start]').disabled = ['running', 'queued'].includes(status);
      a.$('[data-cancel]').disabled = !['running', 'queued'].includes(status);
      a.$('[data-retry]').disabled = !['failed', 'cancelled'].includes(status);
      a.$('output').textContent =
        `${{ idle: '就绪', queued: '排队中', running: '执行中', failed: '故障已注入，请重试', cancelled: '已取消', done: '全部完成' }[status]} · 尝试 ${attempt} · 本地模拟`;
      L.state(a, { status, step, attempt, epoch });
    }
    function cancel() {
      epoch++;
      clearTimeout(timer);
      timer = null;
      if (['queued', 'running'].includes(status)) status = 'cancelled';
      render();
    }
    function start() {
      cancel();
      step = 0;
      attempt++;
      status = 'queued';
      const ticket = epoch;
      render();
      function next() {
        if (ticket !== epoch) return;
        if (step === 2 && a.params.failure === '2' && attempt === 1) {
          status = 'failed';
          timer = null;
          render();
          return;
        }
        step++;
        status = step >= 4 ? 'done' : 'running';
        render();
        if (status !== 'done')
          timer = setTimeout(() => a.invoke(next), a.params.duration);
        else timer = null;
      }
      timer = setTimeout(() => a.invoke(next), a.params.duration);
    }
    L.button(a, '[data-start]', () => {
      attempt = 0;
      start();
    });
    L.button(a, '[data-cancel]', cancel);
    L.button(a, '[data-retry]', start);
    a.onActivity((s) => {
      if (!s.visible || s.paused) cancel();
    });
    a.cleanup(() => {
      epoch++;
      clearTimeout(timer);
    });
    render();
  });
  // @effect localcursors
  register('localcursors', (root, a) => {
    const L = MuseumLab,
      random = Museum.rng(177);
    L.shell(
      a,
      'LOCAL SIMULATION / 不是在线协作',
      `<div class="bc-collab"><div class="bc-paper"><b>共同的画布</b><p>观察延迟、丢包与过期消息。</p><div></div></div>${['林 / BOT', '舟 / BOT', '月 / BOT'].map((n, i) => `<div class="bc-remote" style="--cursor:${['#d4e6a7', '#baa8ef', '#efa880'][i]}"><i>↖</i><span>${n}</span><em></em></div>`).join('')}</div><output class="bc-note"></output>`,
      '#202a34',
    );
    let clock = 0,
      next = 0,
      seq = 0,
      queue = [],
      received = [-1, -1, -1],
      dropped = 0,
      stale = 0;
    const cur = Array.from({ length: 3 }, (_, i) => ({
      x: 0.2 + i * 0.25,
      y: 0.5,
      tx: 0.2 + i * 0.25,
      ty: 0.5,
    }));
    const cursors = a.$$('.bc-remote');
    a.loop((t, dt) => {
      clock += dt;
      if (clock >= next) {
        next = clock + 0.08;
        for (let i = 0; i < 3; i++) {
          const id = seq++;
          if (random() * 100 < a.params.loss) {
            dropped++;
            continue;
          }
          const msg = {
            i,
            id,
            x: 0.5 + 0.35 * Math.sin(clock * 0.6 + i * 2),
            y: 0.5 + 0.29 * Math.cos(clock * 0.9 + i * 1.7),
            at:
              clock +
              Math.max(
                0,
                a.params.latency + (random() - 0.5) * 2 * a.params.jitter,
              ) /
                1000,
          };
          queue.push(msg);
        }
        if (queue.length > 96) {
          dropped += queue.length - 96;
          queue.splice(0, queue.length - 96);
        }
      }
      queue.sort((a, b) => a.at - b.at);
      while (queue.length && queue[0].at <= clock) {
        const m = queue.shift();
        if (m.id <= received[m.i]) {
          stale++;
          continue;
        }
        received[m.i] = m.id;
        cur[m.i].tx = m.x;
        cur[m.i].ty = m.y;
      }
      cur.forEach((p, i) => {
        const k = 1 - Math.exp(-dt * 12);
        p.x += (p.tx - p.x) * k;
        p.y += (p.ty - p.y) * k;
        cursors[i].style.left = p.x * 100 + '%';
        cursors[i].style.top = p.y * 100 + '%';
      });
      a.$('output').textContent =
        `本地 BOT ×3 · 队列 ${queue.length}/96 · 丢包 ${dropped} · 拒绝乱序 ${stale}`;
      L.state(a, { clock, queue: queue.length, received, dropped, stale });
    });
    a.onActivity((s) => {
      if (!s.visible || s.paused) {
        queue = [];
        next = clock + 0.08;
        L.state(a, { clock, queue: 0, received, dropped, stale });
      }
    });
  });

})();
