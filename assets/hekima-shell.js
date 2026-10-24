(function(){
if(window.__hkShell||document.querySelector('.auth-gate#authGate')&&!document.getElementById('appContent'))return;window.__hkShell=1;
var P=location.pathname.split('/').pop()||'index.html';
var items=[['Dashibodi','portal.html','🏠'],['FINANCE'],['Balance','balance.html','💰'],['Combine','combine.html','🧮'],['Updates','portal.html#updates','🔄'],['HR','hr.html','🧑‍💼','hr'],['OPERATIONS'],['Operations','operations.html','⚙️'],['MANAGEMENT','','','top'],['Management','management.html','🏢','top'],['AKAUNTI'],['Profile','portal.html#profile','👤'],['Settings','#settings','🛠️'],['Logout','#logout','🚪']];
function el(t,a,h){var e=document.createElement(t);for(var k in a||{})e.setAttribute(k,a[k]);if(h!=null)e.innerHTML=h;return e}
function build(){
document.body.classList.add('hk-shell');
var side=el('div',{id:'hkSide'}),shade=el('div',{id:'hkShade'}),top=el('div',{id:'hkTop'});
side.innerHTML='<div class="hk-logo">Hekima Finance<small>Pooge na Masmibue</small></div>';
items.forEach(function(i){var cls=i[3]?' data-role="'+i[3]+'"':'';
 if(!i[1]&&i[1]!==''||i.length==1){side.appendChild(el('div',{'class':'hk-sec'},i[0]));return}
 if(i[1]===''){var s=el('div',{'class':'hk-sec'},i[0]);if(i[3])s.dataset.role=i[3];side.appendChild(s);return}
 var a=el('a',{href:i[1].charAt(0)=='#'?'#':i[1]},'<span>'+i[2]+'</span>'+i[0]);a.dataset.h=i[1];if(i[3])a.dataset.role=i[3];
 if(i[1]==P||(i[1]=='portal.html'&&P=='portal.html'&&!location.hash))a.className='act';side.appendChild(a)});
side.querySelectorAll('[data-role]').forEach(function(n){n.style.display='none'});
top.innerHTML='<button class="hk-ic hk-menu" id="hkMenu" aria-label="Menu">☰</button><div id="hkSearch"><input placeholder="Tafuta hapa..." autocomplete="off"><div class="hk-dd"></div></div><div style="position:relative"><button class="hk-ic" id="hkBell" aria-label="Taarifa">🔔<span id="hkBadge"></span></button><div class="hk-dd" id="hkBellDd"><div class="hk-empty">Hakuna taarifa mpya.</div></div></div><div id="hkAvatar">?</div>';
document.body.append(side,shade,top);
var set=el('div',{id:'hkSet'},'<div class="hk-box"><h3>Settings</h3><button id="hkLang">🌐 Lugha (SW/EN)</button><button id="hkT_auto">📱 Mandhari: Auto (kama kifaa)</button><button id="hkT_light">☀️ Mandhari: Mwanga</button><button id="hkT_dark">🌙 Mandhari: Giza</button><a href="portal.html#history">🕘 Historia ya matukio</a><button id="hkClose">Funga</button></div>');document.body.appendChild(set);
function close(){side.classList.remove('open');shade.classList.remove('open')}
top.querySelector('#hkMenu').onclick=function(){side.classList.add('open');shade.classList.add('open')};shade.onclick=close;
side.addEventListener('click',function(e){var a=e.target.closest('a');if(!a)return;var h=a.dataset.h;
 if(h=='#settings'){e.preventDefault();close();set.classList.add('open')}
 else if(h=='#logout'){e.preventDefault();try{sb.auth.signOut().then(function(){location.href='portal.html'})}catch(x){location.href='portal.html'}}
 else if(h&&h.indexOf('portal.html#')==0&&P=='portal.html'){e.preventDefault();location.hash=h.split('#')[1];location.reload()}});
document.getElementById('hkClose').onclick=function(){set.classList.remove('open')};set.onclick=function(e){if(e.target==set)set.classList.remove('open')};
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
 dd.innerHTML=r.length?r.map(function(a){return '<a href="'+a.dataset.h+'">'+a.textContent+'</a>'}).join(''):'<div class="hk-empty">Hakuna kilichopatikana.</div>';dd.classList.add('open')};
inp.onkeydown=function(e){if(e.key=='Enter'){var a=dd.querySelector('a');if(a)location.href=a.getAttribute('href')}};
document.addEventListener('click',function(e){if(!e.target.closest('#hkSearch'))dd.classList.remove('open');if(!e.target.closest('#hkBell,#hkBellDd'))bell.classList.remove('open')});
var n=0,t=setInterval(function(){n++;if(typeof sb!='undefined'&&sb&&sb.auth){clearInterval(t);who(side)}else if(n>40)clearInterval(t)},250)}
function who(side){
function show(r){side.querySelectorAll('[data-role="'+r+'"]').forEach(function(n){n.style.display=''})}
sb.auth.getUser().then(function(x){var u=x&&x.data&&x.data.user;if(!u)return;var av=document.getElementById('hkAvatar'),em=u.email||'?';av.textContent=em[0].toUpperCase();
 sb.from('hr_employees').select('full_name,photo_url').eq('email',em).maybeSingle().then(function(r){var d=r&&r.data;if(!d)return;if(d.full_name)av.textContent=d.full_name[0].toUpperCase();
  if(d.photo_url){var p=d.photo_url;if(!/^https?:/.test(p)){sb.storage.from('employee-files').createSignedUrl(p,3600).then(function(s){if(s&&s.data)av.innerHTML='<img src="'+s.data.signedUrl+'" alt="">'})}else av.innerHTML='<img src="'+p+'" alt="">'}}).catch(function(){})});
sb.rpc('current_top_management').then(function(r){if(r&&r.data){show('top');show('hr')}});
sb.rpc('am_i_hr').then(function(r){if(r&&r.data)show('hr')})}
if(document.body)build();else document.addEventListener('DOMContentLoaded',build)
})();
