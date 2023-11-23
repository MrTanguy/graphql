CREATE TABLE `graphql`.`editor` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `name` varchar(255) NOT NULL,
 PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE `graphql`.`game` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `name` varchar(255) NOT NULL,
 `publicationDate` int(11) DEFAULT NULL,
 PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE `graphql`.`genre` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `name` varchar(255) NOT NULL,
 PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE `graphql`.`platform` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `name` varchar(255) NOT NULL,
 PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE `graphql`.`studio` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `name` varchar(255) NOT NULL,
 PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE `graphql`.`gameEditor` (
 `gameId` int(11) DEFAULT NULL,
 `editorId` int(11) DEFAULT NULL,
 FOREIGN KEY (`gameId`) REFERENCES `game` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
 FOREIGN KEY (`editorId`) REFERENCES `editor` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE `graphql`.`gameGenre` (
 `gameId` int(11) NOT NULL,
 `genreId` int(11) NOT NULL,
 FOREIGN KEY (`gameId`) REFERENCES `game` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
 FOREIGN KEY (`genreId`) REFERENCES `genre` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE `graphql`.`gamePlatform` (
 `gameId` int(11) NOT NULL,
 `platformId` int(11) NOT NULL,
 FOREIGN KEY (`gameId`) REFERENCES `game` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
 FOREIGN KEY (`platformId`) REFERENCES `platform` (`id`)ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE `graphql`.`gameStudio` (
 `gameId` int(11) DEFAULT NULL,
 `studioId` int(11) DEFAULT NULL,
 FOREIGN KEY (`gameId`) REFERENCES `game` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
 FOREIGN KEY (`studioId`) REFERENCES `studio` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB;
