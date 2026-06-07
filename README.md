# Portfolio - Rosaire KAKPO

Portfolio professionnel de Rosaire KAKPO, développeur frontend spécialisé en e-commerce et UX design, basé à Cotonou, Bénin.

## À propos

Je suis étudiant en Licence 1 Systèmes Informatiques et Logiciels à l'Institut Universitaire Les Cours Sonou, passionné par le développement web moderne et les technologies frontend.

### Accomplissements
- 8e place au MIABE Hackathon avec "Tontine Chain" (plateforme blockchain)
- 3e place au challenge Innerbuild Season 1
- Participant aux Arduino Days 2026 à Sèmè City Open Park
- Baccalauréat au CPEG "La Rigueur" (2024-2025)

## Technologies

### Frontend
- React.js
- Next.js
- TypeScript
- JavaScript (ES6+)
- HTML5 / CSS3
- Tailwind CSS

### Backend & Database
- Firebase
- Node.js
- REST API

### Design & Tools
- Figma
- Adobe XD
- Git / GitHub
- VS Code

## Fonctionnalités du site

### Animations Premium
Le portfolio intègre 7 animations scroll avancées :

1. **Hero to About** : Photo fixe avec transition fluide vers la section À propos
2. **Vision Writing** : Texte qui s'écrit mot par mot
3. **Projects Zoom** : Effet de zoom du titre avec apparition progressive des cartes
4. **Projects Storytelling** : Chaque projet arrive avec effet blur et zoom
5. **Neural Network** : Réseau de compétences animé sur canvas HTML5
6. **Timeline Drawing** : Ligne verticale qui se dessine avec événements séquentiels
7. **Contact Dashboard** : Effet d'assombrissement avec éléments flottants

### Responsive Design
- Optimisé pour mobile, tablette et desktop
- 3 breakpoints principaux (1100px, 768px, 480px)
- Navigation adaptative
- Formulaires optimisés pour le tactile

### SEO Optimisé
- Meta tags optimisés pour les moteurs de recherche
- Sitemap.xml pour l'indexation
- Robots.txt configuré
- Données structurées JSON-LD
- Open Graph pour les réseaux sociaux
- Compression GZIP et mise en cache

## Structure du projet

```
Portfolio/
├── index.html                      # Page d'accueil
├── about.html                      # À propos
├── projects.html                   # Projets
├── skills.html                     # Compétences
├── experience.html                 # Parcours
├── contact.html                    # Contact
├── robots.txt                      # SEO
├── sitemap.xml                     # SEO
├── .htaccess                       # Configuration serveur
├── responsive-mobile.css           # Styles responsive
├── assets/
│   ├── style.css                   # Styles principaux
│   ├── main.js                     # JavaScript principal
│   ├── scroll-animations.js        # Animations scroll
│   └── scroll-animations.css       # Styles animations
└── images/
    ├── img1.jpeg                   # Photo hero
    ├── img2.jpeg                   # Certificat Innerbuild
    ├── img3.jpeg                   # Finalistes MIABE
    ├── img4.jpeg                   # Portrait
    └── certificate-rosaire-kakpo.pdf
```

## Installation

### Prérequis
- Serveur web (Apache, Nginx, ou serveur local)
- Navigateur moderne (Chrome, Firefox, Safari, Edge)

### Déploiement local

1. Cloner le repository
```bash
git clone https://github.com/kakporosaire953-creator/Portfolio.git
cd Portfolio
```

2. Lancer un serveur local
```bash
# Avec Python
python -m http.server 8000

# Avec Node.js (http-server)
npx http-server

# Avec PHP
php -S localhost:8000
```

3. Ouvrir dans le navigateur
```
http://localhost:8000
```

## Configuration

### Personnalisation des couleurs
Modifier les variables CSS dans `assets/style.css` :
```css
[data-theme="light"]{
  --orange:#A020F0;  /* Couleur principale */
  --bg:#F5F3EF;      /* Fond */
  --text:#0F1623;    /* Texte */
}
```

### Modification des animations
Ajuster les paramètres dans `assets/scroll-animations.js` :
```javascript
const scrollConfig = {
  heroPhotoSticky: 0.4,      // Durée photo fixe
  visionWriteDelay: 150,     // Délai entre mots
  projectZoomDuration: 2000, // Durée zoom projets
  neuralNodeDelay: 400,      // Délai entre nœuds
  timelineItemDelay: 300     // Délai items timeline
};
```

## Performance

### Optimisations implémentées
- Compression GZIP activée
- Mise en cache navigateur
- Images optimisées
- Lazy loading
- Hardware acceleration CSS
- Intersection Observer API

### Scores attendus
- PageSpeed Mobile : 85-95/100
- PageSpeed Desktop : 95-100/100
- Temps de chargement : moins de 3 secondes
- FPS animations : 60fps desktop, 30-60fps mobile

## SEO

### Référencement
Le site est optimisé pour le référencement local :
- Mots-clés : développeur frontend Cotonou, développeur web Bénin, React developer
- Meta descriptions uniques par page
- Balises canonical
- Données structurées Schema.org

### Soumission aux moteurs de recherche
1. Google Search Console : https://search.google.com/search-console
2. Soumettre le sitemap : https://votresite.com/sitemap.xml
3. Vérifier l'indexation

## Contact

- **Email** : kakporosaire953@gmail.com
- **Téléphone** : +229 68 81 20 19
- **LinkedIn** : [rosaire-kakpo-9b31963b6](https://www.linkedin.com/in/rosaire-kakpo-9b31963b6)
- **GitHub** : [kakporosaire953-creator](https://github.com/kakporosaire953-creator)
- **Localisation** : Cotonou, Bénin

## Projets

### Tontine Chain
Plateforme de tontine sécurisée par blockchain pour le Bénin. Développée lors du MIABE Hackathon.
- Technologies : React, Blockchain, Web3
- Résultat : 8e place

### Autres projets
Consultez la page [Projets](projects.html) pour découvrir mes autres réalisations en e-commerce, applications web et design UX.

## Licence

Copyright 2026 Rosaire KAKPO. Tous droits réservés.

## Contributeurs

- **Rosaire KAKPO** - Développeur principal

## Remerciements

- Institut Universitaire Les Cours Sonou
- MIABE Hackathon
- Innerbuild Challenge
- Sèmè City Open Park

---

Développé avec passion à Cotonou, Bénin.
