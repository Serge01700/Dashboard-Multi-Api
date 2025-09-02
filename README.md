Dashboard Multi-Api

Un tableau de bord moderne et polyvalent intégrant plusieurs APIs pour centraliser vos informations essentielles.

 🚀 Fonctionnalités

- Authentication Sécurisée
  - Système de connexion/inscription
  - Gestion des tokens JWT
  - Gestion des rôles utilisateurs

- Widgets Personnalisables
  - Météo en temps réel
  - Gestion des tâches (Todo List)
  - Calendrier d'événements
  - Conversion de devises
  - Intégration Gmail
  - Suivi boursier
  - Recommandations musicales
  - Métriques API en temps réel

- Interface Utilisateur
  - Design responsive
  - Mode clair/sombre
  - Widgets réorganisables par glisser-déposer
  - Animations fluides
  - Mise en page personnalisable

 🛠 Stack Technique

Frontend
- Vue.js 3
- Vite
- Pinia (Gestion d'état)
- Vue Router
- Tailwind CSS
- Vuedraggable
- Axios

 Backend
- Node.js
- Express
- MongoDB
- JWT pour l'authentification
- APIs externes :
  - Gmail API
  - Weather API
  - Finnhub API (Données boursières)
  - APIs Musicales

 Infrastructure
- Docker
- Docker Compose
- Nginx 

 🚦 Prérequis
- Node.js
- MongoDB
- Docker et Docker Compose
- Clés API pour les services externes

 🔧 Installation

1. Cloner le projet
```bash
git clone https://github.com/Serge01700/Dashboard-Multi-Api.git
cd Dashboard-Multi-Api
```

2. Configuration des variables d'environnement
```bash
# Backend
cp dashboard-api/backend/.env.example dashboard-api/backend/.env
# Frontend
cp dashboard-api/frontend/.env.example dashboard-api/frontend/.env
```

3. Installation des dépendances
```bash
# Backend
cd dashboard-api/backend
npm install

# Frontend
cd ../frontend
npm install
```

4. Lancer en développement
```bash
# Backend
npm run dev

# Frontend (dans un autre terminal)
npm run dev
```

5. Avec Docker
```bash
docker-compose up --build
```

 📱 Ports par défaut
- Frontend: http://localhost:5173 (dev) / http://localhost:8080 (prod)
- Backend: http://localhost:3000

🔐 Configuration des APIs
Pour utiliser toutes les fonctionnalités, vous devrez configurer :

1. Gmail API (OAuth2)
2. Weather API
3. Finnhub API
4. Itunes API

Consultez la documentation de chaque service pour obtenir vos clés API.

 🗂 Structure du Projet
```
dashboard-api/
├── backend/          # API Node.js
├── frontend/         # Application Vue.js
└── docker-compose.yml
```

 🛡 Sécurité
- Authentification JWT
- Hashage des mots de passe
- CORS configuré
- Validation des entrées
- Protection des routes sensibles



Figma : (https://www.figma.com/design/ZrPI4AqwXoAVByLnSr18YJ/Untitled?node-id=0-1&t=aOkKNEmbUl8VZZf0-1)
