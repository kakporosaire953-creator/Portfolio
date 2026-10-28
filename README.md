# THE KRAFTER — Portfolio de Rosaire Kakpo

**Frontend Developer × UI/UX Designer** — Cotonou, Bénin
*Design × Code × Impact* · *Créer • Inspirer • Impacter*

🌐 **Site en ligne :** https://kakpo-rosaire.vercel.app/

---

## Ce que contient ce dépôt

| Dossier / fichier | Rôle |
| --- | --- |
| **`krafter/`** | **Le code source du site** (Next.js 15, React 19, TypeScript). Tout se modifie ici. |
| `vercel.json` | Configuration du déploiement Vercel : installation, build, dossier publié, en-têtes et redirections des anciennes URL `/Portfolio/...`. |
| `krafter/out/` | Export statique généré (`npm run build:export`). **Jamais commité** : Vercel le construit à chaque déploiement. |

Aucun artefact de build n'est versionné : le dépôt ne contient que des sources.

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
npm ci
npm run dev        # http://localhost:3000
```

Build de production (serveur Node) : `npm run build && npm run start`.
Export statique (ce que Vercel publie) : `npm run build:export`.

## Publication (Vercel uniquement)

Le site n'est publié que sur **Vercel**, à la racine du domaine :

```text
https://kakpo-rosaire.vercel.app/
```

`vercel.json` fait tout, sans étape manuelle et sans artefact commité :

```json
{
  "installCommand": "cd krafter && npm ci",
  "buildCommand": "cd krafter && npm run build:export",
  "outputDirectory": "krafter/out",
  "trailingSlash": true,
  "redirects": [
    { "source": "/Portfolio", "destination": "/", "permanent": true },
    { "source": "/Portfolio/:path*", "destination": "/:path*", "permanent": true }
  ]
}
```

Le script `krafter/scripts/build-export.mjs` masque `app/api` pendant le build
(un hébergement statique n'a pas de serveur), construit sans basePath et laisse
l'export dans `krafter/out/`. GitHub Pages n'est plus utilisé : plus de workflow,
plus aucun HTML de site à la racine du dépôt.

Les anciennes adresses `…vercel.app/Portfolio/…` restent valides : `vercel.json`
redirige le préfixe `/Portfolio` vers la racine, et le build génère en plus de
petites pages de redirection sous `out/Portfolio/…` (une par route), pour que
les liens et partages déjà diffusés fonctionnent même si l'hôte ignore la
configuration de routage.

Le fichier `.nojekyll` (vide) reste présent volontairement : sans lui, GitHub
Pages afficherait le contenu de ce README comme s'il était le site. Avec lui,
GitHub n'a plus rien à publier à la racine (aucun `index.html`) et la Page
GitHub répond 404. Sa désactivation complète se fait en un clic dans
**Settings → Pages** du dépôt.

## Ce qui fonctionne / ce qui dépend de vous

- ✅ 8 pages, 3 études de cas (SkillBridge, Campusly, Blue Inova), FR/EN, thème
  clair par défaut + mode sombre, animations GSAP, SVG anime.js v4, scène Three.js
  « KRAFTER / ORBIT », ouverture « portrait découpé » avec le logo officiel, assistant à réponses
  préprogrammées (aucune IA connectée), formulaire validé avec repli `mailto`.
- ✅ **Logo officiel** : `krafter/public/brand/` contient le lockup complet, le
  wordmark et le monogramme fournis par Rosaire Kakpo, affichés tels quels.
- 🔸 **Envoi réel du formulaire** : sur un hôte Node (serveur Next), définir
  `RESEND_API_KEY` + `CONTACT_TO_EMAIL` (ou `CONTACT_WEBHOOK_URL`). En export
  statique sur Vercel, seul le repli `mailto` / copier-coller est actif.
- 🔸 **Assistant avec un vrai modèle** : `ASSISTANT_API_URL` + `ASSISTANT_API_KEY`
  (nécessite un hôte Node, pas l'export statique).
- 🔸 **Journal (blog)** : état vide assumé, aucun article inventé.

Détails complets (architecture, accessibilité, tests, variables d'environnement) :
**[`krafter/README.md`](krafter/README.md)**.
