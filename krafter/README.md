# THE KRAFTER — Portfolio de Rosaire Kakpo

**Frontend Developer × UI/UX Designer** — Cotonou, Bénin
*Design × Code × Impact* · *Créer • Inspirer • Impacter*

Site multipage Next.js (App Router) avec direction artistique éditoriale,
animations GSAP, motifs SVG anime.js, scène 3D Three.js, Liquid Glass maîtrisé,
mode clair par défaut / mode sombre, et système bilingue FR/EN.

---

## Projets publiés

Le site n'expose que les trois projets validés — **SkillBridge**, **Campusly**,
**Blue Inova** (`/projets`, `/projets/[slug]`, sitemap, accueil). Les trois autres
projets réels documentés dans l'ancien portfolio (Apple Confidence, Tontine Chain,
Portfolio Synnova Tocloe) restent dans `data/projects.ts` sous `allProjects`, mais
sont exclus de la publication via `PUBLISHED_SLUGS` — aucun contenu inventé, rien
n'est supprimé : ajoutez un slug à ce tableau pour le publier (la route, la carte
et l'entrée de sitemap sont générées automatiquement).

## 1. Démarrage

Prérequis : **Node.js 18.18+** (testé en Node 22) et npm.

```bash
cd krafter
npm install
npm run dev        # http://localhost:3000
```

Build de production :

```bash
npm run build
npm run start      # http://localhost:3000
```

> **TypeScript** est volontairement épinglé en `5.9.x`. TypeScript 7 (compilateur
> natif) n'expose pas encore l'API attendue par Next.js 15 pour lire
> `tsconfig.paths`, ce qui casse la résolution de l'alias `@/`.
> Ne montez pas `typescript` en v7 sans passer à Next.js 16+.

---

## 2. Structure

```
krafter/
├── app/
│   ├── layout.tsx                 fonts locales, providers, chrome, JSON-LD, script anti-flash
│   ├── page.tsx                   accueil
│   ├── a-propos/ services/ projets/ competences/ blog/ contact/
│   ├── projets/[slug]/            études de cas (3 projets publiés prérendus)
│   ├── api/contact/route.ts       envoi e-mail (Resend ou webhook) — non configuré par défaut
│   ├── api/assistant/route.ts     adaptateur modèle — 501 tant qu'aucune clé n'est posée
│   ├── globals.css                design system : tokens, typographie, layout, verre, boutons
│   ├── styles/chrome.css          header, rail, menu mobile, footer, assistant, intro
│   ├── styles/pages.css           hero, sections, projets, études de cas, formulaires
│   ├── sitemap.ts robots.ts not-found.tsx
├── components/
│   ├── brand/                     logo (asset réel ou emplacement identifié), signature
│   ├── navigation/                header, rail vertical, menu mobile, locale switch, icônes
│   ├── theme/                     ThemeProvider + KRAFTER / GLASS SWITCH
│   ├── assistant/                 KRAFTER / GUIDANCE (assistant préprogrammé)
│   ├── motion/                    reveals, SplitText, Magnetic, transition Flip
│   ├── sections/                  sections de la homepage + Design × Code
│   ├── three/                     Living Ghost / Liquid Core (une scène partagée)
│   ├── svg/                       géométries SVG anime.js, affiches statiques des sculptures
│   ├── projects/ pages/ contact/ layout/
├── lib/
│   ├── animations/gsap/           enregistrement des plugins, hook de contexte, store Flip
│   ├── animations/anime/          helpers de tracé SVG (v4)
│   ├── assistant/engine.ts        moteur de réponses local
│   ├── utils/                     reduced-motion, media queries, cn, état de l'intro
├── data/                          projects.ts, services.ts, articles.ts, translations.ts, profile.ts
├── public/                        images optimisées, captures projets, favicon, og.jpg, brand/
└── types/                         déclarations CSS
```

Le site statique historique (HTML à la racine du dépôt) est conservé tel quel ;
le nouveau site vit dans `krafter/`.

---

## 3. Ce qui fonctionne réellement

### Pages (toutes testées en HTTP 200)

| Route | Contenu |
|---|---|
| `/` | Hero + portrait + scène 3D, signature, projets sélectionnés, Design × Code, services, méthode, profil, histoire THE KRAFTER, journal, CTA contact |
| `/a-propos` | Portrait éditorial, identité, 3 convictions, trajectoire (chapitres thématiques), approche |
| `/services` | 4 services détaillés, déroulé en 4 étapes, FAQ accordéon accessible |
| `/projets` | Galerie filtrée (Tous / Design & dev / Développement / Direction artistique) |
| `/projets/[slug]` | 3 études de cas (SkillBridge, Campusly, Blue Inova) : vue d'ensemble, contexte, enjeu, approche, design, développement, fiche technique, résultat (honnête), écrans, projet suivant |
| `/competences` | Stack réelle par groupe avec contexte d'usage, méthode, exploration — **aucun pourcentage** |
| `/blog` | État vide honnête + sujets en préparation (aucun article publié) |
| `/contact` | Formulaire validé + fallback e-mail réel |
| `404` | Page d'erreur éditoriale bilingue |

### Navigation
- **Header** en verre : logo, statut, FR/EN, switch de thème, CTA « Travaillons ensemble »,
  compactage au scroll.
- **Rail vertical flottant** (desktop) : 7 destinations, état actif orange, libellé au
  survol/focus, filet de progression de lecture.
- **Menu mobile plein écran** : cibles ≥ 44 px, numérotation éditoriale, contrôles
  langue/thème, CTA, fermeture Échap, piège à focus, `inert` quand fermé.
- **Assistant** : modale centrée (desktop) / plein écran (mobile), suggestions,
  liens de navigation, « nouvelle conversation », fermeture Échap, focus géré.

### Thème & langue
- Clair par défaut ; sombre au choix ; `localStorage` (`krafter:theme`), respect de
  `prefers-color-scheme` en l'absence de choix ; script inline anti-flash.
- **Atmosphère du mode sombre** : une couche fixe et purement décorative
  (`div.atmosphere`, `globals.css`) pose un champ navy profond, un arc orange en
  haut à droite, une respiration bleue en haut à gauche, et une trame
  d'imprimerie (points de 6 px) masquée sur la lumière uniquement. Elle est en
  `mix-blend-mode: screen` : elle éclaire les surfaces sans teinter le texte, et
  vaut pour toutes les pages, cartes et sections. Invisible en mode clair
  (`opacity: 0`, aucune peinture), désactivée pour `prefers-reduced-motion` par
  son absence d'animation. Le verre du header est assombri en conséquence
  (`.glass`, jetons `--glass-*`) pour rester lisible sur ce fond.
- Le logo officiel reste affiché sans retouche de couleur : en sombre, il est
  simplement ourlé de lumière (dropshadows blancs empilés) pour se détacher du
  navy.
- FR/EN : contenu réellement permuté (`data/translations.ts`, `data/projects.ts`,
  `data/services.ts`), persistance `krafter:lang`, `lang` sur `<html>`,
  raccourci `Alt + L`.
- Le **logo, le statut et les CTA** restent cohérents dans les deux langues.

### Animations
- **GSAP timeline** du hero : filet orange, titres masqués, rôle, portrait en
  `clip-path`, géométries, CTA, métadonnées — calée après l'intro.
- **ScrollTrigger** : révélations de titres, images en rideau, filets, staggers,
  parallaxe légère, chapitre Design × Code piloté au scroll (composition collante
  CSS `position: sticky`, **aucun scroll hijacking**).
- **SplitText** : titre « L'histoire de THE KRAFTER » (masques de lignes réels,
  `revert()` au démontage).
- **Flip** : transition image de grille → couverture d'étude de cas entre deux
  routes (via `Flip.fit`), désactivée en `prefers-reduced-motion`.
- **anime.js v4** : tracés SVG indépendants (géométries « K », arcs, grille) dans
  les bandes Histoire/Contact et dans l'intro. Aucun élément n'est piloté à la fois
  par GSAP et anime.js.
- **Nettoyage** : `gsap.context()` + `revert()` dans chaque composant, `kill()`
  des temporisations, `dispose()` de toutes les ressources Three.js.

### 3D — deux sculptures, une scène

Deux objets, jamais visibles en même temps, placés dans des sections qui
existaient déjà :

| Sculpture | Où | Rôle |
| --- | --- | --- |
| **THE LIVING GHOST** | héros, en bas à gauche de la plaque portrait | présence calme, respiration, réaction au pointeur |
| **THE LIQUID CORE** | section Méthode, derrière la timeline | progression au défilement, sculpture métallique |

- **Géométrie procédurale, aucun asset externe.** Aucun modèle `.glb`, aucune
  texture, aucun HDRI : la forme du fantôme est une nappe paramétrique écrite à
  la main (dôme, ourlet à cinq lobes, plis, deux orbites creusées), les rubans du
  noyau sont balayés le long de courbes fermées puis vrillés. Les deux objets
  sont donc reproductibles au pixel et ne dépendent d'aucun téléchargement.
- **Yeux du fantôme** : découpés au pixel dans le fragment shader, dans l'espace
  UV de la nappe (pas de trou polygonal, pas d'opération booléenne), avec une
  coque intérieure sombre pour que le trou lise une profondeur.
- **Matières PBR uniquement** : `MeshPhysicalMaterial` (iridescence à couche
  mince, clearcoat, sheen) et un environnement de studio construit à la volée
  (PMREM) avec les quatre couleurs de la marque. Aucun post-traitement, aucun
  bloom : le coût d'un second passage de rendu n'était pas justifié.
- **Palette** : orange `#FF6A00`, navy `#081A2B`, bleu `#1E6FD9`, cyan
  `#54CFE0`, papier `#FAF8F3`. Le violet n'existe que comme reflet secondaire de
  l'iridescence ; il n'y a pas d'« univers violet ».
- **Deux directions artistiques** : en clair, le fantôme est un verre navy fumé
  qui tient sur le papier ; en sombre, une opale éclairée de l'intérieur. Le noyau
  passe du graphite chaud au métal orange/bleu. Le changement de thème tween un
  seul nombre (0 → 1) qui interpole couleurs, rugosités, iridescence, intensités
  de lumières et exposition : la rotation, la pose et le contexte WebGL ne sont
  jamais reconstruits (vérifié : même élément `<canvas>` avant/après).
- **GSAP coordonne, sans se disputer les propriétés** : quatre objets d'état
  distincts, composés en une seule transformation par image — `rest` (flottement,
  rotation lente), `pointer` (amorti, retour au repos), `scroll` (une seule
  progression 0 → 1, `scrub` amorti, réversible), `theme` (le mix). Aucune
  timeline n'écrit sur la propriété d'une autre.
- **Une seule boucle de rendu** pour toutes les scènes
  (`components/three/sculptures/loop.ts`) : elle ne tourne que si un canvas est
  visible, s'arrête quand l'onglet passe en arrière-plan et reprend sans saut.
- **Performance** : DPR plafonné (1.75 desktop / 1.35 mobile), qualité par
  viewport (segments de la nappe, segments des rubans), scène suspendue hors
  écran (`IntersectionObserver`), aucun suivi du pointeur sur tactile
  (`(hover: hover) and (pointer: fine)`), contexte unique par scène.
- **Téléphones** : le héros garde le fantôme en définition réduite ; le noyau
  n'est pas monté sous 768 px, pour ne pas ouvrir un second contexte WebGL sur un
  appareil qui n'en a pas besoin. La section Méthode garde ses dégradés CSS.
- **Repli** : affiche SVG peinte immédiatement, remplacée seulement après la
  première image WebGL ; si WebGL est absent, refusé, ou si le contexte est
  perdu, l'affiche reste (vérifié avec `--disable-webgl`).
- **Mouvement réduit** : une seule image composée au repos, aucun écouteur
  pointeur, aucun ScrollTrigger pour la scène.

### Tests de la couche 3D
`npm run test:sculptures` exécute 31 vérifications sur le code réellement publié,
sans navigateur : fermeture de la couture de la nappe, normales unitaires, cinq
lobes, orbites réellement creusées, rubans fermés et plats, ancrages de shader
effectivement injectés, accolades équilibrées, uniformes déclarés, interpolation
de thème, déterminisme du bruit. Ce sont les défauts qu'une capture ne montre
pas.

### Scène d'ouverture
Un portrait pleine hauteur découpé en bandes verticales qui se recalent en une
seule image à mesure que la page est prête ; le logo officiel complet (grand K,
arcs, « The », KRAFTER, la ligne CRÉER · INSPIRER · IMPACTER) sur papier à
gauche, une ligne d'état « Chargement » et une jauge segmentée de 14 cellules.

La jauge n'est pas décorative : typographies (30 %), événement `load` (30 %) et
décodage du portrait (40 %) débloquent chacun une part fixe, et l'écran ne part
qu'une fois les trois réunies. Le remplissage suit toujours le plus lent des deux
(prêt réel, révélation), jamais plus vite. Échap, bouton « Passer » et minuterie
de secours mettent fin à la scène ; `prefers-reduced-motion` la supprime
entièrement (décidé avant le premier rendu, dans le script de boot).

Une fois par session (`sessionStorage`), sur l'accueil uniquement. Le portrait
est dessiné sur un canvas (`components/brand/SlicePortrait.tsx`) : une seule
décompression d'image, pas une balise `<img>` par bande, et un repli `<img>`
net si JavaScript est absent. La boucle s'arrête définitivement à 100 %.

---

## 4. Assets et actions requises

### Logo officiel
Le fichier fourni par Rosaire Kakpo est utilisé tel quel, jamais redessiné :

```
public/brand/the-krafter-logo.png      lockup complet (760 × 663)
public/brand/the-krafter-wordmark.png  wordmark seul (760 × 144)
public/brand/the-krafter-mark.png      monogramme K (512 × 512)
```

`components/brand/BrandLogo.tsx` les affiche aux proportions d'origine. Le header
montre le wordmark seul (le K n'apparaît pas deux fois sur le premier écran) ;
l'ouverture, la section Histoire et le footer montrent le lockup complet ; le
monogramme sert au favicon et à la marque.

### Photographies
- `public/images/portrait-hero.jpg` — portrait costume blanc / disque orange
  (fichier fourni), utilisé dans le hero et l'intro.
- `public/images/portrait-navy.jpg` et `portrait-editorial.jpg` — portraits
  éditoriaux existants du dépôt.
- Captures de projets : Campusly, Apple Confidence, Tontine Chain, Portfolio
  Synnova (recadrées depuis les visuels du dépôt, export WebP + JPEG).
- SkillBridge et Blue Inova n'ont **pas** de captures publiées : ils utilisent une
  couverture typographique générée par le design system, pas une fausse maquette.
- `public/og.jpg` — image Open Graph 1200×630 générée à partir du portrait réel.

---

## 5. Assistant — état réel et branchement

**Aucune IA générative n'est connectée.** L'assistant répond à partir des contenus
du site via `lib/assistant/engine.ts` (mots-clés FR/EN → réponses écrites +
liens de navigation). Le bandeau d'information dans la fenêtre l'indique
explicitement, en français comme en anglais.

Pour brancher un modèle :

1. Implémentez un endpoint qui accepte `{ message, locale }` et renvoie
   `{ reply: string, links?: {href,label}[] }`.
2. `app/api/assistant/route.ts` relaie déjà vers `ASSISTANT_API_URL`
   (option `ASSISTANT_API_KEY`).
3. Exposez-le au client :

```bash
# .env.local
ASSISTANT_API_URL=https://votre-service/v1/chat
ASSISTANT_API_KEY=sk-...
NEXT_PUBLIC_ASSISTANT_ENDPOINT=/api/assistant
```

Sans `ASSISTANT_API_URL`, l'API répond `501 not_configured` et le client reste sur
le moteur local — aucun faux « je suis une IA » n'est affiché.

---

## 6. Formulaire de contact — état réel et branchement

Le formulaire valide les champs (nom, e-mail, type de projet, message ≥ 20
caractères), gère les états `idle / sending / success / error`, l'accessibilité
(`aria-invalid`, `aria-describedby`, focus, `aria-busy`) et un honeypot.

**Aucun service d'envoi n'est branché par défaut** : l'API répond
`503 not_configured`, et l'interface propose alors deux actions qui, elles,
fonctionnent immédiatement :

1. **Ouvrir dans mon logiciel de messagerie** — `mailto:` prérempli
   (objet + corps) vers `kakporosaire953@gmail.com`.
2. **Copier le brief** — presse-papiers.

Pour activer l'envoi réel, ajoutez dans `.env.local` :

```bash
# Option A — Resend
RESEND_API_KEY=re_...
CONTACT_TO_EMAIL=kakporosaire953@gmail.com
CONTACT_FROM_EMAIL="THE KRAFTER <site@votre-domaine.com>"

# Option B — n'importe quel webhook (Zapier, Make, Formspree, Worker…)
CONTACT_WEBHOOK_URL=https://...
```

Le code d'envoi est déjà écrit dans `app/api/contact/route.ts` (validation
serveur, anti-spam, réponse 502 en cas d'échec fournisseur).

---

## 7. Journal (blog)

Aucun article n'est publié — l'état vide est explicite et daté, sans faux
historique. Pour publier :

1. Ajoutez un objet dans `data/articles.ts` (titre, extrait, sujet, date, corps FR/EN).
2. La page `/blog` et l'aperçu de la homepage s'adaptent automatiquement
   (l'aperçu affiche alors les articles au lieu des sujets « à venir »).
3. Une route `/blog/[slug]` n'est pas incluse : à ajouter si un vrai flux d'articles
   est décidé (le modèle de données est prêt).

---

## 8. Contenus à confirmer (transparence)

Aucun chiffre, témoignage, classement ou nombre d'utilisateurs n'a été inventé.
Les études de cas affichent d'ailleurs une mention explicite :
« Aucun indicateur public n'est publié pour ce projet ».

À valider par le propriétaire :

- **SkillBridge** et **Blue Inova** : périmètre fonctionnel exact (les pages
  décrivent la démarche, la direction et la stack, pas des fonctionnalités non
  documentées). Un encart « à confirmer » le signale sur les études de cas
  concernées.
- **Tontine Chain** : positionnement exact au hackathon MIABE 2026 (mention neutre
  « hackathon » sans revendiquer de classement).
- **Années** des projets (`data/projects.ts`) et liens publics (aucun lien
  « voir le site » n'est affiché tant qu'une URL réelle n'est pas renseignée).
- **Liens sociaux** : seul GitHub (`kakporosaire953-creator`) est réel ; les
  anciens liens `github.com` / `linkedin.com` / `twitter.com` génériques du site
  historique n'ont pas été repris pour éviter des liens morts.

---

## 9. Accessibilité, mouvement, performance

- `prefers-reduced-motion` : intro désactivée, timelines et ScrollTrigger non
  créés, Flip ignoré, transitions CSS neutralisées, scène 3D rendue en une image.
- Clavier : lien d'évitement, focus visible orange, Échap pour les dialogues,
  piège à focus, `aria-current`, `aria-expanded`, `role="switch"` sur le thème.
- Contenus jamais dépendants d'une animation : le HTML est complet et lisible
  sans JavaScript (hormis les contrôles de thème/langue et l'assistant, qui sont
  des améliorations).
- Contrastes : texte `--ink` / `--ink-soft` sur papier et navy ; l'orange #FF6A00
  est réservé aux accents, traits, états actifs et libellés mono de petite taille
  sur fond clair très spécifiques (variante `--orange-ink` pour le texte).
- Aucun débordement horizontal : `overflow-x: clip` sur `html`/`body`, bandeaux
  animés dans un conteneur masqué, grilles en `minmax(0, 1fr)`.
- Images locales pré-optimisées (WebP/JPEG progressifs, dimensions déclarées),
  scène 3D hors du bundle initial, `gsap`/`three` chargés uniquement côté client.
- La qualité de rendu dépend de l'appareil : aucune promesse de fréquence
  d'images identique partout. Réduire les effets si nécessaire
  (`components/three/SculptureScene.tsx`, `readQuality`).

---

## 10. Tests effectués (et limites)

Vérifié dans cet environnement :

- `npx tsc --noEmit` — 0 erreur.
- `npm run build` — compilation réussie, 15 routes générées (dont 6 études de cas
  prérendues).
- Requêtes HTTP sur toutes les routes : `/`, `/a-propos`, `/services`, `/projets`,
  `/projets/{skillbridge,campusly,blue-inova,apple-confidence,tontine-chain,portfolio-synnova}`,
  `/competences`, `/blog`, `/contact` → 200 ; route inconnue → 404.
- Vérification des liens internes et des `alt` (script de crawl) ; aucun `<img>`
  sans `alternate`.
- Revue de code des nettoyages GSAP / anime.js / Three.js et des chemins de repli.

- `npm run test:sculptures` — 31/31 vérifications (géométrie, shaders, thème).
- Captures réalisées dans Chromium headless (SwiftShader, donc rendu logiciel)
  sur le serveur de développement, en clair et en sombre : héros 1440×900,
  héros 820×1100, héros 390×844, section Méthode 1440×900, mouvement réduit,
  WebGL désactivé (repli), bascule de thème par clic. Les captures servent à
  juger la composition et la lisibilité, pas la fluidité.
- Bascule de thème vérifiée par assertion dans le DOM : un seul `<canvas>`, le
  même élément avant et après, état `live` conservé, thème passé à `dark`.

**Limites honnêtes** :
- Le rendu des captures est logiciel : les fréquences d'images réelles, le
  comportement du GPU mobile et les différences Safari/Firefox n'ont pas été
  mesurés ici. Une passe manuelle sur un iPhone et un Android réels reste
  nécessaire.
- Les captures du navigateur headless montrent parfois les textes de révélation
  à mi-course : c'est la boucle GSAP qui est ralentie par le rendu logiciel, pas
  un défaut du site (vérifié en masquant la scène : les cartes sont alors
  entièrement lisibles).

---

## 11. Déploiement — Vercel uniquement

Le site est publié **uniquement sur Vercel** : <https://kakpo-rosaire.vercel.app/>.
GitHub ne sert plus le site (plus de workflow Pages, plus aucun HTML de site
commité à la racine). Le fichier `.nojekyll` vide est conservé uniquement pour
empêcher GitHub d'afficher le README comme site ; sans `index.html`, la Page
GitHub répond donc 404.

### Comment Vercel construit le site

`vercel.json`, à la racine du dépôt, décrit tout :

```json
{
  "installCommand": "cd krafter && npm ci",
  "buildCommand": "cd krafter && npm run build:export",
  "outputDirectory": "krafter/out",
  "trailingSlash": true
}
```

`npm run build:export` (`krafter/scripts/build-export.mjs`) :

1. masque temporairement `app/api` — un hébergement statique n'a pas de serveur ;
   le formulaire et l'assistant proposent déjà leurs replis `mailto` / moteur local,
2. lance `next build` avec `NEXT_STATIC_EXPORT=1`, **sans basePath**
   (`SITE_BASE_PATH` reste une surcharge pour un hôte en sous-chemin) et avec
   `NEXT_PUBLIC_SITE_URL=https://kakpo-rosaire.vercel.app`,
3. laisse l'export dans `krafter/out/` (ignoré par Git) : c'est le dossier que
   Vercel publie, avec les pages de redirection des anciennes URL,
4. restaure `app/api`.

Conséquence : le domaine racine est la racine du site (`/competences/`,
`/projets/campusly/`, `/contact/`). Les anciennes URL préfixées `/Portfolio/...`
sont redirigées vers `/*` par `vercel.json` ; le build génère en plus, sous
`out/Portfolio/…`, une page de redirection par route (canonical + rafraîchissement
immédiat), donc les liens et partages déjà diffusés continuent de fonctionner
même si l'hôte ignore la configuration de routage.

### Construire et vérifier en local

```bash
cd krafter
npm ci
npm run typecheck        # tsc --noEmit
npm run build:export     # export statique dans krafter/out
cd out && python3 -m http.server 3100 --bind 0.0.0.0
# http://localhost:3100/
```

`npm run dev` lance le serveur Next complet (avec `/api`) sur le port 3000.

### Serveur complet (optionnel)

Sur un hôte Node (VPS, Vercel en mode serveur), `npm run build && npm run start`
active réellement `/api/contact` et `/api/assistant` dès que `RESEND_API_KEY` +
`CONTACT_TO_EMAIL` (ou `CONTACT_WEBHOOK_URL`) et `ASSISTANT_API_URL` sont
définis. Avec l'export statique actuel, le formulaire valide puis bascule sur
`mailto` / copier-coller, et l'assistant répond depuis son moteur local : aucune
IA n'est connectée.

L'ancien site statique (HTML/CSS/JS historiques, galerie photos, certificat,
configurations Apache/Netlify/Jekyll) a été **supprimé** du dépôt : une seule
version existe. Il reste consultable dans l'historique Git
(`git show <commit>:about.html`, ou `git archive <commit>`) et une copie de
sauvegarde est conservée hors du dépôt.

---

## 12. Crédits

Design, développement et contenus : **Rosaire Kakpo — THE KRAFTER**.
Typographies : Instrument Sans, Bodoni Moda, JetBrains Mono (SIL Open Font
License, auto-hébergées via Fontsource).
Bibliothèques : Next.js, React, TypeScript, Tailwind CSS, GSAP (ScrollTrigger,
SplitText, Flip), anime.js v4, Three.js.
