(() => {
 'use strict';
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 const menu=document.querySelector('.menu-button'),nav=document.querySelector('.main-nav');
 const closeMenu=()=>{if(menu&&nav){menu.setAttribute('aria-expanded','false');nav.classList.remove('is-open');}};
 if(menu&&nav){
   menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('is-open',open);});
   nav.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
   document.addEventListener('click',e=>{if(!e.target.closest('.header-inner'))closeMenu();});
   document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){closeMenu();menu.focus();}});
   matchMedia('(max-width:900px)').addEventListener('change',closeMenu);
   nav.querySelectorAll('a').forEach(a=>{const url=new URL(a.href);if(!url.hash&&url.pathname.replace(/index\.html$/,'')===location.pathname.replace(/index\.html$/,''))a.setAttribute('aria-current','page');});
 }
 document.querySelectorAll('[data-year]').forEach(e=>e.textContent=new Date().getFullYear());
 const animations=new Set();
 const finish=()=>{animations.forEach(a=>a.finish());animations.clear();};
 document.addEventListener('keydown',()=>{document.documentElement.classList.add('using-keyboard');finish();});
 document.addEventListener('pointerdown',()=>document.documentElement.classList.remove('using-keyboard'));
 reduce.addEventListener('change',()=>{if(reduce.matches)finish();scheduleProgress();});
 if('IntersectionObserver' in window){
   const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{if(!entry.isIntersecting)return;observer.unobserve(entry.target);
     if(reduce.matches||document.documentElement.classList.contains('using-keyboard')||!entry.target.animate)return;
     const panel=entry.target.hasAttribute('data-panel-reveal');
     const frames=panel?[{clipPath:'inset(10% 0 0 0)',opacity:.7},{clipPath:'inset(0 0 0 0)',opacity:1}]:[{transform:'translateY(20px)',opacity:.55},{transform:'translateY(0)',opacity:1}];
     const a=entry.target.animate(frames,{duration:panel?680:560,easing:'cubic-bezier(.22,.61,.36,1)'});
     animations.add(a);a.onfinish=()=>animations.delete(a);
    });
   },{threshold:.12,rootMargin:'0px 0px -6% 0px'});
   document.querySelectorAll('[data-enter],[data-panel-reveal]').forEach(e=>observer.observe(e));
 }
 let progressFrame=0;
 const progressBars=[...document.querySelectorAll('[data-reading-progress]')];
 const readingBody=document.querySelector('[data-reading-body]');
 const timelines=[...document.querySelectorAll('[data-progress-steps]')];
 function scheduleProgress(){if(!progressFrame)progressFrame=requestAnimationFrame(updateProgress);}
 function updateProgress(){
  progressFrame=0;
  if(readingBody&&progressBars.length){const r=readingBody.getBoundingClientRect();const distance=Math.max(1,r.height-innerHeight*.6);const p=Math.min(1,Math.max(0,(innerHeight*.2-r.top)/distance));progressBars.forEach(e=>e.style.transform=`scaleX(${p})`);}
  timelines.forEach(t=>{
   const points=[...t.querySelectorAll('[data-step-point]')];const base=t.querySelector('.timeline-base'),fill=t.querySelector('.timeline-fill');if(points.length<2||!base||!fill)return;
   const parent=t.getBoundingClientRect(),first=points[0].getBoundingClientRect(),last=points.at(-1).getBoundingClientRect();
   const start=first.top+first.height/2,end=last.top+last.height/2,anchor=innerHeight*.64,p=reduce.matches?1:Math.min(1,Math.max(0,(anchor-start)/Math.max(1,end-start)));
   [base,fill].forEach(e=>{e.style.top=`${start-parent.top}px`;e.style.left=`${first.left+first.width/2-parent.left}px`;e.style.height=`${Math.max(1,end-start)}px`;});fill.style.transform=`scaleY(${p})`;
   points.forEach(point=>point.closest('[data-step]').classList.toggle('is-reached',reduce.matches||point.getBoundingClientRect().top<=anchor));
  });
 }
 if(readingBody||timelines.length){addEventListener('scroll',scheduleProgress,{passive:true});addEventListener('resize',scheduleProgress,{passive:true});document.fonts?.ready.then(scheduleProgress);addEventListener('load',scheduleProgress);scheduleProgress();}
 document.querySelectorAll('form[data-ajax-form]').forEach(form=>{
  form.addEventListener('submit',async e=>{
   if(!window.fetch||!window.FormData)return;e.preventDefault();if(!form.reportValidity())return;
   const button=form.querySelector('button[type=submit]'),status=form.querySelector('.form-status');if(!button||!status)return;
   button.disabled=true;form.setAttribute('aria-busy','true');status.removeAttribute('data-error');status.textContent='Odesílám vaši zprávu…';
   const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),20000);
   try{const response=await fetch(form.action,{method:'POST',body:new FormData(form),headers:{Accept:'application/json'},signal:controller.signal});if(!response.ok)throw new Error('Submission failed');
    if(form.dataset.successUrl){location.assign(form.dataset.successUrl);return;}status.textContent='Děkuji za zprávu, ozvu se vám na uvedený e-mail.';form.reset();
   }catch{status.dataset.error='';status.innerHTML='Odeslání se nepodařilo potvrdit. Zkuste to znovu nebo napište na <a href="mailto:zaneta.janacova@gmail.com">zaneta.janacova@gmail.com</a>. Vaše zpráva zůstala vyplněná.';}
   finally{clearTimeout(timeout);button.disabled=false;form.removeAttribute('aria-busy');}
  });
 });
 // Load analytics only on the production domain after consent.
 const panel=document.querySelector('[data-consent-panel]');
 if(panel){
  const production=/^(www\.)?zjanacova\.cz$/.test(location.hostname);
  const measurementId='G-29FCKKCGYR',disableKey='ga-disable-'+measurementId;
  let consent=null,settingsOpener=null,analyticsScript=null,analyticsReady=false,configured=false;
  try{const saved=localStorage.getItem('cookie-consent');if(saved==='accepted'||saved==='declined')consent=saved;}catch{}
  function gtag(){window.dataLayer.push(arguments);}
  if(production){
   window[disableKey]=true;
   window.dataLayer=window.dataLayer||[];
   window.gtag=gtag;
   gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
  }
  function clearAnalyticsCookies(){
   const names=document.cookie.split(';').map(cookie=>cookie.trim().split('=')[0]).filter(name=>/^_ga(?:_|$)/.test(name));
   const paths=new Set(['/']);let current='';
   location.pathname.split('/').filter(Boolean).forEach(part=>{current+='/'+part;paths.add(current);paths.add(current+'/');});
   const rootHost=location.hostname.replace(/^www\./,''),domains=new Set(['',location.hostname,'.'+location.hostname,rootHost,'.'+rootHost]);
   names.forEach(name=>paths.forEach(path=>domains.forEach(domain=>{
    document.cookie=name+'=; Max-Age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; path='+path+(domain?'; domain='+domain:'')+(location.protocol==='https:'?'; Secure':'')+'; SameSite=Lax';
   })));
  }
  function configureAnalytics(){
   // An in-flight download may finish after the visitor has withdrawn consent.
   if(!production||consent!=='accepted'||window[disableKey]||!analyticsReady||configured)return;
   configured=true;
   gtag('js',new Date());
   gtag('config',measurementId,{cookie_flags:'SameSite=None;Secure'});
  }
  function loadAnalytics(){
   if(!production||consent!=='accepted')return;
   if(analyticsReady){configureAnalytics();return;}
   if(analyticsScript)return;
   const script=document.createElement('script');analyticsScript=script;
   script.async=true;script.dataset.siteAnalytics='';
   script.src='https://www.googletagmanager.com/gtag/js?id='+measurementId;
   script.onload=()=>{analyticsReady=true;configureAnalytics();};
   script.onerror=()=>{script.remove();analyticsScript=null;analyticsReady=false;};
   document.head.appendChild(script);
  }
  function applyConsent(value){
   consent=value;
   if(!production)return;
   const accepted=value==='accepted';
   window[disableKey]=!accepted;
   gtag('consent','update',{analytics_storage:accepted?'granted':'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
   if(accepted)loadAnalytics();else clearAnalyticsCookies();
  }
  function closePanel(){panel.hidden=true;settingsOpener?.focus();settingsOpener=null;}
  document.querySelectorAll('[data-consent-settings]').forEach(button=>{
   button.hidden=false;
   button.addEventListener('click',event=>{event.preventDefault();settingsOpener=button;panel.hidden=false;panel.querySelector('[data-consent]')?.focus();});
  });
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&settingsOpener&&!panel.hidden)closePanel();});
  panel.querySelectorAll('[data-consent]').forEach(button=>button.addEventListener('click',()=>{
   const value=button.dataset.consent;if(value!=='accepted'&&value!=='declined')return;
   try{localStorage.setItem('cookie-consent',value);}catch{}
   applyConsent(value);closePanel();
  }));
  window.addEventListener('storage',event=>{
   if(event.key==='cookie-consent'&&(event.newValue==='accepted'||event.newValue==='declined')){applyConsent(event.newValue);panel.hidden=true;}
  });
  if(production){applyConsent(consent);if(!consent)panel.hidden=false;}
 }
})();
