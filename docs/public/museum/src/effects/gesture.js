(() => {
  const { register, clamp } = Museum;
  const X = MuseumExpansion;
  // @effect pullrefresh
  register('pullrefresh', (root, a) => {
    let down = 0,
      raw = 0,
      offset = 0,
      busy = false,
      start = 0,
      count = 0;
    X.shell(
      a,
      '#dae0d3',
      '<div class="nx-refresh"><div class="nx-refresh-indicator"><i>↻</i><span>向下拉动</span></div><div class="nx-refresh-list"><div>观察 / Observe</div><div>试验 / Experiment</div><div>发现 / Discover</div></div><button data-refresh>刷新（键盘替代）</button></div>'
    );
    const list = a.$('.nx-refresh-list');
    function begin() {
      if (busy) return;
      busy = true;
      start = a.time;
      offset = 44;
      a.$('.nx-refresh-indicator span').textContent = '正在整理灵感…';
    }
    X.pointerDrag(a, list, {
      start: (e) => {
        if (busy) return false;
        down = e.clientY;
        raw = 0;
      },
      move: (e) => {
        raw = Math.max(
          0,
          ((e.clientY - down) * root.clientHeight) / root.getBoundingClientRect().height
        );
        offset = raw * 0.5 * (200 / (raw + 200));
        a.$('.nx-refresh-indicator span').textContent =
          raw > 50 + a.amount * 60 ? '松开刷新' : '继续向下';
        a.repaint();
      },
      end: (e, cancel) => {
        if (!cancel && raw > 50 + a.amount * 60) begin();
        else offset = 0;
        raw = 0;
      }
    });
    a.on(a.$('[data-refresh]'), 'click', begin);
    a.loop((t) => {
      if (busy && t - start > 0.85) {
        busy = false;
        count++;
        offset = 0;
        const row = document.createElement('div');
        row.textContent = '新想法 / ' + String(count).padStart(2, '0');
        list.prepend(row);
        while (list.children.length > 4) list.lastChild.remove();
        root.dataset.refreshes = count;
        a.$('.nx-refresh-indicator span').textContent = '已更新 · 本地演示';
      }
      list.style.transform = `translateY(${offset}px)`;
      a.$('.nx-refresh-indicator i').style.transform = `rotate(${busy ? t * 240 : raw * 2}deg)`;
      a.$('[data-refresh]').disabled = busy;
    });
  });
  // @effect swipepage
  register('swipepage', (root, a) => {
    let page = 0,
      pos = 0,
      startPos = 0,
      target = 0,
      animStart = -3,
      drag = false,
      x0 = 0,
      lastX = 0,
      lastT = 0,
      velocity = 0;
    X.shell(
      a,
      '#2b3c35',
      '<div class="nx-swipe"><div class="nx-swipe-track">' +
        ['OBSERVE', 'EXPERIMENT', 'CREATE']
          .map(
            (s, i) =>
              `<div style="background:${['#a2b995', '#cdb993', '#bba7ce'][i]}"><b>0${i + 1}</b><span>${s}</span></div>`
          )
          .join('') +
        '</div></div><div class="nx-swipe-tools"><button data-prev aria-label="上一页">←</button><span data-dots>● ○ ○</span><button data-next aria-label="下一页">→</button></div>'
    );
    const surface = a.$('.nx-swipe');
    function go(n) {
      page = clamp(n, 0, 2);
      startPos = pos;
      target = -page * surface.clientWidth;
      animStart = a.time;
      root.dataset.page = page;
      a.$('[data-dots]').textContent = [0, 1, 2].map((i) => (i === page ? '●' : '○')).join(' ');
    }
    X.pointerDrag(a, surface, {
      start: (e) => {
        drag = true;
        x0 = e.clientX;
        startPos = pos;
        lastX = x0;
        lastT = performance.now();
        velocity = 0;
      },
      move: (e) => {
        const now = performance.now();
        const scale = surface.getBoundingClientRect().width / surface.clientWidth;
        velocity = (e.clientX - lastX) / scale / Math.max(1, now - lastT);
        lastX = e.clientX;
        lastT = now;
        pos = clamp(
          startPos + (e.clientX - x0) / scale,
          -surface.clientWidth * 2.2,
          surface.clientWidth * 0.2
        );
        a.repaint();
      },
      end: (e, cancel) => {
        drag = false;
        const proposed = cancel
          ? page
          : Math.abs(velocity) > 0.45
            ? page - Math.sign(velocity)
            : Math.round(-pos / surface.clientWidth);
        go(proposed);
      }
    });
    a.on(a.$('[data-prev]'), 'click', () => go(page - 1));
    a.on(a.$('[data-next]'), 'click', () => go(page + 1));
    a.loop((t) => {
      if (!drag) {
        const p = X.reduced() ? 1 : clamp((t - animStart) / (0.25 + a.amount * 0.4));
        const spring =
          p >= 1 ? 1 : 1 - Math.exp(-7 * p) * (Math.cos(10 * p) + 0.7 * Math.sin(10 * p));
        pos = startPos + (target - startPos) * spring;
      }
      a.$('.nx-swipe-track').style.transform = `translateX(${pos}px)`;
    });
  });
  // @effect bottomsheet
  register('bottomsheet', (root, a) => {
    let top = 70,
      startY = 0,
      startTop = 70,
      lastY = 0,
      lastT = 0,
      v = 0;
    X.shell(
      a,
      '#b8c8bc',
      '<div class="nx-sheet-scene"><span>THREE PLACES<br>TO PAUSE.</span><div class="nx-sheet"><button class="nx-sheet-handle" aria-label="拖动抽屉手柄，也可用下方停靠按钮"></button><h4>更多可能</h4><p>先停留，再继续。<br>三档停靠 / 本地演示</p></div><div class="nx-sheet-stops"><button data-stop="70">收起</button><button data-stop="38">半屏</button><button data-stop="4">展开</button></div></div>'
    );
    const sheet = a.$('.nx-sheet');
    function snap(value) {
      top = value;
      sheet.style.transition = `top ${0.2 + a.amount * 0.4}s cubic-bezier(.2,.8,.2,1)`;
      sheet.style.top = top + '%';
      root.dataset.stop = top;
    }
    X.pointerDrag(a, a.$('.nx-sheet-handle'), {
      start: (e) => {
        startY = lastY = e.clientY;
        startTop = top;
        lastT = performance.now();
        v = 0;
        sheet.style.transition = 'none';
      },
      move: (e) => {
        const now = performance.now();
        v =
          ((e.clientY - lastY) * root.clientHeight) /
          root.getBoundingClientRect().height /
          Math.max(1, now - lastT);
        lastY = e.clientY;
        lastT = now;
        top = clamp(
          startTop + ((e.clientY - startY) / root.getBoundingClientRect().height) * 100,
          4,
          80
        );
        sheet.style.top = top + '%';
      },
      end: (e, cancel) => {
        const stops = [4, 38, 70];
        let choice = stops.reduce(
          (best, n) => (Math.abs(n - top) < Math.abs(best - top) ? n : best),
          70
        );
        if (!cancel && Math.abs(v) > 0.45)
          choice =
            v > 0
              ? stops.find((n) => n > top) || 70
              : [...stops].reverse().find((n) => n < top) || 4;
        snap(cancel ? startTop : choice);
      }
    });
    a.$$('[data-stop]').forEach((b) => a.on(b, 'click', () => snap(Number(b.dataset.stop))));
    a.loop(() => sheet.style.setProperty('--sheet-softness', a.amount));
    snap(70);
  });
  // @effect edgeback
  register('edgeback', (root, a) => {
    let x = 0,
      start = 0,
      active = false,
      returned = false;
    X.shell(
      a,
      '#d4dfca',
      '<div class="nx-edge"><div class="nx-edge-back"><b>← BACK HERE</b><span>已返回本地上一页</span></div><div class="nx-edge-front"><i>‹</i><b>GO BEYOND.</b><span>从左边缘 28px 向右拖</span></div></div><button class="nx-edge-reset">再次进入 / 返回</button>'
    );
    const zone = a.$('.nx-edge'),
      front = a.$('.nx-edge-front');
    function paint() {
      front.style.transform = `translateX(${x}px)`;
      root.dataset.returned = returned;
    }
    X.pointerDrag(a, zone, {
      start: (e) => {
        const r = zone.getBoundingClientRect();
        if (returned || ((e.clientX - r.left) * zone.clientWidth) / r.width > 28) return false;
        start = e.clientX;
        active = true;
        front.style.transition = 'none';
      },
      move: (e) => {
        if (active) {
          x = clamp(
            ((e.clientX - start) * zone.clientWidth) / zone.getBoundingClientRect().width,
            0,
            zone.clientWidth
          );
          paint();
        }
      },
      end: (e, cancel) => {
        active = false;
        returned = !cancel && x > zone.clientWidth * (0.3 + a.amount * 0.4);
        x = returned ? zone.clientWidth : 0;
        front.style.transition = 'transform .4s cubic-bezier(.2,.8,.2,1)';
        paint();
      }
    });
    a.on(a.$('button'), 'click', () => {
      returned = !returned;
      x = returned ? zone.clientWidth : 0;
      front.style.transition = 'transform .4s';
      paint();
    });
    a.loop(() => front.style.setProperty('--threshold', 0.3 + a.amount * 0.4));
  });
  // @effect haptics
  register('haptics', (root, a) => {
    let start = -5,
      selected = 0;
    const modes = [
      ['轻触', [18]],
      ['重击', [55]],
      ['成功', [20, 55, 30]],
      ['警告', [40, 50, 40, 50, 40]],
      ['连击', [15, 35, 15, 35, 15, 35, 15]],
      ['渐强', [12, 55, 25, 55, 50]]
    ];
    X.shell(
      a,
      '#2f3746',
      '<div class="nx-haptics"><div class="nx-haptic-core">◉</div><div class="nx-haptic-grid">' +
        modes.map(([name], i) => `<button data-mode="${i}">${name}</button>`).join('') +
        '</div><label><input type="checkbox" data-vibrate> 同时震动（可选）</label><output>视觉演示 · 默认不震动</output></div>'
    );
    const vib = a.$('[data-vibrate]');
    if (!navigator.vibrate) {
      vib.disabled = true;
      a.$('output').textContent = '此设备无震动接口 · 视觉仍可体验';
    }
    const stop = () => {
      if (navigator.vibrate && vib.checked) navigator.vibrate(0);
    };
    a.cleanup(stop);
    a.on(document, 'visibilitychange', () => {
      if (document.hidden) stop();
    });
    const io = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) stop();
    });
    io.observe(root);
    a.cleanup(() => io.disconnect());
    a.$$('[data-mode]').forEach((b) =>
      a.on(b, 'click', () => {
        selected = Number(b.dataset.mode);
        start = a.time;
        root.dataset.mode = selected;
        if (vib.checked && navigator.vibrate) navigator.vibrate(modes[selected][1]);
        a.$('output').textContent =
          modes[selected][0] + ' / ' + (vib.checked ? '已请求设备震动' : '仅视觉脉冲');
      })
    );
    a.loop((t) => {
      const ms = (t - start) * 1000;
      let cursor = 0,
        pulse = 0;
      modes[selected][1].forEach((duration, i) => {
        if (i % 2 === 0 && ms >= cursor && ms < cursor + duration + 70)
          pulse = Math.sin(clamp((ms - cursor) / (duration + 70)) * Math.PI);
        cursor += duration;
      });
      a.$('.nx-haptic-core').style.transform = `scale(${1 + pulse * (0.08 + a.amount * 0.22)})`;
      a.$('.nx-haptic-core').style.boxShadow = `0 0 0 ${pulse * 28}px #c4d2ef22`;
    });
  });
// @effect pinch
  register('pinch', (root, a) => {
    const K = MuseumMechanics;
    let z = 1,
      tx = 0,
      ty = 0,
      base = null,
      animation = null,
      hadMulti = false,
      down = null,
      lastTap = null;
    a.background('#cfdaca');
    a.html(
      '<div class="mx-zoom-view" tabindex="0" aria-label="双指或滚轮缩放，方向键平移，加减缩放，0复位"><div class="mx-zoom-world"><span class="mx-zoom-coord">00 / LOCAL ATLAS</span><div class="mx-zoom-cell">FORM<i>◒</i></div><div class="mx-zoom-cell">LIGHT<i>✳</i></div><div class="mx-zoom-cell">MOTION<i>↗</i></div><div class="mx-zoom-cell">SPACE<i>◇</i></div></div></div><div class="mx-tools light"><button data-minus aria-label="缩小">−</button><output data-zoom>1.00×</output><button data-plus aria-label="放大">+</button><button data-home>复位</button></div>'
    );
    const view = a.$('.mx-zoom-view'),
      world = a.$('.mx-zoom-world');
    const motifs = [
      '<circle cx="70" cy="48" r="29" fill="currentColor" opacity=".16"/><path d="M70 19a29 29 0 0 1 0 58Z" fill="currentColor" opacity=".52"/><circle cx="70" cy="48" r="39" fill="none" stroke="currentColor" opacity=".25"/>',
      Array.from({ length: 24 }, (_, i) => {
        const q = (i * Math.PI) / 12;
        return `<path d="M${70 + Math.cos(q) * 13} ${48 + Math.sin(q) * 13}L${70 + Math.cos(q) * 39} ${48 + Math.sin(q) * 39}" stroke="currentColor" opacity="${0.25 + i / 60}"/>`;
      }).join(''),
      Array.from(
        { length: 8 },
        (_, i) =>
          `<path d="M8 ${24 + i * 6}C45 ${-5 + i * 5} 82 ${100 - i * 4} 132 ${30 + i * 5}" fill="none" stroke="currentColor" opacity="${0.2 + i * 0.075}"/>`
      ).join(''),
      Array.from({ length: 6 }, (_, i) => {
        const r = 11 + i * 6;
        return `<path d="M70 ${48 - r}l${r} ${r}l${-r} ${r}l${-r} ${-r}Z" fill="none" stroke="currentColor" opacity="${0.65 - i * 0.07}"/>`;
      }).join('')
    ];
    a.$$('.mx-zoom-cell').forEach((el, i) =>
      el.insertAdjacentHTML(
        'beforeend',
        `<svg viewBox="0 0 140 96" aria-hidden="true">${motifs[i]}</svg>`
      )
    );
  
    function constrain() {
      const w = view.clientWidth,
        h = view.clientHeight;
      if (!w || !h) return;
      z = clamp(z, a.params.minScale, a.params.maxScale);
      tx = z <= 1 ? (w - w * z) / 2 : clamp(tx, w - w * z, 0);
      ty = z <= 1 ? (h - h * z) / 2 : clamp(ty, h - h * z, 0);
    }
    function paint() {
      constrain();
      world.style.transform = `translate(${tx}px,${ty}px) scale(${z})`;
      a.$('[data-zoom]').value = z.toFixed(2) + '×';
      root.dataset.view = JSON.stringify({
        scale: z,
        x: tx,
        y: ty,
        width: view.clientWidth,
        height: view.clientHeight,
        pointers: controller?.points.size || 0
      });
    }
    function zoomAt(next, p) {
      animation = null;
      next = clamp(next, a.params.minScale, a.params.maxScale);
      tx = p.x - (p.x - tx) * (next / z);
      ty = p.y - (p.y - ty) * (next / z);
      z = next;
      paint();
    }
    function home() {
      if (K.reduced() || a.paused || a.suspended) {
        z = 1;
        tx = ty = 0;
        animation = null;
        paint();
      } else animation = { start: a.time, x: tx, y: ty, z };
    }
    function rebase(points) {
      if (points.length >= 2) {
        const [p, q] = points,
          cx = (p.x + q.x) / 2,
          cy = (p.y + q.y) / 2;
        hadMulti = true;
        base = {
          kind: 'pinch',
          distance: Math.max(1, Math.hypot(q.x - p.x, q.y - p.y)),
          scale: z,
          worldX: (cx - tx) / z,
          worldY: (cy - ty) / z
        };
      } else if (points.length === 1) base = { kind: 'pan', point: points[0], x: tx, y: ty };
      else base = null;
    }
    let controller = null;
    controller = K.pointers(
      a,
      view,
      {
        start: (p) => {
          animation = null;
          if (p.points.length === 1) {
            hadMulti = false;
            down = { x: p.x, y: p.y, time: p.time };
          }
          rebase(p.points);
        },
        move: (p) => {
          if (p.points.length >= 2 && base?.kind === 'pinch') {
            const [u, v] = p.points;
            z = clamp(
              (base.scale * Math.hypot(v.x - u.x, v.y - u.y)) / base.distance,
              a.params.minScale,
              a.params.maxScale
            );
            tx = (u.x + v.x) / 2 - base.worldX * z;
            ty = (u.y + v.y) / 2 - base.worldY * z;
          } else if (base?.kind === 'pan') {
            tx = base.x + p.x - base.point.x;
            ty = base.y + p.y - base.point.y;
          }
          paint();
        },
        end: (p) => {
          if (p.cancelled) {
            controller.cancel('pointercancel');
            base = null;
            lastTap = null;
          } else if (
            !p.points.length &&
            !hadMulti &&
            down &&
            p.time - down.time < 260 &&
            Math.hypot(p.x - down.x, p.y - down.y) < 8
          ) {
            if (
              lastTap &&
              p.time - lastTap.time < 330 &&
              Math.hypot(p.x - lastTap.x, p.y - lastTap.y) < 24
            ) {
              home();
              lastTap = null;
            } else lastTap = p;
          }
          rebase(p.points);
          paint();
        },
        cancel: () => {
          base = null;
          lastTap = null;
          hadMulti = false;
          paint();
        }
      },
      2
    );
    a.on(
      view,
      'wheel',
      (e) => {
        e.preventDefault();
        const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? view.clientHeight : 1;
        zoomAt(z * Math.exp(-e.deltaY * unit * 0.0017), K.point(view, e));
      },
      { passive: false }
    );
    a.on(a.$('[data-plus]'), 'click', () =>
      zoomAt(z * 1.25, { x: view.clientWidth / 2, y: view.clientHeight / 2 })
    );
    a.on(a.$('[data-minus]'), 'click', () =>
      zoomAt(z / 1.25, { x: view.clientWidth / 2, y: view.clientHeight / 2 })
    );
    a.on(a.$('[data-home]'), 'click', home);
    a.on(view, 'keydown', (e) => {
      if (e.ctrlKey || e.metaKey) return;
      if (['+', '=', '-', '0', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
        animation = null;
        if (e.key === '0') home();
        else if (['+', '=', '-'].includes(e.key))
          zoomAt(z * (e.key === '-' ? 0.8 : 1.25), {
            x: view.clientWidth / 2,
            y: view.clientHeight / 2
          });
        else {
          tx += e.key === 'ArrowLeft' ? 24 : e.key === 'ArrowRight' ? -24 : 0;
          ty += e.key === 'ArrowUp' ? 24 : e.key === 'ArrowDown' ? -24 : 0;
          paint();
        }
      }
    });
    const ro = new ResizeObserver(() => {
      if (view.clientWidth && view.clientHeight) {
        animation = null;
        controller.cancel('resize');
        paint();
      }
    });
    ro.observe(view);
    a.cleanup(() => ro.disconnect());
    a.onParamsChange(() => {
      animation = null;
      controller.cancel('parameters');
      paint();
    });
    a.loop((t) => {
      if (animation) {
        const p = clamp((t - animation.start) / (a.params.resetMs / 1000)),
          q = 1 - (1 - p) ** 3;
        z = animation.z + (1 - animation.z) * q;
        tx = animation.x * (1 - q);
        ty = animation.y * (1 - q);
        if (p >= 1) animation = null;
      }
      paint();
    });
  });
  // @effect archive
  register('archive', (root, a) => {
    const K = MuseumMechanics;
    const cards = [
      { id: 'light', name: '光影', kind: 'material', symbol: '◐' },
      { id: 'idea', name: '想法', kind: 'idea', symbol: '✳' },
      { id: 'space', name: '空间', kind: 'material', symbol: '◇' }
    ];
    let model = { tray: cards.map((c) => c.id), material: [], idea: [] },
      selected = 'light',
      drag = null,
      controller = null;
    a.background('#ded9ce');
    a.html(
      '<div class="mx-archive"><div class="mx-archive-zones"></div><div class="mx-archive-actions"><button data-place="tray">返回收集区</button><button data-place="material">移到素材</button><button data-place="idea">移到想法</button></div><output role="status">选卡后移动，或直接拖放。</output></div>'
    );
    const zones = a.$('.mx-archive-zones');
    function render() {
      zones.innerHTML = [
        ['tray', '收集'],
        ['material', '素材'],
        ['idea', '想法']
      ]
        .map(
          ([key, name]) =>
            `<section data-zone="${key}"><header>${name}<b>${model[key].length}</b></header><div>${model[
              key
            ]
              .map((id) => {
                const c = cards.find((c) => c.id === id);
                return `<button class="mx-archive-card" data-item="${id}" data-stable-id="${id}" aria-label="选择${c.name}卡" aria-pressed="${id === selected}"><i>${c.symbol}</i><span>${c.name}</span></button>`;
              })
              .join('')}</div></section>`
        )
        .join('');
      root.dataset.locations = JSON.stringify(model);
    }
    render();
    const flipper = K.flipGroup(a, () => a.$$('.mx-archive-card'), {
      duration: () => a.params.duration
    });
    function allowed(id, zone) {
      return (
        zone === 'tray' || a.params.policy === 'free' || cards.find((c) => c.id === id).kind === zone
      );
    }
    function homeOf(id) {
      return Object.keys(model).find((k) => model[k].includes(id));
    }
    function clearDrag() {
      if (drag) {
        drag.clone.remove();
        if (drag.original.isConnected) drag.original.style.visibility = '';
        drag = null;
      }
      a.$$('[data-zone]').forEach((z) => z.classList.remove('can-drop', 'cannot-drop'));
    }
    function move(id, zone, override) {
      const home = homeOf(id);
      if (!allowed(id, zone)) {
        a.$('output').textContent = '类型不匹配，已回到原位。';
        return false;
      }
      if (home === zone) {
        a.$('output').textContent = '仍在当前区域。';
        return false;
      }
      selected = id;
      flipper.play(() => {
        model[home] = model[home].filter((v) => v !== id);
        model[zone].push(id);
        render();
      }, override);
      a.$('output').textContent = '已归档：' + cards.find((c) => c.id === id).name;
      a.$(`[data-item="${id}"]`)?.focus({ preventScroll: true });
      return true;
    }
    function hit(e) {
      const pad =
        (a.params.hitSlop * root.getBoundingClientRect().width) / Math.max(1, root.clientWidth);
      return a
        .$$('[data-zone]')
        .map((z) => ({ z, r: z.getBoundingClientRect() }))
        .filter(
          ({ r }) =>
            e.clientX >= r.left - pad &&
            e.clientX <= r.right + pad &&
            e.clientY >= r.top - pad &&
            e.clientY <= r.bottom + pad
        )
        .sort(
          (u, v) =>
            Math.hypot(
              e.clientX - (u.r.left + u.r.right) / 2,
              e.clientY - (u.r.top + u.r.bottom) / 2
            ) -
            Math.hypot(e.clientX - (v.r.left + v.r.right) / 2, e.clientY - (v.r.top + v.r.bottom) / 2)
        )[0]?.z;
    }
    controller = K.pointers(a, root, {
      accept: (e) => !!e.target.closest('.mx-archive-card'),
      start: (p) => {
        const card = p.event.target.closest('.mx-archive-card');
        selected = card.dataset.item;
        a.$$('.mx-archive-card').forEach((b) =>
          b.setAttribute('aria-pressed', b.dataset.item === selected)
        );
        const r = card.getBoundingClientRect(),
          clone = card.cloneNode(true);
        clone.className = 'mx-archive-ghost';
        clone.removeAttribute('data-item');
        clone.tabIndex = -1;
        clone.setAttribute('aria-hidden', 'true');
        clone.style.cssText = `position:fixed;left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px;pointer-events:none;z-index:100001;`;
        (root.closest('dialog') || document.body).append(clone);
        drag = {
          id: selected,
          original: card,
          clone,
          box: r,
          startClient: { x: p.event.clientX, y: p.event.clientY },
          moved: false
        };
        card.style.visibility = 'hidden';
        a.$('output').textContent = '拖动 ' + cards.find((c) => c.id === selected).name;
      },
      move: (p) => {
        if (!drag) return;
        const dx = p.event.clientX - drag.startClient.x,
          dy = p.event.clientY - drag.startClient.y;
        drag.moved ||= Math.hypot(dx, dy) > 5;
        drag.clone.style.transform = `translate(${dx}px,${dy}px) rotate(3deg)`;
        const target = hit(p.event);
        a.$$('[data-zone]').forEach((z) => {
          z.classList.toggle('can-drop', z === target && allowed(drag.id, z.dataset.zone));
          z.classList.toggle('cannot-drop', z === target && !allowed(drag.id, z.dataset.zone));
        });
      },
      end: (p) => {
        if (!drag) return;
        const info = drag,
          target = hit(p.event),
          rect = info.clone.getBoundingClientRect();
        clearDrag();
        if (!p.cancelled && info.moved) {
          const overrides = new Map([[info.id, rect]]);
          const moved = target ? move(info.id, target.dataset.zone, overrides) : false;
          if (!moved) {
            flipper.play(render, overrides);
            if (!target) a.$('output').textContent = '没有命中槽位，已回原处。';
          }
        } else {
          a.$('output').textContent = p.cancelled ? '已取消拖放。' : '已选择，可点击下方移动。';
          render();
        }
      },
      cancel: () => {
        clearDrag();
        a.$('output').textContent = '已取消拖放。';
      }
    });
    a.on(root, 'click', (e) => {
      const card = e.target.closest('.mx-archive-card');
      if (card && e.detail === 0) {
        selected = card.dataset.item;
        render();
        a.$(`[data-item="${selected}"]`)?.focus();
      }
    });
    a.$$('[data-place]').forEach((b) => a.on(b, 'click', () => move(selected, b.dataset.place)));
    a.onParamsChange(() => {
      controller?.cancel('parameters');
      root.dataset.policy = a.params.policy;
    });
    a.cleanup(clearDrag);
  });
  // @effect swipedelete
  register('swipedelete', (root, a) => {
    const K = MuseumMechanics;
    const initial = [
      { id: 'a', text: '一份光影研究' },
      { id: 'b', text: '一段未完成的旋律' },
      { id: 'c', text: '一个空间念头' }
    ];
    let items = initial.map((x) => ({ ...x })),
      gesture = null,
      undo = null,
      timer = null,
      revision = 0;
    const removalTimers = new Set();
    a.background('#e3e5d7');
    a.html(
      '<div class="mx-delete"><div class="mx-delete-list"></div><div class="mx-delete-footer"><button data-undo disabled>撤销</button><button data-reset>复位</button><output role="status">仅删除本地示例条目</output></div></div>'
    );
    const list = a.$('.mx-delete-list');
    function render() {
      list.innerHTML = items
        .map(
          (item) =>
            `<div class="mx-delete-row" data-row="${item.id}"><button class="mx-delete-action" tabindex="-1" data-remove="${item.id}" aria-label="删除${item.text}">删除</button><div class="mx-delete-front" data-front="${item.id}" tabindex="0"><span>${item.text}</span><button data-reveal="${item.id}" aria-label="显示${item.text}删除操作">←</button></div></div>`
        )
        .join('');
      root.dataset.ids = JSON.stringify(items.map((x) => x.id));
      a.$('[data-undo]').disabled = !undo;
    }
    function remove(id) {
      const index = items.findIndex((x) => x.id === id);
      if (index < 0) return;
      clearTimeout(timer);
      const prior = items.map((x) => ({ ...x })),
        old = list.querySelector(`[data-row="${id}"]`),
        height = old?.getBoundingClientRect().height || 40;
      items = items.filter((x) => x.id !== id);
      undo = {
        items: prior,
        expires: performance.now() + a.params.undoSeconds * 1000,
        token: ++revision
      };
      if (old) {
        old.inert = true;
        old.classList.add('exiting');
        old.style.height = height + 'px';
        old.style.overflow = 'hidden';
        old.style.transition = 'height .24s, opacity .24s';
        requestAnimationFrame(() => {
          if (old.isConnected) {
            old.style.height = '0px';
            old.style.opacity = '0';
          }
        });
        const cleanup = setTimeout(() => {
          removalTimers.delete(cleanup);
          if (old.isConnected) old.remove();
        }, 280);
        removalTimers.add(cleanup);
      }
      root.dataset.ids = JSON.stringify(items.map((x) => x.id));
      a.$('[data-undo]').disabled = false;
      a.$('output').textContent = '已删除，可撤销最后一次操作。';
      const token = undo.token;
      timer = setTimeout(() => {
        if (undo?.token === token) {
          undo = null;
          a.$('[data-undo]').disabled = true;
          a.$('output').textContent = '撤销窗口已结束。';
        }
      }, a.params.undoSeconds * 1000);
    }
    render();
    K.pointers(a, list, {
      accept: (e) => !!e.target.closest('[data-front]') && !e.target.closest('button'),
      start: (p) => {
        const front = p.event.target.closest('[data-front]');
        gesture = { id: front.dataset.front, front, x: p.x, dx: 0 };
        front.style.transition = 'none';
      },
      move: (p) => {
        if (!gesture) return;
        gesture.dx = clamp((p.x - gesture.x) * a.params.resistance, -list.clientWidth, 0);
        gesture.front.style.transform = `translateX(${gesture.dx}px)`;
      },
      end: (p) => {
        if (!gesture) return;
        const g = gesture;
        gesture = null;
        g.front.style.transition = 'transform .28s';
        if (!p.cancelled && a.params.autoDelete && -g.dx > list.clientWidth * a.params.threshold)
          remove(g.id);
        else {
          const revealed = !p.cancelled && g.dx < -35;
          g.front.style.transform = revealed ? 'translateX(-72px)' : 'translateX(0)';
          const button = list.querySelector(`[data-remove="${g.id}"]`);
          if (button) button.tabIndex = revealed ? 0 : -1;
        }
      },
      cancel: () => {
        if (gesture) {
          gesture.front.style.transition = 'transform .2s';
          gesture.front.style.transform = 'translateX(0)';
          const button = list.querySelector(`[data-remove="${gesture.id}"]`);
          if (button) button.tabIndex = -1;
        }
        gesture = null;
      }
    });
    a.on(list, 'click', (e) => {
      const removeButton = e.target.closest('[data-remove]'),
        reveal = e.target.closest('[data-reveal]');
      if (removeButton) remove(removeButton.dataset.remove);
      if (reveal) {
        const front = list.querySelector(`[data-front="${reveal.dataset.reveal}"]`);
        front.style.transition = 'transform .25s';
        front.style.transform =
          front.dataset.revealed === 'true' ? 'translateX(0)' : 'translateX(-72px)';
        front.dataset.revealed = front.dataset.revealed === 'true' ? 'false' : 'true';
        list.querySelector(`[data-remove="${reveal.dataset.reveal}"]`).tabIndex =
          front.dataset.revealed === 'true' ? 0 : -1;
      }
    });
    a.on(list, 'keydown', (e) => {
      const front = e.target.closest('[data-front]');
      if (front && e.key === 'Delete') {
        e.preventDefault();
        remove(front.dataset.front);
      }
      if (front && e.key === 'Escape') {
        front.style.transform = 'translateX(0)';
        list.querySelector(`[data-remove="${front.dataset.front}"]`).tabIndex = -1;
      }
    });
    a.on(a.$('[data-undo]'), 'click', () => {
      if (!undo) return;
      if (performance.now() > undo.expires) {
        undo = null;
        render();
        a.$('output').textContent = '撤销窗口已结束。';
        return;
      }
      items = undo.items;
      undo = null;
      clearTimeout(timer);
      render();
      a.$('output').textContent = '已恢复原条目和顺序。';
    });
    a.on(a.$('[data-reset]'), 'click', () => {
      clearTimeout(timer);
      undo = null;
      items = initial.map((x) => ({ ...x }));
      render();
      a.$('output').textContent = '已复位。';
    });
    a.cleanup(() => {
      clearTimeout(timer);
      for (const t of removalTimers) clearTimeout(t);
      removalTimers.clear();
    });
  });
  // @effect swipedecision
  register('swipedecision', (root, a) => {
    const K = MuseumMechanics;
    const studies = [
      ['LIGHT', '光影'],
      ['FORM', '形状'],
      ['SOUND', '声音'],
      ['SPACE', '空间'],
      ['TIME', '时间']
    ];
    let index = 0,
      x = 0,
      origin = 0,
      dragging = false,
      phase = null,
      decisions = [];
    const tracker = K.velocity();
    a.background('#29362f');
    a.html(
      '<div class="mx-decision"><div class="mx-decision-stack"></div><div class="mx-decision-card" tabindex="0" aria-label="拖动决定，左右键也可使用"><span data-number></span><b data-name></b><span class="mx-decision-stamp nope">SKIP</span><span class="mx-decision-stamp like">KEEP</span></div></div><div class="mx-tools"><button data-skip>← 跳过</button><button data-keep>保留 →</button><button data-reset>复位</button></div><output class="mx-readout" role="status"></output>'
    );
    const card = a.$('.mx-decision-card');
    function paint() {
      a.$('[data-number]').textContent =
        index < studies.length ? String(index + 1).padStart(2, '0') + ' / 05' : 'DONE';
      a.$('[data-name]').textContent = index < studies.length ? studies[index][0] : 'THANK YOU';
      const width = card.clientWidth,
        rotation = clamp(x / Math.max(1, width), -1, 1) * a.params.rotation;
      card.style.transform = `translate(${x}px,${phase?.kind === 'commit' ? Math.abs(x) * 0.09 : 0}px) rotate(${rotation}deg)`;
      a.$('.like').style.opacity = clamp(x / (width * 0.45));
      a.$('.nope').style.opacity = clamp(-x / (width * 0.45));
      a.$('output').textContent = `已决定 ${decisions.length} / 5 · 仅本地演示`;
      a.$('[data-skip]').disabled = a.$('[data-keep]').disabled = !!phase || index >= studies.length;
      root.dataset.state = JSON.stringify({
        index,
        decisions,
        x,
        dragging,
        phase: phase?.kind || null
      });
    }
    function settle() {
      phase = { kind: 'return', from: x, start: a.time };
    }
    function commit(direction) {
      if (phase?.kind === 'commit' || index >= studies.length) return;
      decisions.push({ id: index, choice: direction > 0 ? 'keep' : 'skip' });
      dragging = false;
      phase = { kind: 'commit', from: x, start: a.time, direction };
      if (K.reduced() || a.paused) {
        index++;
        x = 0;
        phase = null;
      }
      paint();
    }
    K.pointers(a, card, {
      accept: () => !phase && index < studies.length,
      start: (p) => {
        dragging = true;
        origin = K.point(root, p.event).x;
        tracker.clear();
        tracker.push({ ...K.point(root, p.event), time: p.time });
      },
      move: (p) => {
        const q = K.point(root, p.event);
        x = q.x - origin;
        tracker.push({ ...q, time: p.time });
        paint();
      },
      end: (p) => {
        dragging = false;
        if (p.cancelled) {
          x = 0;
          phase = null;
          paint();
          return;
        }
        const velocity = tracker.read().x,
          width = card.clientWidth;
        if (Math.abs(x) > width * a.params.distance) commit(Math.sign(x));
        else if (Math.abs(velocity) > a.params.velocity) commit(Math.sign(velocity));
        else settle();
      },
      cancel: () => {
        dragging = false;
        x = 0;
        phase = null;
        paint();
      }
    });
    a.on(card, 'keydown', (e) => {
      if (['ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        commit(e.key === 'ArrowRight' ? 1 : -1);
      }
    });
    a.on(a.$('[data-skip]'), 'click', () => commit(-1));
    a.on(a.$('[data-keep]'), 'click', () => commit(1));
    a.on(a.$('[data-reset]'), 'click', () => {
      index = 0;
      decisions = [];
      phase = null;
      x = 0;
      paint();
    });
    a.loop((t) => {
      if (phase) {
        const p = clamp((t - phase.start) / (phase.kind === 'commit' ? 0.32 : 0.38)),
          q = 1 - (1 - p) ** 3;
        if (phase.kind === 'commit') {
          x = phase.from + (phase.direction * root.clientWidth * 1.1 - phase.from) * q;
          if (p >= 1) {
            index++;
            x = 0;
            phase = null;
          }
        } else {
          x = phase.from * (1 - q);
          if (p >= 1) {
            x = 0;
            phase = null;
          }
        }
      }
      paint();
    });
  });
  // @effect peekpop
  register('peekpop', (root, a) => {
    const K = MuseumMechanics;
    let phase = 'idle',
      progress = 0,
      returnFocus = null;
    a.background('#dfd8cd');
    a.html(
      '<div class="mx-peek-shade"></div><button class="mx-peek-card" aria-label="按住预览，保持到阈值展开"><span>ONE SMALL IDEA</span><i>✳</i><b>KEEP LOOKING.</b><svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="20" pathLength="1" stroke-dasharray="1"/></svg></button><div class="mx-peek-full" hidden><button data-close aria-label="收起局部预览">×</button><span>AN IDEA, OPENED.</span><i>✳</i><h4>把好奇心，<br>留给下一步。</h4><p>这是展品内的局部预览，<br>没有离开博物馆。</p></div><div class="mx-tools light"><button data-direct>直接打开</button></div><output class="mx-readout light" role="status">按住 Enter / Space 也可体验</output>'
    );
    const trigger = a.$('.mx-peek-card'),
      panel = a.$('.mx-peek-full');
    function paint() {
      trigger.style.transform = `scale(${K.reduced() ? 1 : 1 + progress * (a.params.previewScale - 1)})`;
      a.$('.mx-peek-shade').style.opacity = phase === 'holding' ? progress * 0.45 : 0;
      trigger.querySelector('circle').style.strokeDashoffset = 1 - progress;
      trigger.hidden = phase === 'open';
      panel.hidden = phase !== 'open';
      root.dataset.phase = phase;
      root.dataset.progress = progress.toFixed(3);
    }
    function open() {
      hold.cancel('opened', false);
      returnFocus = document.activeElement;
      phase = 'open';
      progress = 1;
      paint();
      a.$('output').textContent = '已展开 · Escape 可收起';
      a.$('[data-close]').focus({ preventScroll: true });
    }
    function close() {
      phase = 'idle';
      progress = 0;
      paint();
      a.$('output').textContent = '已收起，可再次按住';
      (returnFocus && returnFocus.isConnected ? returnFocus : trigger).focus({ preventScroll: true });
    }
    const hold = K.hold(a, trigger, {
      duration: () => a.params.holdMs,
      radius: () => a.params.cancelRadius,
      progress: (p) => {
        if (phase === 'open') return;
        progress = p;
        phase = p > 0 ? 'holding' : 'idle';
        paint();
      },
      complete: open,
      cancelled: () => {
        if (phase !== 'open') {
          phase = 'idle';
          progress = 0;
          paint();
          a.$('output').textContent = '已取消，未打开。';
        }
      }
    });
    a.on(a.$('[data-direct]'), 'click', open);
    a.on(a.$('[data-close]'), 'click', close);
    a.on(root, 'keydown', (e) => {
      if (e.key === 'Escape' && phase === 'open') {
        e.preventDefault();
        e.stopPropagation();
        close();
      }
    });
    const dialog = root.closest('dialog');
    if (dialog)
      a.on(dialog, 'cancel', (e) => {
        if (phase === 'open') {
          e.preventDefault();
          close();
        }
      });
    a.onParamsChange(() => {
      hold.cancel('parameters');
      if (phase !== 'open') {
        progress = 0;
        phase = 'idle';
        paint();
      }
    });
    paint();
  });
  // @effect rubberbound
  register('rubberbound', (root, a) => {
    const K = MuseumMechanics;
    let y = 0,
      v = 0,
      dragging = false,
      startY = 0,
      baseY = 0,
      priorContent = '',
      min = 0;
    const tracker = K.velocity();
    a.background('#dbe2d4');
    a.html(
      '<div class="mx-rubber-view" tabindex="0" aria-label="拖动列表，方向键滚动，Home/End 到边界"><div class="mx-rubber-edge top">TOP</div><div class="mx-rubber-edge bottom">BOTTOM</div><div class="mx-rubber-content"></div></div><div class="mx-tools light"><button data-top>拉上界</button><button data-bottom>拉下界</button><button data-reset>复位</button></div><output class="mx-readout light"></output>'
    );
    const view = a.$('.mx-rubber-view'),
      content = a.$('.mx-rubber-content');
    function measure() {
      min = Math.min(0, view.clientHeight - content.scrollHeight);
    }
    function rubber(raw) {
      if (raw > 0) return (raw * a.params.elasticity * a.params.limit) / (raw + a.params.limit);
      if (raw < min) {
        const over = raw - min;
        return (
          min + (over * a.params.elasticity * a.params.limit) / (Math.abs(over) + a.params.limit)
        );
      }
      return raw;
    }
    function paint() {
      if (priorContent !== a.params.content) {
        priorContent = a.params.content;
        content.innerHTML = Array.from(
          { length: priorContent === 'short' ? 2 : 9 },
          (_, i) =>
            `<div><b>${String(i + 1).padStart(2, '0')}</b><span>${['观察', '试验', '发现', '留白', '节奏', '边界', '手感', '反馈', '继续'][i]}</span></div>`
        ).join('');
        measure();
        y = clamp(y, min, 0);
        v = 0;
      }
      measure();
      content.style.transform = `translateY(${y}px)`;
      a.$('output').textContent = `y ${Math.round(y)} · 边界 ${Math.round(min)} … 0`;
      root.dataset.state = JSON.stringify({ y, v, min, dragging, count: content.children.length });
    }
    const physics = K.fixedStep(a, (dt) => {
      if (dragging) return;
      const target = clamp(y, min, 0);
      if (y !== target) {
        const k = 120,
          c = 2 * Math.sqrt(k) * a.params.damping;
        v += ((target - y) * k - c * v) * dt;
      } else v *= Math.exp(-5 * dt);
      y += v * dt;
      if (y > a.params.limit) {
        y = a.params.limit;
        v = Math.min(0, v);
      }
      if (y < min - a.params.limit) {
        y = min - a.params.limit;
        v = Math.max(0, v);
      }
      if (Math.abs(y - target) < 0.2 && Math.abs(v) < 1) {
        y = target;
        v = 0;
      }
    });
    K.pointers(a, view, {
      start: (p) => {
        dragging = true;
        startY = p.y;
        baseY = y;
        v = 0;
        tracker.clear();
        tracker.push(p);
      },
      move: (p) => {
        y = rubber(baseY + p.y - startY);
        tracker.push(p);
        paint();
      },
      end: (p) => {
        dragging = false;
        v = p.cancelled ? 0 : tracker.read().y;
        v = clamp(v, -900, 900);
        physics.reset();
        if (p.cancelled) y = clamp(y, min, 0);
      },
      cancel: () => {
        dragging = false;
        y = clamp(y, min, 0);
        v = 0;
        paint();
      }
    });
    a.on(view, 'keydown', (e) => {
      if (['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key)) {
        e.preventDefault();
        y =
          e.key === 'Home'
            ? 0
            : e.key === 'End'
              ? min
              : clamp(y + (e.key === 'ArrowDown' ? -32 : 32), min, 0);
        v = 0;
        paint();
      }
    });
    a.on(a.$('[data-top]'), 'click', () => {
      y = a.params.limit * 0.6;
      v = 0;
      a.repaint();
    });
    a.on(a.$('[data-bottom]'), 'click', () => {
      y = min - a.params.limit * 0.6;
      v = 0;
      a.repaint();
    });
    a.on(a.$('[data-reset]'), 'click', () => {
      y = 0;
      v = 0;
      physics.reset();
      paint();
    });
    a.loop((t, dt) => {
      paint();
      physics.advance(dt);
      paint();
    });
  });

})();
