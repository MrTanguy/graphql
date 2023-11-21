# GraphQL

Cette API a pour but d'utiliser GraphQL pour requêter des Jeux-vidéos, des studios et des éditeurs

## Prérequis

- nodejs : [installation](https://nodejs.org/en/download)
- npm : Inclus dans l'installation de nodejs

## Déploiement de la BDD 

Afin de pouvoir utilise l'API, il est nécessaire de la connecter à une BDD MySQL, pour ce faire, créer la BDD avec les requêtes suivantes : 

````
CREATE TABLE `editor` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `name` varchar(255) NOT NULL,
 PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE `game` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `name` varchar(255) NOT NULL,
 `publicationDate` int(11) DEFAULT NULL,
 PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE `genre` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `name` varchar(255) NOT NULL,
 PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE `platform` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `name` varchar(255) NOT NULL,
 PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE `studio` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `name` varchar(255) NOT NULL,
 PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE `gameeditor` (
 `gameId` int(11) DEFAULT NULL,
 `editorId` int(11) DEFAULT NULL,
 FOREIGN KEY (`gameId`) REFERENCES `game` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
 FOREIGN KEY (`editorId`) REFERENCES `editor` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE `gamegenre` (
 `gameId` int(11) NOT NULL,
 `genreId` int(11) NOT NULL,
 FOREIGN KEY (`gameId`) REFERENCES `game` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
 FOREIGN KEY (`genreId`) REFERENCES `genre` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE `gameplatform` (
 `gameId` int(11) NOT NULL,
 `platformId` int(11) NOT NULL,
 FOREIGN KEY (`gameId`) REFERENCES `game` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
 FOREIGN KEY (`platformId`) REFERENCES `platform` (`id`)ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE `gamestudio` (
 `gameId` int(11) DEFAULT NULL,
 `studioId` int(11) DEFAULT NULL,
 FOREIGN KEY (`gameId`) REFERENCES `game` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
 FOREIGN KEY (`studioId`) REFERENCES `studio` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB;

````
## Installation 

Cloner le repo 

````
git clone https://github.com/MrTanguy/graphql.git
cd graphql
git checkout dev 
````

Créer à la racine du projet, un fichier .env dans lequel il faut rentrer les identifiants de connexion à la BDD.

````
MYSQL_HOST = "localhost"
MYSQL_USER = "root"
MYSQL_PWD = ""
````

## Installer les dépendances

````
npm install
````

## Démarrer le projet 

````
node .\index.js
````

## Documentation et tests 

````
http://localhost:4000/graphql
````