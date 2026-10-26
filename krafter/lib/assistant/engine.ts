import type { Dictionary, Locale } from "@/data/translations";

export type AssistantLink = { href: string; label: string };

export type AssistantReply = {
  text: string;
  links: AssistantLink[];
  intent: string;
};

type Intent = {
  id: string;
  patterns: RegExp[];
  answer: (t: Dictionary, locale: Locale) => string;
  links: (t: Dictionary) => AssistantLink[];
};

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, " ");

/**
 * Local, pre-programmed assistant.
 * No generative model is connected: every answer comes from the site's own copy.
 *
 * To plug a real model later, implement a POST handler in app/api/assistant and
 * set NEXT_PUBLIC_ASSISTANT_ENDPOINT — see README (section “Assistant”).
 */
const INTENTS: Intent[] = [
  {
    id: "projects",
    patterns: [/projet/, /project/, /realisation/, /work/, /portfolio/, /skillbridge/, /campusly/, /blue inova/, /etude de cas/, /case study/],
    answer: (t) => t.assistant.answerProjects,
    links: (t) => [
      { href: "/projets", label: t.nav.projects },
      { href: "/projets/campusly", label: "Campusly" },
    ],
  },
  {
    id: "services",
    patterns: [/service/, /prestation/, /offre/, /mission/, /devis/, /tarif/, /prix/, /budget/, /e-?commerce/, /ui\/?ux/, /frontend/],
    answer: (t) => t.assistant.answerServices,
    links: (t) => [
      { href: "/services", label: t.nav.services },
      { href: "/contact", label: t.nav.contact },
    ],
  },
  {
    id: "skills",
    patterns: [/competence/, /skill/, /stack/, /techno/, /react/, /next\.?js/, /typescript/, /gsap/, /three/, /outil/, /langage/],
    answer: (t) => t.assistant.answerSkills,
    links: (t) => [{ href: "/competences", label: t.nav.skills }],
  },
  {
    id: "contact",
    patterns: [/contact/, /mail/, /email/, /ecrire/, /joindre/, /rendez-vous/, /appel/, /telephone/],
    answer: (t) => t.assistant.answerContact,
    links: (t) => [{ href: "/contact", label: t.nav.contact }],
  },
  {
    id: "availability",
    patterns: [/disponib/, /available/, /delai/, /quand/, /commencer/, /freelance/, /mission en cours/],
    answer: (t) => t.assistant.answerAvailability,
    links: (t) => [{ href: "/contact", label: t.nav.contact }],
  },
  {
    id: "blog",
    patterns: [/blog/, /journal/, /article/, /publication/, /newsletter/],
    answer: (t) => t.assistant.answerBlog,
    links: (t) => [{ href: "/blog", label: t.nav.blog }],
  },
  {
    id: "about",
    patterns: [/qui/, /about/, /present/, /parcours/, /experience/, /biographie/, /bio/, /kakpo/, /rosaire/],
    answer: (t) => t.assistant.answerAbout,
    links: (t) => [{ href: "/a-propos", label: t.nav.about }],
  },
  {
    id: "design",
    patterns: [/design/, /typographie/, /couleur/, /palette/, /identite/, /direction artistique/, /branding/, /logo/],
    answer: (t) => t.assistant.answerDesign,
    links: (t) => [
      { href: "/services", label: t.nav.services },
      { href: "/projets", label: t.nav.projects },
    ],
  },
  {
    id: "motion",
    patterns: [/animation/, /motion/, /gsap/, /three/, /anime/, /3d/, /scroll/],
    answer: (t) => t.assistant.answerMotion,
    links: (t) => [{ href: "/competences", label: t.nav.skills }],
  },
];

export function answerLocally(input: string, locale: Locale, t: Dictionary): AssistantReply {
  const text = normalize(input);

  if (!text.trim()) {
    return { text: t.assistant.greeting, links: [], intent: "empty" };
  }

  if (/^(bonjour|salut|hello|hi|hey|bonsoir|merci|thanks|thank you)\b/.test(text)) {
    return {
      text: `${t.assistant.greeting}`,
      links: [
        { href: "/projets", label: t.nav.projects },
        { href: "/contact", label: t.nav.contact },
      ],
      intent: "greeting",
    };
  }

  const match = INTENTS.find((intent) => intent.patterns.some((pattern) => pattern.test(text)));

  if (!match) {
    return {
      text: t.assistant.fallback,
      links: [
        { href: "/projets", label: t.nav.projects },
        { href: "/services", label: t.nav.services },
        { href: "/contact", label: t.nav.contact },
      ],
      intent: "fallback",
    };
  }

  return {
    text: match.answer(t, locale),
    links: match.links(t),
    intent: match.id,
  };
}
