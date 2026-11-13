(function(){
'use strict';
const $=id=>document.getElementById(id);
/* ===== PERSONALIZAÇÃO: edita aqui ou usa o link  ?para=Nome&de=Nome ===== */
const CONFIG={para:'',de:''};
const qs=new URLSearchParams(location.search),PARA=qs.get('para')||CONFIG.para,DE=qs.get('de')||CONFIG.de;
if(PARA)$('ln').textContent=' '+PARA;
if(DE)$('from').textContent='— '+DE;
function fail(){$('err').style.display='block'}
const clamp=(x,a,b)=>Math.min(b,Math.max(a,x));
/* ===== fundo 2D: luzes desfocadas ===== */
(function(){const c=$('bg'),x=c.getContext('2d');let w,h,P=[];function rs(){w=c.width=innerWidth;h=c.height=innerHeight}rs();addEventListener('resize',rs);
for(let i=0;i<36;i++)P.push({x:Math.random(),y:Math.random(),r:5+Math.random()*28,s:.02+Math.random()*.06,c:Math.random()<.4?'255,61,77':'74,125,255',a:.07+Math.random()*.15,p:Math.random()*6});
(function d(t){requestAnimationFrame(d);x.clearRect(0,0,w,h);for(const p of P){p.y-=p.s/60;if(p.y<-.1)p.y=1.1;const px=p.x*w+Math.sin(t/2500+p.p)*18,py=p.y*h,g=x.createRadialGradient(px,py,0,px,py,p.r);g.addColorStop(0,'rgba('+p.c+','+p.a+')');g.addColorStop(1,'rgba('+p.c+',0)');x.fillStyle=g;x.beginPath();x.arc(px,py,p.r,0,7);x.fill()}})(0)})();
/* ===== áudio sintetizado (sem ficheiros) ===== */
const AC=window.AudioContext||window.webkitAudioContext;let ac,mg,nb,sOn=true;
function audioInit(){if(ac||!AC)return;ac=new AC();mg=ac.createGain();mg.gain.value=.55;mg.connect(ac.destination);nb=ac.createBuffer(1,ac.sampleRate,ac.sampleRate);const d=nb.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;music()}
function tone(f,t,d,ty,v,f2){const o=ac.createOscillator(),g=ac.createGain();o.type=ty||'sine';o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+d);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v||.2,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(mg);o.start(t);o.stop(t+d+.05)}
function noise(t,d,f0,f1,v){const s=ac.createBufferSource();s.buffer=nb;s.loop=true;const b=ac.createBiquadFilter();b.type='bandpass';b.Q.value=1.2;b.frequency.setValueAtTime(f0,t);b.frequency.exponentialRampToValueAtTime(f1,t+d);const g=ac.createGain();g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+d*.3);g.gain.exponentialRampToValueAtTime(.0001,t+d);s.connect(b);b.connect(g);g.connect(mg);s.start(t);s.stop(t+d+.05)}
function sfx(k){if(!ac||!sOn)return;const t=ac.currentTime;
 if(k==='open'){noise(t,1.1,300,3500,.5);tone(180,t,.6,'sine',.35,60);[523,659,784,1047].forEach((f,i)=>tone(f,t+.5+i*.12,.9,'triangle',.18))}
 else if(k==='pick'){tone(700,t,.15,'sine',.3,200);tone(1200,t+.08,.4,'triangle',.15)}
 else if(k==='paper'){noise(t,.6,1500,5000,.3)}
 else if(k==='final'){[523,659,784,1047,1319,1568].forEach((f,i)=>tone(f,t+i*.11,1.2,'triangle',.2));noise(t,1.5,500,6000,.3)}
 else if(k==='tap'){tone(400,t,.1,'sine',.2,150)}}
function music(){const ch=[[220,261.6,329.6],[174.6,220,261.6],[261.6,329.6,392],[196,246.9,293.7]];let i=0;
 function bar(){if(!ac||!sOn)return;const t=ac.currentTime,c=ch[i++%4];c.forEach(f=>tone(f/2,t,3.8,'triangle',.05));for(let j=0;j<8;j++)tone(c[j%3]*2,t+j*.5,.7,'sine',.035)}
 bar();setInterval(bar,4000)}
$('snd').onclick=()=>{audioInit();if(ac&&ac.state==='suspended')ac.resume();sOn=!sOn;if(mg)mg.gain.value=sOn?.55:0;$('snd').textContent=sOn?'🔊':'🔇'};
$('start').onclick=()=>{audioInit();if(ac&&ac.state==='suspended')ac.resume();sOn=true;$('snd').textContent=ac?'🔊':'🔇';$('intro').classList.remove('show');sfx('tap')};
if(!window.THREE){fail();return}
try{
const T=THREE,cv=$('gl');
const R=new T.WebGLRenderer({canvas:cv,antialias:true,alpha:true});
R.setPixelRatio(Math.min(devicePixelRatio,1.75));R.outputEncoding=T.sRGBEncoding;R.toneMapping=T.ACESFilmicToneMapping;R.toneMappingExposure=1.2;
R.shadowMap.enabled=true;R.shadowMap.type=T.PCFSoftShadowMap;
const scene=new T.Scene(),cam=new T.PerspectiveCamera(38,1,.1,100);
/* ambiente de estúdio para reflexos */
const es=new T.Scene();es.background=new T.Color(0x070b22);
function panel(c,k,x,y,z,w,h){const m=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({color:new T.Color(c).multiplyScalar(k),side:T.DoubleSide}));m.position.set(x,y,z);m.lookAt(0,0,0);es.add(m)}
panel(0xffffff,7,0,9,3,10,6);panel(0x4a7dff,6,-9,3,1,3,9);panel(0xff3d4d,5,9,3,-2,3,9);panel(0xffffff,2.5,0,2,-9,12,4);panel(0xffffff,1.5,0,2,9,8,3);
scene.environment=new T.PMREMGenerator(R).fromScene(es,.03).texture;
/* texturas desenhadas por código */
function ctex(w,h,fn,srgb){const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);const t=new T.CanvasTexture(c);if(srgb!==false)t.encoding=T.sRGBEncoding;t.anisotropy=8;return t}
function web(g,cx,cy,rad,rings,rays){for(let i=0;i<rays;i++){const a=i/rays*6.2832;g.beginPath();g.moveTo(cx,cy);g.lineTo(cx+Math.cos(a)*rad,cy+Math.sin(a)*rad);g.stroke()}
 for(let k=1;k<=rings;k++){const r=rad*k/rings;g.beginPath();for(let i=0;i<=rays;i++){const a=i/rays*6.2832,m=(i-.5)/rays*6.2832,x=cx+Math.cos(a)*r,y=cy+Math.sin(a)*r;if(i==0)g.moveTo(x,y);else g.quadraticCurveTo(cx+Math.cos(m)*r*.9,cy+Math.sin(m)*r*.9,x,y)}g.stroke()}}
const paper=ctex(1024,1024,(g,w,h)=>{const gr=g.createLinearGradient(0,0,w,h);gr.addColorStop(0,'#e5192d');gr.addColorStop(1,'#a50d1c');g.fillStyle=gr;g.fillRect(0,0,w,h);g.strokeStyle='rgba(255,255,255,.22)';g.lineWidth=2;web(g,w*.5,h*.5,w*.75,9,14);for(let i=0;i<9000;i++){g.fillStyle='rgba(0,0,0,'+Math.random()*.05+')';g.fillRect(Math.random()*w,Math.random()*h,2,2)}});
const bump=ctex(256,256,(g,w,h)=>{g.fillStyle='#888';g.fillRect(0,0,w,h);for(let i=0;i<6000;i++){const v=100+Math.random()*80|0;g.fillStyle='rgb('+v+','+v+','+v+')';g.fillRect(Math.random()*w,Math.random()*h,2,2)}},false);
const emb=ctex(256,256,(g)=>{g.beginPath();g.arc(128,128,120,0,6.2832);g.fillStyle='#fff';g.fill();g.lineWidth=12;g.strokeStyle='#14339a';g.stroke();g.strokeStyle='#c1121f';g.lineWidth=9;g.lineCap='round';g.beginPath();[[-70,-70],[-90,-20],[-90,30],[-65,75]].forEach(p=>{g.moveTo(128,120);g.lineTo(128+p[0],128+p[1]);g.moveTo(128,120);g.lineTo(128-p[0],128+p[1])});g.stroke();g.fillStyle='#c1121f';g.beginPath();g.ellipse(128,138,17,32,0,0,6.2832);g.fill();g.beginPath();g.arc(128,98,13,0,6.2832);g.fill()});
const lidTex=ctex(768,768,(g,w,h)=>{const gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,'#2a52d6');gr.addColorStop(1,'#0a1a55');g.fillStyle=gr;g.fillRect(0,0,w,h);g.strokeStyle='rgba(255,255,255,.2)';g.lineWidth=2;web(g,w/2,h/2,w*.7,8,12);g.strokeStyle='#fff';g.lineWidth=6;g.strokeRect(70,250,w-140,260);g.fillStyle='#fff';g.textAlign='center';g.font='bold 60px Georgia,serif';g.fillText('Porque mereces',w/2,355);g.fillText('todo o mérito!',w/2,435)});
const floorA=ctex(256,256,(g,w,h)=>{const r=g.createRadialGradient(128,128,10,128,128,128);r.addColorStop(0,'#fff');r.addColorStop(.55,'#888');r.addColorStop(1,'#000');g.fillStyle=r;g.fillRect(0,0,w,h)},false);
const mk=(c,m,r,cc)=>new T.MeshPhysicalMaterial({color:c,metalness:m||0,roughness:r==null?.4:r,clearcoat:cc||0,clearcoatRoughness:.2});
const mRed=new T.MeshPhysicalMaterial({map:paper,bumpMap:bump,bumpScale:.4,roughness:.38,clearcoat:.8,clearcoatRoughness:.25}),mBlue=mk(0x1d44c4,.15,.3,1);
/* luzes */
scene.add(new T.HemisphereLight(0x8fb0ff,0x200008,.35));
const key=new T.SpotLight(0xffffff,2.4,50,.6,.6);key.position.set(5,11,6);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.bias=-.0004;scene.add(key);
const rb=new T.DirectionalLight(0x4a7dff,1.6);rb.position.set(-6,4,-5);scene.add(rb);const rr=new T.DirectionalLight(0xff3d4d,1.3);rr.position.set(6,3,-5);scene.add(rr);
const inner=new T.PointLight(0xa8c4ff,0,7);inner.position.set(0,.9,0);scene.add(inner);const flash=new T.PointLight(0xffffff,0,9);flash.position.set(0,3.4,2.2);scene.add(flash);
const floor=new T.Mesh(new T.CircleGeometry(8,64),new T.MeshStandardMaterial({color:0x0c1536,roughness:.3,metalness:.7,alphaMap:floorA,transparent:true}));floor.rotation.x=-1.5708;floor.receiveShadow=true;scene.add(floor);
/* caixa */
const W=2.4,H=1.6,D=2.0,t=.07,root=new T.Group();scene.add(root);
function bx(w,h,d,m,x,y,z,p){const o=new T.Mesh(new T.BoxGeometry(w,h,d),m);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;(p||root).add(o);return o}
bx(W,t,D,mRed,0,t/2,0);bx(W,H,t,mRed,0,H/2,D/2-t/2);bx(W,H,t,mRed,0,H/2,-D/2+t/2);bx(t,H,D,mRed,-W/2+t/2,H/2,0);bx(t,H,D,mRed,W/2-t/2,H/2,0);
bx(.4,H+.01,.02,mBlue,0,H/2,D/2+.012);bx(.4,H+.01,.02,mBlue,0,H/2,-D/2-.012);
const dec=new T.Mesh(new T.PlaneGeometry(.62,.62),new T.MeshStandardMaterial({map:emb,transparent:true,roughness:.3}));dec.position.set(0,.5,D/2+.03);root.add(dec);
const lid=new T.Group();lid.position.set(0,H,-D/2-.06);root.add(lid);const LW=W+.14,LD=D+.14,LH=.42;
bx(LW,.07,LD,mRed,0,LH-.035,LD/2,lid);bx(LW,LH,.05,mRed,0,LH/2,LD-.025,lid);bx(LW,LH,.05,mRed,0,LH/2,.025,lid);bx(.05,LH,LD,mRed,-LW/2+.025,LH/2,LD/2,lid);bx(.05,LH,LD,mRed,LW/2-.025,LH/2,LD/2,lid);
bx(.42,.02,LD+.02,mBlue,0,LH,LD/2,lid);bx(.42,LH+.01,.02,mBlue,0,LH/2,LD+.01,lid);
const inl=new T.Mesh(new T.PlaneGeometry(LW-.2,LD-.2),new T.MeshStandardMaterial({map:lidTex,roughness:.35,metalness:.1}));inl.rotation.x=Math.PI/2;inl.position.set(0,LH-.075,LD/2);lid.add(inl);
const bow=new T.Group();bow.position.set(0,LH+.02,LD/2+.1);lid.add(bow);
[-1,1].forEach(s=>{const l=new T.Mesh(new T.TorusGeometry(.3,.085,18,48),mBlue);l.scale.set(.85,1.2,1);l.position.set(s*.32,.2,0);l.rotation.y=s*.55;l.rotation.z=-s*.3;l.castShadow=true;bow.add(l);const tl=new T.Mesh(new T.BoxGeometry(.2,.7,.04),mBlue);tl.position.set(s*.2,0,.38);tl.rotation.set(.5,0,s*.35);tl.castShadow=true;bow.add(tl)});
const kn=new T.Mesh(new T.SphereGeometry(.17,24,16),mBlue);kn.position.set(0,.14,0);kn.castShadow=true;bow.add(kn);
/* ===== modelos 3D dos presentes (estilizados, feitos por código) ===== */
const Bx=(w,h,d)=>new T.BoxGeometry(w,h,d),Cy=(a,b,h)=>new T.CylinderGeometry(a,b,h,32),Sp=r=>new T.SphereGeometry(r,24,16),To=(r,tb,arc)=>new T.TorusGeometry(r,tb,14,48,arc||6.2832);
function add(p,geo,mat,x,y,z,rx,ry,rz){const o=new T.Mesh(geo,mat);o.position.set(x||0,y||0,z||0);o.rotation.set(rx||0,ry||0,rz||0);o.castShadow=true;p.add(o);return o}
const WH=mk(0xf2f4ff,0,.35,.6),RD=mk(0xd4162a,0,.4,.8),BL=mk(0x1e3fae,0,.4,.7),DK=mk(0x10183a,.3,.35,1),GD=mk(0xd9a93a,1,.22,1);
const MODELS=[
()=>{const g=new T.Group();add(g,To(.34,.06),DK).scale.set(.8,1,1);add(g,Cy(.22,.22,.1),GD,0,.34,0);add(g,Cy(.18,.18,.12),mk(0x1e3fae,.3,.15,1),0,.35,0);add(g,Bx(.02,.01,.14),WH,0,.415,-.04);add(g,Bx(.1,.01,.02),WH,.04,.415,0);return g},
()=>{const g=new T.Group(),gl=new T.MeshPhysicalMaterial({color:0x0f2a80,transparent:true,opacity:.78,roughness:.05,clearcoat:1});add(g,Bx(.46,.6,.26),gl);const li=add(g,Bx(.36,.46,.18),mk(0x4a7dff,0,.2),0,-.04,0);li.material.emissive=new T.Color(0x1b3cb0);add(g,Cy(.07,.07,.1),mk(0xc8d0e6,1,.2,1),0,.35,0);add(g,Cy(.11,.11,.2),GD,0,.5,0);add(g,Bx(.26,.14,.01),WH,0,-.05,.131);return g},
()=>{const g=new T.Group();add(g,Bx(.95,.1,.36),WH,0,-.16,0);add(g,Bx(.6,.3,.34),RD,-.1,.04,0);add(g,Sp(.18),RD,.3,-.04,0).scale.set(1.5,.8,1.05);add(g,Bx(.22,.4,.34),BL,-.38,.1,0);add(g,Bx(.5,.05,.02),BL,-.05,-.08,.18);for(let i=0;i<3;i++)add(g,Bx(.04,.025,.22),WH,i*.1-.1,.2-i*.03,0,0,0,-.3);return g},
()=>{const g=new T.Group();add(g,To(.45,.05,Math.PI),DK,0,-.05,0);[-1,1].forEach(s=>{add(g,Cy(.18,.18,.12),mk(0x2a52d6,.5,.25,1),s*.45,-.05,0,0,0,Math.PI/2);add(g,To(.14,.045),RD,s*.38,-.05,0,0,Math.PI/2,0)});return g},
()=>{const g=new T.Group(),ln=mk(0x1e3fae,.9,.08,1);[-1,1].forEach(s=>{add(g,Cy(.22,.22,.04),ln,s*.27,0,0,Math.PI/2,0,0);add(g,To(.22,.025),DK,s*.27,0,0);add(g,Bx(.03,.03,.5),DK,s*.5,.05,-.25)});add(g,Bx(.1,.03,.03),DK,0,.05,0);return g},
()=>{const g=new T.Group();add(g,Bx(.6,.78,.34),BL);add(g,Bx(.46,.3,.12),RD,0,-.18,.22);add(g,Bx(.34,.03,.02),WH,0,-.04,.285);add(g,To(.09,.022,Math.PI),DK,0,.4,0);add(g,Bx(.07,.6,.05),DK,-.22,0,-.2);add(g,Bx(.07,.6,.05),DK,.22,0,-.2);return g},
()=>{const g=new T.Group(),dk=mk(0x141a38,.3,.35,1);add(g,Bx(.85,.15,.46),dk);[-1,1].forEach(s=>{add(g,Sp(.2),dk,s*.4,-.06,.12).scale.set(.95,.9,1.5);add(g,Cy(.07,.08,.08),mk(0x4a7dff,.3,.3,1),s*.2,.1,-.04*s)});[[.3,-.12,0xd4162a],[.3,.02,0x4a7dff],[.23,-.05,0xffffff],[.37,-.05,0xd9a93a]].forEach(b=>add(g,Sp(.04),mk(b[2],.2,.3,1),b[0],.09,b[1]));add(g,Bx(.14,.04,.05),WH,-.3,.09,-.05);add(g,Bx(.05,.04,.14),WH,-.3,.09,-.05);return g},
()=>{const g=new T.Group();add(g,Bx(.62,.74,.1),RD);[-1,1].forEach(s=>add(g,Bx(.34,.22,.1),RD,s*.44,.3,0,0,0,-s*.7));add(g,Cy(.12,.12,.06),mk(0x050818),0,.38,0);add(g,To(.12,.03),BL,0,.37,0,Math.PI/2,0,0);const em=new T.Mesh(new T.PlaneGeometry(.3,.3),new T.MeshStandardMaterial({map:emb,transparent:true}));em.position.set(0,.04,.056);g.add(em);return g},
()=>{const g=new T.Group(),br=mk(0x2a1810,0,.6,.3);add(g,Bx(.7,.46,.1),br);add(g,Bx(.7,.012,.11),DK);add(g,Bx(.66,.012,.102),RD,0,.2,0);add(g,Bx(.3,.02,.08),GD,.1,.24,0);add(g,Bx(.14,.1,.02),DK,-.2,-.08,.056);return g},
()=>{const g=new T.Group();add(g,Bx(.5,.9,.16),mk(0x2a52d6,.8,.25,1),0,0,0,0,0,.2);for(let i=0;i<4;i++)add(g,Bx(.06,.03,.02),i<3?WH:RD,-.12+i*.08,.3-i*.02+.0,.09,0,0,.2);add(g,Bx(.14,.05,.1),DK,-.02,.46,0,0,0,.2);add(g,To(.16,.015,Math.PI),DK,.3,-.2,0,0,Math.PI/2,0);return g}];
const GIFTS=[
["Relógio","Elegante, preciso e com atitude.","Que nunca te falte tempo para conquistar os teus sonhos.",0xd4162a,0xffffff],
["Perfume","Uma presença que se faz notar.","Que a tua presença seja sempre marcante.",0x1e3fae,0xff3d4d],
["Ténis","Conforto para todos os caminhos.","Que cada passo te aproxime das tuas maiores conquistas.",0xf2f4ff,0x1e3fae],
["Auscultadores","Bluetooth, graves fortes e zero fios.","Que nunca faltem boas músicas e bons momentos.",0xd4162a,0x1e3fae],
["Óculos de sol","Estilo para os dias de sol.","Que o teu futuro seja tão brilhante que precises sempre de óculos escuros.",0x1e3fae,0xffffff],
["Mochila","Espaço para todas as aventuras.","Que estejas sempre preparado para novas aventuras.",0xf2f4ff,0xd4162a],
["Comando gamer","Para quem joga sempre para ganhar.","Que venças todos os desafios que aparecerem no teu caminho.",0xd4162a,0x1e3fae],
["Camisola de herói","Porque tens atitude de herói.","Não é preciso ter superpoderes para ser um herói para os amigos.",0x1e3fae,0xff3d4d],
["Carteira","Clássica e resistente.","Que nunca te falte o essencial e sobre sempre para as boas aventuras.",0xf2f4ff,0x1e3fae],
["Power bank","Energia para o dia inteiro.","Que a tua energia nunca acabe, mesmo nos dias mais longos.",0xd4162a,0xffffff]];
const N=GIFTS.length,RR=2.7;
const ring=new T.Group();ring.position.set(0,2.7,0);scene.add(ring);
function label(txt){const c=ctex(256,64,(g,w,h)=>{g.fillStyle='rgba(10,16,48,.88)';g.fillRect(0,8,w,48);g.strokeStyle='#4a7dff';g.lineWidth=2;g.strokeRect(1,9,w-2,46);g.fillStyle='#fff';g.font='bold 25px Trebuchet MS,Arial';g.textAlign='center';g.textBaseline='middle';g.fillText(txt,w/2,33)});const s=new T.Sprite(new T.SpriteMaterial({map:c,transparent:true,depthTest:false}));s.scale.set(1.2,.3,1);s.renderOrder=5;return s}
function tick(){const c=ctex(64,64,(g)=>{g.fillStyle='#1fa35c';g.beginPath();g.arc(32,32,28,0,6.2832);g.fill();g.strokeStyle='#fff';g.lineWidth=7;g.lineCap='round';g.beginPath();g.moveTo(19,33);g.lineTo(28,42);g.lineTo(46,22);g.stroke()});const s=new T.Sprite(new T.SpriteMaterial({map:c,transparent:true,depthTest:false}));s.scale.set(.3,.3,1);s.renderOrder=6;return s}
const gifts=GIFTS.map((d,i)=>{const g=new T.Group(),wrap=new T.Group();g.add(wrap);
 const bm=new T.MeshPhysicalMaterial({color:d[3],roughness:.3,clearcoat:.9,clearcoatRoughness:.2}),rm=new T.MeshPhysicalMaterial({color:d[4],roughness:.25,metalness:.2,clearcoat:1});
 const b=new T.Mesh(new T.BoxGeometry(.56,.5,.56),bm);b.castShadow=true;wrap.add(b);wrap.add(new T.Mesh(new T.BoxGeometry(.1,.51,.58),rm),new T.Mesh(new T.BoxGeometry(.58,.51,.1),rm));const k=new T.Mesh(new T.SphereGeometry(.09,16,12),rm);k.position.y=.3;wrap.add(k);
 const model=MODELS[i]();model.scale.setScalar(.001);model.visible=false;g.add(model);
 const lab=label(d[0]);lab.position.y=.66;g.add(lab);const chk=tick();chk.position.set(.36,.4,0);chk.visible=false;g.add(chk);
 b.userData.i=i;g.userData={wrap:wrap,model:model,chk:chk,ang:i/N*6.2832,open:false,rev:0,burst:false};g.scale.setScalar(.01);g.visible=false;ring.add(g);return g});
/* balões */
const bcol=[0xe11d2e,0x1e3fae,0xf4f6ff,0x4a7dff,0xa1121f,0xc8d0e6,0xe11d2e,0x14339a,0xffffff,0x2a52d6,0xff3d4d,0xdde3f5];
const balloons=bcol.map(c=>{const g=new T.Group(),m=new T.MeshPhysicalMaterial({color:c,roughness:.12,clearcoat:1,clearcoatRoughness:.05});
 const s=new T.Mesh(new T.SphereGeometry(.38,32,24),m);s.scale.y=1.22;s.castShadow=true;g.add(s);const kt=new T.Mesh(new T.ConeGeometry(.06,.12,12),m);kt.position.y=-.5;kt.rotation.x=Math.PI;g.add(kt);
 g.add(new T.Line(new T.BufferGeometry().setFromPoints([new T.Vector3(0,-.56,0),new T.Vector3(.04,-1.5,0)]),new T.LineBasicMaterial({color:0xffffff,transparent:true,opacity:.6})));g.visible=false;scene.add(g);return g});
let bs=balloons.map(()=>({d:0,sp:1,ph:0,x:0,y:0,on:false}));
/* confete */
const NC=180,conf=new T.InstancedMesh(new T.PlaneGeometry(.1,.17),new T.MeshStandardMaterial({side:T.DoubleSide,roughness:.5}),NC),dm=new T.Object3D(),cp=[];
const ccol=[0xff3d4d,0x4a7dff,0xffffff,0x14339a];for(let i=0;i<NC;i++){cp.push({p:new T.Vector3(),v:new T.Vector3(),r:new T.Vector3(),on:false});conf.setColorAt(i,new T.Color(ccol[i%4]));dm.scale.setScalar(0);dm.updateMatrix();conf.setMatrixAt(i,dm.matrix)}scene.add(conf);
function burst(n,o){o=o||new T.Vector3(0,2.2,0);let k=0;cp.forEach(c=>{if(k>=n)return;k++;c.on=true;c.p.set(o.x+(Math.random()-.5)*.8,o.y,o.z+(Math.random()-.5)*.8);c.v.set((Math.random()-.5)*5,4+Math.random()*5,(Math.random()-.5)*4);c.r.set(Math.random()*6,Math.random()*6,Math.random()*6)})}
/* câmara orbital com arrasto */
let th=.7,ph=1.2,vth=0,rad=10,idle=0,drag=false,mv=0,lx=0,ly=0;
function size(){const w=innerWidth,h=innerHeight;R.setSize(w,h,false);cam.aspect=w/h;rad=Math.max(10,6.4/(.689*(w/h)));cam.updateProjectionMatrix()}size();addEventListener('resize',size);
cv.addEventListener('pointerdown',e=>{drag=true;mv=0;lx=e.clientX;ly=e.clientY;vth=0;cv.setPointerCapture(e.pointerId)});
cv.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-lx,dy=e.clientY-ly;lx=e.clientX;ly=e.clientY;mv+=Math.abs(dx)+Math.abs(dy);th-=dx*.009;vth=-dx*.009;ph=clamp(ph-dy*.005,.6,1.5);idle=0});
cv.addEventListener('pointerup',e=>{drag=false;if(mv<8)tap(e.clientX,e.clientY)});
/* estado e interação */
const ray=new T.Raycaster(),mp=new T.Vector2();let isOpen=false,opened=0,foc=-1,fo=0,tOpen=0,lidT=0,jig=0;
function tap(x,y){if(foc>=0)return;mp.set(x/innerWidth*2-1,-(y/innerHeight)*2+1);ray.setFromCamera(mp,cam);
 if(isOpen){const hit=ray.intersectObjects(gifts.map(g=>g.children[0].children[0]),false)[0];if(hit)showGift(hit.object.userData.i)}
 else if(ray.intersectObjects(root.children,true).length)openBox()}
function openBox(){if(isOpen)return;jig=1;sfx('open');setTimeout(()=>{isOpen=true;tOpen=0;lidT=1.95;$('open').style.display='none';$('chip').style.display='inline-block';$('letterbtn').style.display='';$('hint').textContent='Escolhe um presente à volta da caixa';
 bs=balloons.map((b,i)=>({d:.3+i*.12,sp:.9+Math.random()*.6,ph:Math.random()*6,x:(Math.random()-.5)*3,y:1.6,on:true}));burst(NC,new T.Vector3(0,2.2,0))},300)}
function upd(){$('cnt').textContent=opened+'/'+N;$('prog').style.width=opened/N*100+'%';$('letterbtn').disabled=opened<N;if(opened===N)$('hint').textContent='Todos abertos! Já podes abrir a carta.'}
function showGift(i){const g=gifts[i],d=GIFTS[i];foc=i;sfx('pick');flash.intensity=7;if(!g.userData.open){g.userData.open=true;g.userData.chk.visible=true;opened++;upd()}
 $('sc').textContent='Presente '+(i+1)+' de '+N;$('sn').textContent=d[0];$('sd').textContent=d[1];$('sm').textContent='“'+d[2]+'”';$('sheet').classList.add('show')}
function back(){foc=-1;$('sheet').classList.remove('show')}
$('open').onclick=openBox;$('sback').onclick=back;
/* carta e final */
$('letterbtn').onclick=()=>{back();$('letterov').classList.add('show');$('env').classList.remove('open','gone');$('lcard').classList.remove('show');$('openl').style.display=''};
$('openl').onclick=()=>{sfx('paper');$('env').classList.add('open');$('openl').style.display='none';setTimeout(()=>{$('env').classList.add('gone');$('lcard').classList.add('show')},1900)};
$('lback').onclick=()=>$('letterov').classList.remove('show');
const fw=$('fw'),fx=fw.getContext('2d');let fwOn=false,fp=[],fwT=0;
function rocket(){const x=Math.random()*fw.width*.8+fw.width*.1,y=Math.random()*fw.height*.4+50,c=['255,61,77','74,125,255','255,255,255','233,185,73'][Math.random()*4|0];for(let i=0;i<50;i++){const a=Math.random()*6.283,s=1+Math.random()*3.6;fp.push({x:x,y:y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,l:1,c:c})}}
(function fl(now){requestAnimationFrame(fl);if(!fwOn&&!fp.length)return;fx.clearRect(0,0,fw.width,fw.height);if(fwOn&&now-fwT>550){fwT=now;rocket()}fp=fp.filter(p=>p.l>0);fp.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.04;p.vx*=.985;p.l-=.013;fx.fillStyle='rgba('+p.c+','+p.l+')';fx.beginPath();fx.arc(p.x,p.y,2.2,0,7);fx.fill()})})(0);
$('tofinal').onclick=()=>{$('letterov').classList.remove('show');fw.width=innerWidth;fw.height=innerHeight;$('finalov').classList.add('show');sfx('final');fwOn=true;burst(NC,new T.Vector3(0,2.2,0))};
$('again').onclick=()=>{fwOn=false;$('finalov').classList.remove('show')};
/* ciclo de animação */
let lidA=0,lidV=0,last=performance.now(),jigT=0;
function eob(x){const c=2.70158;return 1+c*Math.pow(x-1,3)+1.70158*Math.pow(x-1,2)}
const wv=new T.Vector3();
function loop(now){requestAnimationFrame(loop);const dt=Math.min(.033,(now-last)/1000);last=now;tOpen+=dt;
 lidV+=(lidT-lidA)*70*dt;lidV*=Math.exp(-6*dt);lidA+=lidV*dt;lid.rotation.x=-lidA;
 jig*=Math.exp(-5*dt);const sq=jig*Math.sin(now/35)*.05;root.scale.set(1+sq,1-sq,1+sq);
 inner.intensity+=((isOpen?3:0)-inner.intensity)*Math.min(1,dt*4);flash.intensity*=Math.exp(-4*dt);
 fo+=((foc>=0?1:0)-fo)*Math.min(1,dt*4);
 idle+=dt;if(!drag){th+=vth;vth*=.94;if(idle>1.5)th+=dt*(isOpen?.12:.3)}
 cam.position.set(Math.sin(th)*Math.sin(ph)*rad,1.4+Math.cos(ph)*rad,Math.cos(th)*Math.sin(ph)*rad);cam.lookAt(0,1.5+fo*1.1,0);
 if(foc<0)ring.rotation.y+=dt*.14;
 gifts.forEach((g,i)=>{const u=g.userData;if(!isOpen)return;const k=clamp((tOpen-.7-i*.1)/1.1,0,1);if(k<=0)return;
  const e=eob(k),a=u.ang+0,r=RR*e,isF=i===foc,cf=isF?fo:0;
  g.visible=!(foc>=0&&!isF&&fo>.97);
  g.position.set(Math.cos(a)*r*(1-cf),((1-e)*-1.8+Math.sin(now/700+i)*.1)*(1-cf),Math.sin(a)*r*(1-cf));
  const base=Math.max(.001,e);g.scale.setScalar(Math.max(.001,isF?base*(1+fo*1.4):(foc>=0?base*(1-fo):base)));
  const tr=(isF&&fo>.6)?1:0;u.rev+=(tr-u.rev)*Math.min(1,dt*3);
  u.wrap.scale.setScalar(Math.max(.001,1-u.rev));u.model.visible=u.rev>.02;u.model.scale.setScalar(Math.max(.001,eob(clamp(u.rev,0,1))*.95));
  if(isF&&u.rev>.05&&!u.burst){u.burst=true;g.getWorldPosition(wv);burst(70,wv);sfx('pick')}if(!isF&&u.burst&&u.rev<.05)u.burst=false;
  g.rotation.y=isF?now/900:now/1400+i});
 balloons.forEach((b,i)=>{const s=bs[i];if(!s.on||!isOpen)return;const k=tOpen-s.d;if(k<0)return;b.visible=true;const q=Math.min(1,k/3);b.position.set(s.x*q+Math.sin(now/600+s.ph)*.18,s.y+k*s.sp*1.5,Math.sin(s.ph)*1.2*q);b.rotation.z=Math.sin(now/500+s.ph)*.12;b.scale.setScalar(Math.min(1,k*2.5));if(b.position.y>11){b.visible=false;s.on=false}});
 cp.forEach((c,i)=>{if(!c.on)return;c.v.y-=7*dt;c.v.multiplyScalar(1-dt*.9);c.p.addScaledVector(c.v,dt);c.r.x+=dt*6;c.r.y+=dt*4;dm.position.copy(c.p);dm.rotation.set(c.r.x,c.r.y,c.r.z);if(c.p.y<0){c.on=false;dm.scale.setScalar(0)}else dm.scale.setScalar(1);dm.updateMatrix();conf.setMatrixAt(i,dm.matrix)});conf.instanceMatrix.needsUpdate=true;
 R.render(scene,cam)}
requestAnimationFrame(loop);
}catch(e){console.error(e);fail()}
})();
