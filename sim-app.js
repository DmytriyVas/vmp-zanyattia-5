'use strict';
// Shared touch-first presentation. Clinical algorithms and saved results stay in the lesson engines.
const APP_LESSON = location.pathname.includes('z5-play') ? 5 : 10;
const APP_META = APP_LESSON === 5 ? {
 title:'Допомога. Захист. Відновлення.',subtitle:'Стрес і радіаційна безпека',icons:['command','measure','shelter','clean','medicine','record']
} : {title:'Твої дії мають значення.',subtitle:'Безпека осередку та масові ураження',icons:['inspect','place','disinfect','resp','red','transport']};
const appIcon = id => id==='hands'?'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M8 12V4a1.5 1.5 0 0 1 3 0v6-7a1.5 1.5 0 0 1 3 0v7-5a1.5 1.5 0 0 1 3 0v6-3a1.5 1.5 0 0 1 3 0v7c0 4-2 7-6 7h-1c-2 0-3-1-4-2l-5-6a1.6 1.6 0 0 1 2-2l2 2Z"/></svg>':lineIcon(id);
function appPhoto(m){
 if(m.id==='ppe')return '<div class="app-photo app-doctor"><div class="doctor-sprite" style="background-position:0 100%"></div></div>';
 if(m.id==='stress'||m.id==='raddecon')return `<div class="app-photo app-atlas app-${m.id}" role="img" aria-label="Навчальна візуалізація людини"></div>`;
 const src=m.id==='dose'?'img/s5-dosimeter.webp':m.id==='radiation'||m.id==='triage'?'img/z10-patient.jpg':m.scene==='desk'?'img/z10-desk.jpg':'img/z10-camp.jpg';
 return `<img class="app-photo ${m.id==='dose'?'app-device':''}" src="${src}" alt="" loading="lazy">`;
}
function appHeader(){
 document.body.classList.add('sim-app');
 const header=document.querySelector('body > header');
 header.innerHTML=`<div class="app-top"><a class="app-brand" href="./"><span class="app-brand-mark">+</span><span>Практикум<small>МЕДИЧНІ СИМУЛЯЦІЇ</small></span></a><span class="app-course">Заняття <b>${String(APP_LESSON).padStart(2,'0')}</b></span></div><nav aria-label="Розділи заняття"><a href="#missions">${appIcon('check')}<span>Навички</span></a><a href="#control">${appIcon('record')}<span>Мій прогрес</span></a><a href="#material">${appIcon('plan')}<span>Довідка</span></a><a href="#practice">${appIcon('inspect')}<span>Знання</span></a></nav>`;
 document.querySelector('body > footer').innerHTML='КЗ «Одеський обласний базовий медичний фаховий коледж» · Паламарчук Д. В.<br>Навчальна симуляція. Візуалізації не замінюють практику з викладачем.';
}
renderHub=function(){
 $('#game').hidden=true;$('#hub').hidden=false;
 const done=MISSIONS.filter(m=>state.results[m.id]).length;
 $('#hub').innerHTML=`<div class="app-welcome"><div><span class="app-kicker">ВІДПРАЦЮВАННЯ НАВИЧОК · ${String(APP_LESSON).padStart(2,'0')}</span><h1>${APP_META.title}</h1><p>${APP_META.subtitle}</p></div><div class="app-progress" style="--progress:${done/6*360}deg"><span><b>${done}<small>/6</small></b><small>навичок</small></span></div></div><div class="app-how"><span class="app-touch">${appIcon('hands')}</span><p><b>Спробуй руками.</b> Перенось предмети у сцену, стеж за змінами й відпрацьовуй дії у своєму темпі.</p></div><div class="app-section-heading"><h2>Обери навичку</h2><span>6 симуляцій</span></div><div class="app-skills">${MISSIONS.map((m,i)=>{
 const r=state.results[m.id];return `<button class="app-skill ${r?'is-complete':''}" data-app-start="${m.id}"><div class="app-skill-visual">${appPhoto(m)}<span class="app-skill-number">${String(i+1).padStart(2,'0')}</span><span class="app-skill-status">${r?'✓ Виконано':'Практика'}</span></div><div class="app-skill-content"><span class="app-skill-icon">${appIcon(APP_META.icons[i])}</span><span class="app-skill-copy"><strong>${m.name}</strong><span>${m.desc}</span><small>${m.steps.length} дій${r?' · '+r.pct+'% · оцінка '+r.grade:''}</small></span><span class="app-skill-arrow">↗</span></div></button>`}).join('')}</div><details class="app-profile"><summary>${appIcon('record')} Дані для звіту <span>${esc(state.profile.name||'Додати за потреби')}</span></summary>${profileForm()}${done?'<button id="newStudent">Новий студент · зберегти попередній звіт</button>':''}</details><details class="app-grading"><summary>Як оцінюється практика?</summary><p>2 бали — самостійно, 1 — після підказки або виправлення, 0 — критична помилка. Підсумкова оцінка після всіх шести навичок: 5 від 90%, 4 від 75%, 3 від 60%, 2 нижче 60%. Швидкість не оцінюється. Повторна спроба замінює результат навички.</p><a href="#control">Переглянути результати →</a></details>`;
 $('#hub').oninput=()=>readProfile();
 $('#hub').onclick=e=>{const b=e.target.closest('[data-app-start]');if(b){readProfile();showIntro(b.dataset.appStart)}};
 if($('#newStudent'))$('#newStudent').onclick=()=>{downloadReport();state={profile:{name:'',group:''},results:{},training:{},lessons:{},work:{},control:{answers:{},done:false},active:null};save();renderHub()};
};
showIntro=function(id){
 const m=MISSIONS.find(m=>m.id===id),i=MISSIONS.indexOf(m);
 $('#hub').hidden=true;$('#game').hidden=false;
 $('#game').innerHTML=`<div class="app-briefing"><button class="app-back" id="backHub">← Усі навички</button><div class="app-briefing-layout"><div class="app-briefing-photo">${appPhoto(m)}<span>НАВЧАЛЬНА СЦЕНА</span></div><div class="app-briefing-copy"><span class="app-kicker">НАВИЧКА ${String(i+1).padStart(2,'0')} · ${m.steps.length} ДІЙ</span><h1>${m.name}</h1><p>${m.intro.replaceAll('манекена','лікаря').replace('Перед грою відкрий пам’ятку: у ній наведено послідовність саме для цієї навчальної моделі.','Послідовність можна перевірити кнопкою «?» у сцені.')}</p><div class="app-briefing-gesture">${appIcon('hands')}<span><b>Візьми → перенеси → відпусти</b><small>Ділянка підсвітиться під предметом. Результат побачиш одразу.</small></span></div><button class="primary app-start" id="startMission">Почати відпрацювання <span>→</span></button><small class="app-briefing-note">Без таймера · Прогрес зберігається на пристрої</small><details class="app-briefing-reference"><summary>Коротка інструкція до навички</summary><ol>${NOTES[id].map(t=>'<li>'+t+'</li>').join('')}</ol></details></div></div></div>`;
 $('#backHub').onclick=renderHub;
 $('#startMission').onclick=()=>{state.active={id,k:0,selected:null,scores:[],errors:[],hints:[],log:[],outcome:null,choice:false,started:Date.now()};save();renderGame();window.scrollTo(0,0)};
 window.scrollTo(0,0);
};
const appBaseRenderGame=renderGame;
renderGame=function(){
 appBaseRenderGame();
 const a=state.active,m=MISSIONS.find(m=>m.id===a?.id),world=$('#simulationWorld');if(!m||!world)return;
 const s=m.steps[a.k];
 const topline=world.querySelector('.world-topline');topline.innerHTML=`<span class="app-live-dot"></span><span>${m.id==='ppe'?'ЗАХИСТ МЕДИКА':m.id==='dose'?'ДОЗИМЕТРИЧНИЙ КОНТРОЛЬ':'РОБОЧА СЦЕНА'}</span><small>${a.outcome?'ДІЮ ВИКОНАНО':'ІНТЕРАКТИВНО'}</small>`;
 const objective=$('.objective');objective.insertAdjacentHTML('afterbegin',`<div class="app-step-track" aria-label="Крок ${a.k+1} із ${m.steps.length}">${m.steps.map((x,i)=>`<i class="${i<a.k||i===a.k&&a.outcome?'done':i===a.k?'current':''}"></i>`).join('')}</div>`);
 objective.querySelector('span:not(.app-live-dot)').textContent=a.outcome?'ГОТОВО':'ТВОЯ НАСТУПНА ДІЯ';
 // Keep existing targets and Pointer Events; presentation never selects an answer.
 world.querySelectorAll('.drop-zone').forEach(z=>{const label=z.querySelector('span');if(label){label.insertAdjacentHTML('afterbegin','<i class="app-target-dot"></i>');}});
 const dock=$('.inventory-dock');
 if(!a.outcome&&!a.prepared&&!a.measuring){const label=dock.querySelector('.dock-label');if(label)label.innerHTML='<b>Інструменти</b><span>Перетягни у сцену ↑</span>'}
 if(m.id==='disinfection'&&s.tool==='mix'&&!a.outcome){
 dock.classList.remove('choice-dock','long-choice');
 dock.innerHTML=`<div class="dock-label"><b>Мірна ємність</b><span>Пересувай повзунок пальцем</span></div><div class="app-measure"><div class="app-measure-readout"><b id="appMl">100</b><span>мл концентрату</span></div><div class="app-beaker"><i id="appLiquid" style="height:25%"></i><span>400<br>300<br>200<br>100</span></div><label for="appVolume">Відміряй об’єм</label><input id="appVolume" type="range" min="0" max="400" step="20" value="100"><div class="app-range-ends"><span>0 мл</span><span>400 мл</span></div><button class="primary" id="appPour">Додати в робочу ємність →</button></div>`;
 $('#appVolume').oninput=e=>{$('#appMl').textContent=e.target.value;$('#appLiquid').style.height=(+e.target.value/4)+'%'};
 $('#appPour').onclick=()=>{const value=+$('#appVolume').value;a.lastPayload={tool:'mix',volume:value};if(value!==200){fail('Цей об’єм не дає 4 л 0,5% розчину з 10% концентрату. Перевір C₁ × V₁ = C₂ × V₂.',s.critical);return}completeStep()};
 }
 const next=$('#nextStep');if(next)next.innerHTML=(a.k===m.steps.length-1?'Завершити навичку':'Наступна дія')+' <span>→</span>';
 $('#openHelp').setAttribute('aria-label','Інструкція до навички');
};
appHeader();
route();
