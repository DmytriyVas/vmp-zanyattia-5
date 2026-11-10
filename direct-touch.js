'use strict';
Object.entries(COURSE_CATALOG[APP_LESSON].skills).forEach(([id,name])=>{const m=MISSIONS.find(m=>m.id===id);if(m)m.name=name});
const directBaseRender=renderGame;
function touchNote(text){return '<div class="touch-action-note"><span>◎</span><p>'+text+'</p></div>'}
function contactOn(el,done,swipe=false,duration=1000){
 let active=false,start=0,frame=0,travel=0,last=null;el.classList.add('touch-contact');el.tabIndex=0;el.setAttribute('role','button');
 const reset=()=>{active=false;cancelAnimationFrame(frame);el.classList.remove('contact-pressed');el.style.setProperty('--contact','0deg')};
 const finish=()=>{reset();done()};
 el.onpointerdown=e=>{if(e.button>0)return;e.preventDefault();el.setPointerCapture(e.pointerId);active=true;start=performance.now();travel=0;last=[e.clientX,e.clientY];el.classList.add('contact-pressed');if(!swipe){const tick=t=>{if(!active||!el.isConnected)return;const p=Math.min(1,(t-start)/duration);el.style.setProperty('--contact',p*360+'deg');if(p>=1)finish();else frame=requestAnimationFrame(tick)};frame=requestAnimationFrame(tick)}};
 el.onpointermove=e=>{if(!active||!swipe)return;travel+=Math.hypot(e.clientX-last[0],e.clientY-last[1]);last=[e.clientX,e.clientY];el.style.setProperty('--contact',Math.min(1,travel/170)*360+'deg');if(travel>=170)finish()};
 el.onpointerup=el.onpointercancel=el.onlostpointercapture=reset;
 el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();done()}};
}
function spatialOn(el,world,m,a,s,tool){
 if(!el)return;let drag=null;el.classList.add('touch-movable');el.tabIndex=0;el.setAttribute('role','button');el.setAttribute('aria-label','Перемістити сам об’єкт: '+(tool==='measure'?'дозиметр':'людина або екран'));
 const zones=()=>[...world.querySelectorAll('[data-dropzone]')];
 const find=(x,y)=>zones().find(z=>{const b=z.getBoundingClientRect();return x>=b.left&&x<=b.right&&y>=b.top&&y<=b.bottom});
 el.onpointerdown=e=>{if(e.button>0||a.outcome)return;e.preventDefault();el.setPointerCapture(e.pointerId);drag={x:e.clientX,y:e.clientY,moved:0};el.classList.add('object-in-hand');zones().forEach(z=>z.classList.add('drop-available'))};
 el.onpointermove=e=>{if(!drag)return;const x=e.clientX-drag.x,y=e.clientY-drag.y;drag.moved=Math.hypot(x,y);el.style.translate=x+'px '+y+'px';zones().forEach(z=>z.classList.remove('drop-hover'));find(e.clientX,e.clientY)?.classList.add('drop-hover');if(m.id==='dose'&&$('#doseLive'))$('#doseLive').textContent='…'};
 const end=(e,cancel=false)=>{if(!drag)return;const d=drag;drag=null;el.classList.remove('object-in-hand');zones().forEach(z=>z.classList.remove('drop-hover','drop-available'));const z=find(e.clientX,e.clientY);el.style.translate='';if(!cancel&&d.moved>14&&z){if(m.id==='dose'&&z.dataset.dropzone===s.target)a.lastDeviceTarget=z.dataset.dropzone;acceptDrop({tool,answer:null,item:null},z.dataset.dropzone,m,a,s)}else if(!cancel)$('#dropMessage').textContent='Перемісти сам об’єкт до потрібної ділянки й відпусти.'};
 el.onpointerup=e=>end(e);el.onpointercancel=e=>end(e,true);el.onlostpointercapture=e=>{if(drag)end(e,true)};
 el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();if(m.id==='dose')a.lastDeviceTarget=s.target;acceptDrop({tool,answer:null,item:null},s.target,m,a,s)}};
}
function cleanDirect(world,a,s){
 const area=document.createElement('div');area.className='touch-wipe-surface';area.setAttribute('role','button');area.setAttribute('aria-label','Проведи пальцем по всіх забруднених ділянках');area.tabIndex=0;
 area.innerHTML=Array.from({length:12},(_,i)=>'<i class="touch-dirt" data-dirt="'+i+'" style="left:'+(i%3*31+3)+'%;top:'+(Math.floor(i/3)*23+2)+'%"></i>').join('')+'<span class="touch-wipe-caption">Очищуй м’якими рухами <b>0%</b></span>';
 world.appendChild(area);let wiping=false,seen=new Set();
 const sample=e=>{if(!wiping)return;const r=area.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;if(x<0||x>1||y<0||y>1)return;const i=Math.min(2,Math.floor(x*3))+Math.min(3,Math.floor(y*4))*3;seen.add(i);area.querySelector('[data-dirt="'+i+'"]').classList.add('wiped');area.querySelector('b').textContent=Math.round(seen.size/12*100)+'%';if(seen.size===12){wiping=false;a.lastPayload={tool:s.tool,target:s.target};completeStep()}};
 area.onpointerdown=e=>{e.preventDefault();area.setPointerCapture(e.pointerId);wiping=true;sample(e)};area.onpointermove=sample;area.onpointerup=area.onpointercancel=()=>wiping=false;area.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();a.lastPayload={tool:s.tool,target:s.target};completeStep()}};
}
function evacObjects(world,a){
 const retained=[...world.querySelectorAll('.world-topline,.world-result,.drop-message,.mistake-overlay')],past=MISSIONS.find(m=>m.id==='evac').steps.slice(0,a.k+(a.outcome?1:0)),fields=[...new Set(past.map(s=>s.cardField).filter(Boolean))];
 world.innerHTML='<div class="touch-evac-context">Пункт збору · повторна оцінка та передача</div><div class="touch-patient" data-dropzone="patient"><img src="img/z10-patient.jpg" alt="Постраждалий Р-17 на ношах"><span>Р-17 · огляд</span><div class="touch-vital-sticker">14:25<br><b>ЧД 26 · пульс 112</b></div></div><div class="touch-paper" data-dropzone="card"><small>НАВЧАЛЬНА МОДЕЛЬ КАРТКИ №002/О</small><b>Р-17</b><p>Травма стегна<br>Турнікет: 14:10<br>Огляд: 14:25</p><div class="touch-paper-lines">'+[1,2,3,4,5,6].map(i=>'<span class="'+(fields.includes(i)?'filled':'')+'">'+(fields.includes(i)?'✓ Зафіксовано':'Розділ '+i)+'</span>').join('')+'</div><span>Змістові розділи, а не юридично точний бланк</span></div><div class="touch-route"><button data-dropzone="ambulance">Транспорт<span>Узгодити евакуацію</span></button><i>→</i><button data-dropzone="hospital">Приймальний заклад<span>Травма · ізольований прийом</span></button></div><button class="touch-radio" data-dropzone="radio">Зв’язок із бригадою <span>Передати MIST</span></button>';
 retained.forEach(e=>world.appendChild(e));
}
function riskObjects(world,a){
 const retained=[...world.querySelectorAll('.world-topline,.world-result,.drop-message,.mistake-overlay')];
 const labels=[['water','Питна вода',17,31],['food','Відомості кухні',70,29],['shelter','Розміщення людей',48,48],['isolation','Медичний пост',81,63],['waste','Санітарна зона',24,76],['radio','Зв’язок',70,82]];
 world.innerHTML='<img class="touch-camp-photo" src="img/z10-camp.jpg" alt="Навчальний пункт розміщення"><div class="touch-camp-caption">Відомості про зони пункту · позначки умовні</div>'+labels.map(([id,label,x,y])=>'<button class="touch-pin '+(a.observed?.includes(id)?'visited':'')+'" data-dropzone="'+id+'" style="left:'+x+'%;top:'+y+'%"><i>'+(a.observed?.includes(id)?'✓':'+')+'</i><span>'+label+'</span></button>').join('');retained.forEach(e=>world.appendChild(e));
}
function exploreRisk(target,m,a){
 const i=m.steps.findIndex((s,j)=>j<5&&s.target===target);if(i<0)return;
 a.observed=a.observed||[];if(!a.observed.includes(target)){a.observed.push(target);a.scores[i]=a.hints.includes(i)?1:2;a.log.push({text:m.steps[i].title+' — '+m.steps[i].why,error:false})}
 const next=m.steps.slice(0,5).findIndex((s,j)=>a.scores[j]==null);a.k=next<0?5:next;a.outcome=null;save();renderGame();
 const note=document.createElement('div');note.className='touch-observation';note.setAttribute('role','status');note.innerHTML='<b>Результат огляду</b><p>'+esc(m.steps[i].why)+'</p><button>Зрозуміло</button>';$('#simulationWorld').appendChild(note);note.querySelector('button').onclick=()=>note.remove();
}
renderGame=function(){
 directBaseRender();const a=state.active,m=MISSIONS.find(m=>m.id===a?.id),world=$('#simulationWorld');if(!m||!world)return;
 const s=m.steps[a.k],dock=$('.inventory-dock'),f=a.ppeFault;world.classList.add('touch-world','touch-'+m.id);
 if(m.id==='evac')evacObjects(world,a);
 if(m.id==='risk'||m.id==='camp')riskObjects(world,a);
 if(!a.outcome&&['evac','risk','camp'].includes(m.id))wireDrag(m,a,s);
 if(m.id==='dose'&&a.lastDeviceTarget){const d=world.querySelector('.interactive-device');d.style.left='54%';d.style.top=a.lastDeviceTarget==='sample'?'47%':'15%';d.style.height='35%'}
 if(a.outcome||dock.querySelector('[data-practical-widget]'))return;
 const commit=(target=s.target,answer=null)=>{if(state.active===a&&!a.outcome)acceptDrop({tool:s.tool,target,answer,item:null},target,m,a,s)};
 const tell=text=>{dock.innerHTML=touchNote(text);dock.classList.remove('choice-dock','long-choice','ppe-gear-dock')};
 const zones=()=>[...world.querySelectorAll('[data-dropzone]')];
 const hint=document.createElement('p');hint.className='touch-current-gesture';$('.objective').appendChild(hint);
 if(m.id==='ppe'){
  if(f&&f.repair!=='hygiene'){hint.textContent='Візьми предмет на самому лікарі й перенеси в контейнер.';return}
  dock.querySelectorAll('[data-drag="hygiene"],[data-drag="check"]').forEach(e=>e.remove());
  if(s.tool==='hygiene'||f?.repair==='hygiene'){
   hint.textContent='Торкнися ділянки кистей та розітри засіб рухом пальця.';
   zones().filter(z=>z.dataset.dropzone==='hands').forEach(z=>{contactOn(z,()=>commit('hands'),true);z.setAttribute('aria-label','Гігієна рук: проведи пальцем у ділянці кистей');z.insertAdjacentHTML('beforeend','<span class="touch-contact-label">Рухай пальцем ↔</span>')});
   if(f)tell('Рухом пальця оброби руки. Це умовний жест; реальну техніку та тривалість відпрацьовують окремо.');
  }else if(s.tool==='check'){
   hint.textContent='Утримай на респіраторі, щоб переглянути модель перевірки прилягання.';
   zones().filter(z=>z.dataset.dropzone==='face').forEach(z=>{contactOn(z,()=>commit('face'));z.setAttribute('aria-label','Утримуй на респіраторі для моделі перевірки')});
  }else hint.textContent='Візьми сам предмет спорядження. Для знімання — візьми його на лікарі.';
  return;
 }
 if(m.id==='risk'&&a.k<5){hint.textContent='Оглянь п’ять зон у довільному порядку. Торкайся позначок на самому пункті.';tell('Оглянуто '+(a.observed?.length||0)+' із 5 зон. Дані з’являються у сцені.');zones().forEach(z=>{z.onkeydown=null;z.onclick=()=>exploreRisk(z.dataset.dropzone,m,a)});return}
 if(m.id==='dose'&&['power','mode','measure'].includes(s.tool)){
  const device=world.querySelector('.interactive-device');
  if(s.tool==='power'){
   hint.textContent='Утримай кнопку живлення на самому приладі.';tell('Кнопка ON/OFF запускає умовне самотестування. Прилад є навчальною моделлю.');
   const power=document.createElement('button');power.className='touch-device-button';power.textContent='⏻';device.appendChild(power);contactOn(power,()=>commit('device'),false,1100);power.setAttribute('aria-label','Живлення приладу: утримуй ON/OFF');
  }else if(s.tool==='measure'){
   hint.textContent='Візьми сам дозиметр і перенеси до точки вимірювання. Дочекайся стабілізації.';
   tell(a.measuring?'Прилад виконує умовне вимірювання…':'Рухай зображення приладу. Значення задані навчальним сценарієм.');if(!a.measuring)spatialOn(device,world,m,a,s,'measure');
  }else{
   hint.textContent='Обери режим на самому приладі.';tell('Натисни потрібний режим на панелі приладу.');
   const panel=document.createElement('div');panel.className='touch-device-modes';panel.innerHTML=s.choices.map((x,i)=>'<button data-device-mode="'+i+'">'+esc(x)+'</button>').join('');device.appendChild(panel);panel.querySelectorAll('button').forEach(b=>b.onclick=()=>commit('device',+b.dataset.deviceMode));
  }return;
 }
 if(s.tool==='clean'&&['disinfection','raddecon'].includes(m.id)){hint.textContent='Проведи пальцем по всіх забруднених ділянках. Одне натискання не очищує поверхню.';world.querySelectorAll('.direct-gesture').forEach(x=>x.remove());tell('Ділянки очищуються там, де пройшов палець. Позначки забруднення умовні.');cleanDirect(world,a,s);return}
 if(s.tool==='timer'&&m.id==='disinfection'){
  hint.textContent='Утримуй таймер на поверхні для умовної перемотки експозиції.';world.querySelectorAll('.direct-gesture').forEach(x=>x.remove());tell('Утримання умовно перемотує 60 хв. У реальності повністю витримують час з інструкції засобу на вологій поверхні.');const timer=document.createElement('button');timer.className='touch-exposure';timer.innerHTML='<b>60:00</b><span>Утримуй · умовна перемотка</span>';world.appendChild(timer);contactOn(timer,()=>completeStep(),false,1800);timer.setAttribute('aria-label','Утримуй для умовної перемотки 60 хв');return;
 }
 if(s.tool==='mix'&&m.id==='disinfection'){hint.textContent='Відміряй об’єм повзунком мірної ємності.';return}
 if(s.choices){
  hint.textContent=m.id==='stress'?'Обери репліку, з якою звернешся до людини.':'Внеси рішення безпосередньо до навчальної картки.';
  dock.classList.remove('choice-dock','long-choice');dock.classList.add('touch-decision-dock');
  dock.innerHTML='<div class="touch-decision-label">'+(m.id==='stress'?'Твоя репліка':m.id==='iodine'?'Рішення для картки видачі':'Рішення за даними сценарію')+'</div><div class="touch-decisions">'+s.choices.map((x,i)=>'<button data-direct-choice="'+i+'">'+esc(x)+'<span>→</span></button>').join('')+'</div>';
  dock.querySelectorAll('[data-direct-choice]').forEach(b=>b.onclick=()=>commit(s.target,+b.dataset.directChoice));return;
 }
 if(s.tool==='move'&&['stress','shield'].includes(m.id)){hint.textContent='Візьми зображення людини й перемісти до потрібної зони.';tell('Людина рухається за пальцем. Відпусти в потрібній зоні.');spatialOn(world.querySelector(m.id==='stress'?'.stress-person':'.field-avatar'),world,m,a,s,'move');return}
 if(m.id==='shield'&&s.tool==='shelter'){hint.textContent='Перемісти сам екран у зону захисту.';tell('Візьми екран у сцені. Модель показує принцип екранування, а не властивості довільної реальної стіни.');const wall=world.querySelector('.shield-wall');wall.classList.add('touch-solid-wall');spatialOn(wall,world,m,a,s,'shelter');return}
 const physical=['gown','resp','mask','glasses','gloves','remove','sample','water','disinfect','label','green','yellow','red','black'];
 if(physical.includes(s.tool)){hint.textContent=s.tool==='remove'?'Візьми одяг на людині й перенеси в пакет.':'Перемісти сам предмет до потрібного об’єкта.';if(!['remove','green','yellow','red','black'].includes(s.tool))dock.querySelectorAll('[data-drag]').forEach(e=>{if(!physical.includes(e.dataset.drag))e.remove()});return}
 const labels={breath:'Утримуй на грудній клітці · модель оцінки дихання',pulse:'Утримуй на кисті · модель оцінки пульсу',airway:'Проведи пальцем у ділянці голови · модель дії',inspect:'Торкнися об’єкта для огляду',check:'Утримуй на постраждалому для повторної оцінки',record:'Торкнися картки для фіксації даних',command:'Торкнися людини, щоб дати просту команду',walk:'Торкнися постраждалого для команди ходячим',notify:'Торкнися об’єкта зв’язку',handover:'Торкнися зв’язку, щоб передати дані',plan:'Торкнися відповідної зони для планування',place:'Торкнися зони, яку облаштовуєш',shelter:'Торкнися безпечної зони'};
 hint.textContent=labels[s.tool]||'Працюй безпосередньо з об’єктом у сцені.';tell(['breath','pulse','airway','check'].includes(s.tool)?'Це умовна модель рішення та спостереження. Жест не відтворює реальну техніку або тривалість огляду.':'Працюй із самим об’єктом. Перетягувати символ дії не потрібно.');
 zones().forEach(z=>{z.onkeydown=null;if(['breath','pulse','airway','check'].includes(s.tool)){contactOn(z,()=>commit(z.dataset.dropzone),s.tool==='airway');z.setAttribute('aria-label',(labels[s.tool]||'Огляд')+' · '+z.textContent)}else{z.classList.add('touch-object-button');z.tabIndex=0;z.setAttribute('role','button');z.onclick=()=>commit(z.dataset.dropzone);z.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();commit(z.dataset.dropzone)}}}});
};
route();
