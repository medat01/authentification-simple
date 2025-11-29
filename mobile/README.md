# Application Mobile d'Authentification

Application mobile NativeScript pour l'authentification des utilisateurs.

## Fonctionnalités

- Inscription d'utilisateur
- Connexion d'utilisateur
- Affichage du profil utilisateur
- Stockage sécurisé des tokens
- Gestion des erreurs et états de chargement
- Validation des formulaires

## Prérequis

- Node.js (v14 ou supérieur)
- NativeScript CLI
- Android Studio (pour le développement Android)
- Xcode (pour le développement iOS, macOS uniquement)

## Installation

1. Installer NativeScript CLI globalement :
```bash
npm install -g nativescript
```

2. Aller dans le dossier mobile :
```bash
cd mobile
```

3. Installer les dépendances :
```bash
npm install
```

4. Configurer l'URL de l'API dans `app/config/api.config.js` :
```javascript
BASE_URL: 'http://votre-url-api:3000'
```

**Important** : Pour différents environnements :
- Émulateur Android : Utilisez `http://10.0.2.2:3000`
- Simulateur iOS : Utilisez `http://localhost:3000`
- Appareil physique : Utilisez l'adresse IP de votre ordinateur (ex: `http://192.168.1.100:3000`)

## Lancer l'application

### Android
```bash
npm run android
```

### iOS (macOS uniquement)
```bash
npm run ios
```

### Preview (sans build)
```bash
npm run preview
```

## Structure du projet

```
mobile/
├── app/
│   ├── config/
│   │   └── api.config.js          # Configuration API
│   ├── services/
│   │   ├── api.service.js         # Service API pour les requêtes HTTP
│   │   └── storage.service.js     # Service de stockage des tokens
│   ├── views/
│   │   ├── login/
│   │   │   ├── login-page.xml     # Interface de connexion
│   │   │   └── login-page.js      # Logique de connexion
│   │   ├── register/
│   │   │   ├── register-page.xml  # Interface d'inscription
│   │   │   └── register-page.js   # Logique d'inscription
│   │   └── profile/
│   │       ├── profile-page.xml   # Interface de profil
│   │       └── profile-page.js    # Logique de profil
│   ├── app.js                     # Point d'entrée de l'application
│   ├── app-root.xml               # Navigation racine
│   └── app.css                    # Styles globaux
└── App_Resources/                 # Ressources natives
```

## Écrans

### Écran de Connexion
- Champ email
- Champ mot de passe
- Bouton de connexion
- Navigation vers l'inscription

### Écran d'Inscription
- Champ nom complet
- Champ email
- Champ mot de passe
- Champ confirmation du mot de passe
- Bouton d'inscription
- Retour à la connexion

### Écran de Profil
- Affichage du nom complet
- Affichage de l'email
- Bouton de déconnexion

## Intégration API

L'application utilise des tokens JWT pour l'authentification :
- Le token est stocké de manière sécurisée avec ApplicationSettings
- Le token est envoyé dans l'en-tête Authorization : `Bearer <token>`
- Le token est supprimé lors de la déconnexion

## Gestion des erreurs

- Les erreurs réseau sont affichées à l'utilisateur
- Les identifiants invalides affichent des messages d'erreur
- L'expiration du token redirige vers la connexion
- Indicateurs de chargement pendant les appels API

## Configuration

Mettez à jour `app/config/api.config.js` pour changer l'URL de base de l'API :
```javascript
export const API_CONFIG = {
  BASE_URL: 'http://votre-url-api:3000',
  // ...
};
```

## Build pour la production

### Android
```bash
ns build android --release
```

### iOS
```bash
ns build ios --release
```

## Dépannage

1. **Connexion refusée** : Vérifiez que le serveur API est en cours d'exécution et que l'URL dans `api.config.js` est correcte
2. **Erreurs CORS** : Assurez-vous que CORS_ORIGIN de l'API est configuré correctement
3. **Token ne fonctionne pas** : Vérifiez que JWT_SECRET correspond entre l'API et assurez-vous que le token est envoyé correctement

