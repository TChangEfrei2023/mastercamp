# ElevAlert 
Service de détection de pannes dans les ascenseurs. Projet dans le cadre du Master Camp L3 de 2021 à EFREI Paris.  
![preview](https://github.com/TChangEfrei2023/mastercamp/blob/main/ElevAlert/client/img/screenshotClient.png)

## Table des matières
1) [Informations générales](#informations-générales)
2) [Avertissement](#avertissement)
3) [Utilisation](#utilisation)
4) [Installation et mise en place](#installation-et-mise-en-place)
5) [Contributeurs](#contributeurs)

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
* Voir la liste des clients et leurs détails pour les contacter
* Ajouter des clients, des ascenseurs et des nouveaux composants

### Les fonctionnalités du simulateur :
* Alerter le serveur : le moment où un componsant de l'ascenseur n'est plus opérationnel, un détecteur chargé de tester ce composant enclenchera un mécanisme d'alerte.
* Simuler un ascenseur : chaque ascenseur doit pouvoir s'identifier pour des mesures de sécurité et notifier le serveur avec son identifiant en cas de panne.
* Simuler une erreur : visuel reflétant un ascenseur qui monte et qui descend aléatoirement. Simule l'usure des matériaux et génère une erreur.
* Simuler une réparation : lorsque l'ascenseur est réparé, il doit pouvoir informer le serveur. 

![UseCaseSite](https://github.com/TChangEfrei2023/mastercamp/blob/main/ElevAlert/client/img/UseCaseSite.png)
![UseCaseSim](https://github.com/TChangEfrei2023/mastercamp/blob/main/ElevAlert/client/img/UseCaseSim.png)

## Avertissement
Les détecteurs sur les ascenseurs dans le simulateur sont fictifs, le simulateur reste un prototype, un concept.

## Installation et mise en place
### Installer et faire fonctionner NodeJS, JavaFX, PostgreSQL et pgAdmin 4 au préalable

Tout d'abord, effectuer un git clone pour récupérer le projet :
```bash
git clone https://github.com/TChangEfrei2023/mastercamp.git
cd ElevAlert
```

Installer les packages nécessaires :
```npm
npm install
```

### Partie serveur NodeJS

Aller dans le répertoire 'server/routes/api.js' et modifier vos identifiants :
```javascript
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  password: 'VOTRE MDP POSTGRES', // Ici
  database: 'elevalert_db'
})
```

Aller dans le répertoire 'bin/' et modifier selon votre adresse IP dans 'www' ligne 28 :
```javascript
server.listen(port,'VOTRE ADRESSE IP' || 'localhost', function(){
```
(ou bien en local)
```javascript
server.listen(port, function(){
```

Enfin, lancer le serveur NodeJS :
```npm
npm start
```

### Partie Simulateur Java

Une fois lancé, dans votre IDE de Java (Eclipse, IntelliJ ou autre) avec les dépendances de JavaFX installées. Importer le projet Simulateur qui se trouve dans le répertoire 'Simulateur'. Modifier dans le fichier 'src\simulateur\Request.java' à la ligne 31 :
```java
address = "http://VOTRE ADRESSE IP (OU localhost)/api";
```

### Partie base de données Postgres sur pgAdmin
Suivre à la lettre le tutoriel 'TutorielInstallationBDD.docx'.

## Utilisation

### Site web
ElevAlert est avant-tout utilisé en tant que service. Le serveur doit être lancé afin qu'on puisse se connecter au site web et ainsi accéder aux fonctionnalités. Pour l'utilisateur, il y a deux type de login : un admin et un client.
#### Pour le client :
Il utilisera l'identifiant fourni par l'entreprise ElevAlert (Exemple: 1). 
* Son mdp par défaut est 'AZE', le changement de mot de passe sera implémenté plus tard.
* Une fois connecté, il pourra accéder aux différentes pages concernant ses ascenseurs : 'Mes ascenseurs' et 'Log'.
* Il peut aussi être notifié d'une panne grâce à l'icône clochette qui se mettra en rouge avec le nombre de notifications, puis confirmer avoir pris en compte une notification.

#### Pour l'administrateur :
Il se connectera grâce à son identifiant + une lettre (n'importe laquelle, exemple : 1s).
* Mot de passe par défaut 'QSD'. Il aura accès à plusieurs pages dont :
* Une page 'Client' pour voir et ajouter des clients en remplissant le formulaire.
* Une page 'Ascenseur' pour voir et ajouter des ascenseurs (et des composants pour un ascenseur spécifique) en remplissant les formulaires.
* Une page 'Log' des pannes pour avoir une vue générale des pannes en cours et l'historique (comme les clients mais pour tous les clients)
* Recevoir et confirmer la réception de notification dans le cas où le client ne l'aurait pas fait.

### Simulateur
* Lancer le simulateur et choisir le nombre d'ascenseurs à simuler en même temps.
* Après ouverture de la ou des fenêtres, se connecter à un ascenseur avec l'ID de l'ascenseur (le mot de passe de sécurité est le même que le mot de passe du client à qui appartient l'ascenseur, du coup par défaut 'AZE').
* Appuyer sur [Launch] et attendre qu'une panne se produise (l'ascenseur sera en rouge).Pour réparer un composant, sélectionner la ligne dans le tableau dont le composant est mort et appuyer sur [Repair] pour simuler la fin d'une réparation du composant.

## Contributeurs

* <img src="https://avatars.githubusercontent.com/u/85551666?v=4&s" height="32" alt="TChangEfrei2023" /> [Tom    CHANG](https://github.com/TChangEfrei2023)
* <img src="https://avatars.githubusercontent.com/u/50303219?v=4" height="32" alt="Akars" /> [William   LI](https://github.com/Akars)
* <img src="https://avatars.githubusercontent.com/u/66122190?v=4" height="32" alt="Kyran-LAU" /> [Kyran   LAU](https://github.com/Kyran-LAU)
* <img src="https://avatars.githubusercontent.com/u/61382941?v=4" height="32" alt="Adrien-github1" /> [Adrien  PLOT](https://github.com/Adrien-github1)
* <img src="https://avatars.githubusercontent.com/u/51865517?v=4" height="32" alt="bienvenu k" /> [Bienvenu KANKOLONGO](https://github.com/bienvenu28)
* <img src="https://avatars.githubusercontent.com/u/85549883?v=4" height="32" alt="elisagrlh" /> [Elisa  GERLACH](https://github.com/elisagrlh)