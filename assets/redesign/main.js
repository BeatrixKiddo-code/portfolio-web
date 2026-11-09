(() => {
  'use strict';
  const reveal = document.querySelector('[data-reveal-hover]');
  const toggle = document.querySelector('.reveal-toggle');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const state = { x: 0, y: 0, tx: 0, ty: 0, radius: 0, tr: 0, cx: 0, cy: 0, inside: false, frame: 0 };
  let revealBounds = null;
  const schedule = () => { if (!state.frame) state.frame = requestAnimationFrame(tick); };
  function tick() {
    state.frame = 0;
    state.x += (state.tx - state.x) * (reduce.matches ? 1 : .1);
    state.y += (state.ty - state.y) * (reduce.matches ? 1 : .1);
    state.radius += (state.tr - state.radius) * (reduce.matches ? 1 : .14);
    reveal.style.setProperty('--reveal-x', state.x.toFixed(2) + 'px');
    reveal.style.setProperty('--reveal-y', state.y.toFixed(2) + 'px');
    reveal.style.setProperty('--reveal-radius', state.radius.toFixed(2) + 'px');
    if (Math.abs(state.tx - state.x) > .1 || Math.abs(state.ty - state.y) > .1 || Math.abs(state.tr - state.radius) > .1) schedule();
  }
  function target(cx, cy) {
    state.cx = cx; state.cy = cy;
    if (!revealBounds) revealBounds = reveal.getBoundingClientRect();
    state.tx = cx - revealBounds.left;
    state.ty = cy - revealBounds.top;
  }
  function show(event) {
    if (!fine.matches || reveal.classList.contains('is-pinned')) return;
    target(event.clientX, event.clientY);
    if (!state.inside && state.radius < .5) { state.x = state.tx; state.y = state.ty; }
    state.inside = true;
    state.tr = Math.min(300, Math.max(140, reveal.clientWidth * .27));
    schedule();
  }
  function hide() { state.inside = false; state.tr = 0; schedule(); }
  reveal.addEventListener('pointerenter', show);
  reveal.addEventListener('pointermove', show);
  reveal.addEventListener('pointerleave', hide);
  reveal.addEventListener('pointercancel', hide);
  window.addEventListener('blur', hide);
  document.addEventListener('visibilitychange', () => { if (document.hidden) hide(); });
  const updateBounds = () => {
    revealBounds = null;
    if (state.inside) { target(state.cx, state.cy); schedule(); }
  };
  window.addEventListener('scroll', updateBounds, { passive: true });
  window.addEventListener('resize', updateBounds, { passive: true });
  new ResizeObserver(updateBounds).observe(reveal);
  fine.addEventListener('change', () => { hide(); revealBounds = null; });
  function pin(pinned) {
    reveal.classList.toggle('is-pinned', pinned);
    toggle.setAttribute('aria-pressed', String(pinned));
    toggle.innerHTML = pinned ? 'Vrátit strukturu <span aria-hidden="true">−</span>' : 'Odhalit celý web <span aria-hidden="true">+</span>';
    hide();
  }
  // Visitors who never move the pointer over the wireframe still get to see the finished site.
  let autoStart = 0, autoPin = 0;
  function cancelAuto() { clearTimeout(autoStart); clearTimeout(autoPin); autoStart = autoPin = 0; }
  toggle.addEventListener('click', () => { cancelAuto(); pin(!reveal.classList.contains('is-pinned')); });
  reveal.addEventListener('pointerenter', cancelAuto);
  autoStart = setTimeout(() => {
    autoStart = 0;
    if (!fine.matches || reveal.classList.contains('is-pinned')) return;
    if (reduce.matches) { pin(true); return; }
    const box = reveal.getBoundingClientRect();
    state.x = state.tx = box.width * .5;
    state.y = state.ty = box.height * .5;
    state.tr = Math.hypot(box.width, box.height) * 1.3;
    schedule();
    autoPin = setTimeout(() => { autoPin = 0; pin(true); }, 1400);
  }, 2400);

  // Pointer-driven 3D tilt of the hero screen. Decorative: fine pointers only, off for reduced motion.
  const tilt = { rx: 0, ry: 0, trx: 0, try: 0, frame: 0 };
  function tiltTick() {
    tilt.frame = 0;
    tilt.rx += (tilt.trx - tilt.rx) * .12;
    tilt.ry += (tilt.try - tilt.ry) * .12;
    const moving = Math.abs(tilt.trx - tilt.rx) > .01 || Math.abs(tilt.try - tilt.ry) > .01;
    const flat = !moving && !tilt.trx && !tilt.try;
    reveal.style.transform = flat ? '' : 'perspective(1400px) rotateX(' + tilt.rx.toFixed(3) + 'deg) rotateY(' + tilt.ry.toFixed(3) + 'deg)';
    if (moving) tilt.frame = requestAnimationFrame(tiltTick);
  }
  function tiltTo(event) {
    if (!fine.matches || reduce.matches) return;
    if (!revealBounds) revealBounds = reveal.getBoundingClientRect();
    const px = Math.min(1, Math.max(0, (event.clientX - revealBounds.left) / revealBounds.width)) - .5;
    const py = Math.min(1, Math.max(0, (event.clientY - revealBounds.top) / revealBounds.height)) - .5;
    tilt.try = px * 5;
    tilt.trx = py * -3.5;
    if (!tilt.frame) tilt.frame = requestAnimationFrame(tiltTick);
  }
  function tiltReset() { tilt.trx = 0; tilt.try = 0; if (!tilt.frame) tilt.frame = requestAnimationFrame(tiltTick); }
  reveal.addEventListener('pointermove', tiltTo);
  reveal.addEventListener('pointerleave', tiltReset);
  reveal.addEventListener('pointercancel', tiltReset);
  window.addEventListener('blur', tiltReset);
  reduce.addEventListener('change', tiltReset);

  const entrances = [];
  function finishEntrances() { entrances.forEach(animation => animation.finish()); }
  document.addEventListener('keydown', () => {
    document.documentElement.classList.add('using-keyboard');
    finishEntrances();
  });
  document.addEventListener('pointerdown', () => document.documentElement.classList.remove('using-keyboard'));
  reduce.addEventListener('change', () => { if (reduce.matches) finishEntrances(); });
  if (!reduce.matches && typeof Element.prototype.animate === 'function') {
    document.querySelectorAll('.hero-line > span').forEach((line, index) => {
      entrances.push(line.animate([
        { transform: 'translateY(22%)', opacity: 0 },
        { transform: 'translateY(0)', opacity: 1 }
      ], { duration: 650, delay: index * 65, easing: 'cubic-bezier(.23,1,.32,1)', fill: 'backwards' }));
    });
    entrances.push(reveal.animate([
      { clipPath: 'inset(0 3% 0 3%)', opacity: .65, transform: 'perspective(1400px) rotateX(11deg) scale(.96)' },
      { clipPath: 'inset(0 0 0 0)', opacity: 1, transform: 'perspective(1400px) rotateX(0deg) scale(1)' }
    ], { duration: 900, delay: 100, easing: 'cubic-bezier(.23,1,.32,1)', fill: 'backwards' }));
  }


  const form=document.querySelector('#contact-form');
  const status=form.querySelector('.form-status');
  form.addEventListener('submit',async(event)=>{
    if(!window.fetch || !window.FormData) return;
    event.preventDefault();
    if(!form.reportValidity()) return;
    const submit=form.querySelector('button[type=submit]');
    submit.disabled=true; form.setAttribute('aria-busy','true');status.removeAttribute('data-error');status.textContent='Odesílám vaši zprávu…';
    const controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(),20000);
    try{
      const response=await fetch(form.action,{method:'POST',body:new FormData(form),headers:{Accept:'application/json'},signal:controller.signal});
      if(!response.ok) throw new Error('Form submission failed');
      status.textContent='Děkuji za zprávu. Ozvu se vám na uvedený e-mail.';
      form.reset();
    }catch(error){
      status.setAttribute('data-error','');
      status.innerHTML='Odeslání se nepodařilo potvrdit. Zkuste to znovu nebo napište na <a href="mailto:zaneta.janacova@gmail.com">zaneta.janacova@gmail.com</a>. Vaše zpráva zůstala vyplněná.';
    }finally{clearTimeout(timeout);submit.disabled=false;form.removeAttribute('aria-busy');}
  });
})();

