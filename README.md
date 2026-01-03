# 🛒 E-Commerce Microservices Platform

## 📋 Description
Application e-commerce moderne basée sur une architecture microservices, développée dans le cadre du projet annuel Master DevOps & Cloud.

## 🏗️ Architecture
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    USER     │────▶│   PRODUCT   │────▶│    ORDER    │
│   SERVICE   │     │   SERVICE   │     │   SERVICE   │
└─────────────┘     └─────────────┘     └─────────────┘
```

### Microservices
- **User Service** (Port 3001) : Gestion des utilisateurs et authentification JWT
- **Product Service** (Port 3002) : Catalogue de produits avec recherche
- **Order Service** (Port 3003) : Gestion des commandes

## 🛠️ Technologies
| Composant | Technologie |
|-----------|-------------|
| Backend | Node.js + Express |
| Base de données | PostgreSQL + MongoDB |
| Authentification | JWT |
| Conteneurs | Docker |
| Orchestration | Kubernetes |
| CI/CD | GitLab CI |
| IaC | Terraform + Ansible |
| Monitoring | Prometheus + Grafana |
| Logs | ELK Stack |

## 📂 Structure du Projet
```
ecommerce-microservices/
├── services/               # Microservices
│   ├── user-service/
│   ├── product-service/
│   └── order-service/
├── infrastructure/         # Infrastructure as Code
│   ├── terraform/
│   ├── ansible/
│   └── kubernetes/
├── ci-cd/                 # Pipelines CI/CD
├── monitoring/            # Monitoring & Logs
└── docs/                  # Documentation
```

## 🚀 Quick Start

### Prérequis
- Node.js 18+
- Docker & Docker Compose
- Kubernetes (Minikube/K3s)
- Terraform
- Ansible

### Installation Locale
```bash
# Cloner le repository
git clone https://gitlab.com/VOTRE-USERNAME/ecommerce-microservices.git
cd ecommerce-microservices

# Démarrer les services avec Docker Compose
docker-compose up -d

# Accéder aux services
# User Service: http://localhost:3001
# Product Service: http://localhost:3002
# Order Service: http://localhost:3003
```

## 📊 Monitoring
- **Prometheus** : http://localhost:9090
- **Grafana** : http://localhost:3000
- **Kibana** : http://localhost:5601

## 📝 Documentation
- [Cahier des Charges](docs/cahier-des-charges.md)
- [Architecture](docs/architecture.md)
- [Guide de Démo](docs/guide-demo.md)
- [API Documentation](docs/api-documentation.md)

## 👥 Équipe
- **Étudiant 1** : [Votre Nom]
- **Étudiant 2** : [Nom Binôme]

## 📅 Projet
- **Formation** : Master DevOps & Cloud - 3ème promotion
- **Enseignant** : Soufiene Benmahmoud
- **Date de livraison** : 08 Janvier 2026

## 📄 Licence
Projet académique - Master DevOps & Cloud
