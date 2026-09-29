/* Local synthesis only. One lazily-created context; one audible exhibit at a time. */
window.MuseumAudio = (() => {
  let ctx = null,
    master = null,
    limiter = null,
    current = null,
    timer = null,
    muted = false;
  const scopes = new Set();
  const clamp = Museum.clamp;
  async function context() {
    if (!ctx) {
      const C = window.AudioContext || window.webkitAudioContext;
      if (!C) throw new Error('此浏览器不支持 WebAudio');
      ctx = new C();
      master = ctx.createGain();
      master.gain.value = 0.16;
      limiter = ctx.createDynamicsCompressor();
      limiter.threshold.value = -12;
      limiter.knee.value = 12;
      limiter.ratio.value = 8;
      master.connect(limiter);
      limiter.connect(ctx.destination);
    }
    await ctx.resume();
    return ctx;
  }
  function silence() {
    for (const s of scopes) s.stop();
  }
  function scope(a) {
    let gain = null,
      analyser = null,
      playing = false,
      visible = true,
      scheduler = null,
      next = 0,
      step = 0,
      previousPlay = a.userPlay,
      disposed = false,
      epoch = 0;
    const nodes = new Set(),
      disposers = [];
    let changed = () => {};
    const s = {
      get context() {
        return ctx;
      },
      get analyser() {
        return analyser;
      },
      get playing() {
        return playing;
      },
      get step() {
        return step;
      },
      get gain() {
        return gain;
      },
      onChange(fn) {
        changed = fn;
        fn(false);
      },
      async start() {
        if (muted) {
          changed(false, '全馆已静音，请先取消静音');
          return false;
        }
        if (
          disposed ||
          a.paused ||
          a.suspended ||
          !visible ||
          document.hidden ||
          !a.root.isConnected
        ) {
          if (playing) s.stop();
          changed(false, '请先播放实验台，并让展品保持可见');
          return false;
        }
        if (playing && current === s) return true;
        const ticket = epoch;
        try {
          await context();
          if (disposed || ticket !== epoch || muted || !a.root.isConnected) return false;
          if (playing && current === s) return true;
          if (a.paused || a.suspended || !visible || document.hidden) return false;
          if (current && current !== s) current.stop();
          if (!gain) {
            gain = ctx.createGain();
            analyser = ctx.createAnalyser();
            analyser.fftSize = 1024;
            gain.gain.value = 0.14;
            gain.connect(analyser);
            analyser.connect(master);
          }
          playing = true;
          current = s;
          previousPlay = a.userPlay;
          a.userPlay = true;
          step = 0;
          next = ctx.currentTime + 0.025;
          changed(true);
          if (!timer) timer = setInterval(tick, 25);
          return true;
        } catch (e) {
          changed(false, e.message || '音频未能启动');
          return false;
        }
      },
      stop() {
        epoch++;
        const was = playing;
        playing = false;
        scheduler = null;
        for (const n of nodes) {
          try {
            n.stop();
          } catch {}
          try {
            n.disconnect();
          } catch {}
        }
        nodes.clear();
        for (const fn of disposers.splice(0)) fn();
        if (gain && ctx) gain.gain.cancelScheduledValues(ctx.currentTime);
        if (current === s) current = null;
        a.userPlay = previousPlay;
        if (was) changed(false);
        if (!current && timer) {
          clearInterval(timer);
          timer = null;
        }
      },
      level(v) {
        if (gain && ctx) gain.gain.setTargetAtTime(clamp(v, 0, 0.35), ctx.currentTime, 0.015);
      },
      pattern(period, fn) {
        scheduler = { period, fn };
        next = ctx.currentTime + 0.025;
        step = 0;
      },
      once(fn) {
        disposers.push(fn);
      },
      track(n) {
        nodes.add(n);
        n.addEventListener(
          'ended',
          () => {
            nodes.delete(n);
            try {
              n.disconnect();
            } catch {}
          },
          { once: true }
        );
        return n;
      },
      tone(freq = 220, duration = 0.4, type = 'sine', when, amplitude = 0.3, options = {}) {
        if (!playing || nodes.size >= 64) return null;
        const at = when ?? ctx.currentTime,
          osc = ctx.createOscillator(),
          env = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(clamp(freq, 25, 6000), at);
        if (options.endFrequency)
          osc.frequency.exponentialRampToValueAtTime(options.endFrequency, at + duration);
        if (options.wave) osc.setPeriodicWave(options.wave);
        env.gain.setValueAtTime(0.0001, at);
        env.gain.exponentialRampToValueAtTime(Math.max(0.0002, amplitude), at + 0.008);
        env.gain.exponentialRampToValueAtTime(0.0001, at + duration);
        osc.connect(env);
        env.connect(options.destination || gain);
        s.track(osc);
        osc.addEventListener('ended', () => env.disconnect(), { once: true });
        osc.start(at);
        osc.stop(at + duration + 0.02);
        return osc;
      },
      oscillator(freq = 220, type = 'sine', destination) {
        if (!playing || nodes.size >= 64) return null;
        const n = ctx.createOscillator();
        n.type = type;
        n.frequency.value = freq;
        n.connect(destination || gain);
        s.track(n);
        n.start();
        return n;
      },
      noise(color = 'white', destination, at, seconds = 2) {
        if (!playing || nodes.size >= 64) return null;
        const rate = ctx.sampleRate,
          buffer = ctx.createBuffer(1, Math.ceil(rate * seconds), rate),
          data = buffer.getChannelData(0);
        let b0 = 0,
          b1 = 0,
          b2 = 0,
          brown = 0;
        for (let i = 0; i < data.length; i++) {
          const white = Math.random() * 2 - 1;
          if (color === 'pink') {
            b0 = 0.99765 * b0 + white * 0.099046;
            b1 = 0.963 * b1 + white * 0.2965164;
            b2 = 0.57 * b2 + white * 1.0526913;
            data[i] = (b0 + b1 + b2 + white * 0.1848) * 0.15;
          } else if (color === 'brown') {
            brown = (brown + 0.02 * white) / 1.02;
            data[i] = brown * 3.5;
          } else data[i] = white * 0.5;
        }
        const n = ctx.createBufferSource();
        n.buffer = buffer;
        n.loop = seconds === 2;
        n.connect(destination || gain);
        s.track(n);
        n.start(at ?? ctx.currentTime);
        if (!n.loop) n.stop((at ?? ctx.currentTime) + seconds);
        return n;
      },
      drum(kind, when) {
        if (!playing) return;
        if (kind === 0) s.tone(150, 0.25, 'sine', when, 0.8, { endFrequency: 40 });
        else if (kind === 3) {
          s.tone(530, 0.16, 'triangle', when, 0.25);
          s.tone(802, 0.15, 'sine', when, 0.2);
        } else {
          const filter = ctx.createBiquadFilter(),
            env = ctx.createGain();
          filter.type = kind === 1 ? 'bandpass' : 'highpass';
          filter.frequency.value = kind === 1 ? 1600 : 6500;
          env.gain.setValueAtTime(0.0001, when);
          env.gain.linearRampToValueAtTime(kind === 1 ? 0.6 : 0.3, when + 0.005);
          env.gain.exponentialRampToValueAtTime(0.0001, when + (kind === 1 ? 0.18 : 0.07));
          filter.connect(env);
          env.connect(gain);
          const n = s.noise('white', filter, when, 0.22);
          if (!n) {
            filter.disconnect();
            env.disconnect();
            return;
          }
          n.addEventListener(
            'ended',
            () => {
              filter.disconnect();
              env.disconnect();
            },
            { once: true }
          );
        }
      },
      data(kind = 'frequency') {
        if (!analyser) return new Uint8Array(512).fill(kind === 'time' ? 128 : 0);
        const d = new Uint8Array(kind === 'time' ? analyser.fftSize : analyser.frequencyBinCount);
        kind === 'time' ? analyser.getByteTimeDomainData(d) : analyser.getByteFrequencyData(d);
        return d;
      },
      rms() {
        const d = s.data('time');
        return Math.sqrt(d.reduce((sum, v) => sum + ((v - 128) / 128) ** 2, 0) / d.length);
      },
      _tick() {
        if (!playing) return;
        if (a.paused || a.suspended || !visible || document.hidden || !a.root.isConnected) {
          s.stop();
          return;
        }
        if (scheduler) {
          let budget = 0;
          while (next < ctx.currentTime + 0.07 && budget++ < 4) {
            const job = scheduler;
            job.fn(next, step++);
            if (!playing || scheduler !== job) break;
            const period = typeof job.period === 'function' ? job.period() : job.period;
            next += Math.max(0.045, period);
          }
          if (next < ctx.currentTime - 0.2) next = ctx.currentTime + 0.02;
        }
      }
    };
    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0].isIntersecting;
        if (!visible) s.stop();
      },
      { threshold: 0.01 }
    );
    io.observe(a.root);
    a.cleanup(() => {
      disposed = true;
      s.stop();
      io.disconnect();
      if (gain) gain.disconnect();
      if (analyser) analyser.disconnect();
      scopes.delete(s);
    });
    scopes.add(s);
    return s;
  }
  function tick() {
    if (current) current._tick();
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) silence();
  });
  window.addEventListener('pagehide', silence);
  function mute(value) {
    muted = value;
    if (master && ctx) master.gain.setTargetAtTime(value ? 0 : 0.16, ctx.currentTime, 0.025);
    if (value) silence();
  }
  return {
    scope,
    silence,
    mute,
    get muted() {
      return muted;
    },
    get state() {
      return {
        created: !!ctx,
        contextState: ctx?.state || 'not-created',
        playing: !!current,
        activeScopes: scopes.size,
        rms: current ? current.rms() : 0
      };
    }
  };
})();
