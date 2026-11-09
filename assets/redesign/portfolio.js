(() => {
  'use strict';
  const dialog=document.querySelector('.case-dialog');
  const dialogImage=dialog?.querySelector('img');
  const title=dialog?.querySelector('#case-dialog-title');
  let opener=null;
  if(dialog && typeof dialog.showModal==='function') {
    document.querySelectorAll('[data-case-zoom]').forEach(button=>{
      button.addEventListener('click',()=>{
        opener=button;
        dialogImage.src=button.dataset.image;
        dialogImage.alt='Zvětšený náhled projektu '+button.dataset.title;
        title.textContent=button.dataset.title;
        dialog.showModal();
      });
    });
    dialog.querySelector('.case-dialog-close').addEventListener('click',()=>dialog.close());
    dialog.addEventListener('click',event=>{
      if(event.target===dialog){
        const box=dialog.getBoundingClientRect();
        if(event.clientX<box.left || event.clientX>box.right || event.clientY<box.top || event.clientY>box.bottom)dialog.close();
      }
    });
    dialog.addEventListener('close',()=>opener?.focus());
  } else {
    document.querySelectorAll('[data-case-zoom]').forEach(button=>button.addEventListener('click',()=>window.open(button.dataset.image,'_blank','noopener')));
  }
  const index=document.querySelector('[data-case-index]');
  if(index && 'IntersectionObserver' in window) {
    const links=[...index.querySelectorAll('a')];
    const sections=[...document.querySelectorAll('.case-chapter')];
    const visible=new Map();
    const observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>visible.set(entry.target.id,entry));
      const active=sections.filter(section=>visible.get(section.id)?.isIntersecting).at(-1);
      links.forEach(link=>{
        if(active && link.getAttribute('href')==='#'+active.id)link.setAttribute('aria-current','location');
        else link.removeAttribute('aria-current');
      });
    },{rootMargin:'-12% 0px -55% 0px',threshold:0});
    sections.forEach(section=>observer.observe(section));
  }
})();
