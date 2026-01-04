# Order Service

Service de gestion des commandes pour l'application e-commerce. Ce service communique avec User Service et Product Service.

## 🚀 Fonctionnalités

- ✅ Création de commandes avec vérification utilisateur et stock
- ✅ Consultation de l'historique des commandes
- ✅ Gestion des statuts de commande
- ✅ Annulation de commande avec remise en stock
- ✅ Communication inter-services (User & Product)

## 📋 Prérequis

- Node.js 18+
- PostgreSQL 15+
- User Service en cours d'exécution
- Product Service en cours d'exécution

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

### POST /api/orders
Créer une nouvelle commande

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "userId": "uuid",
  "items": [
    {
      "productId": "product-id",
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "Paris",
    "zipCode": "75001",
    "country": "France"
  },
  "paymentMethod": "credit_card"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "order": {
      "id": "uuid",
      "user_id": "uuid",
      "items": [...],
      "total_amount": "199.98",
      "status": "pending",
      "shipping_address": {...},
      "payment_method": "credit_card",
      "created_at": "2026-01-04T...",
      "updated_at": "2026-01-04T..."
    }
  }
}
```

### GET /api/orders/user/:userId
Obtenir toutes les commandes d'un utilisateur

**Query params:**
- `page` (default: 1)
- `limit` (default: 20)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "orders": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 5,
      "pages": 1
    }
  }
}
```

### GET /api/orders/:id
Obtenir une commande par ID

**Response (200):**
```json
{
  "success": true,
  "data": {
    "order": {...}
  }
}
```

### PUT /api/orders/:id/status
Mettre à jour le statut d'une commande (Admin)

**Body:**
```json
{
  "status": "confirmed"
}
```

**Statuts possibles:**
- `pending` : En attente
- `confirmed` : Confirmée
- `shipped` : Expédiée
- `delivered` : Livrée
- `cancelled` : Annulée

**Response (200):**
```json
{
  "success": true,
  "message": "Order status updated successfully",
  "data": {
    "order": {...}
  }
}
```

### DELETE /api/orders/:id
Annuler une commande

**Note:** Seules les commandes avec statut `pending` ou `confirmed` peuvent être annulées.

**Response (200):**
```json
{
  "success": true,
  "message": "Order cancelled successfully",
  "data": {
    "order": {...}
  }
}
```

## 🔄 Communication Inter-Services

### Avec User Service
- **Endpoint:** `GET /api/users/:id`
- **But:** Vérifier que l'utilisateur existe

### Avec Product Service
- **Endpoint:** `GET /api/products/:id`
- **But:** Vérifier le produit et son stock
- **Endpoint:** `PATCH /api/products/:id/stock`
- **But:** Mettre à jour le stock après commande

## 📊 Base de données (PostgreSQL)

### Table `orders`

| Colonne | Type | Description |
|---------|------|-------------|
| id | UUID | Clé primaire |
| user_id | UUID | Référence utilisateur |
| items | JSONB | Liste des produits |
| total_amount | DECIMAL(10,2) | Montant total |
| status | VARCHAR(50) | Statut de la commande |
| shipping_address | JSONB | Adresse de livraison |
| payment_method | VARCHAR(50) | Méthode de paiement |
| created_at | TIMESTAMP | Date de création |
| updated_at | TIMESTAMP | Date de mise à jour |

### Structure des items (JSONB)
```json
[
  {
    "productId": "string",
    "productName": "string",
    "quantity": 2,
    "price": 99.99
  }
]
```

## 🐳 Docker
```bash
# Build l'image
docker build -t order-service:latest .

# Run le conteneur
docker run -p 3003:3003 --env-file .env order-service:latest
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

## 🔒 Sécurité

- ✅ Validation des entrées
- ✅ Vérification des utilisateurs via JWT
- ✅ Vérification du stock avant commande
- ✅ Helmet.js pour les headers HTTP
- ✅ CORS configuré

## ⚠️ Gestion des Erreurs

Le service gère les erreurs suivantes:
- Utilisateur non trouvé
- Produit non trouvé
- Stock insuffisant
- Statut de commande invalide
- Commande non annulable

## 📝 Variables d'environnement
```env
NODE_ENV=development
PORT=3003
DB_HOST=localhost
DB_PORT=5432
DB_NAME=orders_db
DB_USER=orderservice
DB_PASSWORD=orderpass123
USER_SERVICE_URL=http://localhost:3001
PRODUCT_SERVICE_URL=http://localhost:3002
CORS_ORIGIN=http://localhost:3000
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'Add some AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request
