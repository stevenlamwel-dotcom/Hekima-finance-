/* Hekima Navigation
 * Home (portal.html) ndiyo kituo kuu. Back haiongezi historia ya zamani:
 *  - "‹ Menu" / Home  -> inarudi kwenye Home ile ile iliyopo kwenye historia (haifungui Home mpya)
 *  - Menyu ya chini kati ya kurasa za Updates -> inabadilisha ukurasa (replace), haiongezi historia
 *  - Sehemu za ndani (Matumizi, Mahudhurio...) -> kiwango kimoja tu cha mtoto: Back inarudi sehemu kuu, kisha Home
 * Haibadilishi UI, data, wala logic ya biashara. */
(function(){
  if(window.HkNav) return;
  var HOME='portal.html';

  function store(){
    return {
      get:function(k){ try{ return sessionStorage.getItem(k); }catch(e){ return null; } },
      set:function(k,v){ try{ sessionStorage.setItem(k,v); }catch(e){} },
      del:function(k){ try{ sessionStorage.removeItem(k); }catch(e){} }
    };
  }
  var ss=store();

  function fileOf(u){
    try{
      var a=new URL(u,location.href);
      if(a.origin!==location.origin) return null;
      return a.pathname.split('/').pop()||'index.html';
    }catch(e){ return null; }
  }
  function isHomeFile(f){ return f==='portal.html'||f==='portal'; }
  var ME=fileOf(location.href), IS_HOME=isHomeFile(ME);

  var _push=history.pushState, _rep=history.replaceState;
  function st(){ var s=history.state; return (s&&typeof s==='object')?s:{}; }
  function depth(){ var d=st().hkd; return typeof d==='number'?d:null; }
  function base(){ var b=st().hkb; return typeof b==='number'?b:null; }
  function merge(s,extra){
    var o=(s&&typeof s==='object'&&!Array.isArray(s))?Object.assign({},s):(s==null?{}:{hkv:s});
    for(var k in extra){ if(extra[k]!==undefined) o[k]=extra[k]; }
    return o;
  }

  /* Hesabu ya "umbali kutoka Home" inabebwa ndani ya kila entry ya historia (hkd),
     hata kama ukurasa unatumia history.pushState/replaceState yake mwenyewe (mf. cust-list). */
  history.pushState=function(s,t,u){
    var c=st(), d=(typeof c.hkd==='number')?c.hkd+1:undefined;
    return _push.call(history, merge(s,{hkd:d, hkb:c.hkb}), t, u);
  };
  history.replaceState=function(s,t,u){
    var c=st();
    return _rep.call(history, merge(s,{hkd:c.hkd, hkb:c.hkb}), t, u);
  };

  function init(){
    if(IS_HOME){
      _rep.call(history, merge(history.state,{hkd:0,hkb:0}), '');
      ss.set('hkCur','0'); ss.set('hkCurF',ME||'');
      ss.del('hkRep');
      return;
    }
    var d=depth();
    if(d==null){
      var carry=ss.get('hkRep'); ss.del('hkRep');
      var ref=fileOf(document.referrer||'');
      var cur=ss.get('hkCur'), curF=ss.get('hkCurF');
      if(carry){
        var p=carry.split('|');
        if(p.length===2 && !isNaN(+p[0]) && Date.now()-(+p[1])<15000) d=+p[0];
      }
      if(d==null){
        if(ref && isHomeFile(ref)) d=1;
        else if(ref && ref===curF && ref!==ME && cur!==null && cur!=='' && !isNaN(+cur)) d=(+cur)+1;
        else if(!ref && curF && isHomeFile(curF) && cur==='0') d=1;   /* Home ina moduli hii na browser haitumi referrer */
      }
      if(d!=null) _rep.call(history, merge(history.state,{hkd:d,hkb:d}), '');
    }
  }
  init();

  function remember(){
    if(IS_HOME) return;
    var d=depth();
    ss.set('hkCur', d==null?'':String(d)); ss.set('hkCurF', ME||'');
  }
  remember();
  window.addEventListener('pagehide', remember);
  window.addEventListener('pageshow', remember);

  var leaving=false;
  window.addEventListener('beforeunload', function(){ leaving=true; });

  /* Rudi Home: tumia Home iliyopo tayari kwenye historia, usifungue mpya. */
  var homing=false;
  function home(){
    if(homing) return;                       /* simu mbili za haraka (kiungo + menyu) zisirudi mara mbili */
    homing=true; setTimeout(function(){ homing=false; }, 2500);
    var d=depth();
    if(d!=null && d>0){
      leaving=false;
      history.go(-d);
      setTimeout(function(){ if(!leaving && !document.hidden) location.replace(HOME); }, 1500);
      return;
    }
    location.replace(HOME);
  }

  /* Nenda kwenye ukurasa ndugu (mf. Dashboard -> Refund): badilisha ukurasa, usiongeze historia. */
  var pendingGo=null;
  function doReplace(url){
    var d=depth();
    if(d!=null) ss.set('hkRep', d+'|'+Date.now());
    location.replace(url);
  }
  function go(url){
    if(isHomeFile(fileOf(url))){ home(); return; }
    var d=depth(), b=base();
    if(d!=null && b!=null && d>b){ pendingGo=url; history.go(-(d-b)); return; }
    doReplace(url);
  }

  /* Kiungo chochote cha "portal.html" kinaenda Home kwa utaratibu huo huo. */
  document.addEventListener('click', function(e){
    if(IS_HOME || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a=e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if(!a) return;
    if(a.target && a.target!=='_self') return;
    if(a.hasAttribute('download')) return;
    if(a.dataset && a.dataset.h) return;       /* viungo vya menyu ya shell vinashughulikiwa na shell yenyewe */
    if(a.hash) return;                         /* portal.html#updates n.k. -> shell */
    if(isHomeFile(fileOf(a.href))){ e.preventDefault(); home(); }
  }, true);

  /* Sehemu za ndani (tabs): kiwango kimoja tu cha mtoto -> Back inarudi sehemu kuu kisha Home. */
  var T=null, expectPop=false, applying=false;
  function tabs(cfg){
    T=cfg;
    if(st().hkc){ history.back(); }   /* ukurasa umerudiwa (reload) ukiwa kwenye sehemu ya mtoto */
  }
  function tab(name){
    if(!T || applying) return;
    var s=st();
    if(s.hkc){
      if(name===s.hkm){
        expectPop=true; setTimeout(function(){ expectPop=false; }, 1200);
        history.back();
      }else if(name!==s.hkt){
        _rep.call(history, merge(history.state,{hkt:name}), '');
      }
    }else{
      var cur=T.cur();
      if(!cur || name===cur) return;
      _rep.call(history, merge(history.state,{hkm:cur}), '');
      history.pushState({hkc:1,hkm:cur,hkt:name}, '');
    }
  }

  window.addEventListener('popstate', function(){
    if(pendingGo){ var u=pendingGo; pendingGo=null; doReplace(u); return; }
    if(!T) return;
    if(expectPop){ expectPop=false; return; }
    var s=st(), target=s.hkc ? s.hkt : s.hkm;
    if(target){
      applying=true;
      try{ T.show(target); }finally{ applying=false; }
    }
  });

  window.HkNav={ home:home, go:go, tabs:tabs, tab:tab };
})();
