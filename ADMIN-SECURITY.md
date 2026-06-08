# 🔐 Sécurité Dashboard Admin

## Protection Mise en Place

Votre dashboard admin est maintenant protégé par un système d'authentification simple mais efficace :

### Code d'Accès
- **Code PIN actuel :** `RK2024`
- **Localisation :** Défini dans `assets/main.js` et `rosaire_kakpo_v2_premium.html`

### Comment ça Marche
1. Quand quelqu'un clique sur le bouton admin (🔧) ou utilise Ctrl+K → "Dashboard Admin"
2. Une popup demande le code d'accès
3. Si le code est correct → accès accordé
4. Si le code est incorrect → accès refusé
5. L'authentification reste active pendant la session de navigation

### Changer le Code PIN

Pour modifier votre code d'accès, éditez cette ligne dans les fichiers :

**Dans `assets/main.js` :**
```javascript
const ADMIN_PIN = 'RK2024'; // ← Changez ici
```

**Dans `rosaire_kakpo_v2_premium.html` :**
```javascript
const ADMIN_PIN = 'RK2024'; // ← Changez ici aussi
```

### Niveau de Sécurité

✅ **Protection contre :**
- Accès accidentel par les visiteurs
- Curiosité des utilisateurs lambda
- Navigation non autorisée

⚠️ **Limites :**
- Code visible dans le code source (pour plus de sécurité, utiliser un backend)
- Protection côté client uniquement
- Suffisant pour un portfolio personnel

### Recommandations

1. **Changez le code PIN** régulièrement
2. **Utilisez un code complexe** (lettres + chiffres + symboles)
3. **Ne partagez pas** votre code d'accès

### Support

Si vous voulez une sécurité plus avancée (serveur backend, base de données, etc.), contactez votre développeur.

---
*Système implémenté le 8 juin 2026*