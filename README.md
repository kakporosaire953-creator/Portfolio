# THE KRAFTER — Portfolio de Rosaire Kakpo

**Frontend Developer × UI/UX Designer** — Cotonou, Bénin
*Design × Code × Impact* · *Créer • Inspirer • Impacter*

🌐 **Site en ligne :** https://kakporosaire953-creator.github.io/Portfolio/

---

## Ce que contient ce dépôt

| Dossier / fichier | Rôle |
| --- | --- |
| **`krafter/`** | **Le code source du site** (Next.js 15, React 19, TypeScript). Tout se modifie ici. |
| `index.html`, `a-propos/`, `services/`, `projets/`, `competences/`, `blog/`, `contact/`, `404.html` | **Build statique généré** — ne pas éditer à la main. |
| `_next/`, `images/`, `projects/`, `brand/` | Bundles, portraits, visuels de projets, emplacement du logo (générés/copiés au build). |
| `sitemap.xml`, `robots.txt`, `favicon.svg`, `og.jpg` | Fichiers SEO et partage (générés au build). |
| `.github/workflows/deploy.yml` | Republication automatique sur `main`. |

> L'ancien site statique (HTML/CSS/JS à la racine, `about.html`, `projects.html`,
> `experience.html`, `skills.html`, `contact.html`, `assets/`, `responsive-mobile.css`,
> `feed.xml`, `_config.yml`, `.htaccess`, `_headers`, `netlify.toml`, la galerie
> photos et le certificat) **a été supprimé** : il n'existe plus qu'un seul site.
> Une copie de sauvegarde est conservée hors du dépôt et tout reste récupérable
> dans l'historique Git :
>
> ```bash
> git show 4d47169:about.html > about.html          # un fichier
> git archive 4d47169 | tar -x -C /chemin/sauvegarde  # tout l'ancien site
> ```

## Démarrage

```bash
cd krafter
npm install
npm run dev        # http://localhost:3000
```

Build de production (serveur Node ou Vercel) :

```bash
npm run build && npm run start
```

## Publication (GitHub Pages)

La racine du dépôt **est** le site publié. Elle est générée depuis `krafter/` :

```bash
cd krafter
npm run publish:pages   # export statique + copie vers la racine du dépôt
```

Le script (`krafter/scripts/publish-pages.mjs`) masque `app/api` (un hébergement
statique n'a pas de serveur), construit avec `NEXT_PUBLIC_BASE_PATH=/Portfolio`,
copie l'export à la racine et restaure ensuite `app/api`.

Le workflow **« Publish the site (static export) »** exécute exactement la même
chose à chaque push sur `main` touchant `krafter/`, puis commit le résultat :
la racine ne peut pas dériver du code source.

## Ce qui fonctionne / ce qui dépend de vous

- ✅ 8 pages, 3 études de cas (SkillBridge, Campusly, Blue Inova), FR/EN, thème
  clair par défaut + mode sombre, animations GSAP, SVG anime.js v4, scène Three.js
  « KRAFTER / ORBIT », intro « KRAFTER / ASSEMBLY », assistant à réponses
  préprogrammées (aucune IA connectée), formulaire validé avec repli `mailto`.
- 🔸 **Logo officiel** : déposez `the-krafter-logo.svg` (ou `.png`/`.webp`) dans
  `krafter/public/brand/` puis relancez `npm run publish:pages`. En attendant, un
  emplacement « LOGO SLOT » clairement identifié est affiché — aucun logo inventé.
- 🔸 **Envoi réel du formulaire** : sur un hôte Node (Vercel/Netlify/server),
  définir `RESEND_API_KEY` + `CONTACT_TO_EMAIL` (ou `CONTACT_WEBHOOK_URL`).
  Sur GitHub Pages, seul le repli `mailto` / copier-coller est actif.
- 🔸 **Assistant avec un vrai modèle** : `ASSISTANT_API_URL` + `ASSISTANT_API_KEY`.
- 🔸 **Journal (blog)** : état vide assumé, aucun article inventé.

Détails complets (architecture, accessibilité, tests, variables d'environnement) :
**[`krafter/README.md`](krafter/README.md)**.

## Technologies

Next.js 15 (App Router) · React 19 · TypeScript 5.9 · Tailwind CSS 4 ·
GSAP 3 (ScrollTrigger, SplitText, Flip) · anime.js v4 · Three.js · CSS custom
properties · Fontsource (Instrument Sans, Bodoni Moda, JetBrains Mono).

## Contact

- **Email** : kakporosaire953@gmail.com
- **GitHub** : [kakporosaire953-creator](https://github.com/kakporosaire953-creator)
- **LinkedIn** : [Rosaire KAKPO](https://www.linkedin.com/in/rosaire-kakpo-9b31963b6)

## Licence

MIT — Copyright (c) 2026 Rosaire KAKPO.

Développé à Cotonou, Bénin 🇧🇯
