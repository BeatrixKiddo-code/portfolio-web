(() => {
 const dialog=document.querySelector('#certificate-dialog');if(!dialog||!dialog.showModal)return;
 const image=dialog.querySelector('[data-certificate-image]'),title=dialog.querySelector('h2'),previous=dialog.querySelector('[data-cert-prev]'),next=dialog.querySelector('[data-cert-next]'),counter=dialog.querySelector('[data-cert-counter]');
 let pages=[],index=0,opener=null;
 function render(){image.src=pages[index];image.alt=title.textContent+(pages.length>1?`, strana ${index+1}`:'');counter.textContent=`${index+1} / ${pages.length}`;previous.disabled=index===0;next.disabled=index===pages.length-1;dialog.querySelector('.dialog-pager').hidden=pages.length<2;}
 document.querySelectorAll('[data-certificates]').forEach(link=>link.addEventListener('click',e=>{e.preventDefault();pages=link.dataset.certificates.split(',');index=0;opener=link;title.textContent=link.dataset.certificateTitle||'Certifikát';render();dialog.showModal();}));
 dialog.querySelector('[data-close-cert]').addEventListener('click',()=>dialog.close());
 previous.addEventListener('click',()=>{if(index>0){index--;render();}});next.addEventListener('click',()=>{if(index<pages.length-1){index++;render();}});
 dialog.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'&&index>0){index--;render();}if(e.key==='ArrowRight'&&index<pages.length-1){index++;render();}});
 dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
 dialog.addEventListener('close',()=>opener?.focus());
})();
