# Product Service

Service de gestion du catalogue de produits pour l'application e-commerce.

## 🚀 Fonctionnalités

- ✅ CRUD complet sur les produits
- ✅ Recherche de produits (texte intégral)
- ✅ Filtrage par catégorie
- ✅ Pagination
- ✅ Gestion du stock
- ✅ Support d'images multiples

## 📋 Prérequis

- Node.js 18+
- MongoDB 7+

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

### GET /api/products
Obtenir tous les produits avec pagination

**Query params:**
- `page` (default: 1)
- `limit` (default: 20)
- `category` (optionnel)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "products": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "pages": 3
    }
  }
}
```

### GET /api/products/search?q=keyword
Rechercher des produits

**Query params:**
- `q` (query string)
- `page` (default: 1)
- `limit` (default: 20)

### GET /api/products/:id
Obtenir un produit par ID

**Response (200):**
```json
{
  "success": true,
  "data": {
    "product": {
      "_id": "...",
      "name": "Product Name",
      "description": "Description",
      "price": 99.99,
      "category": "Electronics",
      "stock": 100,
      "images": ["url1", "url2"],
      "tags": ["tag1", "tag2"],
      "isActive": true,
      "isAvailable": true,
      "createdAt": "2026-01-04T...",
      "updatedAt": "2026-01-04T..."
    }
  }
}
```

### POST /api/products
Créer un nouveau produit (Admin)

**Body:**
```json
{
  "name": "Product Name",
  "description": "Product description",
  "price": 99.99,
  "category": "Electronics",
  "stock": 100,
  "images": ["https://example.com/image1.jpg"],
  "tags": ["new", "featured"]
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "product": { ... }
  }
}
```

### PUT /api/products/:id
Mettre à jour un produit (Admin)

**Body:** (tous les champs sont optionnels)
```json
{
  "name": "Updated Name",
  "price": 89.99,
  "stock": 150
}
```

### DELETE /api/products/:id
Supprimer un produit (Admin)

**Response (200):**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

### PATCH /api/products/:id/stock
Mettre à jour le stock

**Body:**
```json
{
  "quantity": -5
}
```

**Note:** Utilisez un nombre négatif pour déduire du stock, positif pour ajouter.

## 📊 Modèle de Données (MongoDB)

### Collection `products`
```javascript
{
  _id: ObjectId,
  name: String (required, max 200 chars),
  description: String (required, max 2000 chars),
  price: Number (required, >= 0),
  category: String (enum: Electronics, Clothing, Books, Home, Sports, Food, Other),
  stock: Number (required, >= 0),
  images: [String] (array of URLs),
  tags: [String],
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Catégories disponibles
- Electronics
- Clothing
- Books
- Home
- Sports
- Food
- Other

## 🐳 Docker
```bash
# Build l'image
docker build -t product-service:latest .

# Run le conteneur
docker run -p 3002:3002 --env-file .env product-service:latest
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

## 🔍 Recherche

La recherche utilise les index textuels de MongoDB sur les champs:
- `name`
- `description`
- `tags`

Exemple:
```
GET /api/products/search?q=smartphone
```

## 📝 Variables d'environnement

Voir `.env.example` pour la liste complète des variables.

## 🔒 Sécurité

- ✅ Validation des entrées avec express-validator
- ✅ Helmet.js pour les headers HTTP
- ✅ CORS configuré
- ✅ Validation des URLs d'images

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'Add some AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request
