(function(){
if(window.__hkShell||document.querySelector('.auth-gate#authGate')&&!document.getElementById('appContent'))return;window.__hkShell=1;
var P=location.pathname.split('/').pop()||'index.html';
var items=[['Home','portal.html','🏠'],['FINANCE'],['Balance','balance.html','💰'],['Combine','combine.html','🧮'],['Updates','portal.html#updates','🔄'],['HR','hr.html','🧑‍💼','hr'],['OPERATIONS'],['Operations','operations.html','⚙️'],['MANAGEMENT','','','top'],['Management','management.html','🏢','top'],['AKAUNTI'],['Profile','portal.html#profile','👤'],['Settings','#settings','🛠️'],['Logout','#logout','🚪']];
var FN={home:'showHome',updates:'showUpdates',history:'showHistory',profile:'openProfileModal',capital:'showCapital',idara:'showIdara'};
function el(t,a,h){var e=document.createElement(t);for(var k in a||{})e.setAttribute(k,a[k]);if(h!=null)e.innerHTML=h;return e}
function goPortal(g){if(P=='portal.html'){var f=window[FN[g]];if(typeof f=='function'){f();return true}}sessionStorage.setItem('hk_go',g);location.href='portal.html';return true}
function pend(){var g=sessionStorage.getItem('hk_go');if(!g||P!='portal.html')return;var n=0,t=setInterval(function(){n++;var ac=document.getElementById('appContent'),f=window[FN[g]];if(ac&&ac.style.display!='none'&&typeof f=='function'){clearInterval(t);sessionStorage.removeItem('hk_go');if(g!='home')f()}else if(n>50){clearInterval(t);sessionStorage.removeItem('hk_go')}},200)}
var BELL='<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>';
function build(){
document.body.classList.add('hk-shell');
var side=el('div',{id:'hkSide'}),shade=el('div',{id:'hkShade'}),top=el('div',{id:'hkTop'});
side.innerHTML='<div class="hk-logo">Hekima Finance<small>Pooge na Masmibue</small></div>';
items.forEach(function(i){
 if(i.length==1){side.appendChild(el('div',{'class':'hk-sec'},i[0]));return}
 if(i[1]===''){var s=el('div',{'class':'hk-sec'},i[0]);if(i[3])s.dataset.role=i[3];side.appendChild(s);return}
 var a=el('a',{href:i[1].charAt(0)=='#'?'#':i[1]},'<span>'+i[2]+'</span>'+i[0]);a.dataset.h=i[1];if(i[3])a.dataset.role=i[3];
 if(i[1]==P||(i[1]=='portal.html'&&P=='portal.html'))a.className='act';side.appendChild(a)});
side.querySelectorAll('[data-role]').forEach(function(n){n.style.display='none'});
top.innerHTML='<button class="hk-ic hk-menu" id="hkMenu" aria-label="Menu">☰</button><div id="hkSearch"><input placeholder="Tafuta hapa..." autocomplete="off"><div class="hk-dd"></div></div><div style="position:relative"><button class="hk-ic hk-bell" id="hkBell" aria-label="Taarifa">'+BELL+'<span id="hkBadge"></span></button><div class="hk-dd" id="hkBellDd"><div class="hk-empty">Hakuna taarifa mpya.</div></div></div><div id="hkUser" role="button" aria-label="Wasifu wangu"><div id="hkAvatar">?</div><div class="hk-un"><b id="hkUN"></b><small id="hkUR"></small></div><span class="hk-un hk-chev">▾</span></div>';
document.body.append(side,shade,top);
var set=el('div',{id:'hkSet'},'<div class="hk-box"><h3>Settings</h3><button id="hkLang">🌐 Lugha (SW/EN)</button><button id="hkT_auto">📱 Mandhari: Auto (kama kifaa)</button><button id="hkT_light">☀️ Mandhari: Mwanga</button><button id="hkT_dark">🌙 Mandhari: Giza</button><a href="portal.html#history" data-h="portal.html#history">🕘 Historia ya matukio</a><button id="hkClose">Funga</button></div>');document.body.appendChild(set);
function close(){side.classList.remove('open');shade.classList.remove('open')}
top.querySelector('#hkMenu').onclick=function(){side.classList.add('open');shade.classList.add('open')};shade.onclick=close;
side.addEventListener('click',function(e){var a=e.target.closest('a');if(!a)return;var h=a.dataset.h||'';
 if(h=='#settings'){e.preventDefault();close();set.classList.add('open')}
 else if(h=='#logout'){e.preventDefault();try{sb.auth.signOut().then(function(){location.href='portal.html'})}catch(x){location.href='portal.html'}}
 else if(h=='portal.html'||h.indexOf('portal.html#')==0){e.preventDefault();close();goPortal(h.split('#')[1]||'home')}});
set.addEventListener('click',function(e){var a=e.target.closest('a');if(a&&a.dataset.h){e.preventDefault();set.classList.remove('open');goPortal(a.dataset.h.split('#')[1])}else if(e.target==set)set.classList.remove('open')});
document.getElementById('hkClose').onclick=function(){set.classList.remove('open')};
top.querySelector('#hkUser').onclick=function(){goPortal('profile')};
document.getElementById('hkLang').onclick=function(){if(typeof toggleLang=='function')toggleLang();else{var c=localStorage.getItem('hekima_lang')||'en';localStorage.setItem('hekima_lang',c=='en'?'sw':'en');location.reload()}};
function rs(m){return m=='auto'?(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):m}
function mark(){var m=localStorage.getItem('hekima_theme_mode')||'';['auto','light','dark'].forEach(function(k){var b=document.getElementById('hkT_'+k);if(b){b.style.fontWeight=k==m?'700':'400';b.style.borderColor=k==m?'#f5b800':''}})}
function setMode(m){localStorage.setItem('hekima_theme_mode',m);var r=rs(m);try{if(typeof applyTheme=='function')applyTheme(r);else throw 0}catch(e){document.documentElement.setAttribute('data-theme',r);localStorage.setItem('hekima_theme',r)}mark()}
['auto','light','dark'].forEach(function(k){document.getElementById('hkT_'+k).onclick=function(){setMode(k)}});
mark();if((localStorage.getItem('hekima_theme_mode')||'')=='auto'){if(rs('auto')!=localStorage.getItem('hekima_theme'))setMode('auto');try{matchMedia('(prefers-color-scheme: dark)').addEventListener('change',function(){if(localStorage.getItem('hekima_theme_mode')=='auto')setMode('auto')})}catch(e){}}
var bell=document.getElementById('hkBellDd');document.getElementById('hkBell').onclick=function(){bell.classList.toggle('open')};
var inp=top.querySelector('#hkSearch input'),dd=top.querySelector('#hkSearch .hk-dd');
inp.oninput=function(){var q=inp.value.trim().toLowerCase();if(!q){dd.classList.remove('open');return}
 var r=[...side.querySelectorAll('a')].filter(function(a){return a.style.display!='none'&&a.dataset.h[0]!='#'&&a.textContent.toLowerCase().indexOf(q)>=0});
 dd.innerHTML=r.length?r.map(function(a){return '<a href="'+a.dataset.h+'" data-h="'+a.dataset.h+'">'+a.textContent+'</a>'}).join(''):'<div class="hk-empty">Hakuna kilichopatikana.</div>';dd.classList.add('open')};
dd.addEventListener('click',function(e){var a=e.target.closest('a');if(a&&a.dataset.h.indexOf('portal.html')==0){e.preventDefault();dd.classList.remove('open');goPortal(a.dataset.h.split('#')[1]||'home')}});
inp.onkeydown=function(e){if(e.key=='Enter'){var a=dd.querySelector('a');if(a)a.click()}};
document.addEventListener('click',function(e){if(!e.target.closest('#hkSearch'))dd.classList.remove('open');if(!e.target.closest('#hkBell,#hkBellDd'))bell.classList.remove('open')});
var n=0,t=setInterval(function(){n++;if(typeof sb!='undefined'&&sb&&sb.auth){clearInterval(t);who(side)}else if(n>40)clearInterval(t)},250);
pend();heroWatch()}
function heroWatch(){if(P!='portal.html')return;var n=0,t=setInterval(function(){n++;var c=document.getElementById('homeCash');if(c){var hero=c.parentElement;if(hero)hero.style.display=(c.style.display=='none')?'none':'';var hn=document.getElementById('homeName'),hr=document.getElementById('homeRole');if(hn&&hn.textContent.trim()&&hn.textContent.trim()!='—'){var u=document.getElementById('hkUN'),r=document.getElementById('hkUR');if(u)u.textContent=hn.textContent;if(r&&hr&&hr.textContent.trim()!='—')r.textContent=hr.textContent}}if(n>30)clearInterval(t)},700)}
function who(side){
function show(r){side.querySelectorAll('[data-role="'+r+'"]').forEach(function(n){n.style.display=''})}
sb.auth.getUser().then(function(x){var u=x&&x.data&&x.data.user;if(!u)return;var av=document.getElementById('hkAvatar'),em=u.email||'?';av.textContent=em[0].toUpperCase();
 sb.from('hr_employees').select('full_name,position,department,photo_url').eq('email',em).maybeSingle().then(function(r){var d=r&&r.data;if(!d)return;if(d.full_name){av.textContent=d.full_name[0].toUpperCase();var un=document.getElementById('hkUN');if(un)un.textContent=d.full_name}
  var ur=document.getElementById('hkUR');if(ur&&(d.position||d.department))ur.textContent=[d.position,d.department].filter(Boolean).join(' · ');
  if(d.photo_url){var p=d.photo_url;if(!/^https?:/.test(p)){sb.storage.from('employee-files').createSignedUrl(p,3600).then(function(s){if(s&&s.data)av.innerHTML='<img src="'+s.data.signedUrl+'" alt="">'})}else av.innerHTML='<img src="'+p+'" alt="">'}}).catch(function(){})});
sb.rpc('current_top_management').then(function(r){if(r&&r.data){show('top');show('hr')}});
sb.rpc('am_i_hr').then(function(r){if(r&&r.data)show('hr')})}
if(document.body)build();else document.addEventListener('DOMContentLoaded',build)
})();
