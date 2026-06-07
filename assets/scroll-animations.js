// ========================================
// ANIMATIONS SCROLL PREMIUM - VERSION COMPLETE
// ========================================

// Configuration globale
const scrollConfig = {
  heroPhotoSticky: 0.4,
  visionWriteDelay: 150,
  projectZoomDuration: 2000,
  neuralNodeDelay: 400,
  timelineItemDelay: 300
};

// ========================================
// 1. HERO → ABOUT : Photo fixe + About émerge derrière
// ========================================
function initHeroToAbout() {
  const hero = document.querySelector('#hero');
  const portrait = document.querySelector('.portrait-frame');
  const heroTexts = document.querySelectorAll('#hero .hero-h1, #hero .hero-italic, #hero .hero-desc, #hero .hero-btns, #hero .hero-nums');
  const about = document.querySelector('#about');
  
  if (!hero || !portrait) return;

  // Faire le hero sticky pendant le scroll
  hero.style.position = 'sticky';
  hero.style.top = '0';
  hero.style.zIndex = '10';

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const heroHeight = hero.offsetHeight;
    const scrollProgress = Math.min(scrolled / heroHeight, 1);

    // Phase 1 (0-40%) : Photo reste FIXE, textes disparaissent PROGRESSIVEMENT
    if (scrollProgress < scrollConfig.heroPhotoSticky) {
      const fadeProgress = scrollProgress / scrollConfig.heroPhotoSticky;
      
      // Textes disparaissent progressivement
      heroTexts.forEach(el => {
        if (el) {
          el.style.opacity = 1 - fadeProgress;
          el.style.transform = `translateY(${fadeProgress * 80}px)`;
          el.style.filter = `blur(${fadeProgress * 10}px)`;
        }
      });

      // Photo reste FIXE et bien visible
      portrait.style.position = 'fixed';
      portrait.style.top = '50%';
      portrait.style.right = '10%';
      portrait.style.transform = 'translate(0, -50%)';
      portrait.style.opacity = '1';
      portrait.style.zIndex = '100';
    } 
    // Phase 2 (40-100%) : Photo GLISSE vers la gauche et disparaît
    else {
      const slideProgress = (scrollProgress - scrollConfig.heroPhotoSticky) / (1 - scrollConfig.heroPhotoSticky);
      
      // Tous les textes complètement invisibles
      heroTexts.forEach(el => {
        if (el) {
          el.style.opacity = '0';
          el.style.display = 'none';
        }
      });

      // Photo GLISSE vers la gauche
      portrait.style.position = 'fixed';
      portrait.style.top = '50%';
      portrait.style.transform = `translate(${-slideProgress * 200}%, -50%) rotate(${-slideProgress * 15}deg)`;
      portrait.style.opacity = Math.max(0, 1 - slideProgress);
      portrait.style.filter = `blur(${slideProgress * 15}px)`;
    }

    // About ÉMERGE derrière progressivement
    if (about && scrollProgress > 0.3) {
      const aboutProgress = (scrollProgress - 0.3) / 0.7;
      about.style.opacity = aboutProgress;
      about.style.transform = `translateY(${(1 - aboutProgress) * 50}px)`;
    }
  });
}

// ========================================
// 2. VISION : Titre s'écrit MOT PAR MOT avec délai élégant
// ========================================
function initVisionWriting() {
  const visionSection = document.querySelector('#vision');
  if (!visionSection) return;

  const visionText = visionSection.querySelector('.vision-text');
  if (!visionText) return;

  // Sauvegarder le texte original
  const originalText = visionText.textContent;
  const words = originalText.split(' ');
  
  // Vider et reconstruire avec des spans
  visionText.innerHTML = '';
  visionText.style.minHeight = '100px'; // Éviter le jump
  
  words.forEach((word, index) => {
    const span = document.createElement('span');
    span.className = 'vision-word';
    span.textContent = word;
    span.style.opacity = '0';
    span.style.transform = 'translateY(30px) scale(0.8)';
    span.style.display = 'inline-block';
    span.style.margin = '0 0.3em';
    visionText.appendChild(span);
  });

  // Observer pour déclencher l'animation
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const wordElements = entry.target.querySelectorAll('.vision-word');
        
        // Chaque mot apparaît avec un délai ÉLÉGANT
        wordElements.forEach((word, i) => {
          setTimeout(() => {
            word.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
            word.style.opacity = '1';
            word.style.transform = 'translateY(0) scale(1)';
          }, i * scrollConfig.visionWriteDelay);
        });
        
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(visionText);
}

// ========================================
// 3. PROJECTS : Titre GROSSIT jusqu'à remplir l'écran
//              puis les cartes apparaissent DANS le texte
// ========================================
function initProjectsZoomEffect() {
  const projectsSection = document.querySelector('#projects');
  if (!projectsSection) return;

  const titleElement = projectsSection.querySelector('.sec-h2');
  const projectCards = projectsSection.querySelectorAll('.proj-card');
  
  if (!titleElement) return;

  const titleText = titleElement.textContent;
  let animationTriggered = false;

  // Créer l'overlay de zoom
  const zoomOverlay = document.createElement('div');
  zoomOverlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    z-index: 9999;
    opacity: 0;
    background: var(--bg);
    transition: opacity 0.5s;
  `;
  
  const zoomTitle = document.createElement('h2');
  zoomTitle.textContent = titleText;
  zoomTitle.style.cssText = `
    font-family: 'Clash Display', sans-serif;
    font-size: 48px;
    font-weight: 700;
    color: var(--text);
    text-align: center;
    transform: scale(1);
    transition: all 1.5s cubic-bezier(0.16, 1, 0.3, 1);
    letter-spacing: -2px;
  `;
  
  zoomOverlay.appendChild(zoomTitle);
  document.body.appendChild(zoomOverlay);

  // Cacher les cartes initialement
  projectCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'scale(0.5)';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animationTriggered) {
        animationTriggered = true;
        
        // PHASE 1: Titre GROSSIT (0-1.5s)
        zoomOverlay.style.opacity = '1';
        setTimeout(() => {
          zoomTitle.style.fontSize = '180px';
          zoomTitle.style.transform = 'scale(2)';
          zoomTitle.style.letterSpacing = '-10px';
        }, 100);
        
        // PHASE 2: Titre explose et disparaît (1.5-2s)
        setTimeout(() => {
          zoomTitle.style.fontSize = '300px';
          zoomTitle.style.transform = 'scale(3)';
          zoomTitle.style.opacity = '0';
          zoomOverlay.style.opacity = '0';
        }, 1500);
        
        // PHASE 3: Cartes apparaissent DANS le texte (2-4s)
        setTimeout(() => {
          projectCards.forEach((card, i) => {
            setTimeout(() => {
              card.style.transition = 'all 1s cubic-bezier(0.16, 1, 0.3, 1)';
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
              card.style.filter = 'blur(0)';
            }, i * 200);
          });
        }, scrollConfig.projectZoomDuration);
        
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  observer.observe(projectsSection);
}

// ========================================
// 4. PROJECTS : Chaque projet arrive du BAS avec BLUR + ZOOM
//               Le précédent DISPARAÎT progressivement
// ========================================
function initProjectsStorytellingScroll() {
  const projectCards = document.querySelectorAll('.proj-card');
  
  // État initial : tous invisibles avec blur
  projectCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(150px) scale(0.8)';
    card.style.filter = 'blur(20px)';
  });

  let currentActiveIndex = -1;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const allCards = Array.from(projectCards);
      const cardIndex = allCards.indexOf(entry.target);
      
      if (entry.isIntersecting) {
        // Projet ACTUEL : arrive du bas avec BLUR qui disparaît
        entry.target.style.transition = 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0) scale(1)';
        entry.target.style.filter = 'blur(0)';
        entry.target.style.zIndex = '10';
        
        // Projet PRÉCÉDENT : disparaît et s'éloigne
        if (currentActiveIndex >= 0 && currentActiveIndex < cardIndex) {
          const prevCard = allCards[currentActiveIndex];
          prevCard.style.transition = 'all 0.8s ease-out';
          prevCard.style.opacity = '0.2';
          prevCard.style.transform = 'translateY(-50px) scale(0.9)';
          prevCard.style.filter = 'blur(5px)';
          prevCard.style.zIndex = '1';
        }
        
        currentActiveIndex = cardIndex;
      }
    });
  }, { 
    threshold: 0.5,
    rootMargin: '-20% 0px -20% 0px'
  });

  projectCards.forEach(card => observer.observe(card));
}

// ========================================
// 5. SKILLS : RÉSEAU NEURONAL qui se construit progressivement
//             React → Next.js → TypeScript → AI avec lignes animées
// ========================================
function initNeuralNetworkAnimation() {
  const skillsSection = document.querySelector('#skills');
  if (!skillsSection) return;

  // Créer le canvas
  const canvas = document.createElement('canvas');
  canvas.id = 'neural-canvas';
  canvas.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;
  `;
  
  const wrap = skillsSection.querySelector('.wrap');
  if (!wrap) return;
  
  wrap.style.position = 'relative';
  wrap.insertBefore(canvas, wrap.firstChild);

  const ctx = canvas.getContext('2d');
  
  // Adapter la taille
  function resizeCanvas() {
    canvas.width = wrap.offsetWidth;
    canvas.height = wrap.offsetHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Définir les NŒUDS du réseau (positions relatives)
  const nodes = [
    { x: 0.2, y: 0.25, label: 'React', active: false, color: '#61DAFB' },
    { x: 0.5, y: 0.15, label: 'Next.js', active: false, color: '#000000' },
    { x: 0.8, y: 0.3, label: 'TypeScript', active: false, color: '#3178C6' },
    { x: 0.3, y: 0.55, label: 'Firebase', active: false, color: '#FFCA28' },
    { x: 0.7, y: 0.6, label: 'AI', active: false, color: '#A020F0' },
    { x: 0.5, y: 0.85, label: 'UX Design', active: false, color: '#FF6B6B' }
  ];

  let currentNodeIndex = 0;
  let animationStarted = false;

  // Dessiner le réseau
  function drawNetwork() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Dessiner les LIGNES entre nœuds actifs
    ctx.lineWidth = 3;
    for (let i = 0; i < nodes.length - 1; i++) {
      if (nodes[i].active && nodes[i + 1].active) {
        const gradient = ctx.createLinearGradient(
          nodes[i].x * canvas.width, nodes[i].y * canvas.height,
          nodes[i + 1].x * canvas.width, nodes[i + 1].y * canvas.height
        );
        gradient.addColorStop(0, nodes[i].color + '80');
        gradient.addColorStop(1, nodes[i + 1].color + '80');
        
        ctx.strokeStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(nodes[i].x * canvas.width, nodes[i].y * canvas.height);
        ctx.lineTo(nodes[i + 1].x * canvas.width, nodes[i + 1].y * canvas.height);
        ctx.stroke();
      }
    }

    // Dessiner les NŒUDS
    nodes.forEach(node => {
      if (node.active) {
        // Cercle externe (glow)
        ctx.fillStyle = node.color + '40';
        ctx.beginPath();
        ctx.arc(node.x * canvas.width, node.y * canvas.height, 25, 0, Math.PI * 2);
        ctx.fill();
        
        // Cercle principal
        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(node.x * canvas.width, node.y * canvas.height, 12, 0, Math.PI * 2);
        ctx.fill();
        
        // Label
        ctx.fillStyle = node.color;
        ctx.font = 'bold 14px "JetBrains Mono"';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, node.x * canvas.width, node.y * canvas.height - 35);
      }
    });
  }

  // Animation séquentielle des nœuds
  function animateNextNode() {
    if (currentNodeIndex < nodes.length) {
      nodes[currentNodeIndex].active = true;
      drawNetwork();
      currentNodeIndex++;
      setTimeout(animateNextNode, scrollConfig.neuralNodeDelay);
    }
  }

  // Observer pour démarrer l'animation
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animationStarted) {
        animationStarted = true;
        setTimeout(animateNextNode, 300);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(skillsSection);
}

// ========================================
// 6. EXPERIENCE : Ligne VERTICALE se dessine
//                 puis événements apparaissent UN PAR UN
// ========================================
function initTimelineDrawing() {
  const timeline = document.querySelector('.timeline');
  if (!timeline) return;

  const timelineItems = timeline.querySelectorAll('.t-item');
  
  // Masquer tous les items initialement
  timelineItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-50px)';
  });

  // Animer la ligne verticale (déjà dans le CSS)
  timeline.style.setProperty('--line-draw-duration', '2s');

  // Observer pour animer les items UN PAR UN
  let itemIndex = 0;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.transition = `all 0.8s cubic-bezier(0.16, 1, 0.3, 1)`;
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateX(0)';
          
          // Faire pulser le dot
          const dot = entry.target.querySelector('.t-dot');
          if (dot) {
            dot.style.animation = 'pulse-dot 1.5s ease-out';
          }
        }, itemIndex * scrollConfig.timelineItemDelay);
        
        itemIndex++;
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  timelineItems.forEach(item => observer.observe(item));
}

// ========================================
// 7. CONTACT : Écran DEVIENT PLUS SOMBRE
//              Éléments FLOTTENT + Dashboard futuriste
// ========================================
function initContactDashboardEffect() {
  const contactSection = document.querySelector('#contact');
  if (!contactSection) return;

  const contactCards = contactSection.querySelectorAll('.c-card');
  const formWrap = contactSection.querySelector('.form-wrap');

  // Animation de scroll pour assombrir
  window.addEventListener('scroll', () => {
    const rect = contactSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    if (rect.top < windowHeight && rect.bottom > 0) {
      const progress = Math.max(0, 1 - (rect.top / windowHeight));
      
      // ASSOMBRIR progressivement
      contactSection.style.background = `rgba(10, 15, 24, ${0.5 + progress * 0.5})`;
      contactSection.style.transition = 'background 0.3s ease';
    }
  });

  // ÉLÉMENTS FLOTTANTS
  function floatElements() {
    const time = Date.now() / 1000;
    
    contactCards.forEach((card, i) => {
      const offsetY = Math.sin(time + i * 0.5) * 8;
      const offsetX = Math.cos(time + i * 0.7) * 5;
      card.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      card.style.transition = 'transform 0.3s ease-out';
    });
    
    requestAnimationFrame(floatElements);
  }

  // Animation d'APPARITION progressive
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        floatElements(); // Démarrer les flottements
        
        // Cartes apparaissent
        contactCards.forEach((card, i) => {
          card.style.opacity = '0';
          card.style.transform = 'translateY(50px) scale(0.9)';
          
          setTimeout(() => {
            card.style.transition = `all 0.8s cubic-bezier(0.16, 1, 0.3, 1)`;
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, i * 150);
        });
        
        // Formulaire apparaît
        if (formWrap) {
          formWrap.style.opacity = '0';
          formWrap.style.transform = 'translateY(50px)';
          setTimeout(() => {
            formWrap.style.transition = 'all 1s cubic-bezier(0.16, 1, 0.3, 1)';
            formWrap.style.opacity = '1';
            formWrap.style.transform = 'translateY(0)';
          }, 600);
        }
        
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  observer.observe(contactSection);
}

// ========================================
// INITIALISATION DE TOUTES LES ANIMATIONS
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  console.log('🎬 Animations scroll premium - TOUTES initialisées');
  
  setTimeout(() => {
    initHeroToAbout();
    initVisionWriting();
    initProjectsZoomEffect();
    initProjectsStorytellingScroll();
    initNeuralNetworkAnimation();
    initTimelineDrawing();
    initContactDashboardEffect();
    
    console.log('✅ 7/7 animations actives');
  }, 300);
});

// Smooth scroll pour les ancres
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

      portrait.style.transform = `translateX(-${slideProgress * 150}%)`;
      portrait.style.opacity = 1 - slideProgress;
    }
  });
}

// ========================================
// 2. VISION : Écriture mot par mot
// ========================================
function initVisionWriting() {
  const visionText = document.querySelector('.vision-text');
  if (!visionText) return;

  const text = visionText.textContent;
  const words = text.split(' ');
  visionText.innerHTML = '';
  
  words.forEach((word, index) => {
    const span = document.createElement('span');
    span.className = 'vision-word';
    span.textContent = word + ' ';
    span.style.transitionDelay = `${index * 0.1}s`;
    visionText.appendChild(span);
  });

  // Observer pour déclencher l'animation
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const words = entry.target.querySelectorAll('.vision-word');
        words.forEach((word, i) => {
          setTimeout(() => {
            word.classList.add('on');
          }, i * 150);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(visionText);
}

// ========================================
// 3. PROJECTS : Titre grossit + cartes apparaissent
// ========================================
function initProjectsZoom() {
  const projectsSection = document.querySelector('#projects');
  if (!projectsSection) return;

  const title = projectsSection.querySelector('.sec-h2');
  const projectCards = projectsSection.querySelectorAll('.proj-card');
  
  if (!title) return;

  // Créer un overlay pour l'effet de zoom du titre
  const overlay = document.createElement('div');
  overlay.className = 'projects-zoom-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    z-index: 1000;
    opacity: 0;
    transition: opacity 0.5s;
  `;
  
  const zoomTitle = document.createElement('div');
  zoomTitle.textContent = title.textContent;
  zoomTitle.style.cssText = `
    font-family: 'Clash Display', sans-serif;
    font-size: 48px;
    font-weight: 700;
    color: var(--text);
    transform: scale(1);
    transition: transform 1s, font-size 1s;
  `;
  overlay.appendChild(zoomTitle);
  document.body.appendChild(overlay);

  let zoomTriggered = false;

  window.addEventListener('scroll', () => {
    const rect = projectsSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Déclencher le zoom quand la section entre dans le viewport
    if (rect.top < windowHeight * 0.5 && rect.bottom > 0 && !zoomTriggered) {
      zoomTriggered = true;
      
      // Phase 1: Zoom du titre
      overlay.style.opacity = '1';
      setTimeout(() => {
        zoomTitle.style.transform = 'scale(3)';
        zoomTitle.style.fontSize = '120px';
      }, 100);
      
      // Phase 2: Fade out titre, fade in cartes
      setTimeout(() => {
        overlay.style.opacity = '0';
        
        projectCards.forEach((card, i) => {
          setTimeout(() => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(50px) scale(0.9)';
            card.style.filter = 'blur(10px)';
            card.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
            
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0) scale(1)';
              card.style.filter = 'blur(0)';
            }, 50);
          }, i * 200);
        });
      }, 1500);
    }
  });
}

// ========================================
// 4. PROJECTS : Scroll storytelling
// ========================================
function initProjectsStory() {
  const projectCards = document.querySelectorAll('.proj-card');
  
  projectCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(100px) scale(0.9)';
    card.style.filter = 'blur(10px)';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.transition = 'all 1s cubic-bezier(0.16, 1, 0.3, 1)';
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0) scale(1)';
        entry.target.style.filter = 'blur(0)';
        
        // Faire disparaître le précédent
        const allCards = Array.from(projectCards);
        const currentIndex = allCards.indexOf(entry.target);
        if (currentIndex > 0) {
          const prevCard = allCards[currentIndex - 1];
          prevCard.style.opacity = '0.3';
          prevCard.style.transform = 'scale(0.95)';
        }
      }
    });
  }, { threshold: 0.3, rootMargin: '-100px' });

  projectCards.forEach(card => observer.observe(card));
}

// ========================================
// 5. NEURAL NETWORK : Réseau de compétences
// ========================================
function initNeuralNetwork() {
  const skillsSection = document.querySelector('#skills');
  if (!skillsSection) return;

  // Créer le canvas pour le réseau
  const canvas = document.createElement('canvas');
  canvas.id = 'neural-canvas';
  canvas.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    opacity: 0.6;
    z-index: 0;
  `;
  
  const container = skillsSection.querySelector('.wrap');
  if (container) {
    container.style.position = 'relative';
    container.insertBefore(canvas, container.firstChild);
  }

  const ctx = canvas.getContext('2d');
  canvas.width = container.offsetWidth;
  canvas.height = container.offsetHeight;

  // Nœuds du réseau
  const nodes = [
    { x: 0.2, y: 0.3, label: 'React', active: false },
    { x: 0.5, y: 0.2, label: 'Next.js', active: false },
    { x: 0.8, y: 0.35, label: 'TypeScript', active: false },
    { x: 0.3, y: 0.6, label: 'Firebase', active: false },
    { x: 0.7, y: 0.65, label: 'AI', active: false },
    { x: 0.5, y: 0.8, label: 'UX', active: false }
  ];

  let animationProgress = 0;

  function drawNetwork() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Dessiner les connexions
    ctx.strokeStyle = 'rgba(160, 32, 240, 0.3)';
    ctx.lineWidth = 2;
    
    for (let i = 0; i < nodes.length - 1; i++) {
      if (nodes[i].active) {
        ctx.beginPath();
        ctx.moveTo(nodes[i].x * canvas.width, nodes[i].y * canvas.height);
        ctx.lineTo(nodes[i + 1].x * canvas.width, nodes[i + 1].y * canvas.height);
        ctx.stroke();
      }
    }

    // Dessiner les nœuds
    nodes.forEach(node => {
      if (node.active) {
        ctx.fillStyle = 'rgba(160, 32, 240, 0.8)';
        ctx.beginPath();
        ctx.arc(node.x * canvas.width, node.y * canvas.height, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Label
        ctx.fillStyle = 'var(--orange)';
        ctx.font = '12px "JetBrains Mono"';
        ctx.fillText(node.label, node.x * canvas.width + 15, node.y * canvas.height + 5);
      }
    });
  }

  function animateNetwork() {
    if (animationProgress < nodes.length) {
      nodes[animationProgress].active = true;
      drawNetwork();
      animationProgress++;
      setTimeout(animateNetwork, 500);
    }
  }

  // Observer pour déclencher
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && animationProgress === 0) {
        animateNetwork();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  observer.observe(skillsSection);

  // Redimensionnement
  window.addEventListener('resize', () => {
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    drawNetwork();
  });
}

// ========================================
// 6. TIMELINE : Ligne qui se dessine
// ========================================
function initTimelineAnimation() {
  const timeline = document.querySelector('.timeline');
  if (!timeline) return;

  const line = timeline.querySelector('::before');
  const items = timeline.querySelectorAll('.t-item');

  items.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-30px)';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateX(0)';
        }, i * 300);
      }
    });
  }, { threshold: 0.2 });

  items.forEach(item => observer.observe(item));
}

// ========================================
// 7. CONTACT : Tableau de bord futuriste
// ========================================
function initContactDashboard() {
  const contact = document.querySelector('#contact');
  if (!contact) return;

  window.addEventListener('scroll', () => {
    const rect = contact.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    if (rect.top < windowHeight * 0.7) {
      const progress = 1 - (rect.top / windowHeight);
      
      // Assombrir progressivement
      contact.style.filter = `brightness(${Math.max(0.7, 1 - progress * 0.3)})`;
      
      // Éléments flottants
      const cards = contact.querySelectorAll('.c-card');
      cards.forEach((card, i) => {
        const offset = Math.sin(Date.now() / 1000 + i) * 5;
        card.style.transform = `translateY(${offset}px)`;
      });
    }
  });

  // Animation d'entrée des cartes
  const cards = contact.querySelectorAll('.c-card');
  const formWrap = contact.querySelector('.form-wrap');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, 100);
      }
    });
  }, { threshold: 0.2 });

  cards.forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(50px)';
    card.style.transition = `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.1}s`;
    observer.observe(card);
  });

  if (formWrap) {
    formWrap.style.opacity = '0';
    formWrap.style.transform = 'translateY(50px)';
    formWrap.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s';
    observer.observe(formWrap);
  }
}

// ========================================
// INITIALISATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  console.log('🎬 Animations scroll premium initialisées');
  
  // Petite pause pour laisser le DOM se charger
  setTimeout(() => {
    initHeroToAbout();
    initVisionWriting();
    initProjectsZoom();
    initProjectsStory();
    initNeuralNetwork();
    initTimelineAnimation();
    initContactDashboard();
  }, 500);
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});
