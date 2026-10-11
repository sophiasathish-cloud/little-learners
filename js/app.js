const KEY='kids-learning-app-settings-v1',$=s=>document.querySelector(s);
let D,S={lang:'en',level:1,sound:true,reduce:false,done:[]};
const rnd=a=>a[Math.random()*a.length|0],shuf=a=>[...a].sort(()=>Math.random()-.5);
const t=k=>(D.ui[k]&&(D.ui[k][S.lang]||D.ui[k].en))||'';
const L=o=>typeof o=='string'?o:(o[S.lang]||o.en||'');
const vl=()=>S.lang=='ta'?'ta-IN':'en-IN';
function load(){try{const o=JSON.parse(localStorage.getItem(KEY));if(o&&typeof o=='object')S={...S,...o}}catch(e){}
 if(!['en','ta'].includes(S.lang))S.lang='en';if(![1,2].includes(S.level))S.level=1;if(!Array.isArray(S.done))S.done=[];S.done=S.done.filter(x=>typeof x=='string')}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
function say(txt,lang){if(!S.sound||!('speechSynthesis'in window)||!txt)return;try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(txt);u.lang=lang;u.rate=.8;speechSynthesis.speak(u)}catch(e){}}
function h(tag,a,...kids){const e=document.createElement(tag);for(const k in a||{}){if(k=='on')for(const v in a.on)e.addEventListener(v,a.on[v]);else e.setAttribute(k,a[k])}e.append(...kids.flat());return e}
const btn=(txt,fn,cls='')=>h('button',{class:'btn '+cls,type:'button',on:{click:fn}},txt);
const go=p=>{location.hash=p};
const item=r=>r.length==3?{k:r[0],e:r[1],n:{en:r[2],ta:r[2]},sp:'en-IN'}:{k:r[0],e:r[1],n:{ta:r[2],en:r[3]},sp:'ta-IN'};
const spk=i=>say(i.sp=='ta-IN'?(i.k?i.k+'. ':'')+i.n.ta:i.k+'. '+i.n.en,i.sp);
const pool=n=>D.pools[n].map(item);
function shell(title,back,...body){$('#app').replaceChildren(h('div',{class:'bar'},btn('🏠 '+t('home'),()=>go('/home'),'alt'),h('h1',{},title),back?btn('⬅ '+t('back'),back,'alt'):''),...body)}
function langBtn(){return btn(S.lang=='en'?'தமிழ்':'English',()=>{S.lang=S.lang=='en'?'ta':'en';save();route()},'alt')}
function welcome(){$('#app').replaceChildren(h('div',{class:'panel',style:'text-align:center'},h('div',{class:'big'},'📚'),h('h1',{},'Little Learners – தமிழ் & English'),h('div',{class:'row'},langBtn()),h('p',{},t('offline')),btn(t('start'),()=>{S.seen=1;save();go('/home')},'go')))}
function home(){const tot=D.cats.reduce((n,c)=>n+c.acts.length,0);
 $('#app').replaceChildren(h('div',{class:'bar'},h('h1',{},'📚 '+t('title')),h('div',{class:'row'},langBtn(),btn('👨‍👩‍👧 '+t('parent'),()=>go('/parent'),'alt'))),
 h('div',{class:'grid'},D.cats.map(c=>h('button',{class:'card',type:'button',on:{click:()=>go('/cat/'+c.id)}},h('span',{class:'ic','aria-hidden':'true'},c.icon),L(c.name)))),
 h('p',{class:'msg'},`⭐ ${S.done.length} / ${tot}`))}
function cat(id){const c=D.cats.find(x=>x.id==id);if(!c)return go('/home');
 shell(L(c.name),()=>go('/home'),h('div',{class:'grid'},c.acts.map(a=>h('button',{class:'card'+(S.done.includes(a.id)?' done':''),type:'button',on:{click:()=>go('/act/'+a.id)}},L(a.title)))))}
const act=id=>D.cats.flatMap(c=>c.acts.map(a=>({...a,cat:c.id}))).find(a=>a.id==id);
const finish=a=>{if(!S.done.includes(a.id)){S.done.push(a.id);save()}};
function learn(a){const P=pool(a.pool);let i=0;const draw=()=>{const x=P[i];spk(x);
 shell(L(a.title),()=>go('/cat/'+a.cat),h('div',{class:'big pop','aria-hidden':'true'},x.e),x.k?h('div',{class:'mid'},x.k+(a.pool=='abc'?' '+x.k.toLowerCase():'')):'',h('div',{class:'mid'},L(x.n)),
 h('div',{class:'row'},btn('🔊 '+t('listen'),()=>spk(x)),btn('⬅ '+t('prev'),()=>{i=(i+P.length-1)%P.length;draw()},'alt'),btn(t('next')+' ➡',()=>{if(i==P.length-1){finish(a);go('/cat/'+a.cat)}else{i++;draw()}},'go')),h('p',{class:'msg'},`${i+1} / ${P.length}`))};draw()}
function runQ(a,gen,N=5){let n=0;const next=()=>{if(n>=N){finish(a);return shell(L(a.title),()=>go('/cat/'+a.cat),h('div',{class:'big'},'🎉'),h('p',{class:'msg'},t('finished')),h('div',{class:'row'},btn(t('replay'),()=>runQ(a,gen,N)),btn(t('back'),()=>go('/cat/'+a.cat),'alt')))}
 const q=gen(),msg=h('p',{class:'msg',role:'status','aria-live':'polite'},'');
 const opts=h('div',{class:'opts'},q.opts.map(o=>{const b=h('button',{class:'opt',type:'button','aria-label':o.label||'',on:{click:()=>{if(o.ok){b.classList.add('ok');msg.textContent='✓ '+t('good');say(t('good'),vl());n++;setTimeout(next,900)}else{b.classList.add('bad');b.disabled=true;msg.textContent='✗ '+t('again')}}}},o.v);return b}));
 shell(L(a.title),()=>go('/cat/'+a.cat),h('p',{class:'msg'},`${n+1} / ${N}`),h('div',{class:'mid pop'},q.p),h('div',{class:'row'},q.sp?btn('🔊 '+t('listen'),q.sp,'alt'):''),opts,msg,h('div',{class:'row'},q.hint?btn('💡 '+t('hint'),()=>{msg.textContent=q.hint},'alt'):''));q.sp?.()};next()}
function quiz(a){const P=pool(a.pool),k=S.level==1?2:3;
 runQ(a,()=>{const x=rnd(P),o=shuf([x,...shuf(P.filter(y=>y!=x)).slice(0,k-1)]);
  if(a.mode=='e')return{p:x.e,sp:()=>spk(x),hint:L(x.n)[0]+'…',opts:o.map(y=>({v:L(y.n),label:L(y.n),ok:y==x}))};
  const p=a.mode=='k'&&x.k?x.k:L(x.n);return{p,sp:()=>spk(x),hint:x.e,opts:o.map(y=>({v:y.e,label:L(y.n),ok:y==x}))}})}
function count(a){const m=S.level==1?5:10;runQ(a,()=>{const n=1+Math.random()*m|0,e=rnd(['🍎','⭐','🐟','🎈','🐥']),o=new Set([n]);while(o.size<(S.level==1?2:3))o.add(1+Math.random()*m|0);
 return{p:e.repeat(n),sp:()=>say(t('count'),vl()),hint:'1, 2, 3…',opts:shuf([...o]).map(v=>({v:String(v),label:String(v),ok:v==n}))}})}
function seq(a){runQ(a,()=>{const s=1+Math.random()*(S.level==1?3:8)|0,ans=s+1+Math.random()*3|0,o=new Set([ans]);while(o.size<(S.level==1?2:3))o.add(Math.max(1,ans+(Math.random()*5|0)-2));
 return{p:[0,1,2,3,4].map(i=>s+i).map(v=>v==ans?'❓':v).join(' '),sp:()=>say(t('missing'),vl()),opts:shuf([...o]).map(v=>({v:String(v),label:String(v),ok:v==ans}))}})}
function memory(a){const P=shuf(pool(a.pool)).slice(0,S.level==1?3:4),cards=shuf([...P,...P].map(x=>({x}))),st={c:null,lock:false};let found=0;
 const grid=h('div',{class:'grid',style:'grid-template-columns:repeat(auto-fit,minmax(90px,1fr))'});
 cards.forEach(c=>{const b=h('button',{class:'mem',type:'button','aria-label':'card',on:{click:()=>{if(st.lock||b.classList.contains('up'))return;b.classList.add('up');b.textContent=c.x.e;spk(c.x);
  if(!st.c){st.c={c,b};return}const f=st.c;st.c=null;
  if(f.c.x==c.x){if(++found==P.length){finish(a);setTimeout(()=>shell(L(a.title),()=>go('/cat/'+a.cat),h('div',{class:'big'},'🎉'),h('p',{class:'msg'},t('finished')),h('div',{class:'row'},btn(t('replay'),()=>memory(a)))),700)}}
  else{st.lock=true;setTimeout(()=>{[f.b,b].forEach(z=>{z.classList.remove('up');z.textContent='❔'});st.lock=false},900)}}}},'❔');grid.append(b)});
 shell(L(a.title),()=>go('/cat/'+a.cat),h('p',{class:'msg'},t('match')),grid,h('div',{class:'row'},btn('🔄 '+t('replay'),()=>memory(a),'alt')))}
function parent(){let timer;const hold=h('button',{class:'btn go',type:'button'},'🔒 '+t('hold'));
 const start=()=>{timer=setTimeout(panel,3000)},stop=()=>clearTimeout(timer);
 hold.addEventListener('pointerdown',start);['pointerup','pointerleave','pointercancel'].forEach(e=>hold.addEventListener(e,stop));
 hold.addEventListener('keydown',e=>{if((e.key=='Enter'||e.key==' ')&&!e.repeat)start()});hold.addEventListener('keyup',stop);
 shell(t('parent'),()=>go('/home'),h('div',{class:'panel',style:'text-align:center'},hold));
 function panel(){const lv=h('select',{'aria-label':t('level'),on:{change:e=>{S.level=+e.target.value;save()}}},h('option',{value:1},t('l1')),h('option',{value:2},t('l2')));lv.value=S.level;
  const ck=(k,l)=>h('label',{},h('input',{type:'checkbox',...(S[k]?{checked:''}:{}),on:{change:e=>{S[k]=e.target.checked;document.body.classList.toggle('rm',S.reduce);save()}}}),' '+t(l));
  shell(t('parent'),()=>go('/home'),h('div',{class:'panel'},h('div',{class:'row'},langBtn()),h('label',{},t('level')+' ',lv),ck('sound','sound'),ck('reduce','motion'),h('p',{},`${t('done')}: ${S.done.length}`),btn(t('reset'),()=>{if(confirm(t('sure'))){S.done=[];save();panel()}},'alt'),h('p',{},t('privacy'))))}}
function route(){if(!D)return;const [,r,id]=location.hash.split('/');document.documentElement.lang=S.lang;
 try{if(!r)return S.seen?home():welcome();if(r=='home')return home();if(r=='cat')return cat(id);if(r=='parent')return parent();
 if(r=='act'){const a=act(id);if(!a)return go('/home');return({learn,quiz,count,seq,memory})[a.type](a)}go('/home')}
 catch(e){console.error(e);$('#app').replaceChildren(h('p',{class:'msg'},t('err')),btn('🏠',()=>go('/home')))}}
async function init(){load();document.body.classList.toggle('rm',S.reduce);try{D=await(await fetch('data/content.json')).json()}catch(e){$('#app').textContent='Please open the app once while online. / ஒருமுறை இணையத்தில் திறக்கவும்.';return}
 addEventListener('hashchange',route);route();
 if('serviceWorker'in navigator)navigator.serviceWorker.register('service-worker.js').catch(e=>console.warn('SW',e))}
init();
