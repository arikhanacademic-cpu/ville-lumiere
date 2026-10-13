(function(){
"use strict";
const LAT0=48.8566, LNG0=2.3522, KX=73.27, KZ=110.57;
const xz=(lat,lng)=>[(lng-LNG0)*KX, -(lat-LAT0)*KZ];
const V3=(lat,lng,y=0)=>{const p=xz(lat,lng);return new THREE.Vector3(p[0],y,p[1]);};
const $=s=>document.querySelector(s);
const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
const RATES={EUR:[1,"€"],USD:[1.16,"$"],GBP:[0.87,"£"]};
let currency="EUR";
const money=(v,short=true)=>{const [r,s]=RATES[currency];const x=v*r;return short? s+(x>=1e6?(x/1e6).toFixed(2)+"M":Math.round(x/1000)+"K") : s+Math.round(x).toLocaleString("en-GB");};
const headline=c=>{const r=c.roles.swe||c.roles[Object.keys(c.roles)[0]];return r.m||((r.r[0]+r.r[1])/2);};
const headRole=c=>c.roles.swe?"swe":Object.keys(c.roles)[0];

/* ---------- renderer ---------- */
const canvas=$("#gl");
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:"high-performance"});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
const scene=new THREE.Scene();
const NIGHT=0x0d1020;
scene.background=new THREE.Color(NIGHT);
scene.fog=new THREE.FogExp2(NIGHT,0.028);
const camera=new THREE.PerspectiveCamera(40,1,0.01,300);
scene.add(new THREE.HemisphereLight(0x6f7fb8,0x1a1420,0.55));
const moon=new THREE.DirectionalLight(0xbfc8ff,0.45);moon.position.set(-20,30,10);scene.add(moon);
const warm=new THREE.PointLight(0xffb45a,0.6,30);warm.position.set(0,6,0);scene.add(warm);

/* ---------- ground ---------- */
const ground=new THREE.Mesh(new THREE.PlaneGeometry(160,160),new THREE.MeshStandardMaterial({color:0x121528,roughness:1}));
ground.rotation.x=-Math.PI/2;scene.add(ground);
function shapeFrom(pts){const s=new THREE.Shape();pts.forEach((p,i)=>{const q=xz(p[0],p[1]);i?s.lineTo(q[0],-q[1]):s.moveTo(q[0],-q[1]);});return s;}
const intra=new THREE.Mesh(new THREE.ShapeGeometry(shapeFrom(PERIPH)),new THREE.MeshStandardMaterial({color:0x1a1e36,roughness:1}));
intra.rotation.x=-Math.PI/2;intra.position.y=0.002;scene.add(intra);
// Périphérique ring
{const pts=PERIPH.concat([PERIPH[0]]).map(p=>V3(p[0],p[1],0.012));
 const curve=new THREE.CatmullRomCurve3(pts,true);
 const g=new THREE.TubeGeometry(curve,300,0.018,4,true);
 scene.add(new THREE.Mesh(g,new THREE.MeshBasicMaterial({color:0xc98a3a,transparent:true,opacity:.55})));}
// woods
function blob(lat,lng,rx,rz,col,rot=0){const m=new THREE.Mesh(new THREE.CircleGeometry(1,40),new THREE.MeshStandardMaterial({color:col,roughness:1}));const p=xz(lat,lng);m.rotation.x=-Math.PI/2;m.rotation.z=rot;m.scale.set(rx,rz,1);m.position.set(p[0],0.004,p[1]);scene.add(m);return m;}
blob(48.8625,2.2490,1.25,2.0,0x15302b,0.2); // Bois de Boulogne
blob(48.8330,2.4350,1.8,1.1,0x15302b,-0.1); // Bois de Vincennes
blob(48.8462,2.3372,0.28,0.2,0x183a30); // Luxembourg
blob(48.8634,2.3275,0.4,0.12,0x183a30,-0.25); // Tuileries
blob(48.8556,2.2986,0.42,0.12,0x183a30,0.85); // Champ de Mars
blob(48.8800,2.3830,0.33,0.25,0x183a30); // Buttes-Chaumont
blob(48.8869,2.3431,0.55,0.45,0x1f2342); // Montmartre base

/* ---------- Seine ---------- */
const seineCurve=new THREE.CatmullRomCurve3(SEINE.map(p=>V3(p[0],p[1],0)));
const seinePts=seineCurve.getSpacedPoints(600);
{const W=0.13,pos=[],idx=[];
 for(let i=0;i<seinePts.length;i++){const a=seinePts[Math.max(0,i-1)],b=seinePts[Math.min(seinePts.length-1,i+1)];
  const t=new THREE.Vector3().subVectors(b,a).normalize();const n=new THREE.Vector3(-t.z,0,t.x);
  const p=seinePts[i];pos.push(p.x+n.x*W,0.008,p.z+n.z*W,p.x-n.x*W,0.008,p.z-n.z*W);
  if(i<seinePts.length-1){const k=i*2;idx.push(k,k+1,k+2,k+1,k+3,k+2);}}
 const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();
 const m=new THREE.Mesh(g,new THREE.MeshStandardMaterial({color:0x2c4f86,emissive:0x173263,emissiveIntensity:.9,roughness:.25,metalness:.4,side:THREE.DoubleSide}));
 scene.add(m);
 // shimmer line
 const lg=new THREE.BufferGeometry().setFromPoints(seinePts.map(p=>new THREE.Vector3(p.x,0.012,p.z)));
 scene.add(new THREE.Line(lg,new THREE.LineBasicMaterial({color:0x7fa8ff,transparent:true,opacity:.5})));}
// islands
blob(48.8545,2.3467,0.5,0.085,0x262b4c,-0.45).position.y=0.014;
blob(48.8517,2.3567,0.3,0.06,0x262b4c,-0.5).position.y=0.014;
const nearSeine=(x,z,d)=>{for(let i=0;i<seinePts.length;i+=2){const p=seinePts[i];if((p.x-x)*(p.x-x)+(p.z-z)*(p.z-z)<d*d)return true;}return false;};

/* ---------- city fabric ---------- */
function inPoly(x,z,poly){let c=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const [xi,zi]=poly[i],[xj,zj]=poly[j];if(((zi>z)!==(zj>z))&&(x<(xj-xi)*(z-zi)/(zj-zi)+xi))c=!c;}return c;}
const periXZ=PERIPH.map(p=>xz(p[0],p[1]));
const inWood=(x,z)=>{const w=[[48.8625,2.2490,1.25,2.0],[48.8330,2.4350,1.8,1.1]];return w.some(([la,ln,rx,rz])=>{const p=xz(la,ln);return ((x-p[0])/rx)**2+((z-p[1])/rz)**2<1;});};
const compXZ=COMPANIES.map(c=>xz(c.ll[0],c.ll[1]));
let seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
const blocks=[];
for(let x=-14;x<=14;x+=0.15){for(let z=-11;z<=11;z+=0.15){
  const jx=x+(rnd()-.5)*.05,jz=z+(rnd()-.5)*.05;const inside=inPoly(jx,jz,periXZ);
  const r=Math.hypot(jx,jz);
  if(!inside){ if(r>13||rnd()<0.35+r/22)continue; }
  if(inWood(jx,jz)||nearSeine(jx,jz,0.2))continue;
  if(compXZ.some(p=>Math.abs(p[0]-jx)<0.07&&Math.abs(p[1]-jz)<0.07))continue;
  let h=inside?0.045+rnd()*0.04:0.03+rnd()*0.06+(rnd()<.03?0.15:0);
  const mx=xz(48.8869,2.3431);const dm=Math.hypot(jx-mx[0],jz-mx[1]);if(dm<0.55)h+=0.09*(1-dm/0.55); // butte
  blocks.push([jx,jz,h,inside]);}}
{const g=new THREE.BoxGeometry(1,1,1);g.translate(0,0.5,0);
 const m=new THREE.MeshStandardMaterial({color:0xffffff,roughness:.9,emissive:0x2a1a08,emissiveIntensity:.6});
 const im=new THREE.InstancedMesh(g,m,blocks.length);const o=new THREE.Object3D();const c=new THREE.Color();
 blocks.forEach((b,i)=>{o.position.set(b[0],0,b[1]);o.scale.set(0.085+rnd()*.025,b[2],0.085+rnd()*.025);o.rotation.y=(rnd()-.5)*.25;o.updateMatrix();im.setMatrixAt(i,o.matrix);
  const lit=rnd();c.setHSL(0.08+rnd()*0.04,0.18+lit*0.25,b[3]?0.15+lit*0.1:0.1+lit*0.06);im.setColorAt(i,c);});
 scene.add(im);}

/* ---------- landmarks ---------- */
const lmLabels=[];
const gold=new THREE.MeshStandardMaterial({color:0xd99a3c,emissive:0xe8a23a,emissiveIntensity:.85,roughness:.5});
const stone=new THREE.MeshStandardMaterial({color:0xcfc3a8,emissive:0x3a3020,emissiveIntensity:.6,roughness:.8});
const glassM=new THREE.MeshStandardMaterial({color:0x3a4466,emissive:0x2a3c70,emissiveIntensity:.7,roughness:.3,metalness:.5});
function place(obj,lat,lng,y=0){const p=xz(lat,lng);obj.position.set(p[0],y,p[1]);scene.add(obj);return obj;}
function lm(name,lat,lng,y){lmLabels.push({name,pos:V3(lat,lng,y)});}
// Eiffel Tower
let beam;
{const H=0.62,prof=[[0.11,0],[0.075,0.07],[0.05,0.14],[0.035,0.22],[0.022,0.32],[0.012,0.45],[0.006,0.56],[0.001,H]].map(p=>new THREE.Vector2(p[0],p[1]));
 const g=new THREE.LatheGeometry(prof,4);const t=new THREE.Mesh(g,gold);t.rotation.y=Math.PI/4;
 const grp=new THREE.Group();grp.add(t);
 const wf=new THREE.Mesh(g,new THREE.MeshBasicMaterial({color:0xffd27a,wireframe:true,transparent:true,opacity:.5}));wf.rotation.y=Math.PI/4;wf.scale.setScalar(1.01);grp.add(wf);
 const bg=new THREE.ConeGeometry(0.35,5,24,1,true);bg.translate(0,-2.5,0);bg.rotateZ(Math.PI/2);
 beam=new THREE.Mesh(bg,new THREE.MeshBasicMaterial({color:0xfff1c4,transparent:true,opacity:.07,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));
 beam.position.y=H*0.97;grp.add(beam);
 place(grp,48.8584,2.2945);lm("Tour Eiffel",48.8584,2.2945,0.7);}
// Arc de Triomphe
{const g=new THREE.Group();const a=new THREE.Mesh(new THREE.BoxGeometry(0.07,0.07,0.035),stone);a.position.y=0.035;g.add(a);place(g,48.8738,2.2950);lm("Arc de Triomphe",48.8738,2.2950,0.1);}
// Champs-Élysées light string
{const a=V3(48.8738,2.2950,0.02),b=V3(48.8656,2.3212,0.02);const pts=[];for(let i=0;i<=60;i++){const p=a.clone().lerp(b,i/60);pts.push(p.x+0.03,0.02,p.z,p.x-0.03,0.02,p.z);}
 const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.Float32BufferAttribute(pts,3));
 scene.add(new THREE.Points(g,new THREE.PointsMaterial({color:0xffd690,size:0.025,transparent:true,opacity:.9})));}
// Sacré-Cœur
{const g=new THREE.Group();const d=new THREE.Mesh(new THREE.SphereGeometry(0.035,16,10,0,Math.PI*2,0,Math.PI/2),new THREE.MeshStandardMaterial({color:0xfff6e6,emissive:0xbfb7a8,emissiveIntensity:.8}));d.position.y=0.17;g.add(d);
 const b=new THREE.Mesh(new THREE.BoxGeometry(0.07,0.04,0.09),new THREE.MeshStandardMaterial({color:0xf2ead8,emissive:0x8a8270,emissiveIntensity:.7}));b.position.y=0.15;g.add(b);place(g,48.8867,2.3431);lm("Sacré-Cœur",48.8867,2.3431,0.24);}
// Louvre pyramid
{const p=new THREE.Mesh(new THREE.ConeGeometry(0.03,0.035,4),new THREE.MeshStandardMaterial({color:0x9fc4ff,emissive:0x9fc4ff,emissiveIntensity:1.2,transparent:true,opacity:.9}));p.rotation.y=Math.PI/4;p.position.y=0.018;place(p,48.8611,2.3358);
 const w=new THREE.Mesh(new THREE.BoxGeometry(0.5,0.035,0.07),stone);w.position.y=0.018;w.rotation.y=-0.22;place(w,48.8620,2.3330);lm("Louvre",48.8611,2.3358,0.08);}
// Notre-Dame
{const g=new THREE.Group();const n=new THREE.Mesh(new THREE.BoxGeometry(0.12,0.04,0.045),stone);n.position.y=0.02;g.add(n);[-0.05].forEach(x=>{[-0.014,0.014].forEach(z=>{const t=new THREE.Mesh(new THREE.BoxGeometry(0.02,0.07,0.02),stone);t.position.set(x,0.035,z);g.add(t);});});
 const sp=new THREE.Mesh(new THREE.ConeGeometry(0.006,0.06,6),gold);sp.position.set(0.02,0.07,0);g.add(sp);g.rotation.y=-0.4;place(g,48.8530,2.3499,0.014);lm("Notre-Dame",48.8530,2.3499,0.11);}
// Tour Montparnasse
{const t=new THREE.Mesh(new THREE.BoxGeometry(0.06,0.42,0.03),glassM);t.position.y=0.21;place(t,48.8421,2.3219);lm("Tour Montparnasse",48.8421,2.3219,0.48);}
// La Défense: Grande Arche + towers
{const g=new THREE.Group();const s=0.11,th=0.018;[[0,s-th/2,0,s,th],[0,th/2,0,s,th],[-s/2+th/2,s/2,0,th,s],[s/2-th/2,s/2,0,th,s]].forEach(([x,y,z,w,h])=>{const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,0.1),new THREE.MeshStandardMaterial({color:0xe9eef5,emissive:0x8090a8,emissiveIntensity:.6}));b.position.set(x,y,z);g.add(b);});
 g.rotation.y=0.55;place(g,48.8925,2.2360);lm("Grande Arche",48.8925,2.2360,0.16);
 const ds=[[48.8905,2.2430,0.30],[48.8890,2.2470,0.22],[48.8935,2.2445,0.26],[48.8915,2.2495,0.18],[48.8875,2.2420,0.2],[48.8950,2.2400,0.16]];
 ds.forEach(([a,b,h])=>{const t=new THREE.Mesh(new THREE.BoxGeometry(0.05,h,0.05),glassM);t.position.y=h/2;place(t,a,b);});}
// Station F + BnF
{const s=new THREE.Mesh(new THREE.BoxGeometry(0.31,0.03,0.06),new THREE.MeshStandardMaterial({color:0x2a2f4a,emissive:0xff5a7a,emissiveIntensity:.35}));s.position.y=0.015;s.rotation.y=0.95;place(s,48.8340,2.3710);lm("Station F",48.8340,2.3710,0.07);
 [[0.0015,0.0018],[-0.0015,0.0018],[0.0015,-0.0018],[-0.0015,-0.0018]].forEach(([a,b])=>{const t=new THREE.Mesh(new THREE.BoxGeometry(0.035,0.1,0.035),glassM);t.position.y=0.05;place(t,48.8336+a,2.3762+b*1.3);});
 lm("Bibliothèque F. Mitterrand",48.8336,2.3762,0.14);}
// Centre Pompidou, Opéra, Bastille
{const p=new THREE.Mesh(new THREE.BoxGeometry(0.17,0.04,0.06),new THREE.MeshStandardMaterial({color:0x3b6dd1,emissive:0x2a4fa0,emissiveIntensity:.8}));p.position.y=0.02;p.rotation.y=-0.35;place(p,48.8607,2.3522);lm("Centre Pompidou",48.8607,2.3522,0.08);
 const o=new THREE.Mesh(new THREE.BoxGeometry(0.08,0.05,0.12),stone);o.position.y=0.025;place(o,48.8720,2.3316);lm("Opéra Garnier",48.8720,2.3316,0.1);
 const c=new THREE.Mesh(new THREE.CylinderGeometry(0.008,0.012,0.12,10),gold);c.position.y=0.06;place(c,48.8532,2.3691);lm("Bastille",48.8532,2.3691,0.15);}

/* ---------- metro lines ---------- */
function buildLine(L){
  const pts=L.st.map(s=>V3(s[1],s[2],0.03));L.curve=new THREE.CatmullRomCurve3(pts,false,"catmullrom",0.3);
  const g=new THREE.TubeGeometry(L.curve,400,0.012,5,false);
  L.mesh=new THREE.Mesh(g,new THREE.MeshBasicMaterial({color:L.color,transparent:true,opacity:.75}));scene.add(L.mesh);
  L.len=L.curve.getLength();
  // station u positions
  L.su=L.st.map(s=>{const p=V3(s[1],s[2],0.03);let best=0,bd=1e9;for(let i=0;i<=400;i++){const q=L.curve.getPointAt(i/400);const d=q.distanceToSquared(p);if(d<bd){bd=d;best=i/400;}}return best;});
  const dg=new THREE.SphereGeometry(0.022,10,8);const dm=new THREE.MeshBasicMaterial({color:0xffffff});
  L.st.forEach(s=>{const d=new THREE.Mesh(dg,dm);d.position.copy(V3(s[1],s[2],0.03));scene.add(d);});
  // train
  const tr=new THREE.Group();for(let i=0;i<5;i++){const car=new THREE.Mesh(new THREE.BoxGeometry(0.035,0.03,0.016),new THREE.MeshStandardMaterial({color:0xe7e7ef,emissive:new THREE.Color(L.color),emissiveIntensity:.55}));tr.add(car);}
  L.train=tr;scene.add(tr);L.tu=Math.random();L.dir=1;
}
[LINE1,LINE14].forEach(buildLine);
function placeTrain(L,dt){
  L.tu+=L.dir*dt*0.35/L.len;if(L.tu>1){L.tu=1;L.dir=-1;}if(L.tu<0){L.tu=0;L.dir=1;}
  L.train.children.forEach((car,i)=>{const u=THREE.MathUtils.clamp(L.tu-L.dir*i*0.045/L.len,0,1);const p=L.curve.getPointAt(u);const q=L.curve.getPointAt(Math.min(1,u+0.002));car.position.set(p.x,0.045,p.z);car.lookAt(q.x,0.045,q.z);car.rotateY(Math.PI/2);});
}

/* ---------- company towers ---------- */
function windowTex(){const c=document.createElement("canvas");c.width=32;c.height=64;const x=c.getContext("2d");x.fillStyle="#0b0d18";x.fillRect(0,0,32,64);
  for(let r=0;r<16;r++)for(let k=0;k<4;k++){const on=Math.random();x.fillStyle=on>.35?`rgba(255,${200+Math.random()*40|0},${130+Math.random()*60|0},${.45+on*.55})`:"#151a2c";x.fillRect(2+k*8,2+r*4,5,2.4);}
  const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.magFilter=THREE.NearestFilter;return t;}
function haloTex(){const c=document.createElement("canvas");c.width=c.height=64;const x=c.getContext("2d");const g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,"rgba(255,255,255,1)");g.addColorStop(.25,"rgba(255,255,255,.45)");g.addColorStop(1,"rgba(255,255,255,0)");x.fillStyle=g;x.fillRect(0,0,64,64);return new THREE.CanvasTexture(c);}
const HALO=haloTex();
const towers=[];const pickables=[];
const heightOf=v=>0.18+Math.pow(v/100000,1.3)*1.15;
COMPANIES.forEach((c,i)=>{
  c.id=i;const col=new THREE.Color(SECTORS[c.sec].color);const v=headline(c);const h=heightOf(v);c.h=h;
  const tex=windowTex();tex.repeat.set(1,Math.max(1,h/0.18));
  const mat=new THREE.MeshStandardMaterial({color:col.clone().multiplyScalar(.35),map:tex,emissive:col,emissiveMap:tex,emissiveIntensity:.9,roughness:.45,metalness:.3});
  const w=0.085;const g=new THREE.BoxGeometry(w,h,w);g.translate(0,h/2,0);
  const m=new THREE.Mesh(g,mat);const p=xz(c.ll[0],c.ll[1]);m.position.set(p[0],0,p[1]);m.userData.c=c;scene.add(m);
  // crown
  const cr=new THREE.Mesh(new THREE.BoxGeometry(w*1.02,0.012,w*1.02),new THREE.MeshBasicMaterial({color:col}));cr.position.set(p[0],h+0.006,p[1]);scene.add(cr);
  const halo=new THREE.Sprite(new THREE.SpriteMaterial({map:HALO,color:col,transparent:true,opacity:.75,blending:THREE.AdditiveBlending,depthWrite:false}));halo.scale.setScalar(0.32);halo.position.set(p[0],h+0.02,p[1]);scene.add(halo);
  // base pool of light
  const pool=new THREE.Mesh(new THREE.CircleGeometry(0.11,24),new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.18,depthWrite:false}));pool.rotation.x=-Math.PI/2;pool.position.set(p[0],0.02,p[1]);scene.add(pool);
  c.obj={m,cr,halo,pool,mat,top:new THREE.Vector3(p[0],h+0.03,p[1]),base:new THREE.Vector3(p[0],0,p[1])};
  towers.push(c);pickables.push(m);
});

/* ---------- Gaston ---------- */
const gaston=new THREE.Group();
{const gm=new THREE.MeshStandardMaterial({color:0x9aa3b5,emissive:0x40485a,emissiveIntensity:.6,side:THREE.DoubleSide});
 const body=new THREE.Mesh(new THREE.SphereGeometry(0.018,10,8),gm);body.scale.set(1.6,1,1);gaston.add(body);
 const head=new THREE.Mesh(new THREE.SphereGeometry(0.011,8,6),new THREE.MeshStandardMaterial({color:0x5d7f7a,emissive:0x2d4f4a}));head.position.set(0.03,0.008,0);gaston.add(head);
 const wg=new THREE.BufferGeometry();wg.setAttribute("position",new THREE.Float32BufferAttribute([0,0,0,-0.02,0,0.05,0.015,0,0.035],3));wg.computeVertexNormals();
 const wl=new THREE.Mesh(wg,gm),wr=new THREE.Mesh(wg,gm);wr.scale.z=-1;gaston.add(wl,wr);gaston.userData.w=[wl,wr];}
scene.add(gaston);lmLabels.push({name:"Gaston",pos:new THREE.Vector3(),gaston:true});
const gastonTarget=new THREE.Vector3(),gastonPos=V3(48.8584,2.2945,0.8);

/* ---------- labels ---------- */
const labelsEl=$("#labels");
let labelMode="all";
COMPANIES.forEach(c=>{const d=document.createElement("div");d.className="lab";d.innerHTML=`<i style="background:${SECTORS[c.sec].color}"></i>${c.n}<em></em>`;d.addEventListener("click",e=>{e.stopPropagation();openCompany(c,true);});labelsEl.appendChild(d);c.el=d;});
const keySet=new Set(COMPANIES.slice().sort((a,b)=>headline(b)-headline(a)).slice(0,14).map(c=>c.n));
lmLabels.forEach(l=>{const d=document.createElement("div");d.className="lm";d.textContent=l.name;labelsEl.appendChild(d);l.el=d;});
const arrLabels=ARRS.map(a=>{const d=document.createElement("div");d.className="ar";d.textContent=a[0];labelsEl.appendChild(d);return {el:d,pos:V3(a[1],a[2],0.02)};});
const stLabels=[];[LINE1,LINE14].forEach(L=>L.st.forEach(s=>{const d=document.createElement("div");d.className="st";d.textContent=s[0];d.hidden=true;labelsEl.appendChild(d);stLabels.push({el:d,pos:V3(s[1],s[2],0.06),L});}));
function refreshPrices(){COMPANIES.forEach(c=>{const r=c.roles[headRole(c)];c.el.querySelector("em").textContent=r.m?money(r.m):"~"+money((r.r[0]+r.r[1])/2);});}
refreshPrices();
const tmp=new THREE.Vector3();
let W=1,H=1;
function proj(v,el,offY=0){tmp.copy(v).project(camera);if(tmp.z>1||tmp.x<-1.2||tmp.x>1.2||tmp.y<-1.2||tmp.y>1.2){el.style.visibility="hidden";return null;}
  const x=(tmp.x*.5+.5)*W,y=(-tmp.y*.5+.5)*H+offY;el.style.visibility="visible";el.style.transform=`translate(${x|0}px,${y|0}px) translate(-50%,-100%)`;return [x,y,tmp.z];}
let activeSectors=new Set(Object.keys(SECTORS));
function updateLabels(){
  const camDist=camera.position.length();
  const placed=[];
  // sort by screen depth so nearer labels win collisions
  const order=COMPANIES.slice().sort((a,b)=>b.h-a.h);
  for(const c of order){
    const show=activeSectors.has(c.sec)&&(labelMode==="all"||keySet.has(c.n)||c===selected)&&state.mode!=="ride";
    if(!show){c.el.style.visibility="hidden";continue;}
    const r=proj(c.obj.top,c.el,-4);if(!r)continue;
    const bw=c.el.offsetWidth||80;const box=[r[0]-bw/2,r[1]-22,r[0]+bw/2,r[1]];
    const hit=c!==selected&&placed.some(b=>!(box[2]<b[0]||box[0]>b[2]||box[3]<b[1]||box[1]>b[3]));
    if(hit){c.el.style.visibility="hidden";continue;}
    placed.push(box);c.el.classList.toggle("hot",c===selected||c===hovered);
  }
  lmLabels.forEach(l=>{if(l.gaston)l.pos.copy(gaston.position).add(new THREE.Vector3(0,0.06,0));proj(l.pos,l.el);});
  const showArr=state.mode!=="ride"&&camera.position.y>2.2;arrLabels.forEach(a=>{if(!showArr){a.el.style.visibility="hidden";return;}proj(a.pos,a.el);});
  stLabels.forEach(s=>{if(s.el.hidden)return;proj(s.pos,s.el,-6);});
  void camDist;
}

/* ---------- camera rig ---------- */
const controls=new THREE.OrbitControls(camera,canvas);
controls.enableDamping=true;controls.dampingFactor=0.08;controls.maxPolarAngle=Math.PI*0.47;controls.minDistance=0.4;controls.maxDistance=40;controls.screenSpacePanning=false;controls.enabled=false;
function pose(ch){const t=V3(ch.t[0],ch.t[1],ch.d<6?0.45:0.2);const az=THREE.MathUtils.degToRad(ch.az),el=THREE.MathUtils.degToRad(ch.el);const h=ch.d*Math.cos(el);
  return {t,p:new THREE.Vector3(t.x+Math.sin(az)*h,ch.d*Math.sin(el),t.z+Math.cos(az)*h),d:ch.d,az,el};}
CHAPTERS.forEach(ch=>{if(ch.d<6)ch.d*=1.7;});const poses=CHAPTERS.map(pose);
const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
function poseAt(f){const i=Math.max(0,Math.min(poses.length-1,Math.floor(f)));const j=Math.min(poses.length-1,i+1);const u=ease(f-i);const A=poses[i],B=poses[j];
  const t=A.t.clone().lerp(B.t,u);const d=Math.exp(THREE.MathUtils.lerp(Math.log(A.d),Math.log(B.d),u));
  let daz=B.az-A.az;while(daz>Math.PI)daz-=2*Math.PI;while(daz<-Math.PI)daz+=2*Math.PI;const az=A.az+daz*u,el=THREE.MathUtils.lerp(A.el,B.el,u);
  // lift in the middle of long hops
  const hop=A.t.distanceTo(B.t);const lift=1+Math.sin(u*Math.PI)*Math.min(1.2,hop/6);
  const dd=d*lift,h=dd*Math.cos(el);return {t,p:new THREE.Vector3(t.x+Math.sin(az)*h,dd*Math.sin(el),t.z+Math.cos(az)*h)};}

const state={mode:"tour",prog:0,goal:0,ride:null,fly:null};
let selected=null,hovered=null;

/* ---------- tour UI ---------- */
const chapterEl=$("#chapter"),dotsEl=$("#dots");
CHAPTERS.forEach((ch,i)=>{const b=document.createElement("button");b.type="button";b.innerHTML=`<span>№${String(i+1).padStart(2,"0")} ${ch.k}</span><i></i>`;b.addEventListener("click",()=>{state.goal=i;});dotsEl.appendChild(b);});
let shownChapter=-1;
function renderChapter(i){
  if(i===shownChapter)return;shownChapter=i;const ch=CHAPTERS[i];
  const cs=(ch.ids||[]).map(n=>COMPANIES.find(c=>c.n===n)).filter(Boolean);
  const top=cs.slice().sort((a,b)=>headline(b)-headline(a))[0];
  chapterEl.innerHTML=`<div class="k">№${String(i+1).padStart(2,"0")} / ${String(CHAPTERS.length).padStart(2,"0")}</div><h2>${ch.k}</h2><p>${ch.p}</p>`+
   (cs.length?`<div class="chips">${cs.map(c=>`<button class="chip" type="button" data-id="${c.id}"><i style="background:${SECTORS[c.sec].color}"></i>${c.n}<span class="mono">${c.roles[headRole(c)].m?money(c.roles[headRole(c)].m):"locked"}</span></button>`).join("")}</div>`:"")+
   (ch.ride?`<div class="rides"><button class="ridebtn" type="button" data-line="1"><span class="roundel" style="background:${LINE1.color};color:${LINE1.fg}">1</span>Ride Line 1</button><button class="ridebtn" type="button" data-line="14"><span class="roundel" style="background:${LINE14.color};color:${LINE14.fg}">14</span>Ride Line 14</button></div>`:"")+
   `<p class="gaston">Gaston: “${ch.g}”</p>`;
  chapterEl.querySelectorAll(".chip").forEach(b=>b.addEventListener("click",()=>openCompany(COMPANIES[+b.dataset.id],true)));
  chapterEl.querySelectorAll(".ridebtn").forEach(b=>b.addEventListener("click",()=>startRide(b.dataset.line==="1"?LINE1:LINE14)));
  [...dotsEl.children].forEach((d,k)=>d.setAttribute("aria-current",k===i?"true":"false"));
  // highlight towers of this chapter
  const ids=new Set(cs.map(c=>c.id));COMPANIES.forEach(c=>{c.el.classList.toggle("dim",ids.size>0&&!ids.has(c.id)&&state.mode==="tour");});
  void top;
}
// wheel / touch / keys
let wheelAcc=0,snapT=0;
addEventListener("wheel",e=>{if(state.mode!=="tour"||e.target.closest(".chapter,.card,.modal,.rank"))return;e.preventDefault();state.goal=THREE.MathUtils.clamp(state.goal+e.deltaY*0.0016,0,CHAPTERS.length-1);snapT=performance.now();},{passive:false});
chapterEl.addEventListener("wheel",e=>{if(state.mode!=="tour")return;if(chapterEl.scrollHeight>chapterEl.clientHeight+4)return;e.preventDefault();state.goal=THREE.MathUtils.clamp(state.goal+e.deltaY*0.0016,0,CHAPTERS.length-1);snapT=performance.now();},{passive:false});
let ty=null;
canvas.addEventListener("touchstart",e=>{if(state.mode==="tour"&&e.touches.length===1)ty=e.touches[0].clientY;},{passive:true});
canvas.addEventListener("touchmove",e=>{if(state.mode!=="tour"||ty===null)return;const y=e.touches[0].clientY;state.goal=THREE.MathUtils.clamp(state.goal+(ty-y)*0.006,0,CHAPTERS.length-1);ty=y;snapT=performance.now();},{passive:true});
canvas.addEventListener("touchend",()=>{ty=null;});
addEventListener("keydown",e=>{
  if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){e.preventDefault();openSearch();return;}
  if(!$("#modal").hidden){return;}
  if(e.key==="Escape"){if(state.mode==="ride")stopRide();else if(!$("#card").hidden)closeCard();else setMode("tour");return;}
  if(state.mode==="tour"&&!(e.target instanceof HTMLInputElement)){if(["ArrowDown","PageDown"," "].includes(e.key)){e.preventDefault();state.goal=Math.min(CHAPTERS.length-1,Math.round(state.goal)+1);}if(["ArrowUp","PageUp"].includes(e.key)){e.preventDefault();state.goal=Math.max(0,Math.round(state.goal)-1);}}
});

/* ---------- modes ---------- */
const hint=$("#hint");
function setMode(m){
  if(state.mode==="ride"&&m!=="ride")endRideVisuals();
  state.mode=m;$("#vTour").setAttribute("aria-pressed",m==="tour");$("#vExplore").setAttribute("aria-pressed",m!=="tour");
  chapterEl.hidden=m!=="tour";dotsEl.hidden=m!=="tour";$("#rank").hidden=m!=="explore";
  controls.enabled=m==="explore";
  if(m==="explore"){const pp=poseAt(state.prog);controls.target.copy(pp.t);camera.position.copy(pp.p);COMPANIES.forEach(c=>c.el.classList.remove("dim"));hint.textContent="drag to orbit · right-drag to pan · scroll to zoom · esc returns to the tour";}
  if(m==="tour"){state.fly=null;shownChapter=-1;state.goal=Math.round(state.prog);hint.textContent="scroll to descend · drag to orbit in Explore · click any tower";}
}
$("#vTour").addEventListener("click",()=>setMode("tour"));
$("#vExplore").addEventListener("click",()=>setMode("explore"));
$("#lAll").addEventListener("click",()=>{labelMode="all";$("#lAll").setAttribute("aria-pressed",true);$("#lKey").setAttribute("aria-pressed",false);});
$("#lKey").addEventListener("click",()=>{labelMode="key";$("#lKey").setAttribute("aria-pressed",true);$("#lAll").setAttribute("aria-pressed",false);});
$("#cur").querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{currency=b.dataset.c;$("#cur").querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",x===b));refreshPrices();shownChapter=-1;if(selected)renderCard();renderRank();}));

function flyTo(target,dist=1.6,az=null,el=0.62){
  const from={p:camera.position.clone(),t:controls.target.clone()};
  const cur=new THREE.Vector3().subVectors(camera.position,controls.target);const a=az===null?Math.atan2(cur.x,cur.z):az;
  const h=dist*Math.cos(el);const toP=new THREE.Vector3(target.x+Math.sin(a)*h,target.y+dist*Math.sin(el),target.z+Math.cos(a)*h);
  state.fly={from,to:{p:toP,t:target.clone()},t0:performance.now(),dur:reduce?1:1300};
}

/* ---------- company card ---------- */
const cardEl=$("#card");let cardRole="swe";
function openCompany(c,fly){
  if(state.mode==="ride")stopRide();
  if(state.mode==="tour")setMode("explore");
  selected=c;cardRole=headRole(c);renderCard();cardEl.hidden=false;document.body.classList.add('has-card');
  if(fly){const t=c.obj.base.clone();t.y=c.h*0.5;flyTo(t,Math.max(1.1,c.h*2.4+0.6));}
}
function closeCard(){cardEl.hidden=true;selected=null;document.body.classList.remove('has-card');}
function pkgFor(r){if(r.lv&&r.lv.length&&r.m){let best=r.lv[0],bd=1e12;r.lv.forEach(l=>{const d=Math.abs(l[1]-r.m);if(d<bd){bd=d;best=l;}});return {src:best[0],b:best[2],s:best[3],o:best[4]};}
  if(r.p)return {src:"typical package",b:r.p[0],s:r.p[1],o:r.p[2]};return null;}
function renderCard(){
  const c=selected;if(!c)return;const sc=SECTORS[c.sec];const r=c.roles[cardRole];const url=`https://www.levels.fyi/companies/${c.s}/salaries/${ROLES[cardRole][1]}/locations/france`;
  const arr=/^\d/.test(c.ar)?`Arrondissement ${c.ar}`:c.ar;
  let main;
  if(r.m){const pk=pkgFor(r);let split="";
    if(pk){const tot=pk.b+pk.s+pk.o;const f=[pk.b/tot,pk.s/tot,pk.o/tot];const cols=["#f3ecdc",sc.color,"#e8b64c"];
      split=`<div class="split" aria-hidden="true">${f.map((x,k)=>`<div style="width:${x*100}%;background:${cols[k]}"></div>`).join("")}</div>
      <div class="splitk">${["Base","Stock","Bonus"].map((n,k)=>`<div><i style="background:${cols[k]}"></i>${n}<b>${money(r.m*f[k])}</b></div>`).join("")}</div>
      <p class="note">Split estimated from the ${pk.src==="typical package"?"typical package":"<b>"+pk.src+"</b> package"} on Levels.fyi, applied to the median.</p>`;}
    else split=`<p class="note">Levels.fyi doesn't publish a base / stock / bonus split for this role in France yet.</p>`;
    main=`<div class="big-l">Median total comp · France</div><div class="big">${money(r.m,false)}</div>${split}`;
    if(r.lv&&r.lv.length){main+=`<table class="lv"><thead><tr><th>Level</th><th>Total</th><th>Base</th><th>Stock</th><th>Bonus</th></tr></thead><tbody>${r.lv.map(l=>`<tr><td>${l[0]}</td><td>${money(l[1])}</td><td>${money(l[2])}</td><td>${money(l[3])}</td><td>${money(l[4])}</td></tr>`).join("")}</tbody></table>`;}
  } else {
    main=`<div class="big-l">Common range · France</div><div class="big">${money(r.r[0])}–${money(r.r[1]).replace(/^\D/,"")}</div><p class="note">Levels.fyi keeps the exact median locked until more people submit. Add yours to unlock it.</p>`;
  }
  cardEl.innerHTML=`<button class="close" type="button" aria-label="Close">×</button>
   <div class="plaque"><small>${arr}</small><h3>${c.n}</h3></div>
   <div class="body"><div class="meta"><span class="sector"><i style="background:${sc.color}"></i>${sc.label}</span><span>${c.hood}</span></div>
   <div class="roles">${Object.keys(c.roles).map(k=>`<button type="button" data-r="${k}" aria-pressed="${k===cardRole}">${ROLES[k][0]}</button>`).join("")}</div>
   ${main}
   <a class="lnk" href="${url}" target="_blank" rel="noopener">View ${c.n} salaries on Levels.fyi ↗</a>
   <p class="note">Figures are France-wide medians from Levels.fyi, retrieved 13 Oct 2026. Office position is approximate. ${currency!=="EUR"?"Converted at an indicative rate.":""}</p></div>`;
  cardEl.querySelector(".close").addEventListener("click",closeCard);
  cardEl.querySelectorAll(".roles button").forEach(b=>b.addEventListener("click",()=>{cardRole=b.dataset.r;renderCard();}));
}

/* ---------- rankings ---------- */
let rankRole="swe";
const rankRoleEl=$("#rankRole");
["swe","ds","pm"].forEach(k=>{const b=document.createElement("button");b.type="button";b.dataset.r=k;b.textContent={swe:"SWE",ds:"Data",pm:"PM"}[k];b.setAttribute("aria-pressed",k===rankRole);b.addEventListener("click",()=>{rankRole=k;rankRoleEl.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",x===b));renderRank();});rankRoleEl.appendChild(b);});
function renderRank(){
  const rows=COMPANIES.filter(c=>c.roles[rankRole]&&c.roles[rankRole].m&&activeSectors.has(c.sec)).sort((a,b)=>b.roles[rankRole].m-a.roles[rankRole].m);
  const max=rows.length?rows[0].roles[rankRole].m:1;
  $("#rankList").innerHTML=rows.map((c,i)=>`<li><button type="button" data-id="${c.id}"><span class="n">${i+1}</span><span class="nm"><b>${c.n}</b><div class="bar" style="width:${(c.roles[rankRole].m/max*100).toFixed(1)}%;background:${SECTORS[c.sec].color}"></div></span><span class="v">${money(c.roles[rankRole].m)}</span></button></li>`).join("");
  $("#rankList").querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{const c=COMPANIES[+b.dataset.id];openCompany(c,true);cardRole=c.roles[rankRole]?rankRole:headRole(c);renderCard();}));
}
renderRank();
$("#rankTog").addEventListener("click",()=>{const r=$("#rank");r.classList.toggle("min");$("#rankTog").textContent=r.classList.contains("min")?"Show":"Hide";});

/* ---------- legend ---------- */
const legendEl=$("#legend");
Object.entries(SECTORS).forEach(([k,s])=>{const b=document.createElement("button");b.type="button";b.setAttribute("aria-pressed","true");const n=COMPANIES.filter(c=>c.sec===k).length;b.innerHTML=`<i style="background:${s.color}"></i>${s.label} <span class="mono" style="color:var(--muted)">${n}</span>`;
  b.addEventListener("click",()=>{if(activeSectors.has(k))activeSectors.delete(k);else activeSectors.add(k);b.setAttribute("aria-pressed",activeSectors.has(k));
   COMPANIES.forEach(c=>{const on=activeSectors.has(c.sec);c.obj.m.visible=on;c.obj.cr.visible=on;c.obj.halo.visible=on;c.obj.pool.visible=on;});renderRank();});legendEl.appendChild(b);});

/* ---------- search ---------- */
const modal=$("#modal"),q=$("#q"),qList=$("#qList");let qSel=0,qRows=[];
function openSearch(){modal.hidden=false;q.value="";renderSearch();q.focus();}
function closeSearch(){modal.hidden=true;}
function renderSearch(){const s=q.value.trim().toLowerCase();qRows=COMPANIES.filter(c=>!s||c.n.toLowerCase().includes(s)||c.hood.toLowerCase().includes(s)||SECTORS[c.sec].label.toLowerCase().includes(s)).sort((a,b)=>headline(b)-headline(a));qSel=0;
  qList.innerHTML=qRows.map((c,i)=>`<li><button type="button" role="option" data-id="${c.id}" aria-selected="${i===qSel}"><span><i style="display:inline-block;width:7px;height:7px;border-radius:50%;background:${SECTORS[c.sec].color};margin-right:8px"></i>${c.n} <small>${c.hood}</small></span><span class="mono">${c.roles[headRole(c)].m?money(c.roles[headRole(c)].m):"locked"}</span></button></li>`).join("")||`<li style="padding:10px;color:var(--muted)">No company matches “${q.value}”.</li>`;
  qList.querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{closeSearch();openCompany(COMPANIES[+b.dataset.id],true);}));}
q.addEventListener("input",renderSearch);
q.addEventListener("keydown",e=>{if(e.key==="Escape"){closeSearch();}if(e.key==="ArrowDown"||e.key==="ArrowUp"){e.preventDefault();qSel=THREE.MathUtils.clamp(qSel+(e.key==="ArrowDown"?1:-1),0,qRows.length-1);qList.querySelectorAll("button").forEach((b,i)=>{b.setAttribute("aria-selected",i===qSel);if(i===qSel)b.scrollIntoView({block:"nearest"});});}if(e.key==="Enter"&&qRows[qSel]){closeSearch();openCompany(qRows[qSel],true);}});
modal.addEventListener("click",e=>{if(e.target===modal)closeSearch();});
$("#searchBtn").addEventListener("click",openSearch);

/* ---------- ride ---------- */
const rideEl=$("#ridebar");
function startRide(L){closeCard();setMode("ride");state.ride={L,u:L.tu,dir:L.dir};chapterEl.hidden=true;dotsEl.hidden=true;$("#rank").hidden=true;
  stLabels.forEach(s=>s.el.hidden=s.L!==L);[LINE1,LINE14].forEach(x=>x.mesh.material.opacity=x===L?1:.25);rideEl.hidden=false;hint.textContent="riding the Métro · tap the bar or press esc to get off";}
function endRideVisuals(){state.ride=null;rideEl.hidden=true;stLabels.forEach(s=>s.el.hidden=true);[LINE1,LINE14].forEach(x=>x.mesh.material.opacity=.75);}
function stopRide(){const p=camera.position.clone();const L=state.ride&&state.ride.L;endRideVisuals();state.mode="explore";setMode("explore");if(L){const t=L.train.children[0].position.clone();controls.target.copy(t);camera.position.copy(p);flyTo(t,3.2,null,0.7);}}
rideEl.addEventListener("click",stopRide);rideEl.addEventListener("keydown",e=>{if(e.key==="Enter")stopRide();});
function updateRide(){const R=state.ride,L=R.L;const u=L.tu,dir=L.dir;
  const p=L.curve.getPointAt(u);const back=L.curve.getPointAt(THREE.MathUtils.clamp(u-dir*0.18/L.len,0,1));const ahead=L.curve.getPointAt(THREE.MathUtils.clamp(u+dir*0.9/L.len,0,1));
  const behind=new THREE.Vector3().subVectors(p,back);if(behind.lengthSq()<1e-6)behind.set(0,0,1);behind.normalize();
  const camP=new THREE.Vector3(p.x-behind.x*0.26,0.15,p.z-behind.z*0.26);camera.position.lerp(camP,0.08);
  const look=new THREE.Vector3(ahead.x,0.05,ahead.z);R.look=R.look?R.look.lerp(look,0.08):look;camera.lookAt(R.look);
  // next station
  let next=null;for(let i=0;i<L.su.length;i++){const k=dir>0?i:L.su.length-1-i;if((dir>0&&L.su[k]>u+0.002)||(dir<0&&L.su[k]<u-0.002)){next=L.st[k][0];break;}}
  const term=dir>0?L.st[L.st.length-1][0]:L.st[0][0];
  const html=`<span class="roundel" style="background:${L.color};color:${L.fg}">${L.id}</span><span class="t"><b>Next: ${next||term}</b><small>Direction ${term}</small></span><span class="x">esc · get off</span>`;
  if(rideEl.dataset.h!==html){rideEl.innerHTML=html;rideEl.dataset.h=html;}
}

/* ---------- picking ---------- */
const ray=new THREE.Raycaster(),ptr=new THREE.Vector2();let down=null;
canvas.addEventListener("pointerdown",e=>{down=[e.clientX,e.clientY];canvas.classList.add("drag");});
canvas.addEventListener("pointerup",e=>{canvas.classList.remove("drag");if(!down)return;const moved=Math.hypot(e.clientX-down[0],e.clientY-down[1]);down=null;if(moved>6)return;
  if(state.mode==="ride"){stopRide();return;}
  const c=pick(e);if(c)openCompany(c,true);});
canvas.addEventListener("pointermove",e=>{if(e.pointerType!=="mouse")return;const c=pick(e);if(c!==hovered){if(hovered)hovered.obj.mat.emissiveIntensity=.9;hovered=c;if(c)c.obj.mat.emissiveIntensity=1.6;canvas.style.cursor=c?"pointer":"";}});
function pick(e){const r=canvas.getBoundingClientRect();ptr.set((e.clientX-r.left)/r.width*2-1,-((e.clientY-r.top)/r.height)*2+1);ray.setFromCamera(ptr,camera);const h=ray.intersectObjects(pickables.filter(m=>m.visible));return h.length?h[0].object.userData.c:null;}

/* ---------- loop ---------- */
const off={x:0,y:0};
function setOffset(x,y){off.x+=(x-off.x)*0.08;off.y+=(y-off.y)*0.08;if(Math.abs(off.x)<0.5&&Math.abs(off.y)<0.5){if(camera.view&&camera.view.enabled){camera.clearViewOffset();}return;}camera.setViewOffset(W,H,off.x,off.y,W,H);}
function resize(){W=innerWidth;H=innerHeight;renderer.setSize(W,H,false);camera.aspect=W/H;camera.fov=W<720?52:40;camera.updateProjectionMatrix();}
addEventListener("resize",resize);resize();
let last=performance.now(),t0=last;
function frame(now){
  const dt=Math.min(0.05,(now-last)/1000);last=now;const T=(now-t0)/1000;
  [LINE1,LINE14].forEach(L=>placeTrain(L,dt));
  if(state.mode==="tour"){
    if(now-snapT>450&&Math.abs(state.goal-Math.round(state.goal))>0.001)state.goal+=(Math.round(state.goal)-state.goal)*0.12;
    state.prog+=(state.goal-state.prog)*(reduce?1:1-Math.pow(0.94,dt*60));if(Math.abs(state.goal-state.prog)<0.002)state.prog=state.goal;
    const pp=poseAt(state.prog);camera.position.copy(pp.p);camera.lookAt(pp.t);
    setOffset(W>720?-W*0.14:0,W>720?0:H*0.2);
    renderChapter(Math.round(state.prog));
  } else if(state.mode==="explore"){
    setOffset(W>720&&!cardEl.hidden?W*0.1:0,W<=720&&!cardEl.hidden?H*0.22:0);
    if(state.fly){const f=state.fly;const u=ease(Math.min(1,(now-f.t0)/f.dur));camera.position.lerpVectors(f.from.p,f.to.p,u);controls.target.lerpVectors(f.from.t,f.to.t,u);if(u>=1)state.fly=null;}
    controls.update();
  } else if(state.mode==="ride"){setOffset(0,0);updateRide();}
  // beam & halos
  beam.rotation.y=T*0.6;
  COMPANIES.forEach((c,i)=>{c.obj.halo.material.opacity=.55+.25*Math.sin(T*1.6+i);});
  // Gaston: circles current focus
  let focus;if(state.mode==="tour")focus=poseAt(state.prog).t;else if(state.mode==="ride")focus=state.ride.L.train.children[0].position;else focus=controls.target;
  gastonTarget.copy(focus);const camD=camera.position.distanceTo(focus);const rad=THREE.MathUtils.clamp(camD*0.12,0.25,2.2);
  gastonTarget.x+=Math.cos(T*0.5)*rad;gastonTarget.z+=Math.sin(T*0.5)*rad;gastonTarget.y=THREE.MathUtils.clamp(camD*0.12,0.3,1.8);
  gastonPos.lerp(gastonTarget,0.02);const prev=gaston.position.clone();gaston.position.copy(gastonPos);
  const vel=gaston.position.clone().sub(prev);if(vel.lengthSq()>1e-9)gaston.rotation.y=Math.atan2(-vel.z,vel.x);
  const sc=THREE.MathUtils.clamp(camD*0.09,0.6,6);gaston.scale.setScalar(sc);
  const fl=Math.sin(T*14)*0.7;gaston.userData.w[0].rotation.x=fl;gaston.userData.w[1].rotation.x=-fl;
  renderer.render(scene,camera);updateLabels();
  requestAnimationFrame(frame);
}
setMode("tour");
requestAnimationFrame(frame);
setTimeout(()=>{$("#loader").classList.add("done");},reduce?100:900);
})();
