# 🎬 GUIDE DE DÉMONSTRATION

## 🚀 Démarrage Rapide

### Prérequis
- Docker Desktop installé et démarré
- Ports 3001, 3002, 3003, 5432, 5433, 27017 disponibles

### Lancer l'application
```bash
# Méthode 1 : Avec le script
./start.sh

# Méthode 2 : Manuellement
docker-compose up --build -d

# Vérifier que tout fonctionne
docker-compose ps
```

### Arrêter l'application
```bash
# Méthode 1 : Avec le script
./stop.sh

# Méthode 2 : Manuellement
docker-compose down -v
```

---

## 🧪 TESTS DES ENDPOINTS

### 1️⃣ User Service - Inscription
```bash
curl -X POST http://localhost:3001/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+33612345678"
  }'
```

**Réponse attendue :**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {...},
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**⚠️ IMPORTANT : Copier le token pour les prochaines requêtes !**

---

### 2️⃣ User Service - Connexion
```bash
curl -X POST http://localhost:3001/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123"
  }'
```

---

### 3️⃣ Product Service - Créer un produit
```bash
curl -X POST http://localhost:3002/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "iPhone 15 Pro",
    "description": "Latest Apple smartphone with A17 chip",
    "price": 1199.99,
    "category": "Electronics",
    "stock": 50,
    "images": ["https://example.com/iphone.jpg"],
    "tags": ["smartphone", "apple", "new"]
  }'
```

**Réponse attendue :**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "product": {
      "_id": "...",
      "name": "iPhone 15 Pro",
      ...
    }
  }
}
```

**⚠️ IMPORTANT : Copier le _id du produit !**

---

### 4️⃣ Product Service - Liste des produits
```bash
curl http://localhost:3002/api/products
```

---

### 5️⃣ Order Service - Créer une commande

**Remplacez :**
- `YOUR_TOKEN` par le token de connexion
- `USER_ID` par l'id de l'utilisateur créé
- `PRODUCT_ID` par l'id du produit créé
```bash
curl -X POST http://localhost:3003/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "userId": "USER_ID",
    "items": [
      {
        "productId": "PRODUCT_ID",
        "quantity": 2
      }
    ],
    "shippingAddress": {
      "street": "123 Rue de la Paix",
      "city": "Paris",
      "zipCode": "75001",
      "country": "France"
    },
    "paymentMethod": "credit_card"
  }'
```

**Réponse attendue :**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "order": {
      "id": "...",
      "total_amount": "2399.98",
      "status": "pending",
      ...
    }
  }
}
```

---

## 📊 Vérification des Logs
```bash
# Tous les logs
docker-compose logs -f

# Logs d'un service spécifique
docker-compose logs -f user-service
docker-compose logs -f product-service
docker-compose logs -f order-service
```

---

## ✅ CHECKLIST DE DÉMO

- [ ] Tous les conteneurs démarrés (6 services)
- [ ] Health checks OK pour les 3 microservices
- [ ] Inscription utilisateur réussie
- [ ] Connexion utilisateur avec token
- [ ] Création de produit réussie
- [ ] Liste des produits affichée
- [ ] Création de commande avec vérification stock
- [ ] Stock du produit mis à jour automatiquement

---

## 🐛 Dépannage

### Problème : Les conteneurs ne démarrent pas
```bash
# Vérifier les logs
docker-compose logs

# Nettoyer tout et recommencer
docker-compose down -v
docker system prune -a
./start.sh
```

### Problème : Port déjà utilisé
```bash
# Trouver le processus qui utilise le port
# Windows
netstat -ano | findstr :3001

# Linux/Mac
lsof -i :3001

# Arrêter le processus ou changer le port dans docker-compose.yml
```

### Problème : Erreur de connexion entre services
```bash
# Vérifier que les services sont dans le même réseau
docker network inspect ecommerce-microservices_ecommerce-network

# Tester la connectivité
docker exec -it order-service ping user-service
```

---

## 📸 SCREENSHOTS À PRENDRE POUR LE RAPPORT

1. `docker-compose ps` montrant tous les services UP
2. Réponse de l'inscription utilisateur (avec token)
3. Réponse de création de produit
4. Réponse de création de commande
5. Logs montrant la communication inter-services

---

**Dernière mise à jour :** 04 Janvier 2026
