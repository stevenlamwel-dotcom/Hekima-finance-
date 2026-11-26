/* Hekima Mkeka
 * PDF ya muundo wa timu: BRANCH | AREAS | UPDATE | AG CODE | NO | AGENT | ZONE | MANAGER
 * Zone imeunganishwa kwa agents wake, kila Zone ina rangi yake, juu kuna logo na maelekezo.
 * Inatumika na Management (Pakua PDF) na HR (Download Mkeka). */
(function(){
  if(window.HkMkeka) return;

  var DEFAULT_BANNERS=[
    'AGENTS WATALIPWA KWA KUZINGATIA IDADI YA WATEJA',
    'AGENTS WENYE WATEJA CHINI YA KIWANGO TUNAENDA KUWASIMAMISHA',
    'MIAMALA HEWA YOTE, ZONE WA ENEO HUSIKA ATAWAJIBIKA'
  ];
  var BAN_COL=[[0,150,70],[220,0,0],[0,0,0]];
  var PALETTE=[[252,228,214],[226,240,217],[221,235,247],[241,214,240],[236,236,236],[255,242,204],[205,238,243],[232,222,212]];
  var KHAKI=[200,192,150];

  function norm(s){ return String(s==null?'':s).toLowerCase().replace(/\*/g,'').replace(/\s+/g,' ').trim(); }

  /* Maelekezo ya juu na mameneja wa matawi vinahifadhiwa ndani ya "maelezo madogo" ya muundo (subtitle). */
  function decodeMeta(sub){
    var out={ banners:null, managers:{}, supervisors:{}, mgrIds:{}, supIds:{}, zones:{} };
    var s=String(sub||'');
    if(s.indexOf('BANNER:')!==0) return out;
    var banners=[];
    s.split('\n').slice(1).forEach(function(l){
      l=l.trim(); if(!l) return;
      var m=l.match(/^MGR:([^=]+)=(.*)$/), sp=l.match(/^SUP:([^=]+)=(.*)$/), mi=l.match(/^MGI:([^=]+)=(.*)$/), si=l.match(/^SPI:([^=]+)=(.*)$/), zn=l.match(/^ZN:([^=]+)=(.*)$/);
      if(m) out.managers[m[1].trim().toUpperCase()]=m[2].trim();
      else if(sp) out.supervisors[sp[1].trim().toUpperCase()]=sp[2].trim();
      else if(mi) out.mgrIds[mi[1].trim().toUpperCase()]=mi[2].trim();
      else if(si) out.supIds[si[1].trim().toUpperCase()]=si[2].trim();
      else if(zn) out.zones[zn[1].trim().toUpperCase()]=zn[2].trim();
      else banners.push(l);
    });
    out.banners=banners;
    return out;
  }
  function encodeMeta(m){
    var s='BANNER:';
    (m.banners==null ? DEFAULT_BANNERS : m.banners).forEach(function(l){ l=String(l||'').trim(); if(l) s+='\n'+l; });
    Object.keys(m.managers||{}).forEach(function(k){ var v=String(m.managers[k]||'').trim(); if(v) s+='\nMGR:'+k+'='+v; });
    Object.keys(m.supervisors||{}).forEach(function(k){ var v=String(m.supervisors[k]||'').trim(); if(v) s+='\nSUP:'+k+'='+v; });
    Object.keys(m.mgrIds||{}).forEach(function(k){ var v=String(m.mgrIds[k]||'').trim(); if(v) s+='\nMGI:'+k+'='+v; });
    Object.keys(m.supIds||{}).forEach(function(k){ var v=String(m.supIds[k]||'').trim(); if(v) s+='\nSPI:'+k+'='+v; });
    Object.keys(m.zones||{}).forEach(function(k){ s+='\nZN:'+k+'='+String(m.zones[k]||'').trim(); });
    return s;
  }

  /* Matawi -> zones -> agents, kwa mpangilio wa kuonekana kwanza */
  function groups(rows){
    var order=[], map={};
    (rows||[]).forEach(function(r,i){
      var b=String(r.branch||'').trim()||'—';
      if(!map[b]){ map[b]={ name:b, zones:[], zmap:{} }; order.push(b); }
      var g=map[b], z=String(r.zone_manager||'').trim()||'—';
      if(!g.zmap[z]){ g.zmap[z]={ name:z, agents:[] }; g.zones.push(g.zmap[z]); }
      g.zmap[z].agents.push({ r:r, i:i });
    });
    return order.map(function(b){ return map[b]; });
  }

  /* Manager wa tawi: aliyewekwa kwa mkono, vinginevyo anayeripotiwa na Zone (kwenye "Msimamizi") */
  function managerFor(branch, g, meta, people){
    var m=meta.managers[String(branch).toUpperCase()]; if(m) return m;
    var parent={}; (people||[]).forEach(function(p){ if(p.full_name && p.supervisor) parent[norm(p.full_name)]=p.supervisor; });
    for(var k=0;k<g.zones.length;k++){ var v=parent[norm(g.zones[k].name)]; if(v) return v; }
    return '';
  }

  /* Supervisor wa zone: aliyewekwa kwa mkono kwa (TAWI|ZONE) */
  function supFor(branch, zone, meta){ return (meta.supervisors||{})[String(branch).toUpperCase()+'|'+String(zone).toUpperCase()] || ''; }

  function loadScript(src){
    return new Promise(function(res,rej){
      var s=document.createElement('script'); s.src=src; s.onload=res;
      s.onerror=function(){ rej(new Error('Imeshindwa kupakia maktaba ya PDF')); };
      document.head.appendChild(s);
    });
  }
  var _libs=null;
  function loadLibs(){
    if(window.jspdf && window.jspdf.jsPDF && window.jspdf.jsPDF.API && window.jspdf.jsPDF.API.autoTable) return Promise.resolve();
    if(_libs) return _libs;
    _libs=(window.jspdf && window.jspdf.jsPDF ? Promise.resolve() : loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'))
      .then(function(){ return loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js'); })
      .catch(function(e){ _libs=null; throw e; });
    return _libs;
  }
  var _logo=null;
  function logoData(){
    if(_logo) return _logo;
    _logo=new Promise(function(res){
      try{
        var im=new Image();
        im.onload=function(){ try{ var c=document.createElement('canvas'); c.width=240; c.height=240; var x=c.getContext('2d'); x.fillStyle='#fff'; x.fillRect(0,0,240,240); x.drawImage(im,0,0,240,240); res(c.toDataURL('image/jpeg',0.92)); }catch(e){ res(null); } };
        im.onerror=function(){ res(null); };
        im.src='assets/hekima-logo.png';
      }catch(e){ res(null); }
    });
    return _logo;
  }

  async function pdf(meta, rows, people){
    rows=rows||[];
    if(!rows.length) throw new Error('Mkeka bado hauna agents');
    await loadLibs();
    var logo=await logoData();
    var M=decodeMeta(meta && meta.subtitle);
    var banners=(M.banners==null) ? DEFAULT_BANNERS : M.banners;
    var title=(meta && meta.title) || 'BRANCH AGENT STRUCTURE';
    var jsPDF=window.jspdf.jsPDF;
    var doc=new jsPDF({ orientation:'landscape', unit:'pt', format:'a4' });
    var W=doc.internal.pageSize.getWidth(), H=doc.internal.pageSize.getHeight(), ML=24;
    var NAVY=[0,24,60], GOLD=[204,156,36], MUTED=[100,112,128];
    var G=groups(rows), nz=0; G.forEach(function(g){ nz+=g.zones.length; });
    var now=new Date(), pad=function(n){ return String(n).padStart(2,'0'); };
    var stamp=pad(now.getDate())+'/'+pad(now.getMonth()+1)+'/'+now.getFullYear();

    // Kichwa chenye logo
    if(logo){ try{ doc.addImage(logo,'JPEG',ML,14,48,48); }catch(e){} }
    doc.setFont('helvetica','bold'); doc.setFontSize(9); doc.setTextColor.apply(doc,GOLD); doc.text('HEKIMA FINANCE', ML+58, 28);
    doc.setFontSize(17); doc.setTextColor.apply(doc,NAVY); doc.text(title, ML+58, 48);
    doc.setFont('helvetica','normal'); doc.setFontSize(8.5); doc.setTextColor.apply(doc,MUTED);
    doc.text('Agents: '+rows.length+'   ·   Zones: '+nz+'   ·   Matawi: '+G.length, W-ML, 30, {align:'right'});
    doc.text(stamp, W-ML, 44, {align:'right'});
    doc.setDrawColor.apply(doc,GOLD); doc.setLineWidth(1.2); doc.line(ML,68,W-ML,68);

    // Maelekezo ya juu (kijani, nyekundu, nyeusi)
    var y=74;
    banners.forEach(function(t,i){
      doc.setFillColor.apply(doc,KHAKI); doc.setDrawColor(120,110,70); doc.setLineWidth(.4);
      doc.rect(ML,y,W-2*ML,17,'FD');
      doc.setFont('helvetica','bold'); doc.setFontSize(10.5); doc.setTextColor.apply(doc,BAN_COL[i%BAN_COL.length]);
      doc.text(String(t), W/2, y+12, {align:'center'});
      y+=17;
    });

    // Jedwali
    var hasSup=false; G.forEach(function(g){ g.zones.forEach(function(z){ if(supFor(g.name,z.name,M)) hasSup=true; }); });
    var body=[], seq=0, zi=0;
    G.forEach(function(g){
      var mgr=managerFor(g.name, g, M, people);
      g.zones.forEach(function(z){
        var col=PALETTE[zi++ % PALETTE.length];
        z.agents.forEach(function(a,k){
          seq++; var r=a.r, c=function(t){ return { content:String(t==null?'':t), styles:{ fillColor:col } }; };
          var row=[ c(g.name), c(r.area), c(r.update_grp), c(r.ag_code), c(seq), c(r.agent_name) ];
          if(k===0){
            row.push({ content: z.name==='—' ? '' : z.name, rowSpan:z.agents.length, styles:{ fillColor:col, valign:'middle', halign:'center' } });
            if(hasSup) row.push({ content: supFor(g.name,z.name,M), rowSpan:z.agents.length, styles:{ fillColor:col, valign:'middle', halign:'center' } });
          }
          row.push(c(mgr));
          body.push(row);
        });
      });
    });
    var drawn={};
    function pageHead(n){
      if(n<2 || drawn[n]) return; drawn[n]=true;
      if(logo){ try{ doc.addImage(logo,'JPEG',ML,8,18,18); }catch(e){} }
      doc.setFont('helvetica','bold'); doc.setFontSize(8.5); doc.setTextColor.apply(doc,NAVY); doc.text(title, ML+24, 20);
      doc.setFont('helvetica','normal'); doc.setTextColor.apply(doc,MUTED); doc.text(stamp, W-ML, 20, {align:'right'});
    }
    doc.autoTable({
      startY:y, theme:'grid', margin:{ left:ML, right:ML, top:32, bottom:26 }, rowPageBreak:'avoid',
      head:[ hasSup ? ['BRANCH','AREAS','UPDATE','AG CODE','NO','AGENT','ZONE','SUPERVISOR','MANAGER'] : ['BRANCH','AREAS','UPDATE','AG CODE','NO','AGENT','ZONE','MANAGER'] ],
      body:body,
      styles:{ font:'helvetica', fontStyle:'bold', fontSize:7.4, halign:'center', valign:'middle', textColor:[0,0,0],
               cellPadding:{ top:2, bottom:2, left:2, right:2 }, lineColor:[70,70,70], lineWidth:.35, overflow:'linebreak' },
      headStyles:{ fillColor:KHAKI, textColor:[0,0,0], fontSize:8.5 },
      columnStyles: hasSup ? { 0:{cellWidth:54}, 1:{cellWidth:88}, 2:{cellWidth:86}, 3:{cellWidth:48}, 4:{cellWidth:28}, 5:{cellWidth:128}, 6:{cellWidth:128}, 7:{cellWidth:118}, 8:{cellWidth:'auto'} }
                         : { 0:{cellWidth:64}, 1:{cellWidth:104}, 2:{cellWidth:100}, 3:{cellWidth:56}, 4:{cellWidth:32}, 5:{cellWidth:148}, 6:{cellWidth:152}, 7:{cellWidth:'auto'} },
      didDrawPage:function(d){ pageHead(d.pageNumber); }
    });
    var pages=doc.internal.getNumberOfPages();
    for(var p=1;p<=pages;p++){
      doc.setPage(p); doc.setFont('helvetica','normal'); doc.setFontSize(7.5); doc.setTextColor.apply(doc,MUTED);
      doc.text('Hekima Finance  ·  '+stamp, ML, H-12);
      doc.text('Ukurasa '+p+' / '+pages, W-ML, H-12, {align:'right'});
    }
    doc.save('Mkeka_'+now.getFullYear()+pad(now.getMonth()+1)+pad(now.getDate())+'.pdf');
  }

  window.HkMkeka={ pdf:pdf, decodeMeta:decodeMeta, encodeMeta:encodeMeta, groups:groups, norm:norm, DEFAULT_BANNERS:DEFAULT_BANNERS, PALETTE:PALETTE };
})();
