# THE KRAFTER — brand assets

## Logo complet (obligatoire)

Le logo officiel complet n'est **pas** inclus dans ce dépôt. Le composant
`components/brand/BrandLogo.tsx` cherche le fichier dans cet ordre :

1. `/public/brand/the-krafter-logo.svg`
2. `/public/brand/the-krafter-logo.png`
3. `/public/brand/the-krafter-logo.webp`

Déposez simplement le fichier officiel sous l'un de ces noms : il s'affichera
tel quel dans le header, la section « histoire » et le footer, sans être
redessiné, recadré ou recoloré.

Tant que le fichier est absent, un **emplacement clairement identifié**
(« LOGO SLOT ») est affiché — aucun logo artificiel n'est généré.

## Conseils de fichier

- SVG de préférence (net sur tous les écrans, poids faible)
- fond transparent, marges internes minimales
- hauteur d'affichage : 40 px (header), 64–104 px (footer / intro)
- conserver les couleurs d'origine : bleu marine, orange, jaune, bleu

## Favicon

`/public/favicon.svg` est un signet typographique neutre (lettre K), pas une
reconstruction du logo. Remplacez-le par l'icône officielle si elle existe.
