import type { Localized } from "./projects";

export type Service = {
  id: string;
  index: string;
  title: Localized;
  tagline: Localized;
  summary: Localized;
  includes: Localized[];
  audience: Localized;
  deliverables: string[];
};

export const services: Service[] = [
  {
    id: "frontend",
    index: "01",
    title: { fr: "Frontend Development", en: "Frontend Development" },
    tagline: {
      fr: "Des interfaces construites pour durer.",
      en: "Interfaces built to last.",
    },
    summary: {
      fr: "Développement d’interfaces en React, Next.js et TypeScript : composants réutilisables, animations maîtrisées, accessibilité et performance traitées comme des exigences, pas des options.",
      en: "Interface development in React, Next.js and TypeScript: reusable components, controlled animation, accessibility and performance treated as requirements, not options.",
    },
    includes: [
      {
        fr: "Architecture de composants typés et documentation d’usage",
        en: "Typed component architecture with usage documentation",
      },
      {
        fr: "Intégration responsive fidèle à la maquette, testée sur appareils réels",
        en: "Responsive integration faithful to the design, tested on real devices",
      },
      {
        fr: "Animations GSAP, anime.js et scènes Three.js légères",
        en: "GSAP and anime.js animation, lightweight Three.js scenes",
      },
      {
        fr: "Optimisation du chargement, des images et du rendu",
        en: "Loading, image and rendering optimisation",
      },
    ],
    audience: {
      fr: "Studios, agences et entreprises qui ont un design à construire proprement.",
      en: "Studios, agencies and companies with a design that must be built properly.",
    },
    deliverables: ["Code source", "Documentation de lancement", "Build de production"],
  },
  {
    id: "uiux",
    index: "02",
    title: { fr: "UI/UX Design", en: "UI/UX Design" },
    tagline: {
      fr: "Concevoir la structure avant l’apparence.",
      en: "Design the structure before the appearance.",
    },
    summary: {
      fr: "Architecture de l’information, wireframes, direction artistique et système de design. Un travail éditorial : hiérarchie, typographie, rythme, et une couleur utilisée avec intention.",
      en: "Information architecture, wireframes, art direction and design systems. Editorial work: hierarchy, typography, rhythm, and colour used with intent.",
    },
    includes: [
      {
        fr: "Wireframes et parcours utilisateurs documentés",
        en: "Wireframes and documented user journeys",
      },
      {
        fr: "Direction artistique complète : typographie, palette, grille",
        en: "Full art direction: typography, palette, grid",
      },
      {
        fr: "Système de design et composants réutilisables",
        en: "Design system and reusable components",
      },
      {
        fr: "Prototype interactif pour valider les choix",
        en: "Interactive prototype to validate decisions",
      },
    ],
    audience: {
      fr: "Projets à repositionner, produits qui ont grandi trop vite, marques personnelles exigeantes.",
      en: "Projects needing repositioning, products that grew too fast, demanding personal brands.",
    },
    deliverables: ["Wireframes", "Maquettes desktop & mobile", "Design system", "Prototype"],
  },
  {
    id: "products",
    index: "03",
    title: { fr: "Digital Products", en: "Digital Products" },
    tagline: {
      fr: "Du concept au produit utilisable.",
      en: "From concept to a usable product.",
    },
    summary: {
      fr: "Conception de produits numériques complets : cadrage, MVP, écrans clés, états limites — puis construction et mise en ligne. Les cas vides et les erreurs sont traités dès le départ.",
      en: "End-to-end digital product work: framing, MVP, key screens, edge states — then build and launch. Empty and error states are handled from the start.",
    },
    includes: [
      {
        fr: "Cadrage produit : objectifs, périmètre, priorités",
        en: "Product framing: goals, scope, priorities",
      },
      {
        fr: "Écrans clés et parcours critiques (authentification, paiement, recherche)",
        en: "Key screens and critical journeys (auth, payment, search)",
      },
      {
        fr: "États de chargement, vides et erreurs",
        en: "Loading, empty and error states",
      },
      {
        fr: "Mise en ligne et suivi des premiers retours d’usage",
        en: "Launch and follow-up on early usage feedback",
      },
    ],
    audience: {
      fr: "Fondateurs et équipes qui lancent un premier produit ou une nouvelle version.",
      en: "Founders and teams launching a first product or a new version.",
    },
    deliverables: ["Cadrage écrit", "Maquettes", "Frontend", "Mise en ligne"],
  },
  {
    id: "ecommerce",
    index: "04",
    title: { fr: "E-commerce", en: "E-commerce" },
    tagline: {
      fr: "Vendre sans perdre la confiance.",
      en: "Sell without losing trust.",
    },
    summary: {
      fr: "Boutiques et parcours d’achat : clarté de l’offre, traitement des objections, fiches produit lisibles, paiement et suivi. Le design sert la conversion, sans pression artificielle.",
      en: "Storefronts and purchase journeys: clear offers, objection handling, readable product pages, payment and follow-up. Design serves conversion without artificial pressure.",
    },
    includes: [
      {
        fr: "Structure de catalogue et fiches produit",
        en: "Catalogue structure and product pages",
      },
      {
        fr: "Parcours panier et paiement (Stripe)",
        en: "Cart and checkout journey (Stripe)",
      },
      {
        fr: "Contenus de réassurance : garantie, livraison, authenticité",
        en: "Reassurance content: warranty, delivery, authenticity",
      },
      {
        fr: "Base de données produit et commandes",
        en: "Product database and orders",
      },
    ],
    audience: {
      fr: "Commerçants et marques qui vendent en ligne, au Bénin ou à l’international.",
      en: "Retailers and brands selling online, in Benin or internationally.",
    },
    deliverables: ["Boutique", "Tunnel de paiement", "Back-office léger", "Documentation"],
  },
];

export const processSteps = [
  {
    index: "01",
    label: { fr: "Cadrage", en: "Framing" },
    text: {
      fr: "Objectifs, publics, contraintes, périmètre. Un brief écrit est validé avant toute production.",
      en: "Goals, audiences, constraints, scope. A written brief is approved before any production.",
    },
  },
  {
    index: "02",
    label: { fr: "Direction", en: "Direction" },
    text: {
      fr: "Architecture, typographie, palette, principes de mouvement. Les règles du système sont posées.",
      en: "Architecture, typography, palette, motion principles. The system’s rules are set.",
    },
  },
  {
    index: "03",
    label: { fr: "Construction", en: "Build" },
    text: {
      fr: "Développement frontend par composants, intégration responsive, animation, contrôle d’accessibilité.",
      en: "Component-based frontend development, responsive integration, animation, accessibility checks.",
    },
  },
  {
    index: "04",
    label: { fr: "Livraison", en: "Delivery" },
    text: {
      fr: "Tests, optimisation, mise en ligne, passation du code et documentation de maintenance.",
      en: "Testing, optimisation, launch, code handover and maintenance documentation.",
    },
  },
];

export type SkillGroup = {
  id: string;
  title: Localized;
  items: { name: string; context: Localized }[];
};

export const skillGroups: SkillGroup[] = [
  {
    id: "languages",
    title: { fr: "Langages & fondations", en: "Languages & foundations" },
    items: [
      {
        name: "HTML",
        context: {
          fr: "Structure sémantique, formulaires, accessibilité de base.",
          en: "Semantic structure, forms, baseline accessibility.",
        },
      },
      {
        name: "CSS",
        context: {
          fr: "Grilles, typographie fluide, variables, thèmes clair/sombre, glassmorphism maîtrisé.",
          en: "Grids, fluid typography, variables, light/dark themes, controlled glass effects.",
        },
      },
      {
        name: "JavaScript",
        context: {
          fr: "Modules ES, API navigateur, animation, interactions complexes.",
          en: "ES modules, browser APIs, animation, complex interactions.",
        },
      },
      {
        name: "TypeScript",
        context: {
          fr: "Typage strict des données et des composants, refactorisations sûres.",
          en: "Strict typing of data and components, safe refactors.",
        },
      },
    ],
  },
  {
    id: "ui",
    title: { fr: "Frameworks & interface", en: "Frameworks & interface" },
    items: [
      {
        name: "React",
        context: {
          fr: "Composants, hooks, context, découpage par domaine.",
          en: "Components, hooks, context, domain-based structuring.",
        },
      },
      {
        name: "Next.js",
        context: {
          fr: "App Router, rendu serveur, routes dynamiques, métadonnées SEO.",
          en: "App Router, server rendering, dynamic routes, SEO metadata.",
        },
      },
      {
        name: "Tailwind CSS",
        context: {
          fr: "Système de jetons, responsive rapide, cohérence visuelle.",
          en: "Token system, fast responsive work, visual consistency.",
        },
      },
    ],
  },
  {
    id: "motion",
    title: { fr: "Mouvement", en: "Motion" },
    items: [
      {
        name: "GSAP",
        context: {
          fr: "Timelines, ScrollTrigger, Flip, SplitText, nettoyage des contextes.",
          en: "Timelines, ScrollTrigger, Flip, SplitText, context cleanup.",
        },
      },
      {
        name: "anime.js",
        context: {
          fr: "Tracés SVG, staggers géométriques, micro-animations de marque.",
          en: "SVG drawing, geometric staggers, brand micro-animations.",
        },
      },
      {
        name: "Three.js",
        context: {
          fr: "Scènes légères, matériaux verre, parallaxe caméra, fallbacks.",
          en: "Lightweight scenes, glass materials, camera parallax, fallbacks.",
        },
      },
      {
        name: "Framer Motion",
        context: {
          fr: "Transitions de composants et gestes dans des projets React.",
          en: "Component transitions and gestures in React projects.",
        },
      },
    ],
  },
  {
    id: "data",
    title: { fr: "Données & services", en: "Data & services" },
    items: [
      {
        name: "Firebase",
        context: {
          fr: "Authentification, base temps réel, stockage, hébergement.",
          en: "Authentication, realtime database, storage, hosting.",
        },
      },
      {
        name: "Supabase",
        context: {
          fr: "Postgres managé, auth, politiques d’accès, requêtes typées.",
          en: "Managed Postgres, auth, access policies, typed queries.",
        },
      },
      {
        name: "REST APIs",
        context: {
          fr: "Consommation, états d’erreur, cache, intégration de services tiers.",
          en: "Consumption, error states, caching, third-party service integration.",
        },
      },
    ],
  },
  {
    id: "tools",
    title: { fr: "Outils & livraison", en: "Tools & delivery" },
    items: [
      {
        name: "Git",
        context: {
          fr: "Branches, revues, historique lisible, collaboration.",
          en: "Branches, reviews, readable history, collaboration.",
        },
      },
      {
        name: "Vercel",
        context: {
          fr: "Déploiement, aperçus de branche, variables d’environnement.",
          en: "Deployment, branch previews, environment variables.",
        },
      },
      {
        name: "Figma",
        context: {
          fr: "Wireframes, maquettes, système de composants, prototypes.",
          en: "Wireframes, mockups, component systems, prototypes.",
        },
      },
    ],
  },
];
