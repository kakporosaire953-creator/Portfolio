/**
 * THE KRAFTER — bilingual content system.
 * French is the source language. `en` is typed against `fr`, so a missing or
 * misspelled key fails the build instead of silently falling back.
 *
 * Rule of honesty: no invented metric, testimonial, client count or ranking.
 * Anything not confirmed lives in data/projects.ts as an explicit note.
 */

export const fr = {
  localeTag: "fr",
  label: "Français",
  shortLabel: "FR",
  otherLabel: "English",

  meta: {
    home: {
      title: "THE KRAFTER — Rosaire Kakpo · Frontend Developer × UI/UX Designer",
      description:
        "Portfolio de Rosaire Kakpo, THE KRAFTER. Frontend developer et UI/UX designer basé au Bénin : interfaces éditoriales, produits numériques et expériences sur mesure.",
    },
    about: {
      title: "À propos — Rosaire Kakpo · THE KRAFTER",
      description:
        "Le parcours, la philosophie et l’approche design × code de Rosaire Kakpo, frontend developer et UI/UX designer basé à Cotonou, Bénin.",
    },
    services: {
      title: "Services — THE KRAFTER",
      description:
        "Frontend development, UI/UX design, produits numériques et e-commerce : ce que THE KRAFTER conçoit et construit.",
    },
    projects: {
      title: "Projets — THE KRAFTER",
      description:
        "Sélection de projets : SkillBridge, Campusly, Blue Inova, Apple Confidence, Tontine Chain et Portfolio Synnova.",
    },
    skills: {
      title: "Compétences — THE KRAFTER",
      description:
        "Stack et compétences réelles de Rosaire Kakpo : HTML, CSS, JavaScript, TypeScript, React, Next.js, Tailwind, GSAP, motion, Firebase, Supabase, APIs, Git, Vercel.",
    },
    blog: {
      title: "Journal — THE KRAFTER",
      description:
        "Le journal de THE KRAFTER : notes de terrain sur le design, le code et les produits numériques. Aucun article n’est publié à ce jour.",
    },
    contact: {
      title: "Contact — THE KRAFTER",
      description:
        "Discutons de votre projet : formulaire de contact, e-mail direct et disponibilités de THE KRAFTER.",
    },
    notFound: {
      title: "Page introuvable — THE KRAFTER",
      description: "Cette page n’existe pas ou a été déplacée.",
    },
  },

  nav: {
    label: "Navigation principale",
    home: "Accueil",
    about: "À propos",
    services: "Services",
    projects: "Projets",
    skills: "Compétences",
    blog: "Blog",
    contact: "Contact",
    menu: "Menu",
    close: "Fermer",
    open: "Ouvrir la navigation",
    railLabel: "Navigation rapide",
  },

  common: {
    ctaProjects: "Découvrir mes projets",
    ctaAbout: "À propos de moi",
    ctaContact: "Travaillons ensemble",
    ctaWork: "Travaillons ensemble",
    viewCase: "Voir l’étude de cas",
    viewAllProjects: "Voir tous les projets",
    allProjects: "Tous les projets",
    nextProject: "Projet suivant",
    backToProjects: "Retour aux projets",
    readMore: "Lire",
    scroll: "Défiler",
    available: "Disponible pour des missions",
    location: "Cotonou, Bénin",
    theme: "Thème",
    themeLight: "Mode clair",
    themeDark: "Mode sombre",
    language: "Langue",
    switchLanguage: "Passer en anglais",
    signature: "Créer • Inspirer • Impacter",
    signatureShort: "Créer · Inspirer · Impacter",
    signatureLine: "DESIGNED IN BENIN. BUILT FOR THE DIGITAL WORLD.",
    concept: "Design × Code × Impact",
    year: "2026",
    selected: "Sélection",
    close: "Fermer",
    external: "(ouvre un nouvel onglet)",
    loading: "Chargement",
    skip: "Aller au contenu",
    backHome: "Retour à l’accueil",
    todo: "À confirmer",
  },

  brand: {
    name: "THE KRAFTER",
    studio: "Studio personnel de Rosaire Kakpo",
    logoSlotTitle: "Emplacement du logo complet",
    logoSlotLine:
      "Déposez le fichier officiel dans /public/brand/the-krafter-logo.svg — le grand K, l’arc orbital, « The », KRAFTER et les accents seront affichés tels quels.",
    logoAlt: "THE KRAFTER — logo complet",
  },

  header: {
    cta: "Travaillons ensemble",
    badge: "Frontend × UI/UX",
    menuLabel: "Ouvrir le menu",
    navLabel: "Navigation",
  },

  hero: {
    eyebrow: "Portfolio · Édition 2026",
    firstName: "ROSAIRE",
    lastName: "KAKPO",
    role: "Frontend Developer × UI/UX Designer",
    lines: ["JE CONÇOIS.", "JE CONSTRUIS.", "J’IMPACTE."],
    intro:
      "Je conçois des interfaces éditoriales et je construis le code qui les rend réelles. Design et développement dans le même geste.",
    basedIn: "Basé au Bénin",
    basedInValue: "Cotonou, Bénin",
    working: "Actif à l’international",
    workingValue: "Missions à distance",
    portraitAlt:
      "Portrait de Rosaire Kakpo en costume blanc et chemise noire, devant un grand disque orange.",
    portraitCaption: "Rosaire Kakpo — Cotonou, Bénin",
    scrollHint: "Faites défiler",
    stat1Label: "Discipline",
    stat1Value: "Design × Code",
    stat2Label: "Signature",
    stat2Value: "Créer · Inspirer · Impacter",
    sceneLabel: "KRAFTER / ORBIT — scène 3D interactive",
    sceneStatic: "Composition orbitale statique",
    domains: [
      "Frontend Development",
      "UI/UX Design",
      "Produits numériques",
      "E-commerce",
      "Création digitale",
    ],
  },

  marquee: {
    words: ["Design", "Code", "Impact"],
    separator: "•",
  },

  home: {
    selected: {
      index: "01",
      kicker: "Travaux sélectionnés",
      title: "Projets qui tiennent debout",
      intro:
        "Trois projets récents, entre produit étudiant, plateforme de mise en relation et univers de marque. Chaque étude de cas documente le contexte, les choix de design et le code livré.",
      meta: "2024 — 2026",
    },
    designCode: {
      index: "02",
      kicker: "Expérience interactive",
      title: "Design × Code",
      intro:
        "Une même intention traverse chaque étape : la structure naît du wireframe, la direction artistique fixe les règles, les composants les rendent réutilisables, le code les rend vraies. Faites défiler pour avancer dans la chaîne.",
      steps: [
        {
          id: "wireframe",
          label: "Wireframe",
          caption: "Squelette",
          text: "Ordre de lecture, grilles, priorités. Rien de décoratif : la structure doit déjà raconter l’histoire.",
        },
        {
          id: "design",
          label: "UI Design",
          caption: "Direction artistique",
          text: "Typographie éditoriale, palette maîtrisée, orange utilisé avec intention. Les règles deviennent un système.",
        },
        {
          id: "component",
          label: "Component",
          caption: "Système",
          text: "Chaque bloc devient un composant typé, documenté, réutilisable — du bouton au formulaire complet.",
        },
        {
          id: "code",
          label: "Code",
          caption: "Construction",
          text: "React, TypeScript, Tailwind. Accessibilité, performance et animations pilotées proprement, sans dette.",
        },
        {
          id: "product",
          label: "Product",
          caption: "Impact",
          text: "Un produit cohérent, mesurable et maintenable, prêt à évoluer avec son usage réel.",
        },
      ],
      hint: "Continuez à faire défiler",
    },
    services: {
      index: "03",
      kicker: "Services",
      title: "Ce que je fais",
      intro:
        "Quatre terrains d’intervention, une seule exigence : que le design et le code racontent la même chose.",
      cta: "Voir le détail des services",
    },
    process: {
      index: "04",
      kicker: "Méthode",
      title: "Comment je travaille",
      intro:
        "Un processus court, documenté et sans zone d’ombre. Vous savez toujours où en est le projet.",
      steps: [
        {
          label: "Cadrage",
          text: "Objectifs, publics, contraintes techniques. Un brief écrit et validé avant toute maquette.",
        },
        {
          label: "Direction",
          text: "Architecture de l’information, système typographique, palette et principes de mouvement.",
        },
        {
          label: "Construction",
          text: "Composants React typés, intégration responsive, animations GSAP et contrôle d’accessibilité.",
        },
        {
          label: "Livraison",
          text: "Tests sur appareils réels, optimisation, passation du code et documentation de maintenance.",
        },
      ],
    },
    about: {
      index: "05",
      kicker: "Profil",
      title: "Rosaire Kakpo",
      role: "Frontend Developer × UI/UX Designer",
      paragraphs: [
        "Je suis développeur frontend et designer d’interface, basé à Cotonou. Je travaille à l’endroit exact où le design prend forme : là où une décision typographique devient une ligne de CSS.",
        "Mon terrain de jeu : des produits numériques lisibles, rapides et durables, avec une direction artistique assumée. J’aime les grilles, les grands espaces négatifs et les animations qui expliquent au lieu de décorer.",
      ],
      cta: "Lire mon parcours",
      facts: [
        { label: "Basé à", value: "Cotonou, Bénin" },
        { label: "Discipline", value: "Design × Code" },
        { label: "Langues", value: "Français, Anglais" },
        { label: "Collaboration", value: "À distance, international" },
      ],
    },
    story: {
      index: "06",
      kicker: "La marque",
      titleLead: "L’histoire de",
      titleEm: "THE KRAFTER",
      paragraphs: [
        "THE KRAFTER est né d’une conviction simple : une interface est un objet fabriqué. Elle a un auteur, des contraintes, une structure et une finition.",
        "Le nom vient de l’artisan — celui qui connaît son matériau, qui répète le geste, qui signe son travail. Le numérique n’y échappe pas : derrière chaque écran soigné, il y a des décisions précises et beaucoup de travail invisible.",
      ],
      principles: [
        { title: "Créer", text: "Partir d’une intention, pas d’un template." },
        { title: "Inspirer", text: "Donner envie d’avancer, sans crier." },
        { title: "Impacter", text: "Livrer un produit qui sert vraiment." },
      ],
      signatureLine: "Designed in Benin. Built for the digital world.",
    },
    blog: {
      index: "07",
      kicker: "Journal",
      title: "Notes de terrain",
      intro:
        "Le journal est en préparation. Aucun article n’est publié à ce jour — je préfère un espace vide honnête à un historique inventé.",
      cta: "Voir le journal",
      emptyLabel: "Aucun article publié",
    },
    cta: {
      kicker: "Prochaine étape",
      lines: ["TRAVAILLONS", "ENSEMBLE."],
      text: "Un site à concevoir, une interface à repenser, un produit à construire ? Décrivez-moi le contexte : je réponds sous 48 h ouvrées avec une première lecture du projet.",
      email: "kakporosaire953@gmail.com",
    },
  },

  about: {
    kicker: "À propos",
    title: "Un artisan du numérique",
    intro:
      "Frontend developer et UI/UX designer. Je conçois des systèmes visuels et je les construis moi-même, du premier croquis au dernier commit.",
    portraitCaption: "Studio personnel — Cotonou, Bénin",
    identity: {
      title: "Identité",
      rows: [
        { label: "Nom", value: "Rosaire Kakpo" },
        { label: "Marque", value: "THE KRAFTER" },
        { label: "Métier", value: "Frontend Developer × UI/UX Designer" },
        { label: "Basé à", value: "Cotonou, Bénin" },
        { label: "Signature", value: "Créer • Inspirer • Impacter" },
      ],
    },
    philosophy: {
      index: "01",
      kicker: "Philosophie",
      title: "Trois convictions",
      items: [
        {
          title: "La structure avant le style",
          text: "Une interface tient d’abord par son architecture : hiérarchie, grille, ordre de lecture. Le style vient habiller une structure qui fonctionne déjà.",
        },
        {
          title: "Le mouvement doit expliquer",
          text: "Une animation sert à montrer un changement d’état, une continuité, une relation. Si elle ne raconte rien, elle disparaît.",
        },
        {
          title: "Le code fait partie du design",
          text: "Une maquette n’existe que si elle est construite avec soin : performance, accessibilité, responsive, maintenabilité.",
        },
      ],
    },
    path: {
      index: "02",
      kicker: "Trajectoire",
      title: "Comment j’en suis arrivé là",
      note: "Chapitres thématiques — je ne publie pas de dates que je ne peux pas confirmer.",
      chapters: [
        {
          label: "Origine",
          title: "Cotonou",
          text: "Grandir au Bénin, dans un environnement où le numérique avance vite et où les outils manquent. Apprendre à faire beaucoup avec peu : c’est là que se forme le réflexe de l’essentiel.",
        },
        {
          label: "Apprentissage",
          title: "Le code, puis le design",
          text: "Le développement web comme porte d’entrée : HTML, CSS, JavaScript, puis React et Next.js. Très vite, une évidence — la qualité d’un produit se joue autant dans l’interface que dans le code.",
        },
        {
          label: "Pratique",
          title: "Produits, hackathons, clients",
          text: "Des projets étudiants, des plateformes e-commerce, un hackathon, des portfolios pour des professionnels. Chaque projet ajoute une contrainte : conversion, accessibilité, multilingue, performance.",
        },
        {
          label: "Aujourd’hui",
          title: "THE KRAFTER",
          text: "Une pratique indépendante qui réunit design et développement sous une même signature : concevoir le système, puis le construire avec précision.",
        },
      ],
    },
    approach: {
      index: "03",
      kicker: "Approche",
      title: "Design et développement, même geste",
      text: "Je travaille en boucle courte : une intention de design, un prototype, un composant, un test sur appareil réel. Les allers-retours entre Figma et l’éditeur de code sont volontaires — c’est là que naissent les détails justes : un espacement, une vitesse d’animation, une couleur d’état.",
      bullets: [
        "Systèmes de design construits en même temps que les composants",
        "Direction artistique typographique, pas de template",
        "Animation pensée dès la maquette (GSAP, anime.js, Three.js)",
        "Contrôle d’accessibilité avant livraison",
      ],
    },
    cta: {
      title: "La suite ?",
      text: "Le plus simple est encore de parler du projet.",
    },
  },

  services: {
    kicker: "Services",
    title: "Concevoir et construire",
    intro:
      "Je travaille en solo, en direct avec vous. Un seul interlocuteur pour le design et le développement, ce qui réduit les allers-retours et garde la cohérence jusqu’à la mise en ligne.",
    listTitle: "Quatre terrains d’intervention",
    includesLabel: "Ce que cela comprend",
    forWhomLabel: "Pour qui",
    processTitle: "Le déroulé",
    processNote:
      "Chaque mission commence par un cadrage écrit. Le périmètre, les livrables et le calendrier sont validés avant de commencer.",
    faqTitle: "Questions fréquentes",
    faq: [
      {
        q: "Travaillez-vous à distance ?",
        a: "Oui. Les échanges se font en visioconférence, avec un suivi écrit. Je suis basé à Cotonou et je travaille avec des clients sur plusieurs fuseaux horaires.",
      },
      {
        q: "Quel est le délai d’un projet ?",
        a: "Cela dépend du périmètre. Un site vitrine éditorial est plus rapide qu’une plateforme avec authentification. Le calendrier est fixé après le cadrage, pas avant.",
      },
      {
        q: "Quel est le budget ?",
        a: "Je ne publie pas de grille tarifaire figée : elle dépend du périmètre, du nombre d’écrans et du niveau d’animation. Décrivez votre besoin et je vous réponds avec une proposition claire.",
      },
      {
        q: "Livrez-vous le code source ?",
        a: "Oui. Le code vous appartient à la livraison, avec la documentation de lancement et de maintenance.",
      },
    ],
    cta: {
      title: "Un besoin précis ?",
      text: "Expliquez-moi le contexte, je vous dis honnêtement si je suis la bonne personne.",
    },
  },

  skills: {
    kicker: "Compétences",
    title: "La stack, sans pourcentage",
    intro:
      "Je n’affiche pas de barres de progression ni de “niveau 92 %” : cela ne veut rien dire. Voici les technologies que j’utilise réellement, avec le contexte dans lequel je les mobilise.",
    coreTitle: "Cœur de métier",
    toolsTitle: "Outils et environnement",
    methodTitle: "Méthode",
    methodItems: [
      "Architecture de l’information et wireframes",
      "Systèmes de design et bibliothèques de composants",
      "Motion design web (timelines, scroll-driven)",
      "Intégration responsive et tests sur appareils réels",
      "Contrôle d’accessibilité (clavier, contrastes, sémantique)",
      "Optimisation des performances et du chargement",
    ],
    honestNote:
      "Chaque ligne correspond à un usage réel sur mes projets. Les niveaux affichés ailleurs sous forme de pourcentages sont une fiction marketing que je laisse aux templates.",
    labTitle: "En exploration",
    labText:
      "Three.js et WebGL, génération d’assets, architectures serverless : utilisés avec mesure, quand cela apporte une valeur réelle au produit.",
  },

  projects: {
    kicker: "Projets",
    title: "Travaux",
    intro:
      "Une sélection de projets conçus et développés par THE KRAFTER. Chaque étude de cas raconte le contexte, les décisions de design et la construction technique — sans chiffres inventés.",
    filterLabel: "Filtrer par nature",
    all: "Tous",
    roles: {
      design: "Design & développement",
      development: "Développement",
      designOnly: "Direction artistique",
    },
    emptyImage: "Visuel non publié",
    caseStudy: {
      overview: "Vue d’ensemble",
      context: "Contexte",
      challenge: "Enjeu",
      approach: "Approche",
      design: "Design",
      development: "Développement",
      technical: "Détails techniques",
      results: "Résultat",
      resultsNone:
        "Aucun indicateur public n’est publié pour ce projet. Je ne publie pas de chiffres que je ne peux pas justifier.",
      role: "Rôle",
      year: "Année",
      category: "Nature",
      stack: "Stack",
      index: "Projet",
      next: "Projet suivant",
      allCases: "Toutes les études de cas",
      gallery: "Captures",
      live: "Voir le site",
      livePending: "Lien non publié",
    },
  },

  blog: {
    kicker: "Journal",
    title: "Notes de terrain",
    intro:
      "Un journal sur le design d’interface, le frontend et les produits numériques. Il est en préparation : aucun article n’est publié pour l’instant.",
    emptyTitle: "Aucun article publié à ce jour",
    emptyText:
      "Je préfère un état vide honnête à un faux historique de publication. Les premiers textes paraîtront ici dès qu’ils seront prêts.",
    upcomingTitle: "Sujets en préparation",
    upcomingNote: "Titres de travail, non publiés.",
    upcoming: [
      {
        title: "Pourquoi je n’affiche pas de pourcentage de compétences",
        topic: "Design d’interface",
      },
      {
        title: "Scroll-driven, sans bloquer le scroll",
        topic: "Motion · GSAP",
      },
      {
        title: "Construire un système typographique éditorial pour le web",
        topic: "Typographie",
      },
    ],
    subscribeTitle: "Être prévenu de la publication",
    subscribeText:
      "Aucune newsletter n’est branchée. Écrivez-moi un e-mail si vous voulez être tenu informé.",
    cta: "M’écrire",
  },

  contact: {
    kicker: "Contact",
    title: "Parlons du projet",
    intro:
      "Décrivez le contexte en quelques lignes. Je réponds sous 48 h ouvrées, avec une première lecture honnête de ce qui est réaliste — même si la réponse est non.",
    direct: "Direct",
    emailLabel: "E-mail",
    locationLabel: "Localisation",
    availabilityLabel: "Disponibilité",
    availabilityValue: "Ouvert aux nouvelles missions",
    responseLabel: "Délai de réponse",
    responseValue: "48 h ouvrées",
    form: {
      title: "Brief express",
      name: "Nom",
      namePlaceholder: "Votre nom",
      email: "E-mail",
      emailPlaceholder: "vous@exemple.com",
      projectType: "Type de projet",
      projectTypes: [
        "Site vitrine éditorial",
        "Produit numérique / application",
        "Refonte UI/UX",
        "E-commerce",
        "Autre",
      ],
      message: "Message",
      messagePlaceholder:
        "Contexte, objectif, échéance envisagée… quelques lignes suffisent.",
      submit: "Envoyer le brief",
      sending: "Envoi…",
      required: "Champ requis",
      invalidEmail: "Adresse e-mail invalide",
      minMessage: "Décrivez le projet en quelques mots (20 caractères minimum).",
      errorTitle: "Envoi non configuré",
      errorText:
        "Aucun service d’envoi n’est branché sur ce portfolio. Votre brief n’a pas été transmis.",
      fallbackTitle: "Deux options fonctionnent dès maintenant",
      fallbackMailto: "Ouvrir dans mon logiciel de messagerie",
      fallbackCopy: "Copier le brief",
      copied: "Brief copié",
      successTitle: "Brief transmis",
      successText: "Merci — je reviens vers vous sous 48 h ouvrées.",
      reset: "Écrire un autre message",
      privacy:
        "Les informations saisies servent uniquement à répondre à votre demande.",
      notice:
        "Aucun service d’envoi n’est branché pour l’instant : si l’envoi échoue, un e-mail prérempli reste disponible en un clic.",
    },
  },

  footer: {
    tagline: "Studio personnel de Rosaire Kakpo. Design × Code × Impact.",
    navTitle: "Navigation",
    contactTitle: "Contact",
    elsewhereTitle: "Ailleurs",
    emailTitle: "Écrire",
    rights: "Tous droits réservés.",
    builtWith: "Conçu et développé par THE KRAFTER",
    signature: "Créer • Inspirer • Impacter",
    location: "Cotonou, Bénin",
    themeNote: "Mode clair par défaut, mode sombre au choix.",
    statusLabel: "Statut",
    statusValue: "Ouvert aux missions",
    backTop: "Haut de page",
  },

  assistant: {
    launcher: "Assistant",
    launcherLong: "Ouvrir l’assistant",
    title: "KRAFTER / Guidance",
    subtitle: "Assistant intégré",
    engineNotice:
      "Assistant préprogrammé — aucune IA générative n’est connectée à ce portfolio. Il répond à partir des contenus du site.",
    greeting:
      "Bonjour, je suis l’assistant de THE KRAFTER. Je peux vous orienter vers les projets, les services, les compétences ou le contact.",
    placeholder: "Posez une question…",
    send: "Envoyer",
    newConversation: "Nouvelle conversation",
    close: "Fermer l’assistant",
    quickLabel: "Questions rapides",
    suggestions: [
      "Quels sont les projets récents ?",
      "Quels services proposes-tu ?",
      "Quelle est ta stack technique ?",
      "Comment te contacter ?",
      "Es-tu disponible ?",
    ],
    fallback:
      "Je n’ai pas de réponse préparée pour cette question. Je peux vous guider vers les projets, les services, les compétences, le journal ou le contact — ou vous écrire directement à kakporosaire953@gmail.com.",
    typing: "L’assistant écrit",
    you: "Vous",
    navigate: "Aller à",
    answerAbout:
      "Rosaire Kakpo, THE KRAFTER : frontend developer et UI/UX designer basé à Cotonou. Il conçoit des systèmes visuels et construit les interfaces qui les rendent réelles.",
    answerProjects:
      "Trois projets principaux : SkillBridge (mise en relation talents / opportunités), Campusly (plateforme académique pour l’UAC) et Blue Inova. S’y ajoutent Apple Confidence, Tontine Chain et le portfolio de Synnova Tocloe.",
    answerSkills:
      "HTML, CSS, JavaScript, TypeScript, React, Next.js, Tailwind CSS, GSAP, Framer Motion, Firebase, Supabase, REST APIs, Git et Vercel. Aucun pourcentage affiché : chaque technologie est accompagnée de son contexte d’usage.",
    answerServices:
      "Quatre services : frontend development, UI/UX design, produits numériques et e-commerce. Chaque mission commence par un cadrage écrit, puis direction artistique, construction et livraison documentée.",
    answerContact:
      "Le formulaire de contact fonctionne mais aucun service d’envoi n’est branché : l’alternative fiable est l’e-mail kakporosaire953@gmail.com.",
    answerAvailability:
      "Disponible pour des missions à distance, depuis Cotonou. Réponse sous 48 h ouvrées.",
    answerBlog:
      "Le journal est en préparation : aucun article n’est publié à ce jour. Trois sujets sont annoncés sur la page Journal.",
    answerDesign:
      "La direction artistique est éditoriale et architecturale : typographie Instrument Sans et Bodoni Moda, palette paper / navy / orange, beaucoup d’espace négatif et un orange utilisé avec intention.",
    answerMotion:
      "GSAP orchestre les timelines (hero, révélations au scroll, section Design × Code épinglée, transitions Flip), anime.js dessine les tracés SVG, Three.js anime la scène orbitale du hero.",
  },

  intro: {
    label: "Introduction THE KRAFTER",
    void: "THE KRAFTER / DIGITAL CRAFT",
    skip: "Passer l’introduction",
    brand: "Construction de la marque",
    person: "Rosaire Kakpo",
  },

  a11y: {
    newTab: "ouvre un nouvel onglet",
    currentPage: "page actuelle",
    themeToggle: "Changer de thème, actuellement",
    langToggle: "Changer de langue, actuellement",
    decorative: "Élément décoratif",
    closeDialog: "Fermer la fenêtre",
    orbitCanvas: "Scène 3D décorative — aucune information essentielle",
    formError: "Erreur dans le formulaire",
    requiredMark: "obligatoire",
  },

  notFound: {
    code: "404",
    title: "Cette page n’existe pas",
    text: "Le lien est peut-être ancien, ou la page a été déplacée. Le portfolio, lui, est toujours là.",
    cta: "Retour à l’accueil",
  },
};

export const en: typeof fr = {
  localeTag: "en",
  label: "English",
  shortLabel: "EN",
  otherLabel: "Français",

  meta: {
    home: {
      title: "THE KRAFTER — Rosaire Kakpo · Frontend Developer × UI/UX Designer",
      description:
        "Portfolio of Rosaire Kakpo, THE KRAFTER. Frontend developer and UI/UX designer based in Benin: editorial interfaces, digital products and bespoke experiences.",
    },
    about: {
      title: "About — Rosaire Kakpo · THE KRAFTER",
      description:
        "The path, philosophy and design × code approach of Rosaire Kakpo, frontend developer and UI/UX designer based in Cotonou, Benin.",
    },
    services: {
      title: "Services — THE KRAFTER",
      description:
        "Frontend development, UI/UX design, digital products and e-commerce: what THE KRAFTER designs and builds.",
    },
    projects: {
      title: "Projects — THE KRAFTER",
      description:
        "Selected work: SkillBridge, Campusly, Blue Inova, Apple Confidence, Tontine Chain and the Synnova portfolio.",
    },
    skills: {
      title: "Skills — THE KRAFTER",
      description:
        "Rosaire Kakpo’s real stack: HTML, CSS, JavaScript, TypeScript, React, Next.js, Tailwind, GSAP, motion, Firebase, Supabase, APIs, Git, Vercel.",
    },
    blog: {
      title: "Journal — THE KRAFTER",
      description:
        "The KRAFTER journal: field notes on design, code and digital products. No article has been published yet.",
    },
    contact: {
      title: "Contact — THE KRAFTER",
      description:
        "Let’s talk about your project: contact form, direct email and current availability.",
    },
    notFound: {
      title: "Page not found — THE KRAFTER",
      description: "This page does not exist or has moved.",
    },
  },

  nav: {
    label: "Main navigation",
    home: "Home",
    about: "About",
    services: "Services",
    projects: "Projects",
    skills: "Skills",
    blog: "Journal",
    contact: "Contact",
    menu: "Menu",
    close: "Close",
    open: "Open navigation",
    railLabel: "Quick navigation",
  },

  common: {
    ctaProjects: "Explore my work",
    ctaAbout: "About me",
    ctaContact: "Let’s work together",
    ctaWork: "Let’s work together",
    viewCase: "View case study",
    viewAllProjects: "View all projects",
    allProjects: "All projects",
    nextProject: "Next project",
    backToProjects: "Back to projects",
    readMore: "Read",
    scroll: "Scroll",
    available: "Available for work",
    location: "Cotonou, Benin",
    theme: "Theme",
    themeLight: "Light mode",
    themeDark: "Dark mode",
    language: "Language",
    switchLanguage: "Switch to French",
    signature: "Create • Inspire • Impact",
    signatureShort: "Create · Inspire · Impact",
    signatureLine: "DESIGNED IN BENIN. BUILT FOR THE DIGITAL WORLD.",
    concept: "Design × Code × Impact",
    year: "2026",
    selected: "Selection",
    close: "Close",
    external: "(opens a new tab)",
    loading: "Loading",
    skip: "Skip to content",
    backHome: "Back to home",
    todo: "To confirm",
  },

  brand: {
    name: "THE KRAFTER",
    studio: "Rosaire Kakpo’s personal studio",
    logoSlotTitle: "Full logo slot",
    logoSlotLine:
      "Drop the official file in /public/brand/the-krafter-logo.svg — the large K, the orbital arc, “The”, KRAFTER and its accents will render untouched.",
    logoAlt: "THE KRAFTER — full logo",
  },

  header: {
    cta: "Let’s work together",
    badge: "Frontend × UI/UX",
    menuLabel: "Open menu",
    navLabel: "Navigation",
  },

  hero: {
    eyebrow: "Portfolio · 2026 edition",
    firstName: "ROSAIRE",
    lastName: "KAKPO",
    role: "Frontend Developer × UI/UX Designer",
    lines: ["I DESIGN.", "I BUILD.", "I DELIVER."],
    intro:
      "I design editorial interfaces and write the code that makes them real. Design and development in one gesture.",
    basedIn: "Based in Benin",
    basedInValue: "Cotonou, Benin",
    working: "Working globally",
    workingValue: "Remote collaborations",
    portraitAlt:
      "Portrait of Rosaire Kakpo in a white suit and black shirt, in front of a large orange disc.",
    portraitCaption: "Rosaire Kakpo — Cotonou, Benin",
    scrollHint: "Scroll",
    stat1Label: "Discipline",
    stat1Value: "Design × Code",
    stat2Label: "Signature",
    stat2Value: "Create · Inspire · Impact",
    sceneLabel: "KRAFTER / ORBIT — interactive 3D scene",
    sceneStatic: "Static orbital composition",
    domains: [
      "Frontend Development",
      "UI/UX Design",
      "Digital products",
      "E-commerce",
      "Digital creation",
    ],
  },

  marquee: {
    words: ["Design", "Code", "Impact"],
    separator: "•",
  },

  home: {
    selected: {
      index: "01",
      kicker: "Selected work",
      title: "Projects that hold up",
      intro:
        "Three recent projects across a student product, a talent platform and a brand universe. Each case study documents context, design decisions and the code that shipped.",
      meta: "2024 — 2026",
    },
    designCode: {
      index: "02",
      kicker: "Interactive experience",
      title: "Design × Code",
      intro:
        "One intention runs through every step: structure is born in the wireframe, art direction sets the rules, components make them reusable, code makes them real. Scroll to move through the chain.",
      steps: [
        {
          id: "wireframe",
          label: "Wireframe",
          caption: "Skeleton",
          text: "Reading order, grids, priorities. Nothing decorative: structure must already tell the story.",
        },
        {
          id: "design",
          label: "UI Design",
          caption: "Art direction",
          text: "Editorial typography, a controlled palette, orange used on purpose. The rules become a system.",
        },
        {
          id: "component",
          label: "Component",
          caption: "System",
          text: "Every block becomes a typed, documented, reusable component — from a button to a full form.",
        },
        {
          id: "code",
          label: "Code",
          caption: "Construction",
          text: "React, TypeScript, Tailwind. Accessibility, performance and animation driven cleanly, without debt.",
        },
        {
          id: "product",
          label: "Product",
          caption: "Impact",
          text: "A coherent, measurable and maintainable product, ready to evolve with real usage.",
        },
      ],
      hint: "Keep scrolling",
    },
    services: {
      index: "03",
      kicker: "Services",
      title: "What I do",
      intro:
        "Four areas of work, one requirement: design and code must tell the same story.",
      cta: "See services in detail",
    },
    process: {
      index: "04",
      kicker: "Method",
      title: "How I work",
      intro:
        "A short, documented process with no grey areas. You always know where the project stands.",
      steps: [
        {
          label: "Framing",
          text: "Goals, audiences, technical constraints. A written brief, approved before any mockup.",
        },
        {
          label: "Direction",
          text: "Information architecture, type system, palette and motion principles.",
        },
        {
          label: "Build",
          text: "Typed React components, responsive integration, GSAP animation and accessibility checks.",
        },
        {
          label: "Delivery",
          text: "Testing on real devices, optimisation, code handover and maintenance documentation.",
        },
      ],
    },
    about: {
      index: "05",
      kicker: "Profile",
      title: "Rosaire Kakpo",
      role: "Frontend Developer × UI/UX Designer",
      paragraphs: [
        "I am a frontend developer and interface designer based in Cotonou. I work exactly where design takes shape: where a typographic decision becomes a line of CSS.",
        "My playground: legible, fast and durable digital products with a committed art direction. I like grids, generous negative space and animation that explains rather than decorates.",
      ],
      cta: "Read my story",
      facts: [
        { label: "Based in", value: "Cotonou, Benin" },
        { label: "Discipline", value: "Design × Code" },
        { label: "Languages", value: "French, English" },
        { label: "Collaboration", value: "Remote, international" },
      ],
    },
    story: {
      index: "06",
      kicker: "The brand",
      titleLead: "The story of",
      titleEm: "THE KRAFTER",
      paragraphs: [
        "THE KRAFTER was born from a simple conviction: an interface is a manufactured object. It has an author, constraints, a structure and a finish.",
        "The name comes from the craftsman — someone who knows the material, repeats the gesture, signs the work. Digital is no different: behind every polished screen sit precise decisions and a lot of invisible work.",
      ],
      principles: [
        { title: "Create", text: "Start from an intention, not a template." },
        { title: "Inspire", text: "Make people want to move forward, without shouting." },
        { title: "Impact", text: "Ship a product that actually serves." },
      ],
      signatureLine: "Designed in Benin. Built for the digital world.",
    },
    blog: {
      index: "07",
      kicker: "Journal",
      title: "Field notes",
      intro:
        "The journal is being prepared. No article has been published yet — I would rather show an honest empty space than an invented publishing history.",
      cta: "Visit the journal",
      emptyLabel: "No published articles",
    },
    cta: {
      kicker: "Next step",
      lines: ["LET’S BUILD", "SOMETHING."],
      text: "A site to design, an interface to rethink, a product to build? Describe the context: I reply within 48 business hours with a first honest read of the project.",
      email: "kakporosaire953@gmail.com",
    },
  },

  about: {
    kicker: "About",
    title: "A digital craftsman",
    intro:
      "Frontend developer and UI/UX designer. I design visual systems and build them myself, from the first sketch to the last commit.",
    portraitCaption: "Personal studio — Cotonou, Benin",
    identity: {
      title: "Identity",
      rows: [
        { label: "Name", value: "Rosaire Kakpo" },
        { label: "Brand", value: "THE KRAFTER" },
        { label: "Role", value: "Frontend Developer × UI/UX Designer" },
        { label: "Based in", value: "Cotonou, Benin" },
        { label: "Signature", value: "Create • Inspire • Impact" },
      ],
    },
    philosophy: {
      index: "01",
      kicker: "Philosophy",
      title: "Three convictions",
      items: [
        {
          title: "Structure before style",
          text: "An interface holds through its architecture first: hierarchy, grid, reading order. Style dresses a structure that already works.",
        },
        {
          title: "Motion must explain",
          text: "Animation exists to show a state change, a continuity, a relationship. If it tells nothing, it goes.",
        },
        {
          title: "Code is part of the design",
          text: "A mockup only exists if it is built with care: performance, accessibility, responsiveness, maintainability.",
        },
      ],
    },
    path: {
      index: "02",
      kicker: "Path",
      title: "How I got here",
      note: "Thematic chapters — I do not publish dates I cannot confirm.",
      chapters: [
        {
          label: "Origin",
          title: "Cotonou",
          text: "Growing up in Benin, where digital moves fast and tools are scarce. Learning to do a lot with little: that is where the instinct for the essential comes from.",
        },
        {
          label: "Learning",
          title: "Code, then design",
          text: "Web development as a doorway: HTML, CSS, JavaScript, then React and Next.js. Quickly an obvious truth — product quality lives as much in the interface as in the code.",
        },
        {
          label: "Practice",
          title: "Products, hackathons, clients",
          text: "Student projects, e-commerce platforms, a hackathon, portfolios for professionals. Each project adds a constraint: conversion, accessibility, multilingual, performance.",
        },
        {
          label: "Today",
          title: "THE KRAFTER",
          text: "An independent practice that unites design and development under a single signature: design the system, then build it with precision.",
        },
      ],
    },
    approach: {
      index: "03",
      kicker: "Approach",
      title: "Design and development, one gesture",
      text: "I work in short loops: a design intention, a prototype, a component, a test on a real device. Moving back and forth between Figma and the code editor is deliberate — that is where the right details appear: a spacing, an animation speed, a state colour.",
      bullets: [
        "Design systems built alongside the components",
        "Typographic art direction, never a template",
        "Motion considered from the mockup stage (GSAP, anime.js, Three.js)",
        "Accessibility checks before delivery",
      ],
    },
    cta: {
      title: "What next?",
      text: "The simplest next step is to talk about the project.",
    },
  },

  services: {
    kicker: "Services",
    title: "Design and build",
    intro:
      "I work solo, directly with you. One contact for both design and development, which cuts the back-and-forth and keeps coherence all the way to launch.",
    listTitle: "Four areas of work",
    includesLabel: "What it includes",
    forWhomLabel: "Who it is for",
    processTitle: "The process",
    processNote:
      "Every engagement starts with a written framing. Scope, deliverables and schedule are agreed before we begin.",
    faqTitle: "Frequent questions",
    faq: [
      {
        q: "Do you work remotely?",
        a: "Yes. We work over video calls with written follow-ups. I am based in Cotonou and work with clients across time zones.",
      },
      {
        q: "How long does a project take?",
        a: "It depends on scope. An editorial showcase site is faster than a platform with authentication. The schedule is set after framing, not before.",
      },
      {
        q: "What is the budget?",
        a: "I do not publish a fixed price list: it depends on scope, number of screens and animation depth. Describe your need and you will get a clear proposal.",
      },
      {
        q: "Do you hand over the source code?",
        a: "Yes. The code is yours on delivery, along with launch and maintenance documentation.",
      },
    ],
    cta: {
      title: "A specific need?",
      text: "Explain the context — I will tell you honestly whether I am the right person.",
    },
  },

  skills: {
    kicker: "Skills",
    title: "The stack, without percentages",
    intro:
      "I do not show progress bars or “92 % level”: that means nothing. Below are the technologies I actually use, with the context in which I use them.",
    coreTitle: "Core craft",
    toolsTitle: "Tools and environment",
    methodTitle: "Method",
    methodItems: [
      "Information architecture and wireframes",
      "Design systems and component libraries",
      "Web motion design (timelines, scroll-driven)",
      "Responsive integration and real-device testing",
      "Accessibility checks (keyboard, contrast, semantics)",
      "Performance and loading optimisation",
    ],
    honestNote:
      "Every line maps to real usage on my projects. The percentage levels shown elsewhere are a marketing fiction I leave to templates.",
    labTitle: "Exploring",
    labText:
      "Three.js and WebGL, asset generation, serverless architectures: used sparingly, when they add real value to the product.",
  },

  projects: {
    kicker: "Projects",
    title: "Work",
    intro:
      "A selection of projects designed and built by THE KRAFTER. Each case study covers context, design decisions and technical construction — no invented numbers.",
    filterLabel: "Filter by nature",
    all: "All",
    roles: {
      design: "Design & development",
      development: "Development",
      designOnly: "Art direction",
    },
    emptyImage: "Visual not published",
    caseStudy: {
      overview: "Overview",
      context: "Context",
      challenge: "Challenge",
      approach: "Approach",
      design: "Design",
      development: "Development",
      technical: "Technical details",
      results: "Result",
      resultsNone:
        "No public metric is published for this project. I do not publish numbers I cannot back up.",
      role: "Role",
      year: "Year",
      category: "Nature",
      stack: "Stack",
      index: "Project",
      next: "Next project",
      allCases: "All case studies",
      gallery: "Screens",
      live: "Visit site",
      livePending: "Link not published",
    },
  },

  blog: {
    kicker: "Journal",
    title: "Field notes",
    intro:
      "A journal about interface design, frontend and digital products. It is being prepared: no article is published yet.",
    emptyTitle: "No article published to date",
    emptyText:
      "I would rather offer an honest empty state than a fake publishing history. The first pieces will appear here once they are ready.",
    upcomingTitle: "Topics in preparation",
    upcomingNote: "Working titles, unpublished.",
    upcoming: [
      {
        title: "Why I don’t show skill percentages",
        topic: "Interface design",
      },
      {
        title: "Scroll-driven, without hijacking the scroll",
        topic: "Motion · GSAP",
      },
      {
        title: "Building an editorial type system for the web",
        topic: "Typography",
      },
    ],
    subscribeTitle: "Be notified on publication",
    subscribeText:
      "No newsletter is wired up. Send an email if you would like to be kept informed.",
    cta: "Email me",
  },

  contact: {
    kicker: "Contact",
    title: "Let’s talk about it",
    intro:
      "Describe the context in a few lines. I reply within 48 business hours with a first honest read of what is realistic — even when the answer is no.",
    direct: "Direct",
    emailLabel: "Email",
    locationLabel: "Location",
    availabilityLabel: "Availability",
    availabilityValue: "Open to new projects",
    responseLabel: "Response time",
    responseValue: "48 business hours",
    form: {
      title: "Quick brief",
      name: "Name",
      namePlaceholder: "Your name",
      email: "Email",
      emailPlaceholder: "you@example.com",
      projectType: "Project type",
      projectTypes: [
        "Editorial showcase site",
        "Digital product / application",
        "UI/UX redesign",
        "E-commerce",
        "Other",
      ],
      message: "Message",
      messagePlaceholder:
        "Context, goal, rough timeline… a few lines are enough.",
      submit: "Send the brief",
      sending: "Sending…",
      required: "Required field",
      invalidEmail: "Invalid email address",
      minMessage: "Describe the project in a few words (20 characters minimum).",
      errorTitle: "Sending not configured",
      errorText:
        "No sending service is connected to this portfolio. Your brief was not delivered.",
      fallbackTitle: "Two options work right now",
      fallbackMailto: "Open in my email app",
      fallbackCopy: "Copy the brief",
      copied: "Brief copied",
      successTitle: "Brief delivered",
      successText: "Thank you — I will get back to you within 48 business hours.",
      reset: "Write another message",
      privacy: "The details you enter are only used to answer your request.",
      notice:
        "No sending service is connected yet: if sending fails, a pre-filled email is one click away.",
    },
  },

  footer: {
    tagline: "Rosaire Kakpo’s personal studio. Design × Code × Impact.",
    navTitle: "Navigation",
    contactTitle: "Contact",
    elsewhereTitle: "Elsewhere",
    emailTitle: "Write",
    rights: "All rights reserved.",
    builtWith: "Designed and built by THE KRAFTER",
    signature: "Create • Inspire • Impact",
    location: "Cotonou, Benin",
    themeNote: "Light mode by default, dark mode on demand.",
    statusLabel: "Status",
    statusValue: "Open for work",
    backTop: "Back to top",
  },

  assistant: {
    launcher: "Assistant",
    launcherLong: "Open the assistant",
    title: "KRAFTER / Guidance",
    subtitle: "Built-in assistant",
    engineNotice:
      "Pre-programmed assistant — no generative AI is connected to this portfolio. It answers from the site’s own content.",
    greeting:
      "Hello, I am THE KRAFTER assistant. I can point you to projects, services, skills or contact.",
    placeholder: "Ask a question…",
    send: "Send",
    newConversation: "New conversation",
    close: "Close the assistant",
    quickLabel: "Quick questions",
    suggestions: [
      "What are the recent projects?",
      "Which services do you offer?",
      "What is your technical stack?",
      "How can I get in touch?",
      "Are you available?",
    ],
    fallback:
      "I have no prepared answer for that question. I can guide you to projects, services, skills, the journal or contact — or you can write directly to kakporosaire953@gmail.com.",
    typing: "Assistant is typing",
    you: "You",
    navigate: "Go to",
    answerAbout:
      "Rosaire Kakpo, THE KRAFTER: frontend developer and UI/UX designer based in Cotonou. He designs visual systems and builds the interfaces that make them real.",
    answerProjects:
      "Three main projects: SkillBridge (connecting talent with opportunities), Campusly (academic platform for UAC) and Blue Inova. Also Apple Confidence, Tontine Chain and Synnova Tocloe’s portfolio.",
    answerSkills:
      "HTML, CSS, JavaScript, TypeScript, React, Next.js, Tailwind CSS, GSAP, Framer Motion, Firebase, Supabase, REST APIs, Git and Vercel. No percentages: each technology comes with the context where it is used.",
    answerServices:
      "Four services: frontend development, UI/UX design, digital products and e-commerce. Every engagement starts with written framing, then art direction, build and documented delivery.",
    answerContact:
      "The contact form works but no sending service is connected: the reliable fallback is email at kakporosaire953@gmail.com.",
    answerAvailability:
      "Available for remote work from Cotonou. Replies within 48 business hours.",
    answerBlog:
      "The journal is being prepared: no article is published yet. Three topics are announced on the Journal page.",
    answerDesign:
      "The art direction is editorial and architectural: Instrument Sans and Bodoni Moda, a paper / navy / orange palette, generous negative space and orange used with intent.",
    answerMotion:
      "GSAP drives the timelines (hero, scroll reveals, pinned Design × Code section, Flip transitions), anime.js draws the SVG paths, Three.js animates the hero orbital scene.",
  },

  intro: {
    label: "THE KRAFTER introduction",
    void: "THE KRAFTER / DIGITAL CRAFT",
    skip: "Skip the introduction",
    brand: "Building the brand",
    person: "Rosaire Kakpo",
  },

  a11y: {
    newTab: "opens a new tab",
    currentPage: "current page",
    themeToggle: "Change theme, currently",
    langToggle: "Change language, currently",
    decorative: "Decorative element",
    closeDialog: "Close the dialog",
    orbitCanvas: "Decorative 3D scene — no essential information",
    formError: "Form error",
    requiredMark: "required",
  },

  notFound: {
    code: "404",
    title: "This page does not exist",
    text: "The link may be old, or the page has moved. The portfolio is still here.",
    cta: "Back to home",
  },
};

export const dictionaries = { fr, en } as const;
export type Dictionary = typeof fr;
export type Locale = keyof typeof dictionaries;
