# CAHIER DES CHARGES
## Application E-Commerce Microservices

**Projet Annuel - Master DevOps & Cloud - 3ème Promotion**

---

## 📋 INFORMATIONS GÉNÉRALES

| Élément | Détail |
|---------|---------|
| **Nom du projet** | E-Commerce Microservices Platform |
| **Équipe** | [Votre Nom] & [Nom Binôme] |
| **Date de livraison** | 08 Janvier 2026 |
| **Version** | 1.0 |
| **Enseignant** | Soufiene Benmahmoud |

---

## 1. CONTEXTE ET OBJECTIFS

### 1.1 Contexte Métier

Une entreprise de services numériques (ESN) exploite actuellement une application e-commerce monolithique qui présente plusieurs limitations :

- **Problèmes de scalabilité** : Impossibilité de scaler les composants indépendamment
- **Maintenance complexe** : Tout changement nécessite un redéploiement complet
- **Time-to-market élevé** : Difficultés à livrer rapidement de nouvelles fonctionnalités
- **Risques de disponibilité** : Une panne affecte l'ensemble de l'application

### 1.2 Objectifs du Projet

**Objectifs Techniques :**
1. Transformer l'architecture monolithique en microservices
2. Automatiser complètement le cycle de déploiement (CI/CD)
3. Assurer une disponibilité de 99.9% (SLA)
4. Permettre le scaling horizontal automatique
5. Implémenter une observabilité complète (monitoring + logs)

**Objectifs Business :**
1. Réduire le time-to-market de 60%
2. Diminuer les coûts d'infrastructure de 30%
3. Améliorer l'expérience utilisateur (temps de réponse < 200ms)
4. Faciliter l'ajout de nouvelles fonctionnalités

### 1.3 Contraintes

**Contraintes Techniques :**
- Budget limité : Solutions open-source privilégiées
- Délai : 6 jours pour le MVP
- Sécurité : Authentification JWT, HTTPS, gestion des secrets

**Contraintes Non-Fonctionnelles :**
- Support de 1000 utilisateurs simultanés
- Temps de réponse API < 200ms (95e percentile)
- Disponibilité 99.9% (8h de downtime max/an)

---

## 2. PÉRIMÈTRE FONCTIONNEL

### 2.1 Architecture Microservices
```
┌────────────────────────────────────────────────────┐
│              UTILISATEURS (Web/Mobile)              │
└─────────────────────┬──────────────────────────────┘
                      │ HTTPS
                      ▼
┌────────────────────────────────────────────────────┐
│           NGINX Ingress Controller                 │
│              (Load Balancer + TLS)                 │
└──────┬─────────────┬──────────────┬────────────────┘
       │             │              │
       │ /api/users  │ /api/products│ /api/orders
       ▼             ▼              ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│    USER     │ │   PRODUCT   │ │    ORDER    │
│   SERVICE   │ │   SERVICE   │ │   SERVICE   │
│  Node.js    │ │  Node.js    │ │  Node.js    │
│  Port 3001  │ │  Port 3002  │ │  Port 3003  │
└──────┬──────┘ └──────┬──────┘ └──────┬──────┘
       │               │               │
       ▼               ▼               ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ PostgreSQL  │ │  MongoDB    │ │ PostgreSQL  │
│  users_db   │ │ products_db │ │  orders_db  │
└─────────────┘ └─────────────┘ └─────────────┘
```

### 2.2 Microservice USER (Gestion Utilisateurs)

**Responsabilité :** Authentification et gestion des utilisateurs

**Fonctionnalités :**
- ✅ Inscription (Register)
- ✅ Connexion (Login) avec JWT
- ✅ Consultation du profil
- ✅ Modification du profil
- ✅ Changement de mot de passe

**Endpoints API :**
```
POST   /api/users/register      # Créer un compte
POST   /api/users/login         # Se connecter
GET    /api/users/:id           # Obtenir profil
PUT    /api/users/:id           # Modifier profil
DELETE /api/users/:id           # Supprimer compte
POST   /api/users/password      # Changer mot de passe
```

**Modèle de données (PostgreSQL) :**
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,  -- Hashé avec bcrypt
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'user', -- 'user' ou 'admin'
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

**Règles métier :**
- Email unique et valide
- Mot de passe : min 8 caractères, 1 majuscule, 1 chiffre
- Hash bcrypt avec 10 rounds
- Token JWT valide 24h

---

### 2.3 Microservice PRODUCT (Catalogue Produits)

**Responsabilité :** Gestion du catalogue de produits

**Fonctionnalités :**
- ✅ Lister tous les produits (pagination)
- ✅ Rechercher des produits
- ✅ Détails d'un produit
- ✅ CRUD produits (admin uniquement)
- ✅ Gestion du stock

**Endpoints API :**
```
GET    /api/products              # Liste (pagination)
GET    /api/products/:id          # Détails
POST   /api/products              # Créer (admin)
PUT    /api/products/:id          # Modifier (admin)
DELETE /api/products/:id          # Supprimer (admin)
GET    /api/products/search?q=    # Rechercher
PATCH  /api/products/:id/stock    # Mettre à jour stock
```

**Modèle de données (MongoDB) :**
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,        // 2 décimales
  category: String,
  stock: Number,        // >= 0
  images: [String],     // URLs
  tags: [String],
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

### 2.4 Microservice ORDER (Gestion Commandes)

**Responsabilité :** Création et suivi des commandes

**Fonctionnalités :**
- ✅ Créer une commande
- ✅ Liste des commandes (utilisateur)
- ✅ Détails d'une commande
- ✅ Changer le statut (admin)
- ✅ Annuler une commande

**Endpoints API :**
```
POST   /api/orders               # Créer commande
GET    /api/orders               # Liste mes commandes
GET    /api/orders/:id           # Détails commande
PUT    /api/orders/:id/status    # Changer statut (admin)
DELETE /api/orders/:id           # Annuler
```

**Modèle de données (PostgreSQL) :**
```sql
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    items JSONB NOT NULL,  -- [{productId, name, quantity, price}]
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    shipping_address JSONB,
    payment_method VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

**Statuts de commande :**
```
pending → confirmed → shipped → delivered
         ↓
      cancelled
```

---

## 3. ARCHITECTURE TECHNIQUE

### 3.1 Stack Technologique

| Composant | Technologie | Version | Justification |
|-----------|-------------|---------|---------------|
| **Backend** | Node.js + Express | 18 LTS | Performance, écosystème npm riche |
| **Base de données** | PostgreSQL | 15 | Fiabilité, ACID, requêtes complexes |
| **Base de données** | MongoDB | 7 | Flexibilité pour catalogue produits |
| **Auth** | JWT | jsonwebtoken | Stateless, scalable |
| **Conteneurs** | Docker | 24+ | Standard industrie |
| **Orchestration** | Kubernetes | 1.28+ | Auto-scaling, self-healing |
| **CI/CD** | GitLab CI | Latest | Intégration native, registry inclus |
| **IaC** | Terraform | 1.6+ | Provisioning cloud |
| **Config Management** | Ansible | 2.15+ | Configuration automatisée |
| **Monitoring** | Prometheus | 2.45+ | Métriques time-series |
| **Visualisation** | Grafana | 10+ | Dashboards riches |
| **Logs** | ELK Stack | 8.11+ | Centralisation logs |
| **API Gateway** | NGINX Ingress | Latest | Reverse proxy, TLS |

### 3.2 Communication Inter-Services

**Synchrone (REST API) :**
- Order Service → User Service : Vérifier l'utilisateur existe
- Order Service → Product Service : Vérifier stock disponible

**Asynchrone (optionnel - RabbitMQ) :**
- Événements : `OrderCreated`, `StockUpdated`

---

## 4. INFRASTRUCTURE

### 4.1 Environnements

| Environnement | Infrastructure | Réplicas | Base de données |
|---------------|----------------|----------|-----------------|
| **Development** | Docker Compose | 1 | Locale (conteneurs) |
| **Staging** | Kubernetes | 1-2 | Cloud |
| **Production** | Kubernetes | 3+ | Cloud (haute dispo) |

### 4.2 Architecture Kubernetes
```
NAMESPACE: production
├── Deployments
│   ├── user-service (3 replicas)
│   ├── product-service (3 replicas)
│   └── order-service (3 replicas)
├── Services (ClusterIP)
│   ├── user-service:3001
│   ├── product-service:3002
│   └── order-service:3003
├── Ingress (NGINX)
│   └── ecommerce.example.com
└── PersistentVolumeClaims
    ├── postgres-user-pvc
    ├── mongodb-product-pvc
    └── postgres-order-pvc
```

---

## 5. SÉCURITÉ

### 5.1 Authentification et Autorisation

- **JWT Token** : Durée 24h, algorithme HS256
- **Secrets Management** : Kubernetes Secrets
- **HTTPS/TLS** : Certificats Let's Encrypt
- **RBAC Kubernetes** : Accès restreints par namespace

### 5.2 Bonnes Pratiques

✅ Hash des mots de passe (bcrypt)
✅ Variables d'environnement pour secrets
✅ Scan de vulnérabilités (npm audit, Trivy)
✅ Rate limiting sur API
✅ CORS configuré
✅ Validation des inputs
✅ Logs d'audit

---

## 6. CI/CD

### 6.1 Pipeline GitLab CI
```
BUILD → TEST → SECURITY → DOCKERIZE → DEPLOY STAGING → DEPLOY PROD
```

**Stages détaillés :**
1. **Build** : npm install, compilation
2. **Test** : Tests unitaires (Jest), couverture > 80%
3. **Security** : npm audit, scan Docker (Trivy)
4. **Dockerize** : Build image, push vers registry
5. **Deploy Staging** : Déploiement K8s staging
6. **Deploy Production** : Déploiement K8s prod (manuel)

---

## 7. MONITORING & LOGS

### 7.1 Métriques (Prometheus)

- **Application** : Requêtes/sec, latence, erreurs
- **Infrastructure** : CPU, RAM, disk, network
- **Base de données** : Connexions, queries/sec

### 7.2 Dashboards Grafana

- Vue d'ensemble système
- Performance par microservice
- Santé des bases de données
- Alertes critiques

### 7.3 Logs Centralisés (ELK)

- Collecte : Filebeat/Fluentd
- Traitement : Logstash
- Stockage : Elasticsearch
- Visualisation : Kibana

---

## 8. TESTS

### 8.1 Tests Unitaires
- Framework : Jest
- Couverture minimale : 80%
- Exécution : Dans pipeline CI

### 8.2 Tests d'Intégration
- Tests API avec Supertest
- Tests des interactions entre services

### 8.3 Tests de Charge
- Outil : k6 ou Apache Bench
- Objectif : 1000 utilisateurs simultanés
- Temps de réponse : < 200ms (p95)

---

## 9. BACKLOG AGILE

### Sprint 1 : Infrastructure & User Service (J1-J2)
- ✅ Setup Git, GitLab, Jira
- ✅ Documentation (cahier des charges)
- ✅ Développement User Service
- ✅ Conteneurisation Docker

### Sprint 2 : Product & Order Services (J3-J4)
- ✅ Développement Product Service
- ✅ Développement Order Service
- ✅ Communication inter-services
- ✅ Tests unitaires et intégration

### Sprint 3 : Infrastructure & CI/CD (J5)
- ✅ Terraform : Provisioning
- ✅ Kubernetes : Déploiement
- ✅ Pipeline GitLab CI/CD
- ✅ Configuration Ansible

### Sprint 4 : Monitoring & Finalisation (J6)
- ✅ Prometheus + Grafana
- ✅ ELK Stack
- ✅ Tests de charge
- ✅ Documentation finale
- ✅ Répétition démo

---

## 10. LIVRABLES

| # | Livrable | Format | Statut |
|---|----------|--------|--------|
| 1 | Cahier des charges | PDF | ✅ |
| 2 | Backlog Agile (Jira) | Capture + Export | 📝 |
| 3 | Code source (GitLab) | Repository | 📝 |
| 4 | Dockerfiles + docker-compose | YAML | 📝 |
| 5 | Scripts Terraform | .tf | 📝 |
| 6 | Playbooks Ansible | .yml | 📝 |
| 7 | Manifests Kubernetes | YAML | 📝 |
| 8 | Pipeline CI/CD | .gitlab-ci.yml | 📝 |
| 9 | Configuration Monitoring | Config files | 📝 |
| 10 | Rapport final | PDF (papier) | 📝 |
| 11 | Présentation PowerPoint | PPTX | 📝 |
| 12 | Démo live | Exécution | 📝 |

---

## 11. CRITÈRES D'ÉVALUATION

| Critère | Poids | Description |
|---------|-------|-------------|
| **Analyse & Préparation** | 25% | Cahier des charges, diagrammes, justifications |
| **Infrastructure** | 25% | IaC (Terraform), Conteneurs, Kubernetes |
| **CI/CD** | 25% | Pipeline automatisé, tests, déploiement |
| **Sécurité** | 15% | TLS, secrets, bonnes pratiques |
| **Documentation & Démo** | 20% | Rapport, présentation, exécution |

---

## 📞 CONTACTS

**Étudiants :**
- [Votre Nom] : [votre.email@example.com]
- [Nom Binôme] : [email.binome@example.com]

**Enseignant :**
- Soufiene Benmahmoud : soufienebm20@gmail.com

---

**Document créé le** : 04 Janvier 2026
**Dernière mise à jour** : 04 Janvier 2026
**Version** : 1.0
