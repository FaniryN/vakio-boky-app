# TIA Evaluation - Projet Littéraire React

## Description

TIA Evaluation est une application web littéraire construite avec **React.js** et **Tailwind CSS**, comprenant trois fonctionnalités principales :

1. **Mini-Réseau Social Littéraire** : 
   - Les utilisateurs peuvent publier des citations ou extraits de livres.
   - Les publications s’affichent en temps réel sur la même page.
   - Possibilité d'ajouter des likes simples à chaque publication.

2. **Catalogue de Livres Interactif** : 
   - Affiche un catalogue de 10 livres avec image, titre et auteur.
   - Barre de recherche pour filtrer les livres par titre ou auteur.
   - Option de tri par titre, auteur ou année de publication.

3. **Mini Application Événement** :
   - Page d’annonce d’événements littéraires.
   - Formulaire d’inscription avec stockage temporaire (localStorage).
   - Affichage dynamique de la liste des participants.
   - Messages de confirmation ou d’erreur via des toasts.

---

## Fonctionnalités principales

- Interface moderne et responsive utilisant **Tailwind CSS**.
- Gestion des états locaux et partagés via **useState** et **useContext**.
- Stockage temporaire des participants à un événement dans **localStorage**.
- Composants réutilisables pour formulaire de publication, carte de livre et formulaire d’événement.
- Navigation claire avec **React Router DOM** et menu responsive (desktop + mobile).

---

## Installation

1. **Cloner le projet :**
```bash
git clone https://github.com/ramandimbsonMg/info-evaluation.git
extraire la projet ensuite...
cd info-evaluation
Installer les dépendances :

bash
Copier le code
npm install
Lancer le projet en mode développement :

bash
Copier le code
npm run dev
Accéder à l’application :
Ouvrir http://localhost:5173 dans votre navigateur.

Structure du projet
php
Copier le code
info-evaluation/
├─ public/
│  ├─ assets/
│  │  └─ images/        # Images des livres et illustrations
├─ src/
│  ├─ components/       # Composants réutilisables (BookCard, PostForm, EventSignup, Navbar)
│  ├─ context/          # Context API pour partager les états globaux
│  ├─ data/             # Données statiques (ex. liste des livres)
│  ├─ pages/            # Pages principales (Home, Social, Catalog, Event)
│  ├─ App.jsx           # Composant racine avec Router
│  └─ main.jsx          # Point d’entrée de l’application
├─ package.json
├─ tailwind.config.js
└─ vite.config.js


Utilisation:

Mini-Réseau Social
Accéder à la page "Réseau Social".

Remplir le formulaire avec votre nom et une citation.

Publier la citation ; elle s’affichera immédiatement.

Les likes peuvent être ajoutés via le bouton dédié.

Catalogue de Livres
Accéder à la page "Catalogue".

Rechercher un livre par titre ou auteur via la barre de recherche.

Trier la liste par titre, auteur ou année de publication.

Événements
Accéder à la page "Événements".

Remplir le formulaire d’inscription avec nom et email.

Les inscriptions sont enregistrées dans le localStorage.

Affichage dynamique de la liste des participants.

Messages de succès ou d’erreur affichés en toast.

Technologies utilisées
React.js pour le frontend.

Tailwind CSS pour le style et la responsivité.

React Router DOM pour la navigation.

Context API pour partager les états globaux.

Vite comme bundler et serveur de développement.

Notes
Les images des livres sont chargées depuis des liens en ligne pour simplification.

Les données sont temporairement stockées côté client (localStorage) et ne sont pas persistées sur un serveur.

L’application est conçue pour être responsive et compatible avec desktop et mobile.

Auteurs
Projet développé par Espoir dans le cadre d’une évaluation pratique en React.js et Tailwind CSS.

Instructions supplémentaires
Pour ajouter de nouveaux livres, éditer le fichier src/data/books.js et ajouter un objet au tableau books.

Pour ajouter un nouvel événement, créer un objet dans la page Event ou passer via props à EventSignup.

Pour réinitialiser les participants ou les posts, supprimer les clés correspondantes dans le localStorage.