🧭 Guide Professionnel d’Utilisation de Git — Vakio Boky Initiative
🎯 Objectif du Guide

Ce document définit la méthodologie Git officielle utilisée par l’équipe du projet Vakio Boky Initiative, afin de garantir :

Une collaboration fluide entre les membres.

Un code propre et validé avant intégration.

Une traçabilité claire des modifications et versions.

🏗️ Structure du Dépôt GitHub
Vakio-Boky-Initiative/
│
├── backend/           → API, base de données et logique serveur
├── webapp/            → Application web React
├── mobile/            → Application mobile (React Native ou Ionic)
├── designs/           → Maquettes Figma, chartes graphiques
├── tests/             → Scripts et rapports de tests QA
└── docs/              → Documentation technique et fonctionnelle

🌿 Organisation des Branches
Branche	Description	Accès
main	Code stable et validé en production.	🔒 Seul le Lead Developer / Chef de Projet peut fusionner ici.
develop	Branche de développement intégrant les features validées.	Équipe technique.
feature/nom_fonctionnalité	Une fonctionnalité spécifique (ex: feature/login).	Tous les développeurs.
fix/nom_bug	Correction d’un bug spécifique.	Tous les développeurs.
design/nom_module	Évolutions visuelles et UI/UX.	Designer / Frontend.
test/nom_test	Tests unitaires ou d’intégration.	Testeur QA.

🔄 Processus de Travail Standard
1️⃣ Cloner le projet
git clone https://github.com/Raphaelito18/Vakio-Boky-Initiative.git
cd Vakio-Boky-Initiative

2️⃣ Créer une nouvelle branche

Toujours créer ta propre branche avant de commencer :

git checkout -b feature/nom_fonctionnalite


🧠 Exemple : git checkout -b feature/profile-update

3️⃣ Ajouter et committer ton travail
git add .
git commit -m "Ajout de la fonctionnalité de mise à jour du profil"


💡 Bonnes pratiques pour les messages de commit :

Toujours en français clair ou anglais simple.

Décrire ce que tu as fait, pas juste “update”.

Exemples :

✅ Ajout du composant de recherche de livres

✅ Correction du bug sur la connexion utilisateur

🚫 update code (trop vague)

4️⃣ Récupérer les dernières modifications avant de pousser

Avant de pousser ton travail, assure-toi d’être à jour :

git pull origin develop --rebase


⚠️ Ne jamais faire un pull direct depuis main !
main est réservé aux versions stables et validées.

5️⃣ Pousser ta branche
git push origin feature/nom_fonctionnalite

🧩 Revue & Fusion du Code
🔍 1. Revue de Code (Pull Request)

Une fois ta fonctionnalité terminée :

Va sur GitHub.

Crée une Pull Request (PR) depuis ta branche vers develop.

Assigne le Lead Developer ou Chef de Projet pour vérification.

💬 La PR doit contenir une courte description de ce qui a été ajouté/modifié.

✅ 2. Validation & Merge

Le Lead Developer relit le code, vérifie la qualité et la cohérence.

Si tout est correct, il valide la PR et merge vers develop.

Après validation complète et tests réussis, le Chef de Projet fusionne develop → main.

🚫 Règles Importantes

❌ Ne pas pusher directement sur main ou develop sans validation.

❌ Ne pas forcer le push (--force) sauf autorisation du lead.

✅ Toujours faire un pull avant de commencer une nouvelle tâche.

✅ Respecter la convention de nommage des branches (feature/, fix/, etc.).

✅ Chaque fonctionnalité = une branche dédiée.

🧠 Commandes Git Essentielles
Action	Commande
Initialiser le projet	git init
Ajouter des fichiers	git add .
Créer un commit	git commit -m "Message"
Vérifier l’état du dépôt	git status
Créer une branche	git checkout -b feature/nom
Changer de branche	git switch nom_branche
Récupérer les dernières mises à jour	git pull origin develop --rebase
Pousser une branche	git push origin feature/nom
Lister les branches	git branch -a
Supprimer une branche locale	git branch -d feature/nom
🧰 Gestion des Conflits

En cas de conflit lors d’un pull ou d’un merge :

Ouvre les fichiers concernés (<<<<<<<, =======, >>>>>>>).

Corrige manuellement les différences.

Ensuite :

git add .
git commit -m "Résolution des conflits sur feature/nom"
git push

🏁 Validation Finale par le Lead Developer

Seul le Lead Developer / Chef de Projet peut :

Fusionner la branche develop vers main.

Déployer la version stable.

Gérer les tags de version (ex: v1.0.0, v1.1.0).