/* Browser compositing studies. All media is original project media. */
(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const features = {
    continue: {title:'Продължи оттам, където спря.', copy:'Върни се пет секунди преди мястото, на което спря. Виж кога има нов епизод.', detail:'Точно където спря', crop: .367},
    share: {title:'Сцената, веднага.', copy:'Избери любимия си момент и го изпрати на приятелите си.', detail:'Момент за споделяне', crop: 1.03},
    cast: {title:'Кой е на екрана?', copy:'Открий актьорите и още филми и сериали с тях.', detail:'Открий актьорите', crop: .34}
  };
  const modes = {
    pop:{title:'01 / ИЗВЪН ЕКРАНА',hint:'Детайлът излиза на преден план',note:'Екранът остава в кадър. Функцията излиза пред него.'},
    cinema:{title:'02 / КИНО МОНТАЖ',hint:'Близък план. Пауза. Нов кадър.',note:'Приближаване, светлинен преход и фокус върху детайла.'},
    handoff:{title:'03 / МЕЖДУ УСТРОЙСТВАТА',hint:'Една история на четири екрана',note:'Телефон → таблет → лаптоп → телевизор. Изборът определя началния екран.'}
  };
  const deviceNames={phone:'Телефон',tablet:'Таблет',laptop:'Лаптоп',tv:'Телевизор'};
  const order=Object.keys(deviceNames), reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let state={mode:'pop',feature:'continue',device:'phone'}, timeline, playing=!reduced.matches, visible=true, sourceVersion=0, currentDevice;
  const duration=12, device=$('.device'), videos=$$('video'), seek=$('#seek');
  function readHash(){const p=new URLSearchParams(location.hash.slice(1));for(const [key,values] of [['mode',modes],['feature',features],['device',deviceNames]])if(p.has(key)&&Object.hasOwn(values,p.get(key)))state[key]=p.get(key);}
  function remember(){history.replaceState(null,'',`#${new URLSearchParams(state)}`);}
  function showDevice(key){if(currentDevice===key)return;currentDevice=key;device.dataset.device=key;$('#device-name').textContent=deviceNames[key];}
  function setVideoSources(){const f=features[state.feature];for(const v of [$('.product-video'),$('.detail-video')]){v.pause();v.poster=`media/${state.feature}.jpg`;v.replaceChildren();for(const type of ['webm','mp4']){const s=document.createElement('source');s.src=`media/${state.feature}.${type}`;s.type=`video/${type}`;v.append(s);}v.load();}$('.detail-video').style.top=`-${Math.round($('.extracted').clientWidth*f.crop)}px`;sourceVersion++;}
  function updatePlayback(){const active=playing&&visible&&!document.hidden;timeline?.paused(!active);for(const v of videos){if(active){const promise=v.play();if(promise)promise.catch(()=>{});}else v.pause();}$('#play').setAttribute('aria-label',playing?'Пауза':'Пусни');$('#play').setAttribute('aria-pressed',String(playing));$('#play-icon').innerHTML=playing?'<path d="M8 6v12M16 6v12"/>':'<path d="m9 5 10 7-10 7z"/>';}
  function build(){
    timeline?.kill();
    gsap.set([device,'.extracted','.copy-motion','.ambient','.focus-line','.light-wipe'],{clearProps:'transform,opacity,visibility'});
    showDevice(state.device);
    const small=innerWidth<=760;
    const t=gsap.timeline({paused:true,repeat:-1,defaults:{ease:'power3.inOut'},onUpdate(){const p=t.time();seek.value=p;$('#time').textContent=`00:${String(Math.floor(p)).padStart(2,'0')} / 00:12`;if(state.mode==='handoff'){const index=Math.min(3,Math.floor(p/3));showDevice(order[(order.indexOf(state.device)+index)%4]);}},onRepeat(){for(const v of videos)if(v.readyState>=1)v.currentTime=0;}});
    t.to({}, {duration:duration},0);
    if(state.mode==='pop'){
      t.fromTo(device,{y:32,opacity:0,scale:.92},{y:0,opacity:1,scale:1,duration:1.1},0)
        .fromTo('.copy-motion',{y:16,opacity:0},{y:0,opacity:1,duration:.8},.15)
        .to(device,{x:small?-32:-48,scale:.91,duration:1.2},2)
        .fromTo('.extracted',{x:small?-28:-55,y:20,scale:.7,opacity:0},{x:0,y:0,scale:1,opacity:1,duration:1.2,ease:'back.out(1.15)'},2.15)
        .to('.ambient',{opacity:1,duration:1.1},2)
        .to('.focus-line',{opacity:1,duration:.5},2.8)
        .to('.extracted',{y:-10,duration:2.2,ease:'sine.inOut'},4)
        .to('.extracted',{y:0,duration:2.2,ease:'sine.inOut'},6.2)
        .to(['.extracted','.focus-line','.ambient'],{opacity:0,duration:.7},9.7)
        .to(device,{x:0,scale:1,duration:1},10.3);
    }else if(state.mode==='cinema'){
      t.fromTo(device,{y:26,scale:.8,opacity:0},{y:0,scale:1,opacity:1,duration:1.2},0)
        .to(device,{scale:small?1.24:1.35,y:small?28:45,x:small?-10:-24,duration:2.6,ease:'power2.inOut'},1.7)
        .fromTo('.light-wipe',{xPercent:-80,opacity:0},{xPercent:80,opacity:1,duration:.9,ease:'power2.inOut'},4.2)
        .to('.light-wipe',{opacity:0,duration:.25},4.9)
        .to(device,{scale:.83,x:small?-42:-90,opacity:.48,duration:.65},4.4)
        .fromTo('.extracted',{scale:1.5,x:small?-20:-35,y:16,opacity:0},{scale:small?1.12:1.35,x:small?-12:-28,y:0,opacity:1,duration:.85},4.45)
        .to('.ambient',{opacity:1,duration:1},4.4)
        .to('.extracted',{scale:small?1.2:1.44,duration:3,ease:'none'},5.3)
        .to(['.extracted','.ambient'],{opacity:0,duration:.6},9.4)
        .to(device,{scale:1,x:0,y:0,opacity:1,duration:1.2},9.8);
    }else{
      for(let i=0;i<4;i++){
        const start=i*3;
        t.fromTo(device,{x:small?38:65,y:10,scale:.86,opacity:0},{x:0,y:0,scale:1,opacity:1,duration:.8},start+.05)
          .to(device,{x:small?-28:-50,scale:.95,opacity:0,duration:.45},start+2.55);
      }
      t.to('.ambient',{opacity:.8,duration:1},0);
    }
    timeline=t;seek.value=0;
    // A paused selection must still show the composition, including reduced motion.
    if(!playing)t.time(state.mode==='cinema'?6:state.mode==='pop'?5:1);
    updatePlayback();
  }
  function render({sources=true}={}){
    const f=features[state.feature],m=modes[state.mode];
    $('#feature-title').textContent=f.title;$('#feature-copy').textContent=f.copy;$('#take').textContent=m.title;$('#detail-label').textContent=f.detail;$('#mode-description').textContent=m.hint;$('#effect-note').textContent=m.note;
    for(const b of $$('[data-mode]')){const selected=b.dataset.mode===state.mode;b.setAttribute('aria-selected',selected);b.tabIndex=selected?0:-1;}
    for(const b of $$('button[data-feature]'))b.setAttribute('aria-pressed',b.dataset.feature===state.feature);
    for(const b of $$('button[data-device]'))b.setAttribute('aria-pressed',b.dataset.device===state.device);
    $('#stage').setAttribute('aria-labelledby',`tab-${state.mode}`);
    if(sources)setVideoSources();build();
  }
  for(const b of $$('button[data-mode],button[data-feature],button[data-device]'))b.addEventListener('click',()=>{const key=b.dataset.mode?'mode':b.dataset.feature?'feature':'device';const previous=state.feature;state[key]=b.dataset[key];remember();render({sources:previous!==state.feature});});
  for(const group of $$('.mode-tabs,.choices,.devices'))group.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;const buttons=[...group.querySelectorAll('button')],index=buttons.indexOf(document.activeElement);if(index<0)return;e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?buttons.length-1:(index+(e.key==='ArrowRight'?1:-1)+buttons.length)%buttons.length;buttons[next].focus();buttons[next].click();});
  $('#play').addEventListener('click',()=>{playing=!playing;updatePlayback();});
  $('#replay').addEventListener('click',()=>{timeline.time(0);for(const v of videos)if(v.readyState>=1)v.currentTime=0;playing=true;updatePlayback();});
  seek.addEventListener('input',()=>{playing=false;timeline.time(Number(seek.value));for(const v of videos)if(v.readyState>=1&&Number.isFinite(v.duration)&&v.duration>0)v.currentTime=Number(seek.value)%v.duration;updatePlayback();});
  document.addEventListener('visibilitychange',updatePlayback);
  new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;updatePlayback();},{threshold:.1}).observe($('#stage'));
  reduced.addEventListener('change',()=>{if(reduced.matches){playing=false;updatePlayback();}});
  addEventListener('hashchange',()=>{readHash();render();});
  let resize;addEventListener('resize',()=>{clearTimeout(resize);resize=setTimeout(()=>{const time=timeline.time();$('.detail-video').style.top=`-${Math.round($('.extracted').clientWidth*features[state.feature].crop)}px`;build();timeline.time(time);},180);});
  // A deterministic preview hook for local visual QA, also useful for captured stills.
  window.motionLab={getState:()=>({...state,currentDevice,playing,time:timeline.time(),sourceVersion}),seek(time){playing=false;timeline.time(Math.max(0,Math.min(11.99,time)));for(const v of videos)if(v.readyState>=1&&Number.isFinite(v.duration)&&v.duration>0)v.currentTime=time%v.duration;updatePlayback();}};
  readHash();render();
})();
