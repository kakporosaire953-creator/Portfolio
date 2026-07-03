/* =========  CURSOR  ========= */
const cx=document.getElementById('cur'),cr=document.getElementById('curR');
let mx=0,my=0,rx=window.innerWidth/2,ry=window.innerHeight/2;

// Désactiver curseur sur mobile pour économiser ressources
const isMobile = window.innerWidth < 768;
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!isMobile) {
  document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cx.style.left=mx+'px';cx.style.top=my+'px';});
  setInterval(()=>{rx+=(mx-rx)*.13;ry+=(my-ry)*.13;cr.style.left=rx+'px';cr.style.top=ry+'px';},14);
  document.querySelectorAll('button,a,.proj-card,.svc-card,.stack-row,.c-card,.chip').forEach(el=>{
    el.addEventListener('mouseenter',()=>cr.classList.add('big'));
    el.addEventListener('mouseleave',()=>cr.classList.remove('big'));
  });
} else {
  // Masquer curseurs sur mobile
  if (cx) cx.style.display = 'none';
  if (cr) cr.style.display = 'none';
}

/* =========  LOADER  ========= */
const lMsgs=['Démarrage du système...','Chargement typographie...','Initialisation modules...','Interface prête'];
let p=0;
const lf=document.getElementById('lFill'),lm=document.getElementById('lMsg');
const lv=setInterval(()=>{
  p+=Math.random()*7+3;
  if(p>=100){p=100;clearInterval(lv);}
  lf.style.width=p+'%';
  lm.textContent=lMsgs[Math.floor(p/25)%4];
  if(p>=100)setTimeout(()=>{document.getElementById('ldr').classList.add('gone');initParts();},700);
},80);

/* =========  NAV  ========= */
window.addEventListener('scroll',()=>{document.getElementById('nav').classList.toggle('scrolled',scrollY>40);});

// Active nav link detection
const pg=location.pathname.split('/').pop()||'index.html';
document.querySelectorAll('.nav-links a[href]').forEach(a=>{
  const h=a.getAttribute('href');
  if(h===pg||(pg===''&&h==='index.html')){a.classList.add('nav-active');}
});

/* =========  MOBILE MENU  ========= */
let mobileMenuOpen = false;
function toggleMobileMenu() {
  mobileMenuOpen = !mobileMenuOpen;
  const menu = document.getElementById('mobileMenu');
  const btn = document.getElementById('mobileMenuBtn');
  menu.classList.toggle('open', mobileMenuOpen);
  btn.classList.toggle('active', mobileMenuOpen);
  // Empêcher le scroll du body quand le menu est ouvert
  document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
}

// Fermer le menu si on clique sur un lien
document.querySelectorAll('.mobile-menu-content a').forEach(link => {
  link.addEventListener('click', () => {
    if(mobileMenuOpen) toggleMobileMenu();
  });
});

// Marquer le lien actif dans le menu mobile
document.querySelectorAll('.mobile-menu-content a[href]').forEach(a => {
  const h = a.getAttribute('href');
  if(h === pg || (pg === '' && h === 'index.html')) {
    a.classList.add('nav-active');
  }
});

/* =========  SCROLL REVEAL  ========= */
const rvObs=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('on');});},{threshold:.1});
document.querySelectorAll('.rv').forEach(el=>rvObs.observe(el));

/* =========  SKILL BARS  ========= */
const skObs=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){e.target.querySelectorAll('.sk-fill').forEach(b=>{b.classList.add('on');b.style.transform='scaleX('+b.dataset.v+')';});}});},{threshold:.3});
document.querySelectorAll('.skills-layout').forEach(el=>skObs.observe(el));

/* =========  THEME  ========= */
let isDark=localStorage.getItem('theme')==='dark';
function toggleTheme(){
  isDark=!isDark;
  const theme=isDark?'dark':'light';
  document.documentElement.setAttribute('data-theme',theme);
  localStorage.setItem('theme',theme);
  document.getElementById('themeBtn').innerHTML=isDark?'<i class="fa-solid fa-moon"></i>':'<i class="fa-solid fa-sun"></i>';
  // Animation de transition fluide
  document.body.style.transition='background 0.4s ease, color 0.4s ease';
}
// Charger le thème au démarrage
document.addEventListener('DOMContentLoaded',()=>{
  const savedTheme=localStorage.getItem('theme')||'light';
  isDark=savedTheme==='dark';
  document.documentElement.setAttribute('data-theme',savedTheme);
  const btn=document.getElementById('themeBtn');
  if(btn)btn.innerHTML=isDark?'<i class="fa-solid fa-moon"></i>':'<i class="fa-solid fa-sun"></i>';
});

/* =========  i18n  ========= */
const TRANS={fr:{
  'nav.home':'Accueil','nav.about':'À propos','nav.projects':'Projets','nav.skills':'Compétences','nav.exp':'Parcours','nav.contact':'Contact','nav.cta':'Travailler ensemble',
  'hero.badge':'Disponible pour missions','hero.italic':'Ingénieur &amp; Architecte du Numérique','hero.desc':"Je transforme les idées ambitieuses en expériences numériques futuristes, plateformes intelligentes et écosystèmes e-commerce conçus pour l'avenir de l'Afrique.",'hero.btn1':'<i class="fa-solid fa-arrow-down-right" style="margin-right:8px"></i>Découvrir mon univers','hero.btn2':'Me contacter','hero.photo':'Photo — Rosaire KAKPO','hero.s1':'Projets livrés','hero.s2':"Années d'expertise",'hero.s3':'Technologies',
  'about.tag':'Identité','about.photo':'Portrait — Rosaire KAKPO','about.p1':"Passionné par l'intersection entre la technologie de pointe et l'innovation africaine, je construis des expériences numériques alliant performance, esthétique et intelligence artificielle.",'about.p2':"Mon approche combine la rigueur d'un ingénieur, la sensibilité d'un designer UX et la vision d'un entrepreneur.",'about.mission_lbl':'Mission','about.mission':"\"Créer les interfaces qui définiront l'économie numérique africaine de demain — futuristes, accessibles et profondément humaines.\"",'about.avail':'<strong>Actuellement disponible</strong> pour missions freelance',
  'aip.tag':'Analyse IA','aip.h2':'ANALYSE DU <em>PROFIL</em>','aip.sub':"L'IA analyse Rosaire.",'aip.sys':'AI SYSTÈME — ANALYSE PROFIL','aip.active':'ACTIF','aip.k1':'NOM','aip.k2':'SPÉCIALITÉ','aip.k3':'LOCALISATION','aip.k4':'MISSION','aip.stat1':'Projets livrés avec succès','aip.stat2':'Année d\'expertise terrain','aip.stack':'Stack principal',
  'vision.tag':'MA VISION',
  'gal.h2':'Univers de <em>Projets</em>','gal.sub':'Naviguez dans la galaxie — survolez une planète.',
  'proj.tag':'Réalisations','proj.p1':'Plateforme e-commerce premium pour Apple reconditionné. Interface immersive, tunnel de conversion optimisé et UX de classe mondiale.','proj.p2':'Plateforme de mise en relation entre jeunes talents africains et opportunités mondiales.','proj.p3':'Écosystème numérique pour la vie étudiante — campus connecté et ressources centralisées.','proj.p4':"Marketplace hyperlocale pour l'artisanat béninois. L'économie locale, digitalisée.",'proj.p5':"Vitrine digitale d'un cabinet d'architecture — portfolio interactif et visualisations 3D.",'proj.explore':'Explorer le projet',
  'sk.tag':'Expertise',
  'exp.tag':'Parcours','exp.e1':"Conception et développement d'interfaces web premium pour clients en Afrique et à l'international.",'exp.e2':'Enseignement du développement web. Formation React, JavaScript moderne et bonnes pratiques.','exp.e3':"Développement d'une solution innovante en 48h. Prototypage rapide sous contrainte.",'exp.e4':'Projets à l\'intersection hardware/software. Prototypes IoT avec interfaces web modernes.',
  'afr.tag':'Innovation','afr.h2':'African <em>Innovation</em>','afr.h3':"Construire pour<br><em>l'Afrique.</em><br>Depuis le Bénin.",'afr.l1':"<strong>Construire des solutions</strong> conçues pour le contexte africain, pas des copies d'occident.",'afr.l2':"<strong>Depuis le Bénin,</strong> avec la fierté d'un développeur africain qui refuse les plafonds de verre.",'afr.l3':"<strong>Pour le monde,</strong> avec des standards d'excellence qui rivalisent avec les meilleures équipes mondiales.",'afr.badge':'<i class="fa-solid fa-satellite-dish"></i>&nbsp;&nbsp;BÉNIN DIGITAL LAB — GLOBAL REACH',
  'hire.tag':'Services','hire.h2':'Travaillons <em>Ensemble</em>','hire.cta':'<i class="fa-solid fa-paper-plane" style="margin-right:10px"></i>Démarrer un projet','svc.price':'Sur devis','svc.t1':'Développement Frontend','svc.d1':'Interfaces performantes et visuellement exceptionnelles. React, Next.js, TypeScript.','svc.t2':'E-commerce','svc.d2':'Boutiques en ligne complètes avec tunnel de conversion optimisé.','svc.t3':'Marketplace','svc.d3':'Plateformes multi-vendeurs sur mesure.','svc.t4':'UX Design','svc.d4':"Wireframing, prototypage et design systems centrés sur l'humain.",'svc.t5':'Intégration IA','svc.d5':'Chatbots intelligents et fonctionnalités IA intégrées dans vos produits.','svc.t6':'Stratégie Produit','svc.d6':'Vision produit et accompagnement de startups africaines à fort potentiel.',
  'contact.tag':'Contact','contact.p':'Que vous ayez une vision ambitieuse ou un problème à résoudre, je transforme vos idées en réalité numérique exceptionnelle.','contact.avail':'<strong>Disponible</strong> — Réponse sous 24h','form.name':'Votre nom','form.subj':'Sujet','form.msg':'Message','form.send':'<i class="fa-solid fa-paper-plane" style="margin-right:8px"></i>Envoyer le message',
  'ai.welcome':"Bonjour ! Je suis l'assistant IA de Rosaire. Posez-moi vos questions sur ses projets, compétences ou services.",
  'ai.name':'RK — Assistant IA','ai.sub':'Propulsé par intelligence artificielle','ai.s1':'Services','ai.s2':'Projets','ai.s3':'Contact','ai.s4':'Skills'
},en:{
  'nav.home':'Home','nav.about':'About','nav.projects':'Projects','nav.skills':'Skills','nav.exp':'Experience','nav.contact':'Contact','nav.cta':'Let\'s Work Together',
  'hero.badge':'Open to new opportunities','hero.italic':'Frontend Developer | E-commerce &amp; UX Design','hero.desc':"I turn bold ideas into futuristic digital experiences — intelligent platforms and e-commerce ecosystems built for Africa's tomorrow.",'hero.btn1':'<i class="fa-solid fa-arrow-down-right" style="margin-right:8px"></i>Explore my work','hero.btn2':'Get in touch','hero.photo':'Photo — Rosaire KAKPO','hero.s1':'Projects shipped','hero.s2':'Year of experience','hero.s3':'Technologies',
  'about.tag':'About Me','about.photo':'Portrait — Rosaire KAKPO','about.p1':"Trained at Institut Universitaire Les Cours Sonou and recognized at the MIABE Hackathon, I also took part in the Arduino Days 2026 at Sèmè City Open Park.",'about.p2':'I am passionate about the crossroads of cutting-edge technology and African innovation, crafting digital experiences that balance performance, beauty and modernity.','about.mission_lbl':'Mission','about.mission':"\"Building the interfaces that will shape tomorrow's African digital economy — futuristic, accessible and deeply human.\"",'about.avail':'<strong>Currently available</strong> for freelance projects',
  'aip.tag':'AI Analysis','aip.h2':'PROFILE <em>ANALYSIS</em>','aip.sub':"AI analyzing Rosaire.",'aip.sys':'AI SYSTEM — PROFILE ANALYSIS','aip.active':'ACTIVE','aip.k1':'NAME','aip.k2':'SPECIALTY','aip.k3':'LOCATION','aip.k4':'MISSION','aip.stat1':'Projects successfully delivered','aip.stat2':'Year of field expertise','aip.stack':'Core stack',
  'vision.tag':'MY VISION',
  'gal.h2':'Universe of <em>Projects</em>','gal.sub':'Navigate the galaxy — hover over a planet.',
  'proj.tag':'Projects','proj.p1':'Premium e-commerce platform for refurbished Apple products — immersive UI and a streamlined, conversion-focused checkout.','proj.p2':'A platform connecting young African talent with opportunities around the world.','proj.p3':'A digital ecosystem for student life — a connected campus with centralized resources.','proj.p4':"A hyperlocal marketplace for Beninese craftsmanship. Local economy, brought online.",'proj.p5':'Digital showcase for an architecture firm — interactive portfolio with 3D visualizations.','proj.explore':'View project',
  'sk.tag':'Skills',
  'exp.tag':'Experience','exp.e1':'Designing and developing premium web interfaces for clients across Africa and beyond.','exp.e2':'Teaching web development — React, modern JavaScript and coding best practices.','exp.e3':'Built an innovative solution in 48 hours during a national hackathon. Fast thinking under pressure.','exp.e4':'Bridging hardware and software — IoT prototypes paired with sleek web interfaces.',
  'afr.tag':'Innovation','afr.h2':'African <em>Innovation</em>','afr.h3':"Building for<br><em>Africa.</em><br>From Benin.",'afr.l1':"<strong>Building solutions</strong> designed for the African context, not Western copies.",'afr.l2':"<strong>From Benin,</strong> with the pride of an African developer refusing glass ceilings.",'afr.l3':"<strong>For the world,</strong> with standards of excellence that rival the best global teams.",'afr.badge':'<i class="fa-solid fa-satellite-dish"></i>&nbsp;&nbsp;BENIN DIGITAL LAB — GLOBAL REACH',
  'hire.tag':'Services','hire.h2':'Let\'s Work <em>Together</em>','hire.cta':'<i class="fa-solid fa-paper-plane" style="margin-right:10px"></i>Start a project','svc.price':'Custom quote','svc.t1':'Frontend Development','svc.d1':'Fast, visually stunning interfaces built with React, Next.js and TypeScript.','svc.t2':'E-commerce','svc.d2':'Complete online stores with optimized checkout flows and high-converting UX.','svc.t3':'Marketplace','svc.d3':'Custom multi-vendor platforms designed to scale for local or international markets.','svc.t4':'UX Design','svc.d4':'Wireframing, prototyping and human-centered design systems that genuinely serve your users.','svc.t5':'AI Integration','svc.d5':'Smart chatbots and AI-powered features smoothly integrated into your products.','svc.t6':'Product Strategy','svc.d6':'Clear product vision and hands-on guidance for ambitious African startups.',
  'contact.tag':'Contact','contact.p':"Have a bold vision or a challenge to solve? Let's build something remarkable together.",'contact.avail':'<strong>Available now</strong> — I respond within 24 hours','form.name':'Your name','form.subj':'Subject','form.msg':'Your message','form.send':'<i class="fa-solid fa-paper-plane" style="margin-right:8px"></i>Send message',
  'ai.welcome':"Hey! I'm Rosaire's AI assistant. Ask me anything about his projects, skills or services — I'm happy to help.",
  'ai.name':'RK — AI Assistant','ai.sub':'Powered by Artificial Intelligence','ai.s1':'Services','ai.s2':'Projects','ai.s3':'Contact','ai.s4':'Skills'
}};

let lang='fr';
function toggleLang(){
  lang=lang==='fr'?'en':'fr';
  document.documentElement.setAttribute('data-lang',lang);
  document.getElementById('langBtn').textContent=lang==='fr'?'EN':'FR';
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const k=el.dataset.i18n;
    if(TRANS[lang][k]!==undefined)el.innerHTML=TRANS[lang][k];
  });
  const wb=document.querySelector('#aiMsgs .bot');
  if(wb)wb.innerHTML=TRANS[lang]['ai.welcome'];
}

/* =========  TERMINAL  ========= */
const termCmds={
  help:`Commandes disponibles:\nabout · projects · skills · experience\ncontact · github · linkedin · whoami\nstats · clear · theme dark|light · lang fr|en`,
  about:`ROSAIRE KAKPO — Frontend Dev & AI Creator\nCotonou, Bénin · Freelance · Global`,
  whoami:`uid=001(rosaire) gid=001(kakpo)\ngroups=frontend,ux,ai,ecommerce`,
  stats:`Projets livrés:   5+\nTechnologies:     10+\nExp (années):     3+\nCafé consommé:    [OVERFLOW]`,
  projects:`01. Apple Confidence — E-commerce Premium\n02. SkillBridge — Plateforme Talents\n03. Campusly — Vie Universitaire\n04. Gbéto — Marketplace Locale\n05. E-Architect SARL`,
  skills:`Frontend  ████████████ 95%\nUX Design ██████████░░ 88%\nFirebase  ████████████ 90%\nAI Integ  ████████░░░░ 78%`,
  experience:`2024–Now  Freelance Developer\n2023      Formateur Les Cours Sonou\n2023      MIABE Hackathon Finalist\n2022–23   Arduino Days Speaker`,
  contact:`Email:    rosaire.kakpo@gmail.com\nWhatsApp: +229 00 00 00 00\nLinkedIn: Rosaire KAKPO`,
  github:`> Ouverture GitHub...`,
  linkedin:`> Ouverture LinkedIn...`,
  'theme dark':'Thème sombre activé.',
  'theme light':'Thème clair activé.',
  'lang fr':'Langue: Français',
  'lang en':'Language: English',
};

let tHist=[],tIdx=-1,termReady=false;
function tLine(isP,cmd,out,cls=''){
  const b=document.getElementById('termBody');
  if(isP)b.innerHTML+=`<div style="margin-bottom:3px"><span class="t-prompt">rosaire@rk:~$ </span><span class="t-cmd">${cmd}</span></div>`;
  if(out)b.innerHTML+=`<div class="t-out ${cls}" style="margin-bottom:8px">${out.replace(/\n/g,'<br>')}</div>`;
  b.scrollTop=9999;
}
function initTerm(){
  const b=document.getElementById('termBody');b.innerHTML='';
  tLine(false,'',`<span style="color:var(--orange);font-weight:600">RK Portfolio OS v2.0</span>\n<span style="color:var(--text3)">Bénin Digital Lab — Tapez </span><span style="color:var(--blue)">help</span><span style="color:var(--text3)"> pour commencer\n</span>`);
}
const navPages={
  'about':'about.html','projects':'projects.html','skills':'skills.html',
  'experience':'experience.html','contact':'contact.html'
};
function runTerm(cmd){
  cmd=cmd.trim();const lc=cmd.toLowerCase();
  tHist.unshift(cmd);tIdx=-1;
  if(lc==='clear'){initTerm();return;}
  if(lc.startsWith('theme ')){
    const t=lc.split(' ')[1];
    if(t==='dark'||t==='light'){isDark=t==='dark';document.documentElement.setAttribute('data-theme',t);document.getElementById('themeBtn').innerHTML=isDark?'<i class="fa-solid fa-moon"></i>':'<i class="fa-solid fa-sun"></i>';tLine(true,cmd,termCmds[lc]||'Thème mis à jour.','ok');return;}
  }
  if(lc.startsWith('lang ')){
    const l=lc.split(' ')[1];
    if(l==='fr'||l==='en'){if(l!==lang)toggleLang();tLine(true,cmd,termCmds[lc]||'Langue mise à jour.','nfo');return;}
  }
  if(navPages[lc]){
    tLine(true,cmd,`> Navigation vers ${lc}...`,'nfo');
    setTimeout(()=>window.location.href=navPages[lc],600);return;
  }
  const out=termCmds[lc];
  if(out){
    tLine(true,cmd,out);
    if(lc==='github')window.open('https://github.com/kakporosaire953-creator','_blank');
    if(lc==='linkedin')window.open('https://www.linkedin.com/in/rosaire-kakpo-9b31963b6','_blank');
  } else {
    tLine(true,cmd,`Commande inconnue: "${cmd}" — Tapez <span style="color:var(--blue)">help</span>`,'warn');
  }
}
document.getElementById('termIn').addEventListener('keydown',e=>{
  if(e.key==='Enter'){const v=e.target.value;if(v.trim())runTerm(v);e.target.value='';}
  if(e.key==='ArrowUp'&&tIdx<tHist.length-1){tIdx++;e.target.value=tHist[tIdx]||'';}
  if(e.key==='ArrowDown'){tIdx>0?tIdx--:tIdx=-1;e.target.value=tHist[tIdx]||'';}
});
let termOpen=false;
function toggleTerminal(){
  termOpen=!termOpen;
  const t=document.getElementById('term'),f=document.getElementById('termFab');
  t.classList.toggle('open',termOpen);
  f.style.display=termOpen?'none':'flex';
  if(termOpen){if(!termReady){initTerm();termReady=true;}setTimeout(()=>document.getElementById('termIn').focus(),80);}
}

/* =========  CMD PALETTE  ========= */
const cmdItems=[
  {i:'fa-house',l:'Accueil / Home',h:'index.html',a:()=>window.location.href='index.html'},
  {i:'fa-user',l:'À propos / About',h:'about.html',a:()=>window.location.href='about.html'},
  {i:'fa-folder-open',l:'Projets / Projects',h:'projects.html',a:()=>window.location.href='projects.html'},
  {i:'fa-brain',l:'Compétences / Skills',h:'skills.html',a:()=>window.location.href='skills.html'},
  {i:'fa-timeline',l:'Parcours / Journey',h:'experience.html',a:()=>window.location.href='experience.html'},
  {i:'fa-handshake',l:'Services / Hire',h:'contact.html',a:()=>window.location.href='contact.html#hire'},
  {i:'fa-envelope',l:'Contact',h:'contact.html',a:()=>window.location.href='contact.html'},
  {i:'fa-terminal',l:'Terminal',h:'',a:()=>toggleTerminal()},
  {i:'fa-gauge',l:'Dashboard Admin 🔐',h:'(Protégé)',a:()=>openAdmin()},
  {i:'fa-robot',l:'Assistant IA',h:'',a:()=>toggleAI()},
  {i:'fa-brands fa-github',l:'GitHub',h:'',a:()=>window.open('https://github.com/kakporosaire953-creator','_blank')},
];
function rCmd(items){
  const el=document.getElementById('cmdRes');
  el.innerHTML='<div class="cmd-sec-lbl">Navigation &amp; Commandes</div>'+items.map((it,i)=>`<div class="cmd-row" id="cr${i}"><div class="cmd-ico"><i class="fa-solid ${it.i}" style="font-size:12px"></i></div><span class="cmd-txt">${it.l}</span><span class="cmd-hint">${it.h}</span></div>`).join('');
  items.forEach((it,i)=>{const e=document.getElementById('cr'+i);if(e)e.onclick=()=>{it.a();closeCmd();};});
}
rCmd(cmdItems);
function fCmd(q){rCmd(q?cmdItems.filter(it=>it.l.toLowerCase().includes(q.toLowerCase())):cmdItems);}
function openCmd(){document.getElementById('cmd').classList.add('open');setTimeout(()=>document.getElementById('cmdIn').focus(),50);}
function closeCmd(){document.getElementById('cmd').classList.remove('open');document.getElementById('cmdIn').value='';rCmd(cmdItems);}
document.addEventListener('keydown',e=>{
  if((e.ctrlKey||e.metaKey)&&e.key==='k'){e.preventDefault();openCmd();}
  if(e.key==='Escape'){closeCmd();closeAdmin();}
});

/* =========  AI CHATBOT  ========= */
let aiOpen=false;
function toggleAI(){aiOpen=!aiOpen;document.getElementById('ai-chat').classList.toggle('open',aiOpen);}
const aiKB={
  'service':'Rosaire propose : Développement Frontend, E-commerce, Marketplace, UX Design, Intégration IA et Stratégie Produit. Tout sur mesure, prix sur devis.',
  'projet':'5 projets majeurs : Apple Confidence, SkillBridge, Campusly, Gbéto et E-Architect SARL. Chacun avec une approche futuriste et centrée sur la performance.',
  'contact':'Email : rosaire.kakpo@gmail.com | WhatsApp : +229 00 00 00 00 | Réponse garantie sous 24h.',
  'skill':'Stack : React, Next.js, TypeScript, Tailwind, Firebase, Supabase, Figma, OpenAI. Expert frontend, fort en UX et e-commerce.',
  'compétence':'Stack : React, Next.js, TypeScript, Tailwind, Firebase, Supabase. Expert en UX Design et intégration IA.',
  'prix':'Les tarifs sont sur devis selon la complexité du projet. Contactez Rosaire pour une estimation gratuite.',
  'disponible':"Rosaire est actuellement disponible pour de nouveaux projets freelance. N'hésitez pas à le contacter !",
};
function aiReply(q){
  const lq=q.toLowerCase();
  let ans="Je n'ai pas d'information précise sur ce sujet. Contactez Rosaire directement à rosaire.kakpo@gmail.com pour plus de détails.";
  for(const[k,v] of Object.entries(aiKB)){if(lq.includes(k)){ans=v;break;}}
  return ans;
}
function sendAI(){const inp=document.getElementById('aiIn');const v=inp.value.trim();if(!v)return;inp.value='';askAI(v);}
function askAI(q){
  const msgs=document.getElementById('aiMsgs');
  msgs.innerHTML+=`<div class="ai-msg me">${q}</div>`;
  const typ=document.createElement('div');typ.className='ai-msg bot';typ.innerHTML='<div class="typing"><span></span><span></span><span></span></div>';msgs.appendChild(typ);msgs.scrollTop=9999;
  setTimeout(()=>{typ.innerHTML=aiReply(q);msgs.scrollTop=9999;},900+Math.random()*600);
}

/* =========  ADMIN DASHBOARD  ========= */
// Configuration de sécurité - Changez ce code PIN pour votre sécurité
const ADMIN_PIN = 'RK2024';
let adminAuthenticated = false;

function openAdmin(){
  if (!adminAuthenticated) {
    promptAdminAuth();
    return;
  }
  document.getElementById('admin-panel').classList.add('open');
  setTimeout(()=>{document.querySelectorAll('.adm-bar-fill').forEach(b=>{b.style.width=b.dataset.w;});},300);
}

function promptAdminAuth() {
  const pin = prompt('🔐 Code d\'accès Admin requis:\n\n(Seul le propriétaire du portfolio peut accéder)');
  
  if (pin === null) return; // Utilisateur a annulé
  
  if (pin === ADMIN_PIN) {
    adminAuthenticated = true;
    sessionStorage.setItem('adminAuth', 'true');
    openAdmin();
  } else {
    alert('❌ Code incorrect. Accès refusé.');
  }
}

// Vérifier l'authentification au chargement
function checkAdminAuth() {
  const stored = sessionStorage.getItem('adminAuth');
  if (stored === 'true') {
    adminAuthenticated = true;
  }
}

// Révoquer l'accès quand on ferme l'admin
function closeAdmin(){
  document.getElementById('admin-panel').classList.remove('open');
  // Optional: déconnecter après fermeture pour plus de sécurité
  // adminAuthenticated = false;
  // sessionStorage.removeItem('adminAuth');
}

// Initialiser la vérification au chargement
document.addEventListener('DOMContentLoaded', checkAdminAuth);

/* =========  PARTICLES  ========= */
function initParts(){
  const c=document.getElementById('pcanvas'),ctx=c.getContext('2d');
  c.width=innerWidth;c.height=innerHeight;
  window.addEventListener('resize',()=>{c.width=innerWidth;c.height=innerHeight;});
  const ps=Array.from({length:55},()=>({x:Math.random()*c.width,y:Math.random()*c.height,vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.25,r:Math.random()*1.2+.4,col:Math.random()>.55?'#FF5C1A':'#1E9EFF'}));
  function dr(){
    ctx.clearRect(0,0,c.width,c.height);
    ps.forEach(p=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0)p.x=c.width;if(p.x>c.width)p.x=0;if(p.y<0)p.y=c.height;if(p.y>c.height)p.y=0;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=p.col;ctx.fill();});
    ps.forEach((a,i)=>{ps.slice(i+1).forEach(b=>{const d=Math.hypot(a.x-b.x,a.y-b.y);if(d<110){ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.strokeStyle=`rgba(255,92,26,${.07*(1-d/110)})`;ctx.lineWidth=.5;ctx.stroke();}});});
    requestAnimationFrame(dr);
  }
  dr();
}

/* =========  MAGNETIC BUTTONS  ========= */
document.querySelectorAll('.btn-p,.btn-s,.nav-cta').forEach(btn=>{
  btn.addEventListener('mousemove',e=>{const r=btn.getBoundingClientRect();btn.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.18}px,${(e.clientY-r.top-r.height/2)*.18}px)`;});
  btn.addEventListener('mouseleave',()=>{btn.style.transform='';});
});

/* =========  MOBILE TOUCH INTERACTIONS  ========= */
// Améliorer l'interaction tactile pour la galaxie de projets
if (isMobile) {
  document.addEventListener('DOMContentLoaded', () => {
    const planets = document.querySelectorAll('.planet-node');
    const infoPanel = document.getElementById('galaxyInfo');
    
    planets.forEach(planet => {
      planet.addEventListener('click', () => {
        // Fermer autres planètes actives
        planets.forEach(p => p.classList.remove('active'));
        // Activer cette planète
        planet.classList.add('active');
        
        // Afficher le panneau d'info
        if (infoPanel) {
          infoPanel.classList.add('show');
        }
      });
      
      // Rendre les labels toujours visibles sur mobile
      const label = planet.querySelector('.planet-lbl');
      if (label) {
        label.style.opacity = '1';
        label.style.color = 'var(--orange)';
      }
    });
    
    // Fermer le panneau si on clique ailleurs
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.planet-node') && !e.target.closest('.galaxy-info-panel')) {
        planets.forEach(p => p.classList.remove('active'));
        if (infoPanel) infoPanel.classList.remove('show');
      }
    });
  });
}

/* =========  LAZY LOADING IMAGES  ========= */
document.addEventListener('DOMContentLoaded', () => {
  const images = document.querySelectorAll('img[src]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.loading = 'lazy';
          observer.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
  }
});

/* =========  PREVENT HORIZONTAL SCROLL  ========= */
if (isMobile) {
  // Empêcher le scroll horizontal sur mobile
  document.body.style.overflowX = 'hidden';
  document.documentElement.style.overflowX = 'hidden';
  
  // Fixer le viewport sur mobile
  const viewport = document.querySelector('meta[name=viewport]');
  if (viewport) {
    viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
  }
}