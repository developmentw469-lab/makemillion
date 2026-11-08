const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
$('#yr').textContent=new Date().getFullYear();

/* Theme toggle (remembered) */
const root=document.documentElement;
try{const t=localStorage.getItem('theme');if(t)root.dataset.theme=t}catch(e){}
$('#theme').onclick=()=>{const d=root.dataset.theme==='dark'?'light':'dark';root.dataset.theme=d;try{localStorage.setItem('theme',d)}catch(e){}};

/* Mobile menu */
$('#burger').onclick=()=>$('#menu').classList.toggle('open');
$$('#menu a').forEach(a=>a.onclick=()=>$('#menu').classList.remove('open'));

/* Scroll progress, back to top, active link */
const secs=$$('section[id]'),links=$$('#menu a:not(.btn)');
addEventListener('scroll',()=>{
  const h=document.documentElement,p=h.scrollTop/(h.scrollHeight-h.clientHeight)*100;
  $('#progress').style.width=p+'%';
  $('#top').classList.toggle('show',h.scrollTop>600);
  let cur='';secs.forEach(s=>{if(s.offsetTop-120<=h.scrollTop)cur=s.id});
  links.forEach(a=>a.classList.toggle('on',a.hash==='#'+cur));
},{passive:true});
$('#top').onclick=()=>scrollTo({top:0,behavior:'smooth'});

/* Typing headline */
const words=['grow your business.','look sharp on every screen.','load in a blink.','turn visitors into customers.'];
let wi=0,ci=0,del=false;
(function type(){
  const w=words[wi];ci+=del?-1:1;$('#typed').textContent=w.slice(0,ci);
  let t=del?35:70;
  if(!del&&ci===w.length){del=true;t=1600}else if(del&&ci===0){del=false;wi=(wi+1)%words.length;t=300}
  setTimeout(type,t);
})();

/* Live code editor + preview */
const lines=['<nav class="top"></nav>','<h1>Your brand</h1>','<p>Fast. Clean. Built to sell.</p>','<button>Get started</button>','<section class="cards"></section>'];
const items=$$('.p-item');let li=0;
(function build(){
  const el=$('#code');
  if(li>=lines.length){setTimeout(()=>{el.textContent='';items.forEach(i=>i.classList.remove('show'));li=0;build()},3500);return}
  const txt=lines[li];let c=0;
  const iv=setInterval(()=>{
    el.textContent=lines.slice(0,li).join('\n')+(li?'\n':'')+txt.slice(0,++c);
    if(c>=txt.length){clearInterval(iv);if(items[li-1])items[li-1].classList.add('show');if(li===lines.length-1)items[items.length-1].classList.add('show');li++;setTimeout(build,350)}
  },35);
})();

/* Scroll reveal */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.15});
$$('section:not(.hero) h2,.grid article,.steps li,.stats div').forEach(e=>{e.classList.add('rv');io.observe(e)});

/* Counters */
const co=new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting)return;co.unobserve(e.target);
  const n=+e.target.dataset.count;let s=0;const step=Math.max(1,n/60);
  const iv=setInterval(()=>{s+=step;if(s>=n){s=n;clearInterval(iv)}e.target.textContent=Math.round(s)},25);
}),{threshold:.6});
$$('[data-count]').forEach(b=>co.observe(b));

/* Portfolio filter */
$$('.filters button').forEach(b=>b.onclick=()=>{
  $$('.filters button').forEach(x=>x.classList.remove('active'));b.classList.add('active');
  $$('.work article').forEach(a=>a.classList.toggle('hide',b.dataset.f!=='all'&&a.dataset.c!==b.dataset.f));
});

/* Pricing toggle */
$('#bill').onclick=e=>{
  const m=e.target.classList.toggle('on');
  $$('.amt b').forEach(b=>b.textContent=m?b.dataset.month:b.dataset.once);
  $$('.u').forEach(u=>u.textContent=m?'per month':'one time');
};

/* Testimonials slider */
const rev=[['Our enquiries doubled in the first month. The site is fast and looks exactly like our brand.','Ayesha K., Clinic owner'],['They explained every step in simple words and delivered a week early.','Hamza R., Restaurant owner'],['The booking system saved us hours every day. Support is always quick.','Bilal S., Salon owner'],['Best agency we have worked with. Clean code and great communication.','Sara M., Startup founder']];
let ri=0,auto;
$('#dots').innerHTML=rev.map((_,i)=>`<i data-i="${i}"></i>`).join('');
function show(i){
  ri=(i+rev.length)%rev.length;const q=$('#quote');q.style.opacity=0;
  setTimeout(()=>{q.innerHTML=`<p>“${rev[ri][0]}”</p><b>${rev[ri][1]}</b>`;q.style.opacity=1},250);
  $$('#dots i').forEach((d,k)=>d.classList.toggle('on',k===ri));
}
const reset=()=>{clearInterval(auto);auto=setInterval(()=>show(ri+1),5000)};
$('#next').onclick=()=>{show(ri+1);reset()};$('#prev').onclick=()=>{show(ri-1);reset()};
$$('#dots i').forEach(d=>d.onclick=()=>{show(+d.dataset.i);reset()});
show(0);reset();

/* FAQ accordion */
$$('.q button').forEach(b=>b.onclick=()=>{
  const q=b.parentElement,open=q.classList.contains('open');
  $$('.q').forEach(x=>x.classList.remove('open'));if(!open)q.classList.add('open');
});

/* Contact form validation */
$('#form').addEventListener('submit',e=>{
  e.preventDefault();const f=e.target;let ok=true;
  const chk=(el,bad,msg)=>{const m=el.parentElement.querySelector('em');el.classList.toggle('bad',bad);m.textContent=bad?msg:'';if(bad)ok=false};
  chk(f.name,f.name.value.trim().length<2,'Enter your name.');
  chk(f.email,!/^\S+@\S+\.\S+$/.test(f.email.value),'Enter a valid email address.');
  chk(f.msg,f.msg.value.trim().length<10,'Write at least 10 characters.');
  if(ok){f.reset();$('#ok').hidden=false;setTimeout(()=>$('#ok').hidden=true,5000)}
});
