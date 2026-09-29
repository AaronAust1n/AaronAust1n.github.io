(() => {
  const { register, clamp, rng } = Museum;
  const X = MuseumExpansion;
  // @effect win95
  register('win95', (root, a) => {
    let x = 0,
      y = 0,
      sx = 0,
      sy = 0,
      ox = 0,
      oy = 0,
      minute = '';
    X.shell(
      a,
      '#528e89',
      '<div class="nx-win-window"><div class="nx-win-title"><span>Curiosity.exe</span><button data-close aria-label="关闭窗口">×</button></div><div class="nx-win-body"><b>Welcome back.</b><p>一个可以拖动的小窗口。<br>好奇心尚未退出。</p><button data-ok>确定</button></div></div><div class="nx-win-off" hidden><span>It is now safe to keep exploring.</span><button data-reboot>重新启动</button></div><div class="nx-win-menu" hidden><button data-open>打开窗口</button><button data-power>关闭演示系统</button></div><div class="nx-win-task"><button data-start>▦ Start</button><time></time></div>'
    );
    const win = a.$('.nx-win-window');
    X.pointerDrag(a, a.$('.nx-win-title'), {
      start: (e) => {
        if (e.target.closest('button')) return false;
        sx = e.clientX;
        sy = e.clientY;
        ox = x;
        oy = y;
      },
      move: (e) => {
        x = clamp(
          ox + ((e.clientX - sx) * root.clientWidth) / root.getBoundingClientRect().width,
          -root.clientWidth * 0.25,
          root.clientWidth * 0.25
        );
        y = clamp(
          oy + ((e.clientY - sy) * root.clientHeight) / root.getBoundingClientRect().height,
          -root.clientHeight * 0.25,
          root.clientHeight * 0.3
        );
        win.style.transform = `translate(${x}px,${y}px)`;
      }
    });
    a.on(a.$('[data-close]'), 'click', () => (win.hidden = true));
    a.on(a.$('[data-open]'), 'click', () => {
      win.hidden = false;
      a.$('.nx-win-menu').hidden = true;
    });
    a.on(
      a.$('[data-start]'),
      'click',
      () => (a.$('.nx-win-menu').hidden = !a.$('.nx-win-menu').hidden)
    );
    a.on(a.$('[data-power]'), 'click', () => {
      win.hidden = true;
      a.$('.nx-win-off').hidden = false;
      a.$('.nx-win-menu').hidden = true;
    });
    a.on(a.$('[data-reboot]'), 'click', () => {
      a.$('.nx-win-off').hidden = true;
      win.hidden = false;
    });
    a.on(
      a.$('[data-ok]'),
      'click',
      () => (a.$('.nx-win-body p').textContent = '操作完成。所有变化仅在这个展品里。')
    );
    a.loop(() => {
      win.style.width = 58 + a.amount * 24 + '%';
      const stamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      if (stamp !== minute) {
        minute = stamp;
        a.$('time').textContent = stamp;
      }
    });
  });
  // @effect aqua
  register('aqua', (root, a) => {
    let saved = false;
    X.shell(
      a,
      '#d6dbe0',
      '<div class="nx-aqua"><header><button aria-label="关闭演示提示">×</button><button aria-label="最小化提示">−</button><button aria-label="放大提示">+</button><span>New idea</span></header><b>A little clarity.</b><p role="status">把灵感存放在此刻。</p><button class="nx-aqua-save">存储</button></div>'
    );
    a.on(a.$('.nx-aqua-save'), 'click', () => {
      saved = !saved;
      a.$('p').textContent = saved ? '已记下这次点击 · 没有写入文件' : '把灵感存放在此刻。';
    });
    a.$$('header button').forEach((b, i) =>
      a.on(
        b,
        'click',
        () =>
          (a.$('p').textContent = [
            '这是演示窗口，不会关闭页面。',
            '保持一点留白。',
            '清晰，也可以是轻盈的。'
          ][i])
      )
    );
    a.loop((t) => {
      a.$('.nx-aqua-save').style.boxShadow =
        `0 0 ${3 + a.amount * 13}px rgba(68,150,234,${0.2 + (Math.sin(t * Math.PI * 1.25) + 1) * 0.2})`;
    });
  });
  // @effect vhs
  register('vhs', (root, a) => {
    let playing = true,
      clock = 0;
    X.shell(
      a,
      '#242d3b',
      '<button class="nx-vhs" aria-label="切换录像带播放暂停" aria-pressed="true"><span class="nx-vhs-land"></span><i class="nx-vhs-noise"></i><b data-state>PLAY ▷</b><time>00:00</time><small>FIELD RECORDING / SYNTHETIC</small></button>'
    );
    a.on(a.$('button'), 'click', () => {
      playing = !playing;
      a.$('button').setAttribute('aria-pressed', playing);
      a.$('[data-state]').textContent = playing ? 'PLAY ▷' : 'PAUSE Ⅱ';
    });
    a.loop((t, dt) => {
      if (playing) clock += dt;
      a.$('time').textContent = '00:' + String(Math.floor(clock) % 60).padStart(2, '0');
      a.$('.nx-vhs-noise').style.top = X.reduced() ? '40%' : ((t / 4.5) % 1) * 120 - 10 + '%';
      a.$('.nx-vhs-noise').style.opacity = 0.08 + a.amount * 0.27;
      a.$('.nx-vhs-land').style.transform =
        !playing && !X.reduced() ? `translateX(${Math.sin(Math.floor(t * 2) * 17) * 3}px)` : 'none';
      root.classList.toggle('nx-vhs-paused', !playing);
    });
  });
  // @effect polaroid
  register('polaroid', (root, a) => {
    let start = -9;
    X.shell(
      a,
      '#cbb99f',
      '<div class="nx-polaroid"><button class="nx-shutter">◎ 快门</button><div class="nx-photo"><div class="nx-photo-art"><i></i><b></b><em></em></div><span>keep a little wonder.</span></div><i class="nx-camera-flash"></i></div>'
    );
    a.on(a.$('button'), 'click', () => (start = a.time));
    a.loop((t) => {
      const dt = t - start,
        p = X.reduced() ? 1 : X.ease((dt - 0.12) / 1.1),
        develop = X.reduced() ? 1 : clamp((dt - 1.1) / (1.5 + a.amount * 3));
      a.$('.nx-photo').style.transform = `translateY(${(1 - p) * -75}px) rotate(-5deg)`;
      a.$('.nx-photo').style.opacity = clamp(p * 2);
      a.$('.nx-photo-art').style.filter = `saturate(${develop}) contrast(${0.2 + develop * 0.8})`;
      a.$('.nx-photo-art').style.opacity = 0.1 + develop * 0.9;
      a.$('.nx-camera-flash').style.opacity = !X.reduced() && dt < 0.15 ? 0.2 * (1 - dt / 0.15) : 0;
    });
  });
  // @effect teletext
  register('teletext', (root, a) => {
    let page = 101,
      start = -3;
    X.shell(
      a,
      '#172031',
      '<button class="nx-teletext" aria-label="切换图文电视页面"><header><span data-page>P101</span><b>OUTLINE TEXT</b></header><div class="nx-mosaic"></div><div class="nx-tele-lines"></div><footer>NEXT PAGE →</footer></button>'
    );
    function draw() {
      const r = rng(page);
      a.$('[data-page]').textContent = 'P' + page;
      a.$('.nx-mosaic').innerHTML = Array.from(
        { length: 48 },
        () =>
          `<i style="background:${['#305ba4', '#dbbc4a', '#c7515b', '#d6d8bc', '#56a1a1'][Math.floor(r() * 5)]}"></i>`
      ).join('');
      a.$('.nx-tele-lines').innerHTML = [
        '今天的灵感，准时抵达。',
        '文字、图形和一点点噪声。',
        '这不是电视广播。',
        '下一页，也许有新发现。'
      ]
        .map((s) => `<p>${s}</p>`)
        .join('');
    }
    draw();
    a.on(a.$('button'), 'click', () => {
      page = page >= 899 ? 101 : page + 1;
      start = a.time;
      draw();
      root.dataset.page = page;
    });
    a.loop((t) =>
      a
        .$$('.nx-tele-lines p')
        .forEach(
          (p, i) =>
            (p.style.opacity = X.reduced() || t - start > i * (0.035 + a.amount * 0.105) ? 1 : 0)
        )
    );
  });
  // @effect flashintro
  register('flashintro', (root, a) => {
    let start = 0,
      skipped = false;
    X.shell(
      a,
      '#242132',
      '<div class="nx-intro"><div class="nx-intro-load"><span>LOCAL INTRO / DEMO</span><b>0%</b><i></i></div><div class="nx-intro-title">ENTER<br>THE UNKNOWN</div><div class="nx-intro-particles">' +
        Array.from({ length: 16 }, () => '<i></i>').join('') +
        '</div><div class="nx-intro-tools"><button data-skip>SKIP INTRO</button><button data-replay>REPLAY</button></div></div>'
    );
    a.on(a.$('[data-skip]'), 'click', () => {
      skipped = true;
      start = a.time - (1 + a.amount * 3);
      a.repaint();
    });
    a.on(a.$('[data-replay]'), 'click', () => {
      skipped = false;
      start = a.time;
    });
    a.loop((t) => {
      const wait = 1 + a.amount * 3,
        p = clamp((t - start) / wait),
        done = p >= 1 || skipped || X.reduced(),
        burst = clamp((t - start - wait) / 1.1);
      root.dataset.done = done;
      a.$('.nx-intro-load').style.opacity = done ? 0 : 1;
      a.$('.nx-intro-load b').textContent = Math.floor(p * 100) + '%';
      a.$('.nx-intro-load i').style.transform = `scaleX(${p})`;
      a.$('.nx-intro-title').style.opacity = done ? 1 : 0;
      a.$('.nx-intro-title').style.transform =
        `scale(${done ? 1 + Math.sin(burst * Math.PI) * 0.2 : 0.5})`;
      a.$$('.nx-intro-particles i').forEach((el, i) => {
        const q = (i / 16) * Math.PI * 2;
        el.style.transform = `translate(${Math.cos(q) * burst * 110}px,${Math.sin(q) * burst * 75}px) rotate(${i * 45}deg)`;
        el.style.opacity = done && !X.reduced() ? 1 - burst : 0;
      });
    });
  });
  // @effect grunge
  register('grunge', (root, a) => {
    X.shell(
      a,
      '#aa9988',
      '<div class="nx-grunge"><button class="nx-note">KEEP<br>LOOKING.</button><button class="nx-ticket">ADMIT ONE<br><small>000159</small></button><button class="nx-stamp">OUT<br>LINE</button><button class="nx-scrap">an unfinished<br>idea.</button></div>'
    );
    a.$$('button').forEach((b) => a.on(b, 'click', () => b.classList.toggle('on')));
    a.loop(() =>
      a
        .$$('button')
        .forEach((b, i) =>
          b.style.setProperty('--tilt', [-0.7, 0.8, -0.4, 1][i] * (4 + a.amount * 14) + 'deg')
        )
    );
  });
  // @effect clickwheel
  register('clickwheel', (root, a) => {
    let index = 0,
      last = 0,
      acc = 0;
    const songs = [
      'Morning field',
      'A quiet room',
      'Small departures',
      'Paper moon',
      'Stay curious'
    ];
    X.shell(
      a,
      '#e0dfd7',
      '<div class="nx-ipod"><div class="nx-ipod-screen"><b>OUTLINE / PLAYLIST</b><ul></ul><output>SELECT A STUDY</output></div><div class="nx-wheel" tabindex="0" aria-label="旋转选曲，也可用上下方向键"><span>MENU</span><button data-confirm aria-label="确认当前选项">●</button><i>◀</i><em>▶</em></div></div>'
    );
    const wheel = a.$('.nx-wheel');
    function paint() {
      a.$('ul').innerHTML = songs
        .map((s, i) => `<li class="${i === index ? 'selected' : ''}">${s}</li>`)
        .join('');
      root.dataset.selected = index;
    }
    paint();
    const angle = (e) => {
      const r = wheel.getBoundingClientRect();
      return Math.atan2(e.clientY - r.top - r.height / 2, e.clientX - r.left - r.width / 2);
    };
    X.pointerDrag(a, wheel, {
      start: (e) => {
        if (e.target.closest('button')) return false;
        last = angle(e);
        acc = 0;
      },
      move: (e) => {
        const q = angle(e);
        let d = q - last;
        if (d > Math.PI) d -= 2 * Math.PI;
        if (d < -Math.PI) d += 2 * Math.PI;
        last = q;
        acc += d;
        const threshold = 0.55 - a.amount * 0.37;
        if (Math.abs(acc) > threshold) {
          index = (index + Math.sign(acc) + songs.length) % songs.length;
          acc = 0;
          paint();
        }
      }
    });
    a.on(wheel, 'keydown', (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        index =
          (index + (['ArrowDown', 'ArrowRight'].includes(e.key) ? 1 : -1) + songs.length) %
          songs.length;
        paint();
      }
      if (e.key === 'Enter') a.$('output').textContent = 'SELECTED: ' + songs[index];
    });
    a.on(
      a.$('[data-confirm]'),
      'click',
      () => (a.$('output').textContent = 'SELECTED: ' + songs[index])
    );
  });
  // @effect filepanels
  register('filepanels', (root, a) => {
    const L = MuseumLab;
    L.shell(
      a,
      'LOCAL COMMANDER / 虚构目录，不访问磁盘',
      `<div class="bc-files"><div><header>A:/STUDIO</header><div role="listbox" tabindex="0" aria-label="左虚构目录"></div></div><div><header>B:/ARCHIVE</header><div role="listbox" tabindex="0" aria-label="右虚构目录"></div></div></div><div class="bc-toolbar"><button data-copy>复制 →</button><button data-move>移动 →</button><button data-switch>切换面板</button></div><output class="bc-note" role="status">↑↓ 选择 / ←→ 切换 / Tab 正常离开</output>`,
      '#182d53',
    );
    let uid = 8,
      active = 0,
      selected = [0, 0],
      dirs = [
        [
          { id: 1, name: 'field.txt', size: 24 },
          { id: 2, name: 'notes.md', size: 8 },
          { id: 3, name: 'orbit.svg', size: 16 },
        ],
        [
          { id: 4, name: 'readme.txt', size: 4 },
          { id: 5, name: 'field.txt', size: 24 },
        ],
      ];
    const lists = a.$$('[role=listbox]');
    function render(focus = false) {
      dirs.forEach((files, k) => {
        files.sort(
          a.params.sort === 'size'
            ? (a, b) => a.size - b.size
            : (a, b) => a.name.localeCompare(b.name),
        );
        selected[k] = clamp(selected[k], 0, Math.max(0, files.length - 1));
        lists[k].replaceChildren();
        files.forEach((f, i) => {
          const el = document.createElement('div');
          el.id = `file-${a.uid}-${f.id}`;
          el.setAttribute('role', 'option');
          el.setAttribute('aria-selected', String(i === selected[k]));
          el.dataset.index = i;
          el.textContent = f.name + ' · ' + f.size + 'K';
          lists[k].append(el);
        });
        lists[k].classList.toggle('bc-active', active === k);
        lists[k].setAttribute(
          'aria-activedescendant',
          files[selected[k]] ? `file-${a.uid}-${files[selected[k]].id}` : '',
        );
      });
      const empty = !dirs[active].length;
      for (const key of ['copy', 'move'])
        a.$('[data-' + key + ']').disabled = empty;
      if (focus) lists[active].focus();
      L.state(a, { dirs, active, selected });
    }
    function transfer(move) {
      const src = dirs[active],
        dst = dirs[1 - active],
        f = src[selected[active]];
      if (!f) return;
      let name = f.name;
      if (dst.some((x) => x.name === name)) {
        if (a.params.conflict === 'skip') {
          a.$('output').textContent = '同名冲突：已跳过，源文件不变';
          return;
        }
        let n = 2;
        while (dst.some((x) => x.name === name)) name = f.name + ' (' + n++ + ')';
      }
      if (dst.length >= 20) {
        a.$('output').textContent = '演示目标目录已达 20 项上限';
        return;
      }
      dst.push({ ...f, name, id: move ? f.id : uid++ });
      if (move) src.splice(selected[active], 1);
      a.$('output').textContent =
        `已${move ? '移动' : '复制'} ${name} · 只修改内存模型`;
      render();
    }
    lists.forEach((el, k) => {
      a.on(el, 'focus', () => {
        active = k;
        render();
      });
      a.on(el, 'click', (e) => {
        const option = e.target.closest('[data-index]');
        if (option) {
          active = k;
          selected[k] = Number(option.dataset.index);
          render(true);
        }
      });
      a.on(el, 'keydown', (e) => {
        if (
          ![
            'ArrowDown',
            'ArrowUp',
            'ArrowLeft',
            'ArrowRight',
            'Home',
            'End',
          ].includes(e.key)
        )
          return;
        e.preventDefault();
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight')
          active = e.key === 'ArrowLeft' ? 0 : 1;
        else
          selected[active] =
            e.key === 'Home'
              ? 0
              : e.key === 'End'
                ? dirs[active].length - 1
                : selected[active] + (e.key === 'ArrowDown' ? 1 : -1);
        render(true);
      });
    });
    L.button(a, '[data-copy]', () => transfer(false));
    L.button(a, '[data-move]', () => transfer(true));
    L.button(a, '[data-switch]', () => {
      active = 1 - active;
      render(true);
    });
    a.onParamsChange(() => render());
  });

})();
