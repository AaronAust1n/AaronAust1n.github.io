/* Helpers for the new wings; the original 100 effect functions remain unchanged. */
window.MuseumExpansion = (() => {
  const M = Museum;
  function shell(a, bg, markup) {
    a.background(bg);
    a.html(markup);
    return a.root;
  }
  function onClick(a, fn) {
    a.on(a.root, 'click', (e) => {
      if (!e.target.closest('input,select,textarea')) {
        fn(e);
        a.repaint();
      }
    });
  }
  function ease(p) {
    return 1 - Math.pow(1 - M.clamp(p), 3);
  }
  function button(a, label, fn) {
    const b = document.createElement('button');
    b.className = 'nx-action';
    b.textContent = label;
    a.root.append(b);
    a.on(b, 'click', (e) => {
      e.stopPropagation();
      fn(e);
      a.repaint();
    });
    return b;
  }
  function pointerDrag(a, handle, { start = () => {}, move = () => {}, end = () => {} }) {
    let active = null;
    a.on(handle, 'pointerdown', (e) => {
      if (e.button !== 0) return;
      active = e.pointerId;
      handle.setPointerCapture(e.pointerId);
      if (start(e) === false) {
        active = null;
        handle.releasePointerCapture(e.pointerId);
      }
    });
    a.on(handle, 'pointermove', (e) => {
      if (active === e.pointerId) move(e);
    });
    for (const event of ['pointerup', 'pointercancel', 'lostpointercapture'])
      a.on(handle, event, (e) => {
        if (active === e.pointerId) {
          active = null;
          end(e, event !== 'pointerup');
          a.repaint();
        }
      });
  }
  function spot(el, e) {
    const r = el.getBoundingClientRect();
    return { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height };
  }
  function pick(list) {
    return list[Math.floor(Math.random() * list.length)];
  }
  function reduced() {
    return document.body.classList.contains('reduce-motion');
  }
  return { shell, onClick, ease, button, pointerDrag, spot, pick, reduced };
})();
