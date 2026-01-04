#!/bin/bash

echo "🚀 Starting E-Commerce Microservices..."
echo ""

# Arrêter les conteneurs existants
echo "🛑 Stopping existing containers..."
docker-compose down

# Construire les images
echo "🔨 Building Docker images..."
docker-compose build

# Démarrer les services
echo "▶️ Starting services..."
docker-compose up -d

# Attendre que les services soient prêts
echo "⏳ Waiting for services to be ready..."
sleep 10

# Vérifier le statut
echo ""
echo "📊 Services Status:"
docker-compose ps

echo ""
echo "✅ Services are running!"
echo ""
echo "📍 Access Points:"
echo "   - User Service:    http://localhost:3001/health"
echo "   - Product Service: http://localhost:3002/health"
echo "   - Order Service:   http://localhost:3003/health"
echo ""
echo "📝 View logs: docker-compose logs -f [service-name]"
echo "🛑 Stop all:  docker-compose down"
