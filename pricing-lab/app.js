'use strict';
const $ = (selector) => document.querySelector(selector);
const euro = cents => (cents / 100).toFixed(2).replace('.', ',') + ' €';
const periodText = months => months === 1 ? '1 месец' : months + ' месеца';
const state = { model: 'a', months: 1, people: 3, plan: 'solo', bundle: 'base', seats: 3 };
const MODELS = {
  a: {
    status: 'Сегашният модел / препоръчвам за първи тест', title: 'А. Първо какво получаваш. После за кого е.',
    description: 'Едно общо обяснение за съдържанието, две опции само за хората и ясно отделени Premium пакети.',
    mechanism: 'Съдържание → Solo или Together → период → регистрация. Добавките са обяснение след основния избор.',
    gain: 'Посетителят вижда, че двата плана дават еднакво съдържание. Together изпъква с ползата за групата, без да изглежда като по-богат каталог.',
    risk: '„Основен каталог“ още е абстрактно. Преди пускане трябват няколко реални заглавия и събития с точен етикет за достъпа.',
    requirement: 'Работи с текущите Solo/Together. Нужни са редакция на представянето и проверени примери от каталога.',
    verdict: 'Най-добрият начален вариант според мен: виждаш стойността и цената едновременно, с малко действия.'
  },
  b: {
    status: 'Сегашният модел / алтернатива за тест', title: 'Б. Един въпрос. Един подходящ план.',
    description: 'Вместо да сравняваш две оферти, казваш с кого ще гледаш. Появява се само съответната опция.',
    mechanism: 'Общо съдържание → „Сам или с компания?“ → конкретен план → период → регистрация.',
    gain: 'Сваля броя едновременно видими решения. Подходящ за малък екран и хора, които искат бърз отговор.',
    risk: 'Цената за другия план се вижда след действие. Някои посетители ще предпочетат директното сравнение в А.',
    requirement: 'Същите цени и права. Изборът на хора трябва да се запазва при преминаване към регистрация.',
    verdict: 'Бих го тествал срещу А. Хипотезата е за по-лесен избор; още нямаме данни кое ще работи по-добре.'
  },
  c: {
    status: 'Сегашният модел / максимална съпоставимост', title: 'В. Разликата се вижда на един ред.',
    description: 'Компактна таблица показва едни и същи характеристики за двата плана. Различават се хората и общата цена.',
    mechanism: 'Еднакви атрибути → различен брой хора → обща цена → регистрация. Premium е отделен ред с отделен статут.',
    gain: 'Човек може бързо да провери дали Together отключва повече съдържание. Отговорът е видим: основният каталог е еднакъв.',
    risk: 'По-рационален и по-сух вид. Таблицата трябва да остане кратка, особено на телефон.',
    requirement: 'Използва текущия модел. Няма нужда от нови търговски пакети или ново таксуване.',
    verdict: 'Добър избор за отделна страница „Цени“ или като подробно сравнение под вариант А.'
  },
  d: {
    status: 'Продуктова хипотеза / изисква ново решение', title: 'Г. Избираш готова комбинация по интерес.',
    description: 'Продаваме крайния резултат: основен каталог, каталог с Premium Films или каталог с Premium Sport. Виждаш обща цена.',
    mechanism: 'Сам или с компания → основен каталог / с кино / със спорт → регистрация със запазена комбинация.',
    gain: 'Човек, дошъл за Premium съдържание, не трябва сам да събира базова цена и добавка. Името на комбинацията показва какво получава.',
    risk: 'Три комбинации по два размера на групата лесно стават шест оферти. Отделната такса за съдържание остава в продукта, дори да я скрием в крайна цена.',
    requirement: 'Променя решението добавките да са само информационни на маркетинг страницата. Изисква одобрени крайни цени, права за групата и запазване на избора към регистрацията.',
    verdict: 'Има смисъл за кампании по интерес. Не бих го пуснал за всички, преди да са ясни основният каталог и икономиката на пакетите.'
  },
  e: {
    status: 'Ценова хипотеза / изисква финансов разчет', title: 'Д. Цената расте с хората, които добавяш.',
    description: 'Една база за първия човек и фиксирана сума за всяко следващо място. За петима стига сегашната цена на Together.',
    mechanism: 'Избираш 1–5 души → виждаш база + допълнителни места → обща цена. Съдържанието е едно и също за всички.',
    gain: 'По-плавен вход за двама и трима. Няма скок от 14,90 € на 24,90 € веднага щом добавиш втори човек.',
    risk: 'При двама губим 7,50 € месечен приход спрямо сегашния Together. По-ниската цена може да привлече нови групи, но може и само да намали приходите от съществуващите.',
    requirement: 'Нов модел в билинга: места, покани, премахване на хора, промени в средата на периода и правило за Premium пакетите. Числото 2,50 € е работна хипотеза.',
    verdict: 'Полезна посока за разчет, с най-голяма оперативна промяна. Не я препоръчвам като първата стъпка за опростяване.'
  }
};
function calc(plan) {
  const base = plan === 'together' ? 2490 : 1490;
  const factor = { 1:100, 3:90, 12:85 }[state.months];
  const monthly = Math.floor((base * factor + 1e-6) / 100);
  return { monthly, total: monthly * state.months, base };
}
function heading(title, description) {
  return '<div class="mock-heading"><span class="eyebrow">Твоят NOISY</span><h2>' + title + '</h2><p>' + description + '</p></div>';
}
function content() {
  return '<div class="content-strip"><b>Един основен каталог. И в двата плана.</b><p>Филми, сериали, спортно съдържание, реалити и новини от включения в абонамента каталог. Без реклами.</p><div class="zone-names">Theatre · Arena · Showtime · Newsroom</div></div>';
}
function billing() {
  return '<div class="billing" role="group" aria-label="Период на абонамента">' + [1,3,12].map(m => '<button data-months="' + m + '" aria-pressed="' + (m === state.months) + '">' + periodText(m) + (m > 1 ? ' / −' + (m === 3 ? 10 : 15) + '%' : '') + '</button>').join('') + '</div><p class="billing-caption">' + (state.months === 1 ? 'Показаните цени са за един месец.' : 'Плащаш целите ' + state.months + ' месеца наведнъж. Месечната цена е за сравнение.') + '</p>';
}
function peopleButtons(kind, selected, start = 2) {
  return '<div class="people"><label for="count-'+kind+'">' + (kind === 'seats' ? 'Колко души ще гледате?' : 'Разделете общата сума между:') + '</label><select id="count-'+kind+'" data-count="'+kind+'">' + Array.from({length:6-start}, (_,i) => i+start).map(n => '<option value="'+n+'" '+(n===selected?'selected':'')+'>'+n+' '+(n===1?'човек':'души')+'</option>').join('') + '</select></div>';
}
function totalLine(plan) {
  const p = calc(plan);
  return '<div class="billing-total">' + (state.months === 1 ? 'Общо ' + euro(p.total) + ' за един месец.' : 'Общо ' + euro(p.total) + ' за ' + state.months + ' месеца.<br>Спестяваш ' + euro(p.base * state.months - p.total) + ' за периода.') + '</div>';
}
function planCard(plan, single = false) {
  const together = plan === 'together', p = calc(plan);
  return '<article class="plan ' + (together ? 'featured' : '') + (single ? ' single-offer' : '') + '"><div class="plan-header"><h3>' + (together ? 'Together' : 'Solo') + '</h3><span class="tag">' + (together ? 'До 5 души' : '1 човек') + '</span></div><p>' + (together ? 'Всеки със свой профил. Споделяте общата цена.' : 'Твоят профил, твоите любими и история на гледане.') + '</p><div class="price"><strong>' + euro(p.monthly) + '</strong><span>/ месец' + (together ? ' общо за групата' : '') + '</span></div>' + totalLine(plan) + (together ? peopleButtons('people',state.people) + '<div class="per-person">' + euro(Math.round(p.monthly/state.people)) + ' на човек при ' + state.people + ' души</div><p class="owner">Един човек плаща цялата сума. Вие разпределяте разхода помежду си.</p>' : '<p>Един човек. Същият основен каталог.</p>') + '<button class="cta" data-select="' + plan + '">Избери ' + (together ? 'Together' : 'Solo') + '</button></article>';
}
function addons() {
  return '<section class="addons"><h3>Premium пакетите са отделно.</h3><p>Разширяват основния каталог срещу допълнително заплащане. Не са включени в горната цена.</p><div class="addon-lines"><div class="addon-line"><span class="addon-icon" aria-hidden="true">▶</span><div><b>Premium Films</b><p>Допълнителен каталог с филми и сериали в Theatre.</p></div></div><div class="addon-line"><span class="addon-icon" aria-hidden="true">↗</span><div><b>Premium Sport</b><p>Допълнителен спортен каталог в Arena.</p></div></div></div></section>';
}
function currentEndnote() {
  return '<p class="endnote">След избора следва регистрация. Premium съдържанието и цената му се показват отделно в профила.</p>';
}
function a() {
  return heading('Твоето съдържание.<br>Твоята компания.', 'Избираш колко души ще гледате. Основният каталог е еднакъв.') + content() + billing() + '<div class="plan-pair">' + planCard('solo') + planCard('together') + '</div>' + addons() + currentEndnote();
}
function planChoice() {
  return '<div class="choice-row" role="group" aria-label="Сам или с компания"><button data-plan="solo" aria-pressed="' + (state.plan === 'solo') + '"><strong>Сам</strong><small>Solo / 1 човек</small></button><button data-plan="together" aria-pressed="' + (state.plan === 'together') + '"><strong>С компания</strong><small>Together / до 5 души</small></button></div>';
}
function b() {
  return heading('С кого ще гледаш?', 'Едно и също съдържание. Избери само за колко души да е абонаментът.') + content() + planChoice() + billing() + planCard(state.plan,true) + addons() + currentEndnote();
}
function c() {
  const s=calc('solo'), t=calc('together');
  return heading('Един каталог.<br>Два начина да гледаш.', 'Сравни това, което се променя, и това, което получаваш и в двата случая.') + billing() + '<div class="access"><div class="access-row"><span>В абонамента</span><span>Solo</span><span>Together</span></div><div class="access-row"><span>Хора със собствен профил</span><span>1</span><span>До 5</span></div><div class="access-row"><span>Основен каталог<small>Theatre, Arena, Showtime, Newsroom</small></span><span>Включен</span><span>Същият</span></div><div class="access-row"><span>Без реклами</span><span>Да</span><span>Да</span></div><div class="access-row"><span>Premium пакети</span><span>Доплащат се</span><span>Доплащат се</span></div><div class="access-row price-row"><span>Цена / месец<small>За целия абонамент</small></span><span>' + euro(s.monthly) + '</span><span>' + euro(t.monthly) + '</span></div><div class="access-row"><span>Общо за ' + periodText(state.months) + '</span><span>' + euro(s.total) + '</span><span>' + euro(t.total) + '</span></div><div class="access-row"><span>Твоят избор</span><button class="cta" data-select="solo">Избери Solo</button><button class="cta primary" data-select="together">Избери Together</button></div></div><p class="billing-caption">При Together един човек плаща общата сума. До 5 души ползват собствени профили; броят профили не е обещание за едновременни екрани.</p>' + addons() + currentEndnote();
}
const bundles = {base:{name:'NOISY',desc:'Основният каталог. Premium пакетите се доплащат.',extra:0},films:{name:'NOISY + Premium Films',desc:'Основният каталог и допълнителните филми и сериали.',extra:760},sport:{name:'NOISY + Premium Sport',desc:'Основният каталог и допълнителното спортно съдържание.',extra:1460}};
function d() {
  const base=state.plan==='solo'?1490:2490, bundle=bundles[state.bundle];
  return heading('Избери какво ти се гледа.', 'Всяка комбинация показва общата месечна цена. И във всяка има основен каталог.') + '<div class="proposal-note">Предложение за нов модел. Числата са примерен сбор на базовите цени без промоции, без пакетна отстъпка и без финално одобрение.</div>' + planChoice() + '<div class="bundle-list">' + Object.entries(bundles).map(([key,item]) => '<article class="bundle-row"><div><h3>' + item.name + '</h3><p>' + item.desc + '</p><span class="bundle-price">' + euro(base+item.extra) + '</span><p>/ месец ' + (state.plan==='solo'?'за 1 човек':'общо за до 5 души') + '</p></div><button data-bundle="'+key+'" aria-pressed="'+(state.bundle===key)+'">'+(state.bundle===key?'Избрано ✓':'Избери')+'</button></article>').join('') + '</div><div class="breakdown"><div><span>'+(state.plan==='solo'?'Solo':'Together')+'</span><b>'+euro(base)+'</b></div>'+(bundle.extra?'<div><span>'+bundle.name.replace('NOISY + ','')+'</span><b>'+euro(bundle.extra)+'</b></div>':'')+'<div><span>Общо за 1 месец</span><b>'+euro(base+bundle.extra)+'</b></div></div><button class="cta primary" data-select="bundle">Продължи с '+bundle.name+'</button><p class="endnote">'+(state.plan==='together'?'Един човек плаща цялата сума за групата. ':'')+'Може да се добави и вторият Premium пакет след регистрация. Няма нов пакет „всичко включено“.</p>';
}
function e() {
  const total=1490+(state.seats-1)*250, current=state.seats===1?1490:2490;
  return heading('Гледате повече.<br>Добавяте хора.', 'Един основен каталог. Първият човек е 14,90 €, всеки следващ добавя 2,50 € месечно.')+'<div class="proposal-note">Нова ценова хипотеза. 2,50 € за допълнително място е примерна цена, която изисква финансов разчет и продуктово одобрение.</div>'+peopleButtons('seats',state.seats,1)+'<div class="seat-total">'+euro(total)+'</div><p class="billing-caption">/ месец общо за '+state.seats+' '+(state.seats===1?'човек':'души')+'</p><div class="breakdown"><div><span>Първи човек</span><b>14,90 €</b></div><div><span>'+(state.seats-1)+' допълнителни места × 2,50 €</span><b>'+euro((state.seats-1)*250)+'</b></div><div><span>Общо за 1 месец</span><b>'+euro(total)+'</b></div></div><p class="per-person">'+euro(Math.round(total/state.seats))+' на човек при '+state.seats+' '+(state.seats===1?'човек':'души')+'</p><p class="owner">Един човек плаща общата сума. Всеки има собствен профил.</p><button class="cta primary" data-select="seats">Продължи с '+state.seats+' '+(state.seats===1?'човек':'души')+'</button>'+content()+addons()+'<p class="endnote">Спрямо сегашния модел за '+state.seats+' '+(state.seats===1?'човек':'души')+': '+euro(current)+' / месец. Разлика в базовия месечен приход: '+euro(total-current)+'. Без предположение за ръст на регистрациите.</p>';
}
function render() {
  const data=MODELS[state.model];
  $('#model-title').textContent=data.title;
  $('#model-description').textContent=data.description;
  $('#model-status').textContent=data.status;
  $('#mockup').innerHTML=({a,b,c,d,e})[state.model]();
  $('#reasoning').innerHTML='<span class="eyebrow">Защо е подредено така</span>'+[['Логиката',data.mechanism],['Какво улеснява',data.gain],['Къде е рискът',data.risk],['Какво изисква',data.requirement]].map(([h,p])=>'<section><h3>'+h+'</h3><p>'+p+'</p></section>').join('')+'<section><p class="verdict">'+data.verdict+'</p></section>';
  document.querySelectorAll('[data-model]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.model===state.model)));
}
function updateHash() {
  const params = new URLSearchParams({m:state.months,p:state.plan,n:state.people,b:state.bundle,s:state.seats});
  history.replaceState(null,'','#'+state.model+'?'+params);
}
function readHash() {
  if(location.hash==='#conclusion'){render();return;}
  const [model,query]=location.hash.slice(1).split('?');
  state.model=Object.hasOwn(MODELS,model)?model:'a';
  const params=new URLSearchParams(query);
  state.months=[1,3,12].includes(Number(params.get('m')))?Number(params.get('m')):1;
  state.plan=params.get('p')==='together'?'together':'solo';
  state.people=[2,3,4,5].includes(Number(params.get('n')))?Number(params.get('n')):3;
  state.bundle=Object.hasOwn(bundles,params.get('b'))?params.get('b'):'base';
  state.seats=[1,2,3,4,5].includes(Number(params.get('s')))?Number(params.get('s')):3;
  render();
}
function selection(kind) {
  let text;
  if(kind==='bundle') {
    const total=(state.plan==='solo'?1490:2490)+bundles[state.bundle].extra;
    text=bundles[state.bundle].name+' / '+(state.plan==='solo'?'Solo':'Together')+' · '+euro(total)+' за 1 месец. Примерен, неодобрен сбор.';
  } else if(kind==='seats') {
    text=state.seats+' '+(state.seats===1?'човек':'души')+' · '+euro(1490+(state.seats-1)*250)+' за 1 месец. Примерна, неодобрена тарифа.';
  } else {
    const p=calc(kind);
    text=(kind==='solo'?'Solo / 1 човек':'Together / до 5 души')+' · '+euro(p.total)+' общо за '+periodText(state.months)+'. Premium пакетите се доплащат.';
  }
  $('#selection-detail').textContent=text;
  $('#selection').showModal();
}
document.addEventListener('click',async event=>{
  const target=event.target.closest('button');if(!target)return;
  let changed=false;
  if(target.dataset.model){state.model=target.dataset.model;changed=true;}
  for(const [key,allowed] of Object.entries({months:[1,3,12],people:[2,3,4,5],seats:[1,2,3,4,5]})){
    if(target.dataset[key]&&allowed.includes(Number(target.dataset[key]))){state[key]=Number(target.dataset[key]);changed=true;}
  }
  if(target.dataset.plan){state.plan=target.dataset.plan;changed=true;}
  if(target.dataset.bundle){state.bundle=target.dataset.bundle;changed=true;}
  if(changed){
    const focusKey=['model','months','people','seats','plan','bundle'].find(key=>target.dataset[key]);
    const value=target.dataset[focusKey];
    updateHash();render();
    document.querySelector('[data-'+focusKey+'="'+value+'"]')?.focus({preventScroll:true});
  }
  if(target.dataset.select)selection(target.dataset.select);
  if(target.classList.contains('dialog-close'))$('#selection').close();
  if(target.id==='copy-link'){
    updateHash();
    try{await navigator.clipboard.writeText(location.href);$('#toast').textContent='Линкът с избрания вариант е копиран.';}
    catch{$('#toast').textContent='Линкът е в адресната лента на браузъра.';}
    $('#toast').classList.add('visible');setTimeout(()=>$('#toast').classList.remove('visible'),3500);
  }
});
window.addEventListener('hashchange',readHash);
document.addEventListener('change',event=>{
  const kind=event.target.dataset.count;
  if(!['people','seats'].includes(kind))return;
  const n=Number(event.target.value);
  if(!Number.isInteger(n)||n<(kind==='people'?2:1)||n>5)return;
  state[kind]=n;updateHash();render();
  document.querySelector('[data-count="'+kind+'"]')?.focus({preventScroll:true});
});
readHash();
