# User Service

Service de gestion des utilisateurs et d'authentification pour l'application e-commerce.

## 🚀 Fonctionnalités

- ✅ Inscription d'utilisateur
- ✅ Connexion avec JWT
- ✅ Gestion du profil
- ✅ Changement de mot de passe
- ✅ Suppression de compte

## 📋 Prérequis

- Node.js 18+
- PostgreSQL 15+

## 🛠️ Installation
```bash
# Installer les dépendances
npm install

# Copier le fichier .env
cp .env.example .env

# Configurer les variables d'environnement dans .env
```

## 🏃 Démarrage
```bash
# Mode développement
npm run dev

# Mode production
npm start

# Tests
npm test
```

## 📡 Endpoints API

### Publics

#### POST /api/users/register
Inscription d'un nouvel utilisateur

**Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "phone": "+1234567890",
      "role": "user",
      "created_at": "2026-01-04T..."
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### POST /api/users/login
Connexion d'un utilisateur

**Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Protégés (Authentification requise)

**Header requis:**
```
Authorization: Bearer <token>
```

#### GET /api/users/profile
Obtenir le profil de l'utilisateur connecté

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": { ... }
  }
}
```

#### PUT /api/users/profile
Mettre à jour le profil

**Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "+9876543210"
}
```

#### DELETE /api/users/profile
Supprimer le compte

**Response (200):**
```json
{
  "success": true,
  "message": "Account deleted successfully"
}
```

#### POST /api/users/password
Changer le mot de passe

**Body:**
```json
{
  "currentPassword": "OldPassword123",
  "newPassword": "NewPassword456"
}
```

## 🐳 Docker
```bash
# Build l'image
docker build -t user-service:latest .

# Run le conteneur
docker run -p 3001:3001 --env-file .env user-service:latest
```

## 🧪 Tests
```bash
# Lancer les tests
npm test

# Tests en mode watch
npm run test:watch

# Coverage
npm test -- --coverage
```

## 📊 Base de données

### Table `users`

| Colonne | Type | Description |
|---------|------|-------------|
| id | UUID | Clé primaire |
| email | VARCHAR(255) | Email unique |
| password | VARCHAR(255) | Mot de passe hashé |
| first_name | VARCHAR(100) | Prénom |
| last_name | VARCHAR(100) | Nom |
| phone | VARCHAR(20) | Téléphone |
| role | VARCHAR(20) | Rôle (user/admin) |
| created_at | TIMESTAMP | Date de création |
| updated_at | TIMESTAMP | Date de mise à jour |

## 🔒 Sécurité

- ✅ Mots de passe hashés avec bcrypt (10 rounds)
- ✅ JWT pour l'authentification
- ✅ Validation des entrées
- ✅ Helmet.js pour les headers HTTP
- ✅ CORS configuré

## 📝 Variables d'environnement

Voir `.env.example` pour la liste complète des variables.

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'Add some AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request
