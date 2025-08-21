#!/bin/bash

IMAGE_NAME="social_network"
TAG="beta"

# Chemin vers le Dockerfile (par défaut répertoire courant)
DOCKERFILE_PATH="."

echo "🚀 Construction de l'image Docker : $IMAGE_NAME:$TAG"

# Commande de build
docker build -t "$IMAGE_NAME:$TAG" "$DOCKERFILE_PATH"

# Vérification du succès
if [ $? -eq 0 ]; then
    echo "✅ Image construite avec succès : $IMAGE_NAME:$TAG"
else
    echo "❌ Erreur lors de la construction de l'image."
    exit 1
fi
