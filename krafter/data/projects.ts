export type Localized = { fr: string; en: string };

export type ProjectCategory = "design-code" | "development" | "art-direction";

export type ProjectCover =
  | { kind: "image"; src: string; alt: Localized; width: number; height: number }
  | { kind: "graphic"; tone: "navy" | "orange" | "blue"; label: string };

export type Project = {
  slug: string;
  index: string;
  title: string;
  tagline: Localized;
  year: string;
  category: ProjectCategory;
  featured: boolean;
  role: Localized;
  stack: string[];
  summary: Localized;
  cover: ProjectCover;
  /** Real, verified links only. Empty means nothing is published. */
  links: { live?: string; repo?: string };
  caseStudy: {
    overview: Localized;
    context: Localized;
    challenge: Localized;
    approach: Localized;
    design: Localized;
    development: Localized;
    technical: { label: Localized; value: Localized }[];
    /** Leave undefined when no public, provable result exists. */
    results?: Localized;
    screens?: { src: string; alt: Localized }[];
    /** Honest note shown when some material is missing. */
    note?: Localized;
  };
};

export const projects: Project[] = [
  {
    slug: "skillbridge",
    index: "01",
    title: "SkillBridge",
    tagline: {
      fr: "Relier les jeunes talents africains aux opportunités mondiales.",
      en: "Connecting young African talent with global opportunities.",
    },
    year: "2025",
    category: "design-code",
    featured: true,
    role: { fr: "UI/UX design & frontend", en: "UI/UX design & frontend" },
    stack: ["React", "TypeScript", "Supabase", "Tailwind CSS"],
    summary: {
      fr: "Plateforme de mise en relation : un pont entre compétences locales et demandes internationales.",
      en: "A matching platform: a bridge between local skills and international demand.",
    },
    cover: { kind: "graphic", tone: "navy", label: "SKILL / BRIDGE" },
    links: {},
    caseStudy: {
      overview: {
        fr: "SkillBridge met en relation de jeunes talents africains et des opportunités professionnelles à l’international. Le projet traite un problème concret : rendre visible et crédible une compétence qui circule mal hors de son contexte local.",
        en: "SkillBridge connects young African talent with international professional opportunities. The project tackles a concrete problem: making a skill visible and credible once it leaves its local context.",
      },
      context: {
        fr: "Un produit à deux faces — profils de talents et besoins d’organisations — dans un environnement où la confiance se gagne vite et où les interfaces doivent rester légères, y compris sur connexion moyenne.",
        en: "A two-sided product — talent profiles and organisations’ needs — in an environment where trust is won quickly and interfaces must stay light, including on average connections.",
      },
      challenge: {
        fr: "Concevoir un parcours qui rassure sans alourdir : hiérarchie claire, information vérifiable, formulaires courts, et une navigation qui reste compréhensible sans tutoriel.",
        en: "Designing a journey that builds trust without adding weight: clear hierarchy, verifiable information, short forms and navigation that needs no tutorial.",
      },
      approach: {
        fr: "Wireframes orientés parcours avant toute direction artistique, puis un système de composants React typés. Les états — chargement, vide, erreur, succès — ont été traités comme des écrans à part entière.",
        en: "Journey-first wireframes before any art direction, then a system of typed React components. States — loading, empty, error, success — were treated as screens in their own right.",
      },
      design: {
        fr: "Une interface calme : fond clair, une couleur d’accent, des blocs de contenu lisibles. La typographie porte la hiérarchie, pas les effets. Les composants de carte de profil et de filtre sont réutilisables d’un écran à l’autre.",
        en: "A calm interface: light background, one accent colour, readable content blocks. Typography carries the hierarchy, not effects. Profile cards and filter components are reused across screens.",
      },
      development: {
        fr: "React et TypeScript, données et authentification côté Supabase, styles en Tailwind CSS. Composants découpés par domaine, logique de données isolée de la présentation.",
        en: "React and TypeScript, data and authentication on Supabase, Tailwind CSS for styling. Components split by domain, data logic isolated from presentation.",
      },
      technical: [
        { label: { fr: "Frontend", en: "Frontend" }, value: { fr: "React, TypeScript", en: "React, TypeScript" } },
        { label: { fr: "Données", en: "Data" }, value: { fr: "Supabase (base, auth)", en: "Supabase (database, auth)" } },
        { label: { fr: "Styles", en: "Styling" }, value: { fr: "Tailwind CSS", en: "Tailwind CSS" } },
        { label: { fr: "Découpage", en: "Structure" }, value: { fr: "Composants par domaine", en: "Domain-based components" } },
      ],
      note: {
        fr: "Captures non publiées pour ce projet. Les sections Design et Développement décrivent la démarche et la stack, pas des fonctionnalités non documentées.",
        en: "No screens published for this project. The Design and Development sections describe the approach and stack, not undocumented features.",
      },
    },
  },
  {
    slug: "campusly",
    index: "02",
    title: "Campusly",
    tagline: {
      fr: "La plateforme académique des étudiants de l’UAC.",
      en: "The academic platform for UAC students.",
    },
    year: "2025",
    category: "design-code",
    featured: true,
    role: { fr: "Design & développement frontend", en: "Design & frontend development" },
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "PWA"],
    summary: {
      fr: "Anciennes épreuves, révision assistée et suivi de progression pour les étudiants de l’Université d’Abomey-Calavi.",
      en: "Past exam papers, assisted revision and progress tracking for students at the University of Abomey-Calavi.",
    },
    cover: {
      kind: "image",
      src: "/projects/campusly.webp",
      alt: {
        fr: "Page d’accueil de Campusly : titre « La plateforme académique des étudiants de l’UAC » et liste d’épreuves récentes.",
        en: "Campusly home page: the headline “The academic platform for UAC students” and a list of recent exam papers.",
      },
      width: 1598,
      height: 777,
    },
    links: {},
    caseStudy: {
      overview: {
        fr: "Campusly rassemble les épreuves passées de l’UAC, la révision assistée et le suivi de progression dans une seule interface. Le problème de départ est simple : des ressources dispersées, des formats illisibles, aucune continuité entre les semestres.",
        en: "Campusly brings UAC past exam papers, assisted revision and progress tracking into one interface. The starting problem is simple: scattered resources, unreadable formats and no continuity between semesters.",
      },
      context: {
        fr: "Un public étudiant, souvent sur mobile et connexion limitée, avec des besoins très concrets : trouver une épreuve, la télécharger, savoir quoi réviser ensuite. Une interface dense en contenu doit rester rapide et hiérarchisée.",
        en: "A student audience, often mobile and on limited connections, with very concrete needs: find a paper, download it, know what to revise next. A content-dense interface still has to stay fast and clearly ordered.",
      },
      challenge: {
        fr: "Faire tenir un catalogue volumineux, un parcours freemium et un tableau de bord de progression sans transformer la page d’accueil en tableau de bord illisible. La contrainte réelle : la première action doit être évidente.",
        en: "Holding a large catalogue, a freemium funnel and a progress dashboard without turning the home page into an unreadable control panel. The real constraint: the first action must be obvious.",
      },
      approach: {
        fr: "Deux colonnes assumées : un discours éditorial court à gauche, une liste d’épreuves concrète à droite. Les blocs « épreuve » sont des composants uniques réutilisés partout — accueil, recherche, favoris, historique.",
        en: "Two committed columns: a short editorial statement on the left, a concrete list of papers on the right. The “paper” blocks are single components reused everywhere — home, search, favourites, history.",
      },
      design: {
        fr: "Fond navy profond, bleu d’action et orange réservé aux accents premium. Le contraste vient de la typographie et de l’espace, pas des effets. Chaque épreuve affiche les mêmes métadonnées, dans le même ordre.",
        en: "Deep navy background, action blue and orange reserved for premium accents. Contrast comes from typography and space, not effects. Every paper shows the same metadata in the same order.",
      },
      development: {
        fr: "Next.js et TypeScript, styles Tailwind, structure orientée PWA pour l’installation sur mobile. Les listes sont rendues côté serveur lorsque c’est possible, avec des états de chargement explicites.",
        en: "Next.js and TypeScript, Tailwind styling, a PWA-oriented structure for mobile installation. Lists render server-side where possible, with explicit loading states.",
      },
      technical: [
        { label: { fr: "Framework", en: "Framework" }, value: { fr: "Next.js, TypeScript", en: "Next.js, TypeScript" } },
        { label: { fr: "Styles", en: "Styling" }, value: { fr: "Tailwind CSS", en: "Tailwind CSS" } },
        { label: { fr: "Distribution", en: "Distribution" }, value: { fr: "Web app / PWA", en: "Web app / PWA" } },
        { label: { fr: "Contraintes", en: "Constraints" }, value: { fr: "Mobile, connexion limitée", en: "Mobile, limited connection" } },
      ],
      screens: [
        {
          src: "/projects/campusly.webp",
          alt: {
            fr: "Campusly — vue d’ensemble de la page d’accueil et du panneau d’épreuves récentes.",
            en: "Campusly — overview of the home page and the recent papers panel.",
          },
        },
      ],
    },
  },
  {
    slug: "blue-inova",
    index: "03",
    title: "Blue Inova",
    tagline: {
      fr: "Un univers produit construit autour du bleu.",
      en: "A product universe built around blue.",
    },
    year: "2026",
    category: "design-code",
    featured: true,
    role: { fr: "Direction artistique & frontend", en: "Art direction & frontend" },
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "GSAP"],
    summary: {
      fr: "Identité et interface d’un produit numérique : une direction monochrome bleue, structurée et calme.",
      en: "Identity and interface for a digital product: a monochrome blue direction, structured and calm.",
    },
    cover: { kind: "graphic", tone: "blue", label: "BLUE / INOVA" },
    links: {},
    caseStudy: {
      overview: {
        fr: "Blue Inova est un projet en cours de documentation. Ce qui est confirmé : une direction visuelle construite autour du bleu, une interface produit et une construction frontend moderne.",
        en: "Blue Inova is a project still being documented. What is confirmed: a visual direction built around blue, a product interface and a modern frontend build.",
      },
      context: {
        fr: "Un projet à identité forte, où la couleur n’est pas un décor mais le fil conducteur : elle porte la hiérarchie, distingue les états et donne sa personnalité au produit.",
        en: "A project with a strong identity, where colour is not decoration but the through-line: it carries hierarchy, distinguishes states and gives the product its personality.",
      },
      challenge: {
        fr: "Travailler une famille de bleus sans produire de monotonie : variation de valeur, contrastes contrôlés, et un accent chaud très rare pour signaler l’action.",
        en: "Working a family of blues without monotony: value variation, controlled contrast, and a rare warm accent to signal action.",
      },
      approach: {
        fr: "Un système de jetons de couleur avant les écrans, puis des composants dérivés. Les animations sont limitées aux transitions d’état et aux révélations de contenu au scroll.",
        en: "A colour-token system before the screens, then derived components. Animation is limited to state transitions and content reveals on scroll.",
      },
      design: {
        fr: "Composition architecturale : blocs alignés, lignes fines, typographie serrée pour les titres et neutre pour la lecture. Le bleu profond sert de fond, le bleu clair de signal.",
        en: "Architectural composition: aligned blocks, fine rules, tight type for headings and neutral type for reading. Deep blue as the ground, light blue as the signal.",
      },
      development: {
        fr: "Next.js, TypeScript et Tailwind CSS, avec GSAP pour les transitions de section. Le thème repose sur des variables CSS, ce qui permet de décliner la palette sans duplication.",
        en: "Next.js, TypeScript and Tailwind CSS, with GSAP for section transitions. The theme relies on CSS variables, so the palette can be extended without duplication.",
      },
      technical: [
        { label: { fr: "Framework", en: "Framework" }, value: { fr: "Next.js, TypeScript", en: "Next.js, TypeScript" } },
        { label: { fr: "Design system", en: "Design system" }, value: { fr: "Jetons de couleur CSS", en: "CSS colour tokens" } },
        { label: { fr: "Motion", en: "Motion" }, value: { fr: "GSAP, transitions d’état", en: "GSAP, state transitions" } },
        { label: { fr: "Statut", en: "Status" }, value: { fr: "Documentation en cours", en: "Documentation in progress" } },
      ],
      note: {
        fr: "Aucune capture publique n’est disponible pour ce projet. Les éléments ci-dessus décrivent la direction et la stack ; ils seront complétés avec des visuels validés.",
        en: "No public screens are available for this project. The elements above describe the direction and stack; they will be completed with approved visuals.",
      },
    },
  },
  {
    slug: "apple-confidence",
    index: "04",
    title: "Apple Confidence",
    tagline: {
      fr: "E-commerce premium pour produits Apple reconditionnés.",
      en: "Premium e-commerce for refurbished Apple products.",
    },
    year: "2024",
    category: "development",
    featured: false,
    role: { fr: "Frontend & e-commerce", en: "Frontend & e-commerce" },
    stack: ["Next.js", "TypeScript", "Stripe", "Firebase"],
    summary: {
      fr: "Vitrine et parcours d’achat pour un revendeur Apple au Bénin : confiance, clarté, conversion.",
      en: "Storefront and purchase journey for an Apple reseller in Benin: trust, clarity, conversion.",
    },
    cover: {
      kind: "image",
      src: "/projects/apple-confidence.webp",
      alt: {
        fr: "Apple Confidence — page d’accueil avec le titre « La technologie. Conçue pour vous impressionner » et un iPhone mis en avant.",
        en: "Apple Confidence — home page with the headline “Technology. Designed to impress you” and a featured iPhone.",
      },
      width: 1588,
      height: 778,
    },
    links: {},
    caseStudy: {
      overview: {
        fr: "Apple Confidence vend des produits Apple authentiques au Bénin. Le site devait résoudre un problème de confiance avant un problème de design : prouver l’authenticité, rassurer sur la livraison, puis vendre.",
        en: "Apple Confidence sells authentic Apple products in Benin. The site had to solve a trust problem before a design problem: prove authenticity, reassure on delivery, then sell.",
      },
      context: {
        fr: "Un marché où le reconditionné inquiète. Les objections arrivent avant l’envie : est-ce authentique ? livré quand ? garanti comment ? L’interface doit répondre dans les dix premières secondes.",
        en: "A market where refurbished devices raise doubts. Objections arrive before desire: is it authentic? when is it delivered? how is it guaranteed? The interface must answer within ten seconds.",
      },
      challenge: {
        fr: "Rendre lisible une offre technique (modèles, capacités, états) sans perdre l’acheteur, et garder un parcours d’achat court sur mobile.",
        en: "Making a technical offer (models, capacities, conditions) readable without losing the buyer, while keeping the purchase journey short on mobile.",
      },
      approach: {
        fr: "Une page d’accueil éditoriale qui traite les objections comme du contenu (garantie, authenticité, livraison), puis des fiches produit structurées autour des mêmes métadonnées.",
        en: "An editorial home page that treats objections as content (warranty, authenticity, delivery), then product pages structured around the same metadata.",
      },
      design: {
        fr: "Typographie serif éditoriale pour la promesse, sans-serif pour la donnée produit. Bleu de confiance en accent, blancs généreux, badges d’assurance discrets plutôt que répétés.",
        en: "Editorial serif for the promise, sans-serif for product data. Trust blue as an accent, generous whitespace, discreet assurance badges rather than repeated ones.",
      },
      development: {
        fr: "Next.js et TypeScript, panier côté client, paiement Stripe, données produit et commandes sur Firebase. Les composants produit sont partagés entre la vitrine et la fiche.",
        en: "Next.js and TypeScript, client-side cart, Stripe checkout, product data and orders on Firebase. Product components are shared between storefront and detail page.",
      },
      technical: [
        { label: { fr: "Framework", en: "Framework" }, value: { fr: "Next.js, TypeScript", en: "Next.js, TypeScript" } },
        { label: { fr: "Paiement", en: "Payments" }, value: { fr: "Stripe", en: "Stripe" } },
        { label: { fr: "Données", en: "Data" }, value: { fr: "Firebase", en: "Firebase" } },
        { label: { fr: "Focus", en: "Focus" }, value: { fr: "Confiance & conversion", en: "Trust & conversion" } },
      ],
      screens: [
        {
          src: "/projects/apple-confidence.webp",
          alt: {
            fr: "Apple Confidence — page d’accueil : promesse éditoriale, badges de garantie et produit mis en avant.",
            en: "Apple Confidence — home page: editorial promise, warranty badges and featured product.",
          },
        },
      ],
    },
  },
  {
    slug: "tontine-chain",
    index: "05",
    title: "Tontine Chain",
    tagline: {
      fr: "L’épargne collective traditionnelle, sécurisée par la blockchain.",
      en: "Traditional group savings, secured by blockchain.",
    },
    year: "2026",
    category: "design-code",
    featured: false,
    role: { fr: "UI/UX & frontend — hackathon", en: "UI/UX & frontend — hackathon" },
    stack: ["React", "Solidity", "Web3", "Tailwind CSS"],
    summary: {
      fr: "Projet de hackathon : digitaliser la tontine béninoise avec transparence et traçabilité.",
      en: "Hackathon project: digitising the Beninese tontine with transparency and traceability.",
    },
    cover: {
      kind: "image",
      src: "/projects/tontine-chain.webp",
      alt: {
        fr: "Tontine Chain — page d’accueil avec le titre « Épargnez avec Confiance » et une carte du Bénin.",
        en: "Tontine Chain — home page with the headline “Save with Confidence” and a map of Benin.",
      },
      width: 1590,
      height: 777,
    },
    links: {},
    caseStudy: {
      overview: {
        fr: "Tontine Chain transpose la tontine — épargne rotative traditionnelle très répandue au Bénin — dans un produit numérique traçable. Projet conçu et défendu lors du hackathon MIABE.",
        en: "Tontine Chain translates the tontine — the rotating savings practice widespread in Benin — into a traceable digital product. Designed and pitched at the MIABE hackathon.",
      },
      context: {
        fr: "Une pratique sociale ancienne, fondée sur la confiance entre proches, avec des risques réels : disparition des fonds, litiges, absence de trace. La blockchain apporte ici une réponse de traçabilité, pas un argument technologique.",
        en: "An old social practice built on trust between relatives, with real risks: lost funds, disputes, no record. Blockchain provides a traceability answer here, not a technology argument.",
      },
      challenge: {
        fr: "Rendre un mécanisme Web3 compréhensible en quelques secondes, pour un public qui n’a jamais utilisé de portefeuille crypto. L’interface devait rester familière.",
        en: "Making a Web3 mechanism understandable in seconds, for an audience that has never used a crypto wallet. The interface had to stay familiar.",
      },
      approach: {
        fr: "Tout expliquer par l’usage : « épargner », « recevoir », « vérifier » — plutôt que par la technique. Le vocabulaire blockchain est cantonné aux écrans de preuve et de détail.",
        en: "Explaining everything through usage — “save”, “receive”, “verify” — rather than technology. Blockchain vocabulary is confined to proof and detail screens.",
      },
      design: {
        fr: "Fond clair, bleu institutionnel, formes douces. La carte du Bénin sert de repère d’ancrage local, les blocs d’impact restent factuels. Aucune promesse chiffrée non vérifiable.",
        en: "Light background, institutional blue, soft shapes. The map of Benin anchors the product locally, impact blocks stay factual. No unverifiable numeric promise.",
      },
      development: {
        fr: "Interface React et Tailwind, contrats Solidity pour la logique de cycle, interaction Web3 côté client. Prototype construit dans le temps court du hackathon.",
        en: "React and Tailwind interface, Solidity contracts for the cycle logic, client-side Web3 interaction. A prototype built within the short hackathon window.",
      },
      technical: [
        { label: { fr: "Interface", en: "Interface" }, value: { fr: "React, Tailwind CSS", en: "React, Tailwind CSS" } },
        { label: { fr: "Contrats", en: "Contracts" }, value: { fr: "Solidity", en: "Solidity" } },
        { label: { fr: "Contexte", en: "Context" }, value: { fr: "Hackathon MIABE", en: "MIABE hackathon" } },
        { label: { fr: "Nature", en: "Nature" }, value: { fr: "Prototype", en: "Prototype" } },
      ],
      screens: [
        {
          src: "/projects/tontine-chain.webp",
          alt: {
            fr: "Tontine Chain — page d’accueil du prototype : promesse d’épargne, carte du Bénin et blocs de sécurité.",
            en: "Tontine Chain — prototype home page: savings promise, map of Benin and security blocks.",
          },
        },
      ],
      note: {
        fr: "Prototype de hackathon : le produit n’est pas en production. Aucun classement ou résultat chiffré n’est revendiqué ici.",
        en: "Hackathon prototype: the product is not in production. No ranking or numeric result is claimed here.",
      },
    },
  },
  {
    slug: "portfolio-synnova",
    index: "06",
    title: "Portfolio Synnova",
    tagline: {
      fr: "Un portfolio éditorial pour une communicatrice et actrice béninoise.",
      en: "An editorial portfolio for a Beninese host and actress.",
    },
    year: "2026",
    category: "design-code",
    featured: false,
    role: { fr: "Design & développement", en: "Design & development" },
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel"],
    summary: {
      fr: "Site multilingue, thème clair/sombre et direction artistique forte pour Synnova Tocloe.",
      en: "A multilingual site with light/dark themes and a strong art direction for Synnova Tocloe.",
    },
    cover: {
      kind: "image",
      src: "/projects/synnova.webp",
      alt: {
        fr: "Portfolio Synnova Tocloe — page d’accueil avec un grand titre serif et un portrait encadré.",
        en: "Synnova Tocloe portfolio — home page with a large serif headline and a framed portrait.",
      },
      width: 1578,
      height: 777,
    },
    links: {},
    caseStudy: {
      overview: {
        fr: "Un portfolio personnel pour Synnova Belvine Kybarance Tocloe : animatrice, communicatrice digitale, actrice et entrepreneuse sociale. Le site devait porter sa voix avant de lister ses activités.",
        en: "A personal portfolio for Synnova Belvine Kybarance Tocloe: host, digital communicator, actress and social entrepreneur. The site had to carry her voice before listing her activities.",
      },
      context: {
        fr: "Une personnalité publique avec plusieurs casquettes, un public francophone et anglophone, et le besoin d’un site qui reste élégant sur mobile, où arrive la majorité du trafic.",
        en: "A public figure with several roles, a French- and English-speaking audience, and the need for a site that stays elegant on mobile, where most traffic arrives.",
      },
      challenge: {
        fr: "Trouver une direction assez forte pour ne pas ressembler à un template, tout en gardant une structure simple à mettre à jour par la propriétaire.",
        en: "Finding a direction strong enough to avoid template territory while keeping a structure the owner can update easily.",
      },
      approach: {
        fr: "Une composition éditoriale asymétrique, un serif de titre assumé et un rose signature. Le contenu est structuré en sections courtes, chacune autonome.",
        en: "An asymmetric editorial composition, a committed display serif and a signature pink. Content is split into short, self-contained sections.",
      },
      design: {
        fr: "Grands titres serif, lettrines en fond, portraits cadrés. Le rose identifie la personne ; le reste de la palette reste neutre pour laisser respirer les images.",
        en: "Large serif headlines, oversized background letters, framed portraits. Pink identifies the person; the rest of the palette stays neutral so images can breathe.",
      },
      development: {
        fr: "Next.js et TypeScript, Tailwind CSS, thème clair/sombre persistant, bascule FR/EN et déploiement Vercel.",
        en: "Next.js and TypeScript, Tailwind CSS, persistent light/dark theme, FR/EN switch and Vercel deployment.",
      },
      technical: [
        { label: { fr: "Framework", en: "Framework" }, value: { fr: "Next.js, TypeScript", en: "Next.js, TypeScript" } },
        { label: { fr: "Thème", en: "Theme" }, value: { fr: "Clair / sombre persistant", en: "Persistent light / dark" } },
        { label: { fr: "Langues", en: "Languages" }, value: { fr: "FR / EN", en: "FR / EN" } },
        { label: { fr: "Hébergement", en: "Hosting" }, value: { fr: "Vercel", en: "Vercel" } },
      ],
      screens: [
        {
          src: "/projects/synnova.webp",
          alt: {
            fr: "Portfolio Synnova Tocloe — accueil : navigation, titre serif et portrait.",
            en: "Synnova Tocloe portfolio — home: navigation, serif headline and portrait.",
          },
        },
      ],
    },
  },
];

export const featuredProjects = projects.filter((project) => project.featured);

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getNextProject(slug: string): Project {
  const index = projects.findIndex((project) => project.slug === slug);
  return projects[(index + 1) % projects.length];
}

export function getProjectNeighbours(slug: string) {
  const index = projects.findIndex((project) => project.slug === slug);
  return {
    previous: projects[(index - 1 + projects.length) % projects.length],
    next: projects[(index + 1) % projects.length],
  };
}
