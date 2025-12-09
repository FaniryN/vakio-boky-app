# API Endpoints – Vakio Boky Initiative

## Authentification

| Méthode | Endpoint           | Description                  |
| ------- | ------------------ | ---------------------------- |
| POST    | /api/auth/register | Créer un compte utilisateur  |
| POST    | /api/auth/login    | Connexion                    |
| GET     | /api/auth/profile  | Profil utilisateur connecté  |
| PUT     | /api/auth/update   | Modifier les infos du profil |

## Livres

| Méthode | Endpoint       | Description               |
| ------- | -------------- | ------------------------- |
| GET     | /api/books     | Liste des livres          |
| GET     | /api/books/:id | Détails d’un livre        |
| POST    | /api/books     | Publier un livre (auteur) |
| PUT     | /api/books/:id | Modifier un livre         |
| DELETE  | /api/books/:id | Supprimer un livre        |

## Marketplace

| Méthode | Endpoint         | Description            |
| ------- | ---------------- | ---------------------- |
| GET     | /api/marketplace | Tous les produits      |
| POST    | /api/orders      | Créer une commande     |
| GET     | /api/orders/:id  | Détails d’une commande |
| POST    | /api/payments    | Traitement de paiement |

## Événements

| Méthode | Endpoint        | Description            |
| ------- | --------------- | ---------------------- |
| GET     | /api/events     | Liste des événements   |
| POST    | /api/events     | Créer un événement     |
| GET     | /api/events/:id | Détails de l’événement |

## Collecte de Fonds

| Méthode | Endpoint       | Description         |
| ------- | -------------- | ------------------- |
| GET     | /api/campaigns | Liste des campagnes |
| POST    | /api/campaigns | Lancer une campagne |
| POST    | /api/donations | Effectuer un don    |


