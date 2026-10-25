(function(){
if(window.__hkShell||document.querySelector('.auth-gate#authGate')&&!document.getElementById('appContent'))return;window.__hkShell=1;
var P=location.pathname.split('/').pop()||'index.html';
var ROLE={hr:false,top:false},CACHE={};
function setOn(o){document.body.classList.toggle('hk-on',o);document.body.classList.toggle('hk-shell',o)}
var items=[['Home','portal.html','home'],['FINANCE'],['Balance','balance.html','wallet'],['Combine','combine.html','calc'],['Updates','portal.html#updates','sync'],['HUMAN RESOURCE','','','hr'],['HR Management','hr.html','users','hr'],['OPERATIONS'],['Operations','operations.html','cog'],['MANAGEMENT','','','top'],['Management','management.html','building','top'],['AKAUNTI'],['Profile','portal.html#profile','user'],['Settings','#settings','sliders'],['Logout','#logout','logout']];
var IC={'home': '🏠', 'wallet': '💰', 'calc': '🧮', 'sync': '📋', 'users': '🧑\u200d💼', 'cog': '⚙️', 'building': '🏢', 'user': '👤', 'sliders': '🛠️', 'logout': '🚪'};
var FN={home:'showHome',updates:'showUpdates',history:'showHistory',profile:'openProfileModal',capital:'showCapital',idara:'showIdara'};
function el(t,a,h){var e=document.createElement(t);for(var k in a||{})e.setAttribute(k,a[k]);if(h!=null)e.innerHTML=h;return e}
function goPortal(g){if(P=='portal.html'){var f=window[FN[g]];if(typeof f=='function'){f();return true}}sessionStorage.setItem('hk_go',g);location.href='portal.html';return true}
function pend(){var g=sessionStorage.getItem('hk_go');if(!g||P!='portal.html')return;var n=0,t=setInterval(function(){n++;var ac=document.getElementById('appContent'),f=window[FN[g]];if(ac&&ac.style.display!='none'&&typeof f=='function'){clearInterval(t);sessionStorage.removeItem('hk_go');if(g!='home')f()}else if(n>50){clearInterval(t);sessionStorage.removeItem('hk_go')}},200)}
var BELL='<span class="hk-emo">🔔</span>';
function build(){
var side=el('div',{id:'hkSide'}),shade=el('div',{id:'hkShade'}),top=el('div',{id:'hkTop'});
side.innerHTML='<div class="hk-logo"><img class="hk-lg" src="assets/hekima-emblem.png" alt="" onerror="this.style.display=\'none\'"><div>Hekima Finance<small>Uwezo wa Fedha, Maendeleo ya Kesho</small></div></div>';
items.forEach(function(i){
 if(i.length==1){side.appendChild(el('div',{'class':'hk-sec'},i[0]));return}
 if(i[1]===''){var s=el('div',{'class':'hk-sec'},i[0]);if(i[3])s.dataset.role=i[3];side.appendChild(s);return}
 var a=el('a',{href:i[1].charAt(0)=='#'?'#':i[1]},'<span>'+(IC[i[2]]||'')+'</span>'+i[0]);a.dataset.h=i[1];if(i[3])a.dataset.role=i[3];
 if(i[1]==P||(i[1]=='portal.html'&&P=='portal.html'))a.className='act';side.appendChild(a)});
side.querySelectorAll('[data-role]').forEach(function(n){n.style.display='none'});
top.innerHTML='<button class="hk-ic hk-menu" id="hkMenu" aria-label="Menu">☰</button><div id="hkSearch"><input placeholder="Tafuta hapa..." autocomplete="off"><div class="hk-dd"></div></div><div style="position:relative"><button class="hk-ic hk-bell" id="hkBell" aria-label="Taarifa">'+BELL+'<span id="hkBadge"></span></button><div class="hk-dd" id="hkBellDd"><div class="hk-empty">Hakuna taarifa mpya.</div></div></div><div id="hkUser" role="button" aria-label="Wasifu wangu"><div id="hkAvatar">?</div><div class="hk-un"><b id="hkUN"></b><small id="hkUR"></small></div><span class="hk-un hk-chev">▾</span></div>';
document.body.append(side,shade,top);
var set=el('div',{id:'hkSet'},'<div class="hk-box"><h3>Settings</h3><button id="hkLang">Lugha (SW/EN)</button><button id="hkT_auto">Mandhari: Auto (kama kifaa)</button><button id="hkT_light">Mandhari: Mwanga</button><button id="hkT_dark">Mandhari: Giza</button><a href="portal.html#history" data-h="portal.html#history">Historia ya matukio</a><button id="hkClose">Funga</button></div>');document.body.appendChild(set);
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
var inp=top.querySelector('#hkSearch input'),dd=top.querySelector('#hkSearch .hk-dd'),tok=0,tmr;
inp.oninput=function(){clearTimeout(tmr);var q=norm(inp.value.trim());if(!q){dd.classList.remove('open');return}
 var pg=PAGES.filter(function(x){return okRole(x[3])&&norm(x[0]+' '+x[1]).indexOf(q)>=0}).slice(0,7),my=++tok;
 if(q.length<2||typeof sb=='undefined'||!sb||!sb.from){draw(pg,[],false);return}
 draw(pg,[],true);
 tmr=setTimeout(function(){Promise.all(GR.map(function(g){return g.ok()?load(g.t):Promise.resolve([])})).then(function(all){if(my!=tok)return;draw(pg,GR.map(function(g,i){return {name:g.name,l:g.l,s:g.s,href:g.href,rows:all[i].filter(function(r){return hit(r,q)}).slice(0,6)}}),false)})},200)};
function draw(pg,gr,ld){var h='';
 if(pg.length)h+='<div class="hk-gh">Kurasa</div>'+pg.map(function(x){return '<a href="'+x[2]+'" data-h="'+x[2]+'">'+esc(x[0])+'</a>'}).join('');
 gr.forEach(function(g){if(g.rows.length)h+='<div class="hk-gh">'+g.name+'</div>'+g.rows.map(function(r){var u=g.href(r);return '<a href="'+u+'" data-h="'+u+'">'+esc(g.l(r))+(g.s(r)?'<small>'+esc(g.s(r))+'</small>':'')+'</a>'}).join('')});
 if(ld)h+='<div class="hk-empty">Inatafuta...</div>';if(!h)h='<div class="hk-empty">Hakuna kilichopatikana.</div>';dd.innerHTML=h;dd.classList.add('open')}
dd.addEventListener('click',function(e){var a=e.target.closest('a');if(!a)return;var h=a.dataset.h||'';dd.classList.remove('open');if(h.indexOf('portal.html')==0){e.preventDefault();goPortal(h.split('#')[1]||'home')}else if(h.split('#')[0]==P){location.hash=h.split('#')[1]||'';prefill()}});
inp.onkeydown=function(e){if(e.key=='Enter'){var a=dd.querySelector('a');if(a)a.click()}};
document.addEventListener('click',function(e){if(!e.target.closest('#hkSearch'))dd.classList.remove('open');if(!e.target.closest('#hkBell,#hkBellDd'))bell.classList.remove('open')});
var n=0,t=setInterval(function(){n++;if(typeof sb!='undefined'&&sb&&sb.auth){clearInterval(t);who(side)}else if(n>40)clearInterval(t)},250);
authPoll();startDK();pend();heroWatch();prefill()}
function heroWatch(){if(P!='portal.html')return;var n=0,t=setInterval(function(){n++;var c=document.getElementById('homeCash');if(c){var hero=c.parentElement;if(hero)hero.style.display=(c.style.display=='none')?'none':'';var hn=document.getElementById('homeName'),hr=document.getElementById('homeRole');if(hn&&hn.textContent.trim()&&hn.textContent.trim()!='—'){var u=document.getElementById('hkUN'),r=document.getElementById('hkUR');if(u)u.textContent=hn.textContent;if(r&&hr&&hr.textContent.trim()!='—')r.textContent=hr.textContent}}if(n>30)clearInterval(t)},700)}
function who(side){
function show(r){side.querySelectorAll('[data-role="'+r+'"]').forEach(function(n){n.style.display=''})}
sb.auth.getUser().then(function(x){var u=x&&x.data&&x.data.user;if(!u)return;var av=document.getElementById('hkAvatar'),em=u.email||'?';av.textContent=em[0].toUpperCase();
 sb.from('hr_employees').select('full_name,position,department,photo_url').eq('email',em).maybeSingle().then(function(r){var d=r&&r.data;if(!d)return;if(d.full_name){av.textContent=d.full_name[0].toUpperCase();var un=document.getElementById('hkUN');if(un)un.textContent=d.full_name}
  var ur=document.getElementById('hkUR');if(ur&&(d.position||d.department))ur.textContent=[d.position,d.department].filter(Boolean).join(' · ');
  if(d.photo_url){var p=d.photo_url;if(!/^https?:/.test(p)){sb.storage.from('employee-files').createSignedUrl(p,3600).then(function(s){if(s&&s.data)av.innerHTML='<img src="'+s.data.signedUrl+'" alt="">'})}else av.innerHTML='<img src="'+p+'" alt="">'}}).catch(function(){})});
sb.rpc('current_top_management').then(function(r){if(r&&r.data){ROLE.top=ROLE.hr=true;show('top');show('hr')}});
sb.rpc('am_i_hr').then(function(r){if(r&&r.data){ROLE.hr=true;show('hr')}})}

var PAGES=[['Home','home dashibodi nyumbani','portal.html#home',''],['Updates','updates maboresho finance','portal.html#updates',''],['Historia ya matukio','history historia matukio','portal.html#history',''],['Profile / Wasifu wangu','profile wasifu taarifa zangu','portal.html#profile',''],['Idara zetu','idara departments','portal.html#idara',''],['Mtaji wa CEO','mtaji capital ceo toa faida','portal.html#capital','top'],['Balance','balance cash mikopo matumizi mishahara faida','balance.html',''],['Combine','combine awamu hesabu','combine.html',''],['Client List (Wateja)','client list wateja customers mteja','cust-list.html',''],['Refund (Marejesho)','refund marejesho daily repayments','refund.html',''],['Dashboard','dashboard capital agents','dashboard.html',''],['Miamala review','miamala review','miamala-review.html',''],['HR: Wafanyakazi','hr wafanyakazi wasifu staff','hr.html','hr'],['HR: Mahudhurio','hr mahudhurio attendance','hr.html','hr'],['HR: Likizo','hr likizo leave','hr.html','hr'],['HR: Mishahara (Payroll)','hr mishahara payroll salary','hr.html','hr'],['HR: Utendaji','hr utendaji performance ripoti','hr.html','hr'],['Operations','operations ripoti ops','operations.html',''],['Management','management usimamizi','management.html','top'],['Wafanyakazi wapya (kukagua)','wapya kukagua thibitisha approve','management.html','top']];
var GR=[{name:'Wateja',t:'mikopo_clients',ok:function(){return true},l:function(r){return r.jina||r.name||r.full_name||''},s:function(r){return [r.simu||r.phone||r.namba_ya_simu,r.agent_code].filter(Boolean).join(' · ')},href:function(r){return 'cust-list.html#q='+encodeURIComponent(r.jina||r.name||r.full_name||'')}},
{name:'Mawakala',t:'mikopo_agents',ok:function(){return true},l:function(r){return r.name||r.code||''},s:function(r){return r.code||''},href:function(r){return 'cust-list.html#q='+encodeURIComponent(r.code||r.name||'')}},
{name:'Wafanyakazi',t:'hr_employees',ok:function(){return ROLE.hr||ROLE.top},l:function(r){return r.full_name||''},s:function(r){return [r.position,r.department].filter(Boolean).join(' · ')},href:function(){return 'hr.html'}}];
function norm(x){return String(x==null?'':x).toLowerCase()}
function esc(x){return String(x==null?'':x).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function okRole(r){return !r||(r=='hr'&&(ROLE.hr||ROLE.top))||(r=='top'&&ROLE.top)}
function load(t){if(!CACHE[t])CACHE[t]=sb.from(t).select('*').limit(2000).then(function(r){return (r&&r.data)||[]},function(){return []});return CACHE[t]}
function hit(row,q){for(var k in row){if(k=='id'||/_id$|^created_|^updated_|_at$/.test(k))continue;var v=row[k];if((typeof v=='string'&&!/^[0-9a-f]{8}-[0-9a-f]{4}-/.test(v)&&v.toLowerCase().indexOf(q)>=0)||(typeof v=='number'&&String(v).indexOf(q)>=0))return true}return false}
function authPoll(){function chk(){if(typeof sb=='undefined'||!sb||!sb.auth)return;sb.auth.getSession().then(function(r){var s=r&&r.data&&r.data.session,ac=document.getElementById('appContent');setOn(!!s&&(!ac||ac.style.display!='none'))}).catch(function(){})}chk();setInterval(chk,800)}
function prefill(){if(P!='cust-list.html'&&P!='refund.html')return;var h=location.hash;if(h.indexOf('#q=')!=0)return;var q=decodeURIComponent(h.slice(3)),n=0,t=setInterval(function(){n++;var i=document.getElementById('searchBox')||document.getElementById('findSearch');if(i){clearInterval(t);i.value=q;['input','keyup','change'].forEach(function(ev){i.dispatchEvent(new Event(ev,{bubbles:true}))})}else if(n>40)clearInterval(t)},250)}
addEventListener('hashchange',prefill);
/* ===== ukaguzi wa rangi: dark mode (mandharinyuma nyeupe -> navy, maandishi meusi -> mepesi) ===== */
var TOUCH=[],obs,busy=false,DKQ=new Set(),dkT;
function isDark(){return document.documentElement.getAttribute('data-theme')!=='light'}
function lum(c){var m=c&&c.match(/[\d.]+/g);if(!m||m.length<3)return null;var a=m.length>3?+m[3]:1;if(a<.6)return null;return(.2126*m[0]+.7152*m[1]+.0722*m[2])/255}
function skipEl(e){return e.closest('#hkTop,#hkSide,#hkSet,#hkLoader,#hkShade,.login-box,#authGate,svg,canvas,img,video')}
function ov(e,pr,v){var o=e.__hk||(e.__hk={});if(!(pr in o)){o[pr]=[e.style.getPropertyValue(pr),e.style.getPropertyPriority(pr)];TOUCH.push(e)}e.style.setProperty(pr,v,'important')}
function undo(e){var o=e.__hk;if(!o)return;for(var pr in o){if(o[pr][0])e.style.setProperty(pr,o[pr][0],o[pr][1]);else e.style.removeProperty(pr)}e.__hk=null;e.removeAttribute('data-hkd')}
function hasText(e){if(/^(INPUT|SELECT|TEXTAREA|BUTTON)$/.test(e.tagName))return true;for(var n=e.firstChild;n;n=n.nextSibling)if(n.nodeType==3&&n.nodeValue.trim())return true;return false}
function proc(e){if(e.nodeType!==1||skipEl(e))return;var cs=getComputedStyle(e),b=lum(cs.backgroundColor);
 if(b!==null&&b>.78){var inner=/^(INPUT|SELECT|TEXTAREA)$/.test(e.tagName)||(e.parentElement&&e.parentElement.closest('[data-hkd]'));ov(e,'background-color',inner?'var(--panel2)':'var(--panel)');e.setAttribute('data-hkd','1');var bl=lum(cs.borderTopColor);if(parseFloat(cs.borderTopWidth)>0&&bl!==null&&bl>.7)ov(e,'border-color','var(--border)')}
 var l=lum(cs.color);if(l!==null&&l<.45&&hasText(e)){var q=e,bg=null;while(q&&q.nodeType==1){var ql=lum(getComputedStyle(q).backgroundColor);if(ql!==null){bg=ql;break}q=q.parentElement}if(bg===null||bg<.4)ov(e,'color','var(--text)')}}
function fixTree(root){if(!isDark())return;busy=true;proc(root);var all=root.querySelectorAll?root.querySelectorAll('*'):[];for(var i=0;i<all.length;i++)proc(all[i]);if(obs)obs.takeRecords();busy=false}
function unfixAll(){TOUCH.forEach(undo);TOUCH=[]}
function startDK(){if(obs)return;obs=new MutationObserver(function(recs){if(busy)return;recs.forEach(function(r){if(r.type=='childList'){r.addedNodes.forEach(function(n){if(n.nodeType==1)DKQ.add(n)})}else if(r.target.nodeType==1){undo(r.target);DKQ.add(r.target)}});clearTimeout(dkT);dkT=setTimeout(function(){var q=Array.from(DKQ);DKQ.clear();q.forEach(function(n){if(n.isConnected)fixTree(n)})},120)});
 obs.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class','style']});
 new MutationObserver(function(){if(isDark())fixTree(document.body);else unfixAll()}).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
 fixTree(document.body);setTimeout(function(){fixTree(document.body)},800);addEventListener('load',function(){fixTree(document.body)})}
if(document.body)build();else document.addEventListener('DOMContentLoaded',build)
})();
