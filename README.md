# Authentification Simple - Monorepo

Système d'authentification complet avec API RESTful (Express.js + MySQL) et application mobile NativeScript.



### equipe : 
mohammed ATMANE (backend/api)
ahmed courki bouzdia(documentation + frontend) 
fahd Mamou (frontend ) 

```

## Structure du Projet

```
authentification_simple/
├── api/                    # API REST Express.js
│   ├── config/            # Configuration de la base de données
│   ├── database/          # Schéma SQL et données de test
│   ├── middleware/        # Authentification et gestion d'erreurs
│   ├── routes/            # Routes API
│   ├── tests/             # Suite de tests
│   └── server.js          # Point d'entrée de l'API
├── mobile/                # Application mobile NativeScript
│   ├── app/
│   │   ├── config/        # Configuration API
│   │   ├── services/      # Services API et stockage
│   │   └── views/         # Écrans de l'application
│   └── App_Resources/     # Ressources natives
└── README.md              # Ce fichier
```

## Démarrage Rapide

### Prérequis

- Node.js (v14 ou supérieur)
- MySQL (v5.7 ou supérieur)
- NativeScript CLI (pour l'application mobile)
- npm ou yarn

### 1. Configuration de la Base de Données

Créer la base de données MySQL :
```sql
CREATE DATABASE auth_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Configuration de l'API

```bash
cd api
npm install
cp .env.example .env
# Éditer .env avec vos identifiants de base de données
npm start
```

L'API sera accessible sur `http://localhost:3000`

Voir [api/README.md](api/README.md) pour la documentation détaillée de l'API.

### 3. Configuration de l'Application Mobile

```bash
cd mobile
npm install
# Éditer app/config/api.config.js avec l'URL de votre API
npm run android  # ou npm run ios
```

Voir [mobile/README.md](mobile/README.md) pour la documentation détaillée de l'application mobile.

## Endpoints API

- `POST /auth/register` - Inscrire un nouvel utilisateur
- `POST /auth/login` - Connecter un utilisateur
- `POST /auth/logout` - Déconnecter un utilisateur
- `GET /users/me` - Obtenir le profil utilisateur (nécessite authentification)
- `PUT /users/me` - Mettre à jour le profil (optionnel)
- `PATCH /users/password` - Changer le mot de passe (optionnel)

## Fonctionnalités

### API
- Authentification basée sur JWT
- Hashage des mots de passe avec bcrypt
- Validation des entrées
- Middleware de gestion d'erreurs
- Support CORS
- Suite de tests incluse

### Application Mobile
- Inscription d'utilisateur
- Connexion d'utilisateur
- Affichage du profil
- Stockage sécurisé des tokens
- Gestion des erreurs
- États de chargement

## Tests

### Tests API
```bash
cd api
npm test
```

### Collection Postman
Importer `api/postman_collection.json` dans Postman pour tester tous les endpoints.

## Sécurité

- Mots de passe hashés avec bcrypt (10 rounds)
- Tokens JWT expirent après 24 heures
- Validation des entrées sur tous les endpoints
- Protection contre l'injection SQL
- CORS configuré pour l'application mobile

## Documentation

- [Documentation API](api/README.md)
- [Documentation Application Mobile](mobile/README.md)
- [Collection Postman](api/postman_collection.json)

## Stack Technique

**API:**
- Express.js
- MySQL
- JWT (jsonwebtoken)
- bcrypt
- express-validator
- Jest (tests)

**Mobile:**
- NativeScript
- JavaScript/XML

## Architecture

### Flux d'Authentification

1. L'utilisateur s'inscrit/se connecte via l'application mobile
2. L'API valide les identifiants et retourne un token JWT
3. L'application mobile stocke le token de manière sécurisée
4. Les requêtes suivantes incluent le token dans l'en-tête Authorization
5. L'API valide le token et retourne les ressources protégées

### Schéma de Base de Données

```sql
users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

## Variables d'Environnement

Voir `api/.env.example` pour les variables d'environnement requises :
- Connexion à la base de données (host, port, user, password, nom de la base)
- Clé secrète JWT
- Origine CORS
- Port du serveur

## Dépôt Git

Ceci est un monorepo contenant à la fois l'API et l'application mobile.

Pour pousser vers GitHub :
```bash
git init
git add .
git commit -m "Commit initial: API d'authentification et Application Mobile"
git remote add origin <votre-url-repo>
git push -u origin main
```

Taguer la version 1.0 :
```bash
git tag v1.0
git push origin v1.0
```

## Limitations et Améliorations Futures

- Pas de mécanisme de rafraîchissement de token
- Pas de limitation de débit
- Pas de vérification d'email
- Pas de réinitialisation de mot de passe
- Déconnexion côté client uniquement (pas de blacklist de tokens)
- Pourrait ajouter un contrôle d'accès basé sur les rôles
- Pourrait implémenter des refresh tokens pour une meilleure UX

## Installation Détaillée

### API

1. Naviguer vers le dossier API :
   ```bash
   cd api
   ```

2. Installer les dépendances :
   ```bash
   npm install
   ```

3. Créer le fichier `.env` :
   ```bash
   cp .env.example .env
   ```

4. Configurer `.env` avec vos identifiants :
   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=votre_mot_de_passe
   DB_NAME=auth_db
   JWT_SECRET=votre_clé_secrète_jwt
   ```

5. Créer la base de données MySQL :
   ```sql
   CREATE DATABASE auth_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

6. Démarrer le serveur :
   ```bash
   npm start
   # ou en mode développement
   npm run dev
   ```

### Application Mobile

1. Installer NativeScript CLI globalement :
   ```bash
   npm install -g nativescript
   ```

2. Naviguer vers le dossier mobile :
   ```bash
   cd mobile
   ```

3. Installer les dépendances :
   ```bash
   npm install
   ```

4. Configurer l'URL de l'API dans `app/config/api.config.js` :
   - Émulateur Android : `http://10.0.2.2:3000`
   - Simulateur iOS : `http://localhost:3000`
   - Appareil physique : `http://VOTRE_IP:3000`

5. Lancer l'application :
   ```bash
   npm run android  # Pour Android
   npm run ios      # Pour iOS (macOS uniquement)
   ```

## Utilisation

### Inscription

1. Ouvrir l'application mobile
2. Cliquer sur "S'inscrire"
3. Remplir le formulaire (nom, email, mot de passe)
4. Cliquer sur "S'inscrire"

### Connexion

1. Ouvrir l'application mobile
2. Entrer email et mot de passe
3. Cliquer sur "Se connecter"

### Profil

1. Après connexion, le profil s'affiche automatiquement
2. Affiche le nom complet et l'email
3. Cliquer sur "Déconnexion" pour se déconnecter

## Dépannage

### Problèmes de Connexion API

- Vérifier que MySQL est en cours d'exécution
- Vérifier les identifiants dans `.env`
- Vérifier que la base de données existe
- Vérifier les logs du serveur pour les erreurs

### Problèmes Application Mobile

- Vérifier que l'API est en cours d'exécution
- Vérifier l'URL dans `api.config.js`
- Vérifier que l'émulateur/appareil est connecté
- Vérifier les logs avec `ns log android` ou `ns log ios`

### Erreurs CORS

- Vérifier que `CORS_ORIGIN` dans `.env` correspond à l'origine de l'application mobile
- Pour l'émulateur Android, utiliser `http://10.0.2.2:3000` dans la config mobile

## Licence

ISC
