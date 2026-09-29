/* v3.1: per-exhibit fault boundaries, owned lifecycle, and declarative parameters. */
window.Museum = (() => {
  const effects = {},
    instances = new Set(),
    definitions = new Map();
  let uid = 0,
    previous = 0,
    globalPaused = false;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const rng =
    (seed = 7) =>
    () =>
      (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296;
  const palette = ['#d4e6a7', '#b09ce4', '#f0a27a', '#80b7ba', '#f3d276'];
  const forbidden = new Set(['__proto__', 'constructor', 'prototype']);
  function configure(list) {
    for (const def of list) {
      definitions.set(def.key, def);
    }
  }
  configure(window.OUTLINE_DATA?.exhibits || []);
  function validateParams(schema, patch, base = {}) {
    if (
      !patch ||
      typeof patch !== 'object' ||
      Array.isArray(patch) ||
      ![Object.prototype, null].includes(Object.getPrototypeOf(patch))
    )
      throw new TypeError('参数必须为普通对象');
    if (Object.getOwnPropertySymbols(patch).length) throw new TypeError('不支持符号参数');
    const known = new Map(schema.map((p) => [p.key, p])),
      next = Object.assign(Object.create(null), base);
    for (const key of Object.keys(patch)) {
      if (forbidden.has(key) || !known.has(key)) throw new RangeError('未知参数：' + key);
      const d = known.get(key),
        value = patch[key];
      if (d.type === 'boolean') {
        if (typeof value !== 'boolean') throw new TypeError(key + ' 必须为布尔值');
      } else if (d.type === 'select') {
        if (
          typeof value !== 'string' ||
          !d.options.some((o) => (typeof o === 'string' ? o : o.value) === value)
        )
          throw new RangeError(key + ' 不是允许的选项');
      } else {
        if (typeof value !== 'number' || !Number.isFinite(value) || value < d.min || value > d.max)
          throw new RangeError(key + ' 超出数值范围');
        if (d.integer && !Number.isInteger(value)) throw new RangeError(key + ' 必须为整数');
      }
      next[key] = value;
    }
    return Object.freeze(next);
  }
  function frame(now) {
    const dt = Math.min((now - previous) / 1000 || 0.016, 0.04);
    previous = now;
    try {
      for (const api of instances) {
        if (api.destroyed || api.failed) continue;
        try {
          api.notifyActivity();
          if (
            !document.hidden &&
            !api.paused &&
            (!globalPaused || api.userPlay) &&
            !api.suspended &&
            !api.failed
          ) {
            api.time += dt * api.speed;
            for (const fn of [...api.ticks]) {
              if (api.failed || api.destroyed) break;
              api.invoke(fn, [api.time, dt * api.speed]);
            }
          }
        } catch (error) {
          api.fail(error);
        }
      }
    } finally {
      requestAnimationFrame(frame);
    }
  }
  requestAnimationFrame(frame);
  function mount(host, key, options = {}) {
    const root = document.createElement('div');
    root.className = 'scene';
    host.replaceChildren(root);
    const cleanups = [],
      activity = [],
      paramListeners = [];
    const definition = definitions.get(key) || options.definition || {};
    const schema = definition.params || [];
    let initializing = true;
    const api = {
      root,
      host,
      key,
      uid: ++uid,
      time: 0,
      speed: 1,
      amount: 0.5,
      _paused: false,
      _suspended: false,
      userPlay: false,
      failed: false,
      destroyed: false,
      ticks: [],
      params: Object.freeze(Object.create(null)),
      schema,
      pointer: { x: 0, y: 0, nx: 0, ny: 0, down: false, inside: false },
      get paused() {
        return this._paused;
      },
      set paused(v) {
        this._paused = !!v;
        root.dataset.paused = this._paused;
        if (!initializing) this.notifyActivity();
      },
      get suspended() {
        return this._suspended;
      },
      set suspended(v) {
        this._suspended = !!v;
        root.dataset.suspended = this._suspended;
        if (!initializing) this.notifyActivity();
      },
      invoke(fn, args = []) {
        if (this.failed || this.destroyed) return;
        if (initializing) return fn(...args);
        try {
          const result = fn(...args);
          if (result && typeof result.then === 'function')
            result.catch((error) => this.fail(error));
          return result;
        } catch (error) {
          this.fail(error);
        }
      },
      fail(error) {
        if (this.failed || this.destroyed) return;
        this.failed = true;
        this.error = String(error?.message || error);
        this._suspended = true;
        this.ticks.length = 0;
        runCleanups();
        activity.length = 0;
        paramListeners.length = 0;
        root.className = 'scene museum-failed';
        root.replaceChildren();
        const panel = document.createElement('div');
        panel.className = 'museum-error';
        const title = document.createElement('b');
        title.textContent = '这件展品暂时遇到了问题';
        const note = document.createElement('p');
        note.textContent = '其他展品仍可使用。进入实验台后可重播重试。';
        panel.append(title, note);
        root.append(panel);
        root.dataset.failed = 'true';
        console.error('[Museum:' + key + ']', error);
      },
      activityState() {
        return {
          visible: !this.suspended && !document.hidden && !this.destroyed && !this.failed,
          paused: this.paused,
          autoTime:
            !this.paused && (!globalPaused || this.userPlay) && !this.suspended && !document.hidden
        };
      },
      notifyActivity() {
        if (this.destroyed || this.failed) return;
        const value = this.activityState(),
          signature = (value.visible ? 1 : 0) | (value.paused ? 2 : 0) | (value.autoTime ? 4 : 0);
        if (this._activitySignature === signature) return;
        this._activitySignature = signature;
        for (const fn of activity) this.invoke(fn, [value]);
      },
      onActivity(fn) {
        activity.push(fn);
        this.invoke(fn, [this.activityState()]);
      },
      html(markup) {
        if (!this.failed && !this.destroyed) root.innerHTML = markup;
        return root;
      },
      $(s) {
        return root.querySelector(s);
      },
      $$(s) {
        return [...root.querySelectorAll(s)];
      },
      on(el, event, fn, opts) {
        if (this.failed || this.destroyed) return;
        const handler = (e) => {
          this.invoke(fn, [e]);
          if (this.paused || globalPaused || this.suspended) this.repaint();
        };
        el.addEventListener(event, handler, opts);
        cleanups.push(() => el.removeEventListener(event, handler, opts));
      },
      cleanup(fn) {
        if (typeof fn !== 'function') throw new TypeError('cleanup needs a function');
        if (this.failed || this.destroyed) {
          try {
            fn();
          } catch (error) {
            console.error('[Museum cleanup:' + key + ']', error);
          }
        } else cleanups.push(fn);
      },
      loop(fn) {
        if (this.failed || this.destroyed) return;
        this.ticks.push(fn);
        this.invoke(fn, [this.time, 0.016]);
      },
      repaint() {
        if (this.failed || this.destroyed) return;
        for (const fn of this.ticks) {
          if (this.failed) break;
          this.invoke(fn, [this.time, 0]);
        }
      },
      background(color) {
        root.style.background = color;
      },
      canvas(draw) {
        const canvas = document.createElement('canvas');
        if (this.failed || this.destroyed) return canvas;
        canvas.className = 'effect-canvas';
        root.append(canvas);
        const g = canvas.getContext('2d');
        if (!g) throw new Error('Canvas 2D unavailable');
        let w = 0,
          h = 0;
        const render = (t, dt) => {
          g.clearRect(0, 0, w, h);
          g.save();
          try {
            return draw(g, w, h, t, dt);
          } finally {
            g.restore();
          }
        };
        const resize = () => {
          if (this.failed || this.destroyed) return;
          w = root.clientWidth || 300;
          h = root.clientHeight || 200;
          const dpr = Math.min(devicePixelRatio || 1, 2);
          canvas.width = Math.round(w * dpr);
          canvas.height = Math.round(h * dpr);
          g.setTransform(dpr, 0, 0, dpr, 0, 0);
          this.invoke(render, [this.time, 0]);
        };
        const ro = new ResizeObserver(resize);
        ro.observe(root);
        cleanups.push(() => ro.disconnect());
        resize();
        this.ticks.push(render);
        return canvas;
      },
      setParams(patch) {
        const next = validateParams(schema, patch, this.params);
        this.params = next;
        for (const fn of paramListeners) this.invoke(fn, [next]);
        this.repaint();
        return next;
      },
      resetParams() {
        return this.setParams(Object.fromEntries(schema.map((d) => [d.key, d.default])));
      },
      onParamsChange(fn) {
        paramListeners.push(fn);
        this.invoke(fn, [this.params]);
      },
      set(values) {
        const allowed = new Set(['amount', 'speed', 'paused', 'suspended', 'userPlay', 'params']);
        for (const k of Object.keys(values))
          if (forbidden.has(k) || !allowed.has(k))
            throw new RangeError('Unknown instance setting ' + k);
        if (
          'amount' in values &&
          (!Number.isFinite(values.amount) || values.amount < 0 || values.amount > 1)
        )
          throw new RangeError('amount out of range');
        if (
          'speed' in values &&
          (!Number.isFinite(values.speed) || values.speed < 0.2 || values.speed > 2)
        )
          throw new RangeError('speed out of range');
        for (const key of ['paused', 'suspended', 'userPlay'])
          if (key in values && typeof values[key] !== 'boolean')
            throw new TypeError(key + ' must be boolean');
        if ('params' in values) this.setParams(values.params);
        for (const [k, v] of Object.entries(values)) if (k !== 'params') this[k] = v;
        root.dataset.paused = this.paused;
        root.style.setProperty('--amount', this.amount);
        root.style.setProperty('--duration', `${4 / this.speed}s`);
        root.style.setProperty('--speed', this.speed);
        this.notifyActivity();
        this.repaint();
      },
      destroy() {
        if (this.destroyed) return;
        this.destroyed = true;
        instances.delete(this);
        runCleanups();
        activity.length = 0;
        paramListeners.length = 0;
        this.ticks.length = 0;
        root.remove();
      }
    };
    function runCleanups() {
      for (const fn of cleanups.splice(0)) {
        try {
          fn();
        } catch (error) {
          console.error('[Museum cleanup:' + key + ']', error);
        }
      }
    }
    try {
      api.params = validateParams(
        schema,
        Object.fromEntries(schema.map((d) => [d.key, d.default]))
      );
      const { params, ...settings } = options;
      Object.assign(api, settings);
      if (params) api.params = validateParams(schema, params, api.params);
      root.style.setProperty('--amount', api.amount);
      root.style.setProperty('--duration', `${4 / api.speed}s`);
      root.dataset.paused = api.paused;
      function pointer(e) {
        const r = root.getBoundingClientRect();
        api.pointer.x = ((e.clientX - r.left) / Math.max(1, r.width)) * root.clientWidth;
        api.pointer.y = ((e.clientY - r.top) / Math.max(1, r.height)) * root.clientHeight;
        api.pointer.nx = clamp(((e.clientX - r.left) / Math.max(1, r.width)) * 2 - 1, -1, 1);
        api.pointer.ny = clamp(((e.clientY - r.top) / Math.max(1, r.height)) * 2 - 1, -1, 1);
        api.pointer.inside = true;
      }
      api.on(root, 'pointermove', pointer);
      api.on(root, 'pointerdown', (e) => {
        pointer(e);
        api.pointer.down = true;
      });
      api.on(window, 'pointerup', () => (api.pointer.down = false));
      api.on(root, 'pointercancel', () => (api.pointer.down = false));
      api.on(root, 'pointerleave', () => (api.pointer.inside = false));
      if (!effects[key]) throw new Error('Missing exhibit ' + key);
      const pending = effects[key](root, api);
      if (pending && typeof pending.then === 'function') pending.catch((error) => api.fail(error));
    } catch (error) {
      initializing = false;
      api.fail(error);
    } finally {
      initializing = false;
    }
    instances.add(api);
    api.notifyActivity();
    return api;
  }
  function pause(value) {
    globalPaused = !!value;
    document.body.classList.toggle('reduce-motion', globalPaused);
    for (const api of instances) {
      api.notifyActivity();
      api.repaint();
    }
  }
  document.addEventListener('visibilitychange', () => {
    for (const api of instances) api.notifyActivity();
  });
  function circle(g, x, y, r, color) {
    g.beginPath();
    g.arc(x, y, Math.max(0, r), 0, Math.PI * 2);
    if (color) {
      g.fillStyle = color;
      g.fill();
    } else g.stroke();
  }
  function path(g, points, close = false) {
    g.beginPath();
    points.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)));
    if (close) g.closePath();
  }
  return {
    effects,
    register: (key, fn) => (effects[key] = fn),
    configure,
    mount,
    pause,
    instances,
    validateParams,
    clamp,
    lerp,
    rng,
    palette,
    circle,
    path
  };
})();
