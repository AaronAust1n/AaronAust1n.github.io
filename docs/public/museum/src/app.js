(() => {
  'use strict';
  const { exhibits, categories } = window.OUTLINE_DATA;
  const $ = (s) => document.querySelector(s),
    $$ = (s) => [...document.querySelectorAll(s)];
  const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c]));
  const state = {
    view: 'all',
    category: 'all',
    search: '',
    limit: 12,
    favorites: new Set(),
    dark: false,
    reduced: false,
    current: null,
    labApi: null,
    labPaused: false,
    labParams: {},
    labInView: true
  };
  let storageWorks = true;
  function load(key, fallback) {
    try {
      const raw = localStorage.getItem('outline.v2.' + key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch {
      storageWorks = false;
      return fallback;
    }
  }
  function save(key, value) {
    try {
      localStorage.setItem('outline.v2.' + key, JSON.stringify(value));
    } catch {
      storageWorks = false;
    }
  }
  state.favorites = new Set(
    (Array.isArray(load('favorites', [])) ? load('favorites', []) : []).filter((id) =>
      exhibits.some((e) => e.id === id)
    )
  );
  state.dark = load('dark', false) === true;
  state.reduced = load('reduced', matchMedia('(prefers-reduced-motion: reduce)').matches) === true;
  function announce(text) {
    $('#announcement').textContent = text;
    $('#announcement').classList.add('show');
    clearTimeout(announce.timer);
    announce.timer = setTimeout(() => $('#announcement').classList.remove('show'), 2200);
  }
  function applySettings() {
    document.body.classList.toggle('dark', state.dark);
    Museum.pause(state.reduced);
    $('#theme-toggle').textContent = state.dark ? '☀' : '☾';
    $('#theme-toggle').setAttribute('aria-label', state.dark ? '切换浅色主题' : '切换深色主题');
    $('#motion-toggle').setAttribute('aria-pressed', state.reduced);
    $('#motion-toggle').textContent = state.reduced ? '▷' : 'Ⅱ';
    $('#motion-toggle').title = state.reduced ? '恢复自动动效' : '减少动态';
    $('#motion-toggle').setAttribute('aria-label', state.reduced ? '恢复自动动效' : '减少动态');
  }
  applySettings();
  $('#audio-mute').addEventListener('click', () => {
    const muted = !MuseumAudio.muted;
    MuseumAudio.mute(muted);
    $('#audio-mute').setAttribute('aria-pressed', muted);
    $('#audio-mute').textContent = muted ? '∅' : '♫';
    $('#audio-mute').setAttribute('aria-label', muted ? '取消全馆静音' : '全馆静音');
    announce(muted ? '已停止全部声音' : '已取消静音；仍需点击展品启声');
  });
  const counts = Object.fromEntries(
    categories.map((c) => [c.id, exhibits.filter((e) => e.category === c.id).length])
  );
  $('.nav-item[data-view="all"] b').textContent = exhibits.length;
  $('.new-count').textContent = exhibits.filter((e) => e.new).length;
  $('#category-nav').innerHTML = categories
    .map(
      (c) =>
        `<button class="nav-item" data-category="${c.id}"><span>${c.symbol}</span>${c.name}<b>${counts[c.id]}</b></button>`
    )
    .join('');
  $('#category-chips').innerHTML =
    '<button class="chip active" data-category="all">全部</button>' +
    categories
      .map((c) => `<button class="chip" data-category="${c.id}">${c.name}</button>`)
      .join('');
  function results() {
    return exhibits.filter(
      (e) =>
        (state.category === 'all' || e.category === state.category) &&
        (state.view !== 'new' || e.new) &&
        (state.view !== 'updated' || e.updated) &&
        (state.view !== 'favorites' || state.favorites.has(e.id)) &&
        (!state.search ||
          `${e.name} ${e.en} ${e.key} ${e.specId || ''} ${e.principle} ${categoryMap[e.category].name} ${String(e.id).padStart(3, '0')}`
            .toLowerCase()
            .includes(state.search.toLowerCase()))
    );
  }
  const previewInstances = new Map();
  let heroApi = null,
    heroVisible = true,
    previewPriority = null,
    previewBlocked = false;
  const lightKeys = new Set([
    'pinch',
    'archive',
    'swipedelete',
    'peekpop',
    'rubberbound',
    'squash',
    'bauhaus',
    'enso',
    'neubrutal',
    'construct',
    'mondrian',
    'memphis',
    'poster',
    'anticipation',
    'shared',
    'skeleton',
    'inkwash',
    'wax',
    'broadsheet',
    'underlines',
    'vertical',
    'shapewrap',
    'dropcap',
    'counters',
    'hanging',
    'island',
    'win95',
    'aqua',
    'polaroid',
    'grunge',
    'clickwheel',
    'giantform',
    'pullrefresh',
    'bottomsheet',
    'edgeback',
    'glass',
    'iridescent',
    'grain',
    'shadow',
    'duotone',
    'magnet',
    'elastic',
    'eyes',
    'cursor',
    'spring',
    'wave',
    'path',
    'marquee',
    'split',
    'typewriter',
    'textshadow',
    'scramble',
    'typepath',
    'flip',
    'stack',
    'isometric',
    'parallax',
    'coverflow',
    'rings',
    'tree',
    'voronoi',
    'scalestory',
    'cardscroll',
    'toggle',
    'like',
    'toast',
    'stepper',
    'halftone',
    'doodle',
    'snapgrid',
    'domino',
    'curtain',
    'book',
    'truchet',
    'zoommap',
    'undo'
  ]);
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const host = entry.target,
          key = host.dataset.effect;
        const api = previewInstances.get(host);
        if (api) {
          api.inView = entry.isIntersecting;
          // Reconciled as a group, so no callback can bypass the concurrency cap.
        }
      }
      reconcilePreviewBudget();
    },
    { rootMargin: '0px' }
  );
  function card(e) {
    const c = categoryMap[e.category],
      fav = state.favorites.has(e.id);
    return `<article class="exhibit-card ${lightKeys.has(e.key) ? 'light-stage' : ''}" data-id="${e.id}"><div class="preview-wrap"><div class="exhibit-stage" data-effect="${e.key}" aria-label="${e.name}，${e.action}"></div><div class="card-topline"><span class="exhibit-no">No. ${String(e.id).padStart(3, '0')}</span><button class="fav-btn ${fav ? 'selected' : ''}" data-favorite="${e.id}" aria-label="${fav ? '取消收藏' : '收藏'}${e.name}" aria-pressed="${fav}">${fav ? '♥' : '♡'}</button></div><span class="stage-hint">↖ ${e.action}</span></div><div class="card-info"><div class="card-title-row"><h3>${e.name}</h3>${e.new ? '<span class="new-label">NEW</span>' : e.updated ? '<span class="updated-label">UPDATED</span>' : ''}</div><p class="en-name">${e.en}${e.specId ? `<span class="spec-ref">${e.specId}</span>` : ''}</p><div class="card-meta"><span class="category-label"><span>${c.symbol}</span>${c.name}</span><button class="enter-lab" data-open="${e.id}" aria-label="进入${e.name}实验台">进入实验台<span>↗</span></button></div></div></article>`;
  }
  function updateNavigation() {
    $$('.sidebar .nav-item[data-view]').forEach((b) =>
      b.classList.toggle('active', state.view === b.dataset.view && state.category === 'all')
    );
    $$('.sidebar .nav-item[data-category]').forEach((b) =>
      b.classList.toggle('active', state.category === b.dataset.category)
    );
    $$('.chip').forEach((b) => {
      b.classList.toggle('active', state.category === b.dataset.category);
      b.setAttribute('aria-pressed', state.category === b.dataset.category);
    });
    $('#favorite-count').textContent = state.favorites.size;
  }
  function render(append = false) {
    const list = results(),
      visible = list.slice(0, state.limit);
    if (!append) {
      observer.disconnect();
      for (const api of previewInstances.values()) api.destroy();
      previewInstances.clear();
      $('#gallery').innerHTML = visible.map(card).join('');
    } else {
      const n = $$('.exhibit-card').length;
      $('#gallery').insertAdjacentHTML('beforeend', visible.slice(n).map(card).join(''));
    }
    $$('.exhibit-stage').forEach((el) => {
      if (!previewInstances.has(el)) {
        try {
          const api = Museum.mount(el, el.dataset.effect, { suspended: true });
          api.inView = false;
          previewInstances.set(el, api);
        } catch (err) {
          console.error(err);
          el.textContent = '此展品暂时无法运行';
        }
      }
      observer.observe(el);
    });
    const title =
      state.category !== 'all'
        ? categoryMap[state.category].name
        : state.view === 'updated'
          ? '本轮升级'
          : state.view === 'favorites'
            ? '我的收藏'
            : state.view === 'new'
              ? '本期上新'
              : '探索全部展品';
    $('#collection-title').replaceChildren(document.createTextNode(title + ' '));
    const count = document.createElement('span');
    count.id = 'result-count';
    count.textContent = list.length;
    $('#collection-title').append(count);
    $('#empty').hidden = list.length > 0;
    $('#load-more').hidden = visible.length >= list.length;
    $('#loaded-note').textContent = list.length
      ? `已呈现 ${visible.length} / ${list.length} 件展品${visible.length === list.length ? ' · 好奇心不止于此' : ''}`
      : '';
    $('#view-caption').textContent =
      state.view === 'new'
        ? `v${window.OUTLINE_DATA.version} / ${exhibits.filter((e) => e.new).length} 件本期上新`
        : state.view === 'updated'
          ? '原位增强 · 不计入新增数量'
          : '按展品编号排列';
    updateNavigation();
  }
  function setFilter(category = 'all', view = 'all') {
    state.category = category;
    state.view = view;
    state.limit = 12;
    render();
    closeMenu();
  }
  $$('.sidebar [data-view]').forEach((b) =>
    b.addEventListener('click', () => {
      setFilter('all', b.dataset.view);
      $('#collection').scrollIntoView({ behavior: state.reduced ? 'instant' : 'smooth' });
    })
  );
  $$('.sidebar [data-category],.chip').forEach((b) =>
    b.addEventListener('click', () => {
      setFilter(b.dataset.category, b.closest('.sidebar') ? 'all' : state.view);
      if (b.closest('.sidebar'))
        $('#collection').scrollIntoView({ behavior: state.reduced ? 'instant' : 'smooth' });
    })
  );
  $('#explore-release').addEventListener('click', () => {
    state.search = '';
    $('#search').value = '';
    setFilter('all', 'new');
    $('#collection').scrollIntoView({ behavior: state.reduced ? 'instant' : 'smooth' });
  });
  $('#search').addEventListener('input', (e) => {
    state.search = e.target.value.trim();
    state.limit = 12;
    render();
  });
  $('#load-more').addEventListener('click', () => {
    state.limit += 12;
    render(true);
  });
  $('#clear-filters').addEventListener('click', () => {
    state.search = '';
    $('#search').value = '';
    setFilter();
  });
  function toggleFavorite(id) {
    state.favorites.has(id) ? state.favorites.delete(id) : state.favorites.add(id);
    save('favorites', [...state.favorites]);
    updateNavigation();
    $$(`[data-favorite="${id}"]`).forEach((b) => {
      const selected = state.favorites.has(id),
        name = exhibits.find((e) => e.id === id).name;
      b.classList.toggle('selected', selected);
      b.setAttribute('aria-pressed', selected);
      b.setAttribute('aria-label', (selected ? '取消收藏' : '收藏') + name);
      b.textContent = selected ? '♥' : '♡';
    });
    if (state.current?.id === id) updateLabFavorite();
    if (state.view === 'favorites') render();
    if (!storageWorks) announce('当前环境无法保存，收藏在本次打开期间有效');
  }
  $('#gallery').addEventListener('click', (e) => {
    const f = e.target.closest('[data-favorite]'),
      o = e.target.closest('[data-open]');
    if (f) toggleFavorite(Number(f.dataset.favorite));
    if (o) openLab(Number(o.dataset.open));
  });
  const lab = $('#lab');
  const labObserver = new IntersectionObserver(
    (entries) => {
      state.labInView = entries[0].isIntersecting;
      if (state.labApi)
        state.labApi.suspended = !state.labInView || document.hidden || $('#live-panel').hidden;
    },
    { root: lab }
  );
  labObserver.observe($('#lab-stage'));
  function suspendPreviews(value) {
    if (value) MuseumAudio.silence();
    previewBlocked = value;
    reconcilePreviewBudget();
  }
  function reconcilePreviewBudget() {
    const blocked = previewBlocked || document.hidden || $('#lab').open || $('#about').open;
    const cap = window.innerWidth < 700 ? 3 : 6;
    const heroActive = !!heroApi && heroVisible && !blocked && !heroApi.failed;
    if (heroApi) heroApi.suspended = !heroActive;
    const candidates = [...previewInstances.entries()].filter(
      ([host, api]) => api.inView && !api.failed && host.isConnected
    );
    const priority = ([host, api]) => {
      const r = host.getBoundingClientRect();
      return (
        (host === previewPriority ? -1000000 : api.root.dataset.audio === 'active' ? -500000 : 0) +
        Math.abs((r.top + r.bottom) / 2 - innerHeight / 2)
      );
    };
    candidates.sort((a, b) => priority(a) - priority(b));
    const allowed = new Set(
      blocked ? [] : candidates.slice(0, cap - (heroActive ? 1 : 0)).map(([, api]) => api)
    );
    for (const api of previewInstances.values()) api.suspended = !allowed.has(api);
    document.body.dataset.previewActive = allowed.size + (heroActive ? 1 : 0);
    document.body.dataset.previewBudget = cap;
  }
  for (const event of ['pointerover', 'pointerdown', 'focusin'])
    $('#gallery').addEventListener(event, (e) => {
      const host = e.target.closest('.exhibit-stage');
      if (host) {
        previewPriority = host;
        reconcilePreviewBudget();
      }
    });
  window.addEventListener('resize', reconcilePreviewBudget);
  document.addEventListener('visibilitychange', () => {
    reconcilePreviewBudget();
    if (state.labApi)
      state.labApi.suspended = document.hidden || !state.labInView || $('#live-panel').hidden;
  });
  function parameterControls(exhibit) {
    const host = $('#named-params');
    host.replaceChildren();
    host.hidden = !exhibit.params?.length;
    $('#amount-control').hidden = exhibit.parameterMode === 'schema';
    state.labParams = Object.fromEntries((exhibit.params || []).map((d) => [d.key, d.default]));
    for (const d of exhibit.params || []) {
      const label = document.createElement('label');
      label.className = 'range-label named-param';
      label.htmlFor = 'param-' + d.key;
      const title = document.createElement('span');
      title.textContent = d.label;
      const output = document.createElement('output');
      output.id = 'param-out-' + d.key;
      const input = document.createElement(d.type === 'select' ? 'select' : 'input');
      input.id = 'param-' + d.key;
      input.dataset.param = d.key;
      if (d.type === 'select') {
        for (const opt of d.options) {
          const option = document.createElement('option');
          option.value = opt.value;
          option.textContent = opt.label;
          input.append(option);
        }
      } else if (d.type === 'boolean') {
        input.type = 'checkbox';
        label.classList.add('param-boolean');
      } else {
        input.type = 'range';
        input.min = d.min;
        input.max = d.max;
        input.step = d.step || 0.1;
      }
      input.addEventListener('input', () => {
        if (!state.labApi) return;
        const value =
          d.type === 'boolean'
            ? input.checked
            : d.type === 'select'
              ? input.value
              : Number(input.value);
        try {
          const next = state.labApi.setParams({ [d.key]: value });
          // Faulted instances have detached listeners; keep retry parameters in the application.
          syncNamedParams(next);
        } catch (error) {
          announce('参数未应用：' + error.message);
          syncNamedParams(state.labApi.params);
        }
      });
      label.append(title, output, input);
      host.append(label);
    }
    syncNamedParams(state.labParams);
  }
  function syncNamedParams(values) {
    state.labParams = { ...values };
    for (const d of state.current?.params || []) {
      const input = $('#param-' + d.key),
        output = $('#param-out-' + d.key);
      if (!input) continue;
      const value = values[d.key];
      if (d.type === 'boolean') {
        input.checked = value;
        output.textContent = value ? '开' : '关';
      } else {
        input.value = value;
        output.textContent =
          d.type === 'select'
            ? ''
            : String(Number(Number(value).toFixed(3))) + (d.unit ? ' ' + d.unit : '');
      }
    }
  }
  function updateLabFavorite() {
    const yes = state.favorites.has(state.current.id);
    $('#lab-favorite').textContent = yes ? '♥' : '♡';
    $('#lab-favorite').setAttribute('aria-pressed', yes);
    $('#lab-favorite').setAttribute('aria-label', yes ? '取消收藏' : '收藏展品');
  }
  function labTab(code) {
    $('#live-panel').hidden = code;
    $('#code-panel').hidden = !code;
    $('#tab-live').classList.toggle('active', !code);
    $('#tab-code').classList.toggle('active', code);
    $('#tab-live').setAttribute('aria-selected', !code);
    $('#tab-code').setAttribute('aria-selected', code);
    $('#tab-live').tabIndex = code ? -1 : 0;
    $('#tab-code').tabIndex = code ? 0 : -1;
    if (state.labApi) state.labApi.suspended = code || document.hidden || !state.labInView;
  }
  function resetParams() {
    for (const [id, value] of Object.entries({ speed: 1, amount: 50, scale: 100, hue: 0 }))
      $('#' + id).value = value;
    state.labApi?.resetParams();
    applyParams();
  }
  function mountLab() {
    state.labApi?.destroy();
    state.labApi = Museum.mount($('#lab-stage'), state.current.key, {
      paused: state.labPaused,
      userPlay: true,
      params: state.labParams
    });
    state.labApi.onParamsChange(syncNamedParams);
    applyParams();
  }
  function applyParams() {
    if (!state.labApi) return;
    const speed = Number($('#speed').value),
      amount = Number($('#amount').value),
      scale = Number($('#scale').value),
      hue = Number($('#hue').value);
    state.labApi.set({ speed, amount: amount / 100, paused: state.labPaused });
    state.labApi.root.style.transform = `scale(${scale / 100})`;
    $('#lab-stage').style.filter = `hue-rotate(${hue}deg)`;
    $('#speed-out').textContent = speed.toFixed(1) + '×';
    $('#amount-out').textContent = amount + '%';
    $('#scale-out').textContent = scale + '%';
    $('#hue-out').textContent = hue + '°';
    $('#lab-pause').textContent = state.labPaused ? '▷ 播放' : 'Ⅱ 暂停';
    $('#lab-pause').setAttribute('aria-pressed', state.labPaused);
  }
  function openLab(id) {
    const exhibit = exhibits.find((e) => e.id === id);
    if (!exhibit) return;
    state.current = exhibit;
    state.labInView = true;
    state.labPaused = state.reduced;
    $('#lab-id').textContent =
      `EXPERIMENT ${String(exhibit.id).padStart(3, '0')} / ${categoryMap[exhibit.category].name}`;
    $('#lab-title').textContent = exhibit.name;
    $('#lab-action').textContent = '↖ ' + exhibit.action;
    $('#amount-label').textContent = exhibit.param;
    $('#lab-principle').textContent = exhibit.principle;
    $('#lab-caution').textContent = exhibit.caution;
    $('#lab-code').textContent = window.OUTLINE_SOURCE[exhibit.key];
    $('#code-path').textContent = `src/effects/${exhibit.category}.js · ${exhibit.key}`;
    updateLabFavorite();
    parameterControls(exhibit);
    if (!lab.open) {
      lab.showModal();
      document.body.classList.add('modal-open');
      suspendPreviews(true);
    }
    labTab(false);
    for (const [key, v] of Object.entries({ speed: 1, amount: 50, scale: 100, hue: 0 }))
      $('#' + key).value = v;
    mountLab();
    lab.scrollTop = 0;
  }
  function disposeLab() {
    MuseumAudio.silence();
    state.labApi?.destroy();
    state.labApi = null;
    document.body.classList.remove('modal-open');
    suspendPreviews(false);
  }
  function closeLab() {
    lab.close();
    disposeLab();
  }
  lab.addEventListener('close', () => {
    if (!lab.open) disposeLab();
  });
  $('#lab-close').addEventListener('click', closeLab);
  $('#lab-favorite').addEventListener('click', () => toggleFavorite(state.current.id));
  $('#tab-code').addEventListener('click', () => labTab(true));
  $('#tab-live').addEventListener('click', () => labTab(false));
  $('.lab-tabs').addEventListener('keydown', (e) => {
    if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
      e.preventDefault();
      const code =
        e.key === 'End' ||
        (e.key !== 'Home' && $('#tab-live').getAttribute('aria-selected') === 'true');
      labTab(code);
      $(code ? '#tab-code' : '#tab-live').focus();
    }
  });
  ['speed', 'amount', 'scale', 'hue'].forEach((id) =>
    $('#' + id).addEventListener('input', applyParams)
  );
  $('#reset-params').addEventListener('click', resetParams);
  $('#lab-pause').addEventListener('click', () => {
    state.labPaused = !state.labPaused;
    applyParams();
  });
  $('#lab-replay').addEventListener('click', () => {
    mountLab();
    announce('已重置此展品');
  });
  function randomExplore(exclude) {
    const list = results().filter((e) => e.id !== exclude);
    if (!list.length) {
      announce('当前筛选没有其他展品，试试切换展区');
      return;
    }
    openLab(list[Math.floor(Math.random() * list.length)].id);
  }
  $('#random-hero').addEventListener('click', () => randomExplore());
  $('#random-small').addEventListener('click', () => randomExplore());
  $('#lab-next').addEventListener('click', () => randomExplore(state.current.id));
  $('#hero-open').addEventListener('click', () => openLab(27));
  $('#copy-code').addEventListener('click', async () => {
    const text = $('#lab-code').textContent;
    try {
      if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(text);
      else throw new Error('fallback');
      announce('代码已复制');
    } catch {
      const area = document.createElement('textarea');
      area.value = text;
      area.style.cssText = 'position:fixed;opacity:0';
      lab.append(area);
      area.select();
      let copied = false;
      try {
        copied = document.execCommand('copy');
      } catch {}
      area.remove();
      if (copied) announce('代码已复制');
      else {
        const range = document.createRange();
        range.selectNodeContents($('#lab-code'));
        getSelection().removeAllRanges();
        getSelection().addRange(range);
        announce('已选中代码，请按 Ctrl/Cmd + C 复制');
      }
    }
  });
  $('#theme-toggle').addEventListener('click', () => {
    state.dark = !state.dark;
    save('dark', state.dark);
    applySettings();
  });
  $('#motion-toggle').addEventListener('click', () => {
    state.reduced = !state.reduced;
    save('reduced', state.reduced);
    applySettings();
    announce(state.reduced ? '已减少自动动态，手动操作仍可体验' : '已恢复自动动态');
  });
  function closeMenu() {
    $('.sidebar').classList.remove('open');
    $('#mobile-shade').classList.remove('show');
    $('#menu-toggle').setAttribute('aria-expanded', false);
  }
  $('#menu-toggle').addEventListener('click', () => {
    const open = $('.sidebar').classList.toggle('open');
    $('#mobile-shade').classList.toggle('show', open);
    $('#menu-toggle').setAttribute('aria-expanded', open);
  });
  $('#mobile-shade').addEventListener('click', closeMenu);
  const about = $('#about');
  function openAbout() {
    about.showModal();
    document.body.classList.add('modal-open');
    suspendPreviews(true);
    closeMenu();
  }
  ['open-about', 'open-guide'].forEach((id) => $('#' + id).addEventListener('click', openAbout));
  $('#about-close').addEventListener('click', () => about.close());
  about.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    suspendPreviews(false);
  });
  $('#download-guide').addEventListener('click', () => {
    const blob = new Blob([window.OUTLINE_GUIDE], { type: 'text/markdown;charset=utf-8' }),
      url = URL.createObjectURL(blob),
      link = document.createElement('a');
    link.href = url;
    link.download = `形外-${exhibits.length}项效果实现手册.md`;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  });
  [lab, about].forEach((d) =>
    d.addEventListener('click', (e) => {
      if (e.target !== d) return;
      const r = d.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)
        d.close();
    })
  );
  document.addEventListener('keydown', (e) => {
    const typing = /INPUT|TEXTAREA|SELECT/.test(e.target.tagName) || e.target.isContentEditable;
    if (e.key === '/' && !typing && !lab.open && !about.open) {
      e.preventDefault();
      $('#search').focus();
    }
    if (e.key === 'Escape') closeMenu();
  });
  $('.brand').addEventListener('click', (e) => {
    e.preventDefault();
    state.search = '';
    $('#search').value = '';
    setFilter();
    window.scrollTo({ top: 0, behavior: state.reduced ? 'instant' : 'smooth' });
  });
  // Featured installation: a bounded, adaptive vector field, rendered with the same lifecycle.
  Museum.register('featured-flow', (root, a) => {
    a.background('#17251f');
    a.canvas((g, w, h, t) => {
      const cx = w * 0.52 + a.pointer.nx * w * 0.1,
        cy = h * 0.47 + a.pointer.ny * h * 0.1,
        step = Math.max(8, w / 55);
      g.fillStyle = '#17251f';
      g.fillRect(0, 0, w, h);
      g.save();
      g.translate(cx, cy);
      g.rotate(-0.25);
      const sx = w * 0.4,
        sy = h * 0.37;
      for (let x = -sx; x < sx; x += step)
        for (let y = -sy; y < sy; y += step) {
          const nx = x / sx,
            ny = y / sy,
            d = Math.hypot(nx, ny);
          if (d > 1.06) continue;
          const q = Math.atan2(ny, nx),
            twist = q + Math.sin(d * 6 - t * 0.22) * 1.1,
            px = x + Math.cos(twist) * 18 * (1 - d),
            py = y + Math.sin(twist) * 18;
          const fade = clamp((1.1 - d) * 3, 0, 1);
          g.strokeStyle = `hsla(${75 + Math.sin(q + t * 0.07) * 15} 52% ${55 + (1 - d) * 19}% / ${fade * 0.8})`;
          g.lineWidth = 0.8;
          const len = step * (0.65 + Math.sin(d * 8) * 0.35);
          g.beginPath();
          g.moveTo(px - (Math.cos(twist) * len) / 2, py - (Math.sin(twist) * len) / 2);
          g.lineTo(px + (Math.cos(twist) * len) / 2, py + (Math.sin(twist) * len) / 2);
          g.stroke();
        }
      g.restore();
    });
  });
  const heroHost = document.createElement('div');
  heroHost.style.cssText = 'position:absolute;inset:0';
  $('#hero-canvas').replaceWith(heroHost);
  heroApi = Museum.mount(heroHost, 'featured-flow');
  const heroObserver = new IntersectionObserver((entries) => {
    heroVisible = entries[0].isIntersecting;
    reconcilePreviewBudget();
  });
  heroObserver.observe(heroHost);
  function clamp(v, a, b) {
    return Math.max(a, Math.min(b, v));
  }
  render();
  // Read-only diagnostics are useful to automated tests and maintainers.
  window.OUTLINE_APP = {
    getState: () => ({
      view: state.view,
      category: state.category,
      resultCount: results().length,
      favorites: [...state.favorites],
      current: state.current?.id,
      paused: state.labPaused
    }),
    openLab,
    previewBudget: () => ({
      limit: Number(document.body.dataset.previewBudget),
      active: Number(document.body.dataset.previewActive),
      cached: previewInstances.size
    }),
    exhibitCount: exhibits.length
  };
})();
