/* Shared controllers for Gate A. Pointer ownership stays local to each stage. */
window.MuseumMechanics = (() => {
  const { clamp } = Museum;
  const reduced = () => document.body.classList.contains('reduce-motion');
  function point(element, event) {
    const r = element.getBoundingClientRect();
    return {
      x: ((event.clientX - r.left) * element.clientWidth) / Math.max(1, r.width),
      y: ((event.clientY - r.top) * element.clientHeight) / Math.max(1, r.height)
    };
  }
  function fixedStep(a, fn, { step = 1 / 120, maxSteps = 8 } = {}) {
    let accumulator = 0,
      dropped = 0;
    const controller = {
      advance(dt) {
        if (!Number.isFinite(dt) || dt <= 0) return;
        const incoming = accumulator + dt;
        accumulator = Math.min(incoming, step * maxSteps);
        dropped += Math.max(0, incoming - accumulator);
        let count = 0;
        while (accumulator + 1e-10 >= step && count < maxSteps) {
          fn(step);
          accumulator -= step;
          count++;
        }
        return count;
      },
      reset() {
        accumulator = 0;
      },
      get droppedTime() {
        return dropped;
      }
    };
    a.onActivity((s) => {
      if (!s.visible || s.paused) controller.reset();
    });
    return controller;
  }
  function pointers(a, element, handlers = {}, max = 1) {
    const points = new Map();
    let disposed = false;
    const snapshot = () => [...points.values()].map((p) => ({ ...p }));
    function finish(event, cancelled = false, reason = 'release') {
      const id = event.pointerId,
        stored = points.get(id);
      if (!stored) return;
      const p = { ...stored, ...point(element, event), time: performance.now() };
      points.delete(id);
      try {
        if (element.hasPointerCapture(id)) element.releasePointerCapture(id);
      } catch {}
      const all = snapshot();
      handlers.end?.({ ...p, event, cancelled, reason, points: all });
      if (!points.size) handlers.idle?.();
      a.repaint();
    }
    function cancel(reason = 'cancel') {
      if (!points.size) return;
      const before = snapshot();
      points.clear();
      for (const p of before) {
        try {
          if (element.hasPointerCapture(p.id)) element.releasePointerCapture(p.id);
        } catch {}
      }
      handlers.cancel?.(reason, before);
      handlers.idle?.();
      a.repaint();
    }
    a.on(element, 'pointerdown', (event) => {
      if (
        disposed ||
        event.button !== 0 ||
        points.size >= max ||
        handlers.accept?.(event) === false
      )
        return;
      const p = { ...point(element, event), id: event.pointerId, event, time: performance.now() };
      points.set(p.id, p);
      try {
        element.setPointerCapture(p.id);
      } catch {}
      handlers.start?.({ ...p, points: snapshot() });
      a.repaint();
    });
    a.on(element, 'pointermove', (event) => {
      const old = points.get(event.pointerId);
      if (!old) return;
      const p = { ...point(element, event), id: old.id, event, time: performance.now() };
      points.set(p.id, p);
      handlers.move?.({ ...p, previous: old, points: snapshot() });
      a.repaint();
    });
    a.on(element, 'pointerup', (event) => finish(event));
    a.on(element, 'pointercancel', (event) => finish(event, true, 'pointercancel'));
    a.on(element, 'lostpointercapture', (event) => finish(event, true, 'lostcapture'));
    a.on(window, 'blur', () => cancel('blur'));
    a.on(element, 'keydown', (event) => {
      if (event.key === 'Escape' && points.size) {
        event.preventDefault();
        event.stopPropagation();
        cancel('escape');
      }
    });
    a.onActivity((s) => {
      if (!s.visible || s.paused) cancel(s.paused ? 'paused' : 'inactive');
    });
    a.cleanup(() => {
      disposed = true;
      cancel('destroy');
    });
    return {
      points,
      cancel,
      get active() {
        return points.size > 0;
      }
    };
  }
  function velocity() {
    let samples = [];
    return {
      clear() {
        samples = [];
      },
      push(p) {
        samples.push({ x: p.x, y: p.y, t: p.time ?? performance.now() });
        const cutoff = (p.time ?? performance.now()) - 120;
        samples = samples.filter((s) => s.t >= cutoff).slice(-12);
      },
      read(now = performance.now()) {
        if (samples.length < 2 || now - samples.at(-1).t > 120) return { x: 0, y: 0 };
        const first = samples[0],
          last = samples.at(-1),
          dt = Math.max(0.008, (last.t - first.t) / 1000);
        return {
          x: clamp((last.x - first.x) / dt, -2500, 2500),
          y: clamp((last.y - first.y) / dt, -2500, 2500)
        };
      }
    };
  }
  function hold(
    a,
    element,
    {
      enabled = () => true,
      duration = () => 600,
      radius = () => 18,
      progress = () => {},
      complete = () => {},
      cancelled = () => {}
    } = {}
  ) {
    let active = false,
      timer = null,
      origin = null,
      start = 0,
      keyboard = false,
      pointerId = null,
      previousPaused = a.paused;
    function stop(reason = 'cancel', notify = true) {
      const was = active;
      active = false;
      clearInterval(timer);
      timer = null;
      try {
        if (pointerId !== null && element.hasPointerCapture(pointerId))
          element.releasePointerCapture(pointerId);
      } catch {}
      pointerId = null;
      keyboard = false;
      if (was) {
        progress(0);
        if (notify) cancelled(reason);
      }
    }
    function tick() {
      if (!active) return;
      if (a.suspended || document.hidden || !a.root.isConnected) {
        stop('inactive');
        return;
      }
      const p = clamp((performance.now() - start) / duration());
      progress(p);
      if (p >= 1) {
        stop('complete', false);
        complete();
      }
    }
    function begin() {
      if (active || a.suspended || document.hidden) return;
      active = true;
      start = performance.now();
      progress(0);
      timer = setInterval(() => a.invoke(tick), 16);
    }
    a.on(element, 'pointerdown', (event) => {
      if (event.button !== 0 || !enabled()) return;
      origin = point(a.root, event);
      pointerId = event.pointerId;
      try {
        element.setPointerCapture(pointerId);
      } catch {}
      begin();
    });
    a.on(element, 'pointermove', (event) => {
      if (active && !keyboard && origin) {
        const p = point(a.root, event);
        if (Math.hypot(p.x - origin.x, p.y - origin.y) > radius()) stop('moved');
      }
    });
    for (const event of ['pointerup', 'pointercancel', 'lostpointercapture'])
      a.on(element, event, () => {
        if (active && !keyboard) stop(event);
      });
    a.on(element, 'keydown', (event) => {
      if (!enabled()) return;
      if (['Space', 'Enter'].includes(event.code)) {
        event.preventDefault();
        if (!event.repeat) {
          keyboard = true;
          begin();
        }
      }
      if (event.key === 'Escape') stop('escape');
    });
    a.on(element, 'keyup', (event) => {
      if (!enabled() && !keyboard) return;
      if (['Space', 'Enter'].includes(event.code)) {
        event.preventDefault();
        if (keyboard) stop('keyup');
      }
    });
    a.on(element, 'blur', () => stop('blur'));
    a.on(window, 'blur', () => stop('window-blur'));
    a.onActivity((s) => {
      if (!s.visible || (s.paused && !previousPaused)) stop('inactive');
      previousPaused = s.paused;
    });
    a.cleanup(() => stop('destroy'));
    return {
      cancel: stop,
      get active() {
        return active;
      }
    };
  }
  function flipGroup(a, getElements, { duration = () => 450 } = {}) {
    let flights = [],
      began = 0;
    function clear() {
      for (const f of flights) {
        f.el.style.transform = '';
        f.el.style.transformOrigin = '';
      }
      flights = [];
    }
    function play(mutate, overrides = new Map()) {
      const first = new Map(
        getElements().map((el) => [el.dataset.stableId, el.getBoundingClientRect()])
      );
      for (const [key, rect] of overrides) first.set(key, rect);
      clear();
      mutate();
      const scale = a.root.getBoundingClientRect().width / Math.max(1, a.root.clientWidth);
      if (reduced() || a.paused || a.suspended) return;
      flights = getElements().flatMap((el) => {
        const from = first.get(el.dataset.stableId),
          to = el.getBoundingClientRect();
        return from && to.width && to.height
          ? [
              {
                el,
                dx: (from.left - to.left) / scale,
                dy: (from.top - to.top) / scale,
                sx: from.width / to.width,
                sy: from.height / to.height
              }
            ]
          : [];
      });
      began = a.time;
      paint(a.time);
    }
    function paint(t) {
      if (!flights.length) return;
      const p = clamp((t - began) / (duration() / 1000)),
        q = 1 - (1 - p) ** 3;
      for (const f of flights) {
        f.el.style.transformOrigin = '0 0';
        f.el.style.transform = `translate(${f.dx * (1 - q)}px,${f.dy * (1 - q)}px) scale(${f.sx + (1 - f.sx) * q},${f.sy + (1 - f.sy) * q})`;
      }
      if (p >= 1) clear();
    }
    a.loop(paint);
    a.on(window, 'resize', clear);
    a.onActivity((s) => {
      if (!s.visible) clear();
    });
    a.cleanup(clear);
    return {
      play,
      clear,
      get active() {
        return flights.length > 0;
      }
    };
  }
  return { point, fixedStep, pointers, velocity, hold, flipGroup, reduced };
})();
