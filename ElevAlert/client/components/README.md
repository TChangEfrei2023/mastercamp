# ElevAlert 
Service de détection de pannes dans les ascenseurs. Projet dans le cadre du Master Camp L3 de 2021 à EFREI Paris.  
![preview](https://github.com/TChangEfrei2023/mastercamp/blob/main/ElevAlert/client/img/screenshotClient.png)

## Table des matières
1) [Informations générales](#informations-générales)
2) [Avertissement](#avertissement)
3) [Utilisation](#utilisation)
4) [Installation et mise en place](#installation-et-mise-en-place)

## Informations générales
ElevAlert est un service qui utilise un site web en VueJS, testé et fonctionnel sur un serveur NodeJS. ElevAlert veut s'adapter à tout type de client, que ce soit pour un ascenseur personnel, d'un hôtel ou même d'une entreprise, le but reste d'automatiser l'alerte des pannes et d'avertir le client avec les détails de la panne. 
### Voici une liste des fonctionnalités du site :
#### Pour le client :
* Voir ses ascenseurs équipés des détecteurs et leurs états.
* Voir l'historique des pannes et ceux en cours de réparation.
* Recevoir une notification d'une nouvelle panne (mail, sur le site directement)


#### Pour les administrateurs et employés :
* Voir tous les ascenseurs équipés des détecteurs
* Voir toutes les pannes en cours
* Voir la liste des clients
* Ajouter des clients et voir leurs détails pour les contacter
* Ajouter des ascenseurs et des composants

### Les fonctionnalités du simulateur :
* Alerter le serveur : le moment où un componsant de l'ascenseur n'est plus opérationnel, un détecteur chargé de tester ce composant enclenchera un mécanisme d'alerte.
* Simuler un ascenseur : chaque ascenseur doit pouvoir s'identifier pour des mesures de sécurité et notifier le serveur avec son identifiant en cas de panne.
* Simuler une erreur : visuel reflétant un ascenseur qui monte et qui descend aléatoirement. Simule l'usure des matériaux et génère une erreur.
* Simuler une réparation : lorsque l'ascenseur est réparé, il doit pouvoir informer le serveur. 

![UseCaseSite](https://github.com/TChangEfrei2023/mastercamp/blob/main/ElevAlert/client/img/UseCaseSite.png)
![UseCaseSim](https://github.com/TChangEfrei2023/mastercamp/blob/main/ElevAlert/client/img/UseCaseSim.png)

## Avertissement
Les détecteurs sur les ascenseurs dans le simulateur sont fictifs, le simulateur reste un prototype, un concept.

## Utilisation



## Installation et mise en place


