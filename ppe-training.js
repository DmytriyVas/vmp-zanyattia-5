'use strict';
// A visible, reversible unsafe state is separate from the correct sequence.
// Coloured particles indicate a training transfer pathway, never measured contamination or certain infection.
if(APP_LESSON===10){
 const ppeMission=MISSIONS.find(m=>m.id==='ppe');
 ppeMission.name='Захист медика: обери й перевір';
 ppeMission.desc='Зрозумій ризик, добери захист і виправ небезпечні дії.';
 ppeMission.intro='Ти готуєш лікаря до допомоги пацієнту з підозрою на кір. Пацієнт кашляє; потрібна також перев’язка рани, під час якої можливі контакт із кров’ю та бризки. Відокремлення пацієнта й організацію приміщення вже забезпечено за умовою. Твоє завдання — підібрати ЗІЗ під ці ризики, перевірити захист і зняти його без перенесення забруднення. Одягнений предмет ще не означає, що захист працює.';
 const reasons=[
 ['Чисті руки — початок захисту','Руки торкатимуться чистих ЗІЗ та обличчя. Якщо пропустити гігієну, можна перенести забруднення ще під час підготовки.'],
 ['Халат потрібен через контактний ризик','У цій ситуації під час перев’язки можливе забруднення одягу та шкіри кров’ю. Халат закриває тулуб і руки; він не захищає дихання.'],
 ['Маска й респіратор мають різні завдання','При підозрі на кір потрібен відповідний респіратор за програмою респіраторного захисту. Медична маска на медику не замінює цей захист.'],
 ['Захист залежить від прилягання','Респіратор на обличчі ще не гарантує герметичності. Під час кожного надягання перевіряють прилягання за інструкцією; попередній fit-test залишається потрібним.'],
 ['Не залишай слизові без захисту від бризок','Через очікувані бризки при перев’язці потрібен захист очей. Окуляри захищають очі, але не замінюють респіратор.'],
 ['Між рукавичкою та рукавом не має бути відкритої ділянки','Рукавички надягають останніми поверх манжет. Вони не замінюють гігієну рук і не роблять будь-який дотик безпечним.'],
 ['Після допомоги зовнішній бік ЗІЗ вважай забрудненим','Допомогу завершено. У цій моделі передня поверхня ЗІЗ і рукавички умовно забруднені. Зніми рукавички без перенесення їх зовнішньої поверхні на шкіру.'],
 ['Зняті рукавички не гарантують чистоти рук','Під час знімання можливе перенесення забруднення. Гігієна рук перед наступними діями перериває цей шлях.'],
 ['Тримайся за дужки, а не за скло','Передня поверхня окулярів могла бути забруднена бризками. Для знімання берися за дужки; багаторазовий захист потребує належної обробки.'],
 ['Сховай забруднену сторону всередину','Перед і рукави халата могли забруднитися. Знімай його, вивертаючи всередину, та тримай подалі від одягу.'],
 ['Не відкривай дихальні шляхи в небезпечному повітрі','У цій моделі вже вийдено з приміщення пацієнта й зачинено двері. Тепер респіратор можна зняти за резинки, не торкаючись передньої поверхні.'],
 ['Фінальний бар’єр — гігієна рук','Після знімання ЗІЗ знову оброби руки. Одноразові предмети та багаторазове спорядження направляють у відповідні контейнери.']
 ];
 ppeMission.steps[0].why='Гігієна рук виконана: зменшено ризик перенесення забруднення на чисті ЗІЗ під час надягання.';
 ppeMission.steps[1].why='Халат закриває одяг і шкіру при очікуваному контакті з кров’ю. Дихання й очі він не захищає.';
 ppeMission.steps[2].why='Обрано респіратор для аерогенного ризику. Наступна дія — перевірити його прилягання; сам факт надягання ще недостатній.';
 ppeMission.steps[5].why='Рукавички надягнуті поверх манжет. Після умовної допомоги їх зовнішню поверхню вважатимемо забрудненою.';
 const baseIntro=showIntro;
 showIntro=function(id){baseIntro(id);if(id!=='ppe')return;
 const copy=$('.app-briefing-copy');copy.insertAdjacentHTML('beforeend','<p class="ppe-sources">Опора: <a href="https://www.cdc.gov/infection-control/hcp/isolation-precautions/appendix-a-figure.html" target="_blank" rel="noopener">CDC · надягання та знімання ЗІЗ</a> · <a href="https://www.cdc.gov/infection-control/hcp/measles/index.html" target="_blank" rel="noopener">CDC · кір</a>. Відпрацьовується заданий сценарій; повний інфекційний контроль також включає ізоляцію, вентиляцію та організаційні заходи.</p>');copy.querySelector('.app-briefing-gesture').insertAdjacentHTML('beforebegin',`<div class="ppe-learning-goals"><b>Що ти тут відпрацюєш</b><ul><li>Зв’язок «ризик → потрібний бар’єр».</li><li>Перевірку прилягання та перекриття манжет.</li><li>Виправлення помилок і безпечне знімання.</li></ul><p>Помилковий предмет може залишитися на лікарі. Побачиш незахищену ділянку й усунеш причину. Червоні позначки — умовний шлях перенесення, а не факт зараження.</p></div>`);
 };
 const baseExpectedDrop=expectedDrop;
 canVisualDrop=function(payload,target,m,a,s){if(m.id!=='ppe')return false;if(a.ppeFault)return target===expectedDrop(m,s);return ['gown','resp','mask','glasses','gloves'].includes(payload.tool)&&['face','eyes','torso','hands'].includes(target)||payload.tool==='remove'&&target==='waste-bin'};
 expectedDrop=function(m,s){const f=state.active?.ppeFault;return m.id==='ppe'&&f?(f.repair==='hygiene'?'hands':'ppe-repair-bin'):baseExpectedDrop(m,s)};
 function actualWorn(a){const worn=[];ppeMission.steps.slice(0,a.k+(a.outcome?1:0)).forEach(s=>{if(s.wear)worn.push(s.wear);if(s.unwear&&worn.includes(s.unwear))worn.splice(worn.indexOf(s.unwear),1)});return worn}
 function frameFor(worn){return worn.includes('gloves')?4:worn.includes('glasses')?3:worn.includes('gown')&&worn.includes('resp')?2:worn.includes('gown')?1:worn.includes('resp')?5:0}
 function reportUnsafe(a,f){a.ppeFault=f;a.errors.push({k:a.k,text:f.reason,critical:f.critical});a.log.push({text:f.reason,error:true});save();renderGame()}
 const baseAcceptDrop=acceptDrop;
 acceptDrop=function(payload,target,m,a,s){
 if(m.id!=='ppe')return baseAcceptDrop(payload,target,m,a,s);
 const f=a.ppeFault;
 if(f){
  if(f.repair==='hygiene'){
   if(payload.tool==='hygiene'&&target==='hands'){a.ppeFault=null;save();renderGame();return}
  }else if(payload.tool==='ppe-correct'&&target==='ppe-repair-bin'){
   if(f.hygieneAfter){f.repair='hygiene';save();renderGame()}else{a.ppeFault=null;save();renderGame()}
   return;
  }
  $('#dropMessage').textContent='Виправ небезпечну дію за поясненням. Поточний крок ще не зараховано.';return;
 }
 if(payload.tool===s.tool&&target===baseExpectedDrop(m,s)&&(s.tool!=='remove'||payload.item===s.unwear))return baseAcceptDrop(payload,target,m,a,s);
 const worn=actualWorn(a),gear=['gown','resp','mask','glasses','gloves'];
 // Accept anatomically plausible incorrect choices into the visual state.
 if(gear.includes(payload.tool)&&['face','eyes','torso','hands'].includes(target)){
  if(payload.tool==='mask'&&target==='face')return reportUnsafe(a,{type:'mask',tool:'mask',label:'Медична маска надягнута. Дихальний захист не відповідає ризику.',reason:'Через підозру на кір потрібен відповідний респіратор із належним приляганням. Медична маска на медику не замінює його.',fix:'Зніми маску в чистій зоні, потім обери респіратор.',frame:worn.includes('gown')?1:0,repair:'remove',critical:true});
  if(payload.tool==='resp'&&target==='torso'&&worn.includes('gown'))return reportUnsafe(a,{type:'low-resp',tool:'resp',label:'Респіратор опинився під підборіддям.',reason:'Ніс і рот відкриті. Респіратор на шиї не створює потрібного бар’єра для вдихуваного повітря.',fix:'Зніми неправильно розміщений респіратор. Повтори надягання на обличчя.',frame:6,repair:'remove',critical:true});
  const correctRegion={gown:'torso',resp:'face',glasses:'eyes',gloves:'hands'};
  if(correctRegion[payload.tool]===target){
   if(payload.tool==='gown'&&a.k===0)return reportUnsafe(a,{type:'dirty-hands',tool:'gown',label:'Халат надягнуто до гігієни рук.',reason:'Під час підготовки забруднені руки можуть торкнутися чистих ЗІЗ. Наявність халата цього не виправляє.',fix:'Зніми щойно надягнений халат. Підготуй руки перед новою спробою.',frame:1,repair:'remove',critical:false});
   if(payload.tool==='gloves'&&a.k<5)return reportUnsafe(a,{type:'early-gloves',tool:'gloves',label:'Рукавички надягнуто завчасно.',reason:!worn.includes('gown')?'Халат і манжети ще не підготовлені. Після надягання халата рукавички мають перекривати манжети.':'Далі ще потрібно поправляти ЗІЗ біля обличчя. У цій послідовності рукавички надягають останніми.',fix:'Зніми рукавички й оброби руки. Повернись до поточної дії.',frame:frameFor(worn),repair:'remove',hygieneAfter:true,critical:false});
   return reportUnsafe(a,{type:'sequence',tool:payload.tool,label:'Предмет надягнуто, але підготовка ще не завершена.',reason:reasons[a.k][1],fix:'Зніми щойно надягнений предмет. Виконай поточну дію, а потім продовжуй.',frame:frameFor([...worn,payload.tool]),repair:'remove',critical:false});
  }
 }
 if(payload.tool==='remove'&&target==='waste-bin'&&payload.item!==s.unwear)return reportUnsafe(a,{type:'transfer',tool:payload.item,label:'Під час неправильного знімання умовне забруднення перенесено на руки.',reason:'Ти почав з іншого предмета. У цій навчальній моделі виник контакт із забрудненою передньою поверхнею, поки рукавички ще на руках. Це можливий шлях самозабруднення, а не прогноз інфекції.',fix:'Зніми забруднені рукавички в контейнер і оброби руки. Після цього повтори безпечну послідовність.',frame:7,repair:'remove',hygieneAfter:true,critical:true});
 return baseAcceptDrop(payload,target,m,a,s);
 };
 const baseResult=showMissionResult;
 showMissionResult=function(m,r){baseResult(m,r);if(m.id==='ppe')$('#game .result-list').insertAdjacentHTML('beforebegin','<div class="ppe-learning-goals"><b>Результат навчання</b><p>Ти відпрацьовував вибір бар’єрів під аерогенний ризик і бризки, перевірку прилягання, перекриття манжет та знімання без контакту з передньою поверхнею. Симуляція перевіряє рішення; реальну техніку й прилягання відпрацьовують із викладачем.</p><p>Виправлені помилки залишені в розборі, щоб було зрозуміло, які дії варто повторити.</p></div>')};
 const baseGame=renderGame;
 renderGame=function(){baseGame();const a=state.active;if(a?.id!=='ppe'||!$('#simulationWorld'))return;
 const s=ppeMission.steps[a.k],f=a.ppeFault,world=$('#simulationWorld'),dock=$('.inventory-dock'),objective=$('.objective'),worn=actualWorn(a);
 objective.insertAdjacentHTML('beforeend',`<div class="ppe-why"><b>${reasons[a.k][0]}</b><p>${reasons[a.k][1]}</p></div>`);
 world.classList.add('ppe-teaching-world');
 const checks=[['Дихання',worn.includes('resp')&&(a.k>=4||a.k===3&&a.outcome)],['Очі',worn.includes('glasses')],['Одяг',worn.includes('gown')],['Руки',worn.includes('gloves')]];
 world.insertAdjacentHTML('beforeend',`<div class="ppe-barriers"><span>${a.k<6?'БАР’ЄРИ ДО КОНТАКТУ':'ПІСЛЯ КОНТАКТУ'}</span>${checks.map(([name,on])=>`<span class="${on?'protected':''}">${on?'✓':'○'} ${name}</span>`).join('')}<small>${a.k<6?'Перевіряємо захист поступово':'Зовнішні поверхні умовно забруднені'}</small></div>`);
 if(a.k>=6&&!a.outcome&&!f)world.insertAdjacentHTML('beforeend','<div class="ppe-contact-markers" aria-label="Умовно забруднені зовнішні поверхні"><i></i><i></i><i></i></div>');
 if(!a.outcome&&!f&&a.k<6){
  dock.classList.remove('choice-dock','long-choice');dock.classList.add('ppe-gear-dock');
  dock.innerHTML='<div class="dock-label"><b>Обери захист під ризик</b><span>Предмет може бути неправильним</span></div><div class="inventory-items">'+['hygiene','gown','resp','mask','check','glasses','gloves'].map(t=>dragItem(t)).join('')+'</div>';
  // An anatomically plausible misplacement can be observed, not just rejected.
  if(s.target==='eyes'&&!world.querySelector('[data-dropzone="face"]'))world.querySelector('.body-world').insertAdjacentHTML('beforeend',dropZone('face',37,2,28,14,'Обличчя'));
 }
 if(f){
  world.querySelectorAll('.drop-zone,.worn-pickup,.mistake-overlay,.ppe-barriers').forEach(e=>e.remove());
  const sprite=$('#doctorSprite');sprite.style.backgroundPosition=(f.frame%4)*100/3+'% '+Math.floor(f.frame/4)*100+'%';sprite.setAttribute('aria-label','Лікар: небезпечна дія — '+f.label);
  if(f.type==='mask')world.querySelector('.body-world').insertAdjacentHTML('beforeend','<div class="ppe-surgical-mask" aria-hidden="true"></div><div class="ppe-air-path" aria-label="Умовний шлях аерозолю до незахищених дихальних шляхів"><i></i><i></i><i></i><i></i></div>');
  if(f.type==='early-gloves')world.querySelector('.body-world').insertAdjacentHTML('beforeend','<div class="ppe-photo-gloves" aria-hidden="true"></div>');
  if(['transfer','dirty-hands'].includes(f.type))world.querySelector('.body-world').insertAdjacentHTML('beforeend','<div class="ppe-transfer-dot dot-hand"></div><div class="ppe-transfer-dot dot-face"></div>');
  if(f.type==='low-resp')world.querySelector('.body-world').insertAdjacentHTML('beforeend','<div class="ppe-exposed-face"></div>');
  objective.querySelector('.ppe-why').hidden=true;
  objective.insertAdjacentHTML('beforeend',`<div class="ppe-fault-card" role="alert"><span>${f.critical?'КРИТИЧНА ПОМИЛКА · 0 ЗА ЦЕЙ КРОК':'ПОМИЛКА · МАКСИМУМ 1 БАЛ'}</span><b>${f.label}</b><p>${f.reason}</p><strong>${f.repair==='hygiene'?'Тепер оброби руки: перенеси засіб на кисті.':f.fix}</strong><small>Позначки показують умовний ризик, а не факт зараження.</small></div>`);
  const label=f.tool==='mask'?'Медична маска':f.tool==='gloves'||f.hygieneAfter?'Рукавички':TOOLS[f.tool]?.[1]||'Предмет';
  if(f.repair==='hygiene'){
   world.querySelector('.body-world').insertAdjacentHTML('beforeend',dropZone('hands',15,40,25,19,'Обробити руки'));
   dock.innerHTML='<div class="dock-label"><b>Перерви шлях перенесення</b></div><div class="inventory-items">'+dragItem('hygiene')+'</div>';
  }else{
   const loc=f.type==='transfer'||f.type==='early-gloves'?[17,43,24,16]:f.tool==='gown'?[29,22,42,27]:f.tool==='glasses'?[37,2,28,12]:[36,4,30,16];
   world.querySelector('.body-world').insertAdjacentHTML('beforeend',`<button class="worn-pickup ppe-fix-pickup" data-drag="ppe-correct" style="left:${loc[0]}%;top:${loc[1]}%;width:${loc[2]}%;height:${loc[3]}%" aria-label="Виправити: зняти ${label}"><span>${label} → контейнер</span></button>`);
   dock.innerHTML=`<div class="discard-zone" data-dropzone="ppe-repair-bin">${lineIcon('remove')}<b>Контейнер · виправ помилку</b><span>Перенеси сюди предмет із лікаря</span></div>`;
  }
  dock.classList.remove('ppe-gear-dock');
 }
 if(!a.outcome)wireDrag(ppeMission,a,s);
 };
 route();
}
