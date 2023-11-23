CREATE TABLE `graphql`.`editor` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `name` varchar(255) NOT NULL,
 PRIMARY KEY (`id`)
) ENGINE=InnoDB;

INSERT INTO `graphql`.`editor` (`name`) 
VALUES
    ('EditorABC'),
    ('Editor123'),
    ('EditorDEF'),
    ('Editor456'),
    ('EditorGHI'),
    ('Editor789');

CREATE TABLE `graphql`.`game` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `name` varchar(255) NOT NULL,
 `publicationDate` int(11) DEFAULT NULL,
 PRIMARY KEY (`id`)
) ENGINE=InnoDB;

INSERT INTO `graphql`.`game` (`name`, `publicationDate`) VALUES
    ('Game1', 20220115),
    ('Game2', 20181203),
    ('Game3', 20191020),
    ('Game4', 20160312),
    ('Game5', 20150708),
    ('Game6', 20121130),
    ('Game7', 20140918),
    ('Game8', 20170825),
    ('Game9', 20130506),
    ('Game10', 20110814);

CREATE TABLE `graphql`.`genre` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `name` varchar(255) NOT NULL,
 PRIMARY KEY (`id`)
) ENGINE=InnoDB;

INSERT INTO `graphql`.`genre` (`name`) VALUES
    ('Action'),
    ('Adventure'),
    ('Role-Playing'),
    ('Strategy'),
    ('Simulation'),
    ('Sports'),
    ('Puzzle'),
    ('Horror'),
    ('Science Fiction'),
    ('Fantasy');

CREATE TABLE `graphql`.`platform` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `name` varchar(255) NOT NULL,
 PRIMARY KEY (`id`)
) ENGINE=InnoDB;

INSERT INTO `graphql`.`platform` (`name`) VALUES
    ('PlayStation'),
    ('Xbox'),
    ('Nintendo Switch'),
    ('PC'),
    ('Mobile');

CREATE TABLE `graphql`.`studio` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `name` varchar(255) NOT NULL,
 PRIMARY KEY (`id`)
) ENGINE=InnoDB;

INSERT INTO `graphql`.`studio` (`name`) VALUES
    ('Studio1'),
    ('Studio2'),
    ('Studio3'),
    ('Studio4'),
    ('Studio5'),
    ('Studio6'),
    ('Studio7'),
    ('Studio8'),
    ('Studio9'),
    ('Studio10');

CREATE TABLE `graphql`.`gameEditor` (
 `gameId` int(11) DEFAULT NULL,
 `editorId` int(11) DEFAULT NULL,
 FOREIGN KEY (`gameId`) REFERENCES `game` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
 FOREIGN KEY (`editorId`) REFERENCES `editor` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB;

INSERT INTO `graphql`.`gameEditor` (`gameId`, `editorId`) VALUES
    (1, 1),   -- Jeu 1, Éditeur 1
    (1, 2),   -- Jeu 1, Éditeur 2
    (2, 3),   -- Jeu 2, Éditeur 3
    (2, 4),   -- Jeu 2, Éditeur 4
    (3, 5),   -- Jeu 3, Éditeur 5
    (4, 6),   -- Jeu 4, Éditeur 6
    (4, 1),   -- Jeu 4, Éditeur 1
    (5, 2),   -- Jeu 5, Éditeur 2
    (6, 3),   -- Jeu 6, Éditeur 3
    (7, 4),   -- Jeu 7, Éditeur 4
    (8, 5),   -- Jeu 8, Éditeur 5
    (9, 6),   -- Jeu 9, Éditeur 6
    (9, 1),   -- Jeu 9, Éditeur 1
    (10, 2),  -- Jeu 10, Éditeur 2
    (10, 3);  -- Jeu 10, Éditeur 3

CREATE TABLE `graphql`.`gameGenre` (
 `gameId` int(11) NOT NULL,
 `genreId` int(11) NOT NULL,
 FOREIGN KEY (`gameId`) REFERENCES `game` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
 FOREIGN KEY (`genreId`) REFERENCES `genre` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB;

INSERT INTO `graphql`.`gameGenre` (`gameId`, `genreId`) VALUES
    (1, 1),   -- Jeu 1, Genre 1
    (1, 2),   -- Jeu 1, Genre 2
    (2, 3),   -- Jeu 2, Genre 3
    (2, 4),   -- Jeu 2, Genre 4
    (3, 5),   -- Jeu 3, Genre 5
    (4, 6),   -- Jeu 4, Genre 6
    (4, 7),   -- Jeu 4, Genre 7
    (5, 8),   -- Jeu 5, Genre 8
    (6, 9),   -- Jeu 6, Genre 9
    (7, 10),  -- Jeu 7, Genre 10
    (8, 1),   -- Jeu 8, Genre 1
    (8, 2),   -- Jeu 8, Genre 2
    (8, 3),   -- Jeu 8, Genre 3
    (9, 4),   -- Jeu 9, Genre 4
    (10, 5),  -- Jeu 10, Genre 5
    (10, 6);  -- Jeu 10, Genre 6

CREATE TABLE `graphql`.`gamePlatform` (
 `gameId` int(11) NOT NULL,
 `platformId` int(11) NOT NULL,
 FOREIGN KEY (`gameId`) REFERENCES `game` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
 FOREIGN KEY (`platformId`) REFERENCES `platform` (`id`)ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB;

INSERT INTO `graphql`.`gamePlatform` (`gameId`, `platformId`) VALUES
    (1, 1),   -- Jeu 1, Plate-forme 1
    (1, 2),   -- Jeu 1, Plate-forme 2
    (2, 3),   -- Jeu 2, Plate-forme 3
    (2, 4),   -- Jeu 2, Plate-forme 4
    (3, 5),   -- Jeu 3, Plate-forme 5
    (4, 1),   -- Jeu 4, Plate-forme 1
    (4, 2),   -- Jeu 4, Plate-forme 2
    (5, 3),   -- Jeu 5, Plate-forme 3
    (6, 4),   -- Jeu 6, Plate-forme 4
    (7, 5),   -- Jeu 7, Plate-forme 5
    (8, 1),   -- Jeu 8, Plate-forme 1
    (8, 2),   -- Jeu 8, Plate-forme 2
    (9, 3),   -- Jeu 9, Plate-forme 3
    (10, 4);  -- Jeu 10, Plate-forme 4

CREATE TABLE `graphql`.`gameStudio` (
 `gameId` int(11) DEFAULT NULL,
 `studioId` int(11) DEFAULT NULL,
 FOREIGN KEY (`gameId`) REFERENCES `game` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
 FOREIGN KEY (`studioId`) REFERENCES `studio` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB;

INSERT INTO `graphql`.`gameStudio` (`gameId`, `studioId`) VALUES
    (1, 1),   -- Jeu 1, Studio 1
    (2, 2),   -- Jeu 2, Studio 2
    (3, 3),   -- Jeu 3, Studio 3
    (4, 4),   -- Jeu 4, Studio 4
    (5, 5),   -- Jeu 5, Studio 5
    (6, 6),   -- Jeu 6, Studio 6
    (7, 7),   -- Jeu 7, Studio 7
    (8, 8),   -- Jeu 8, Studio 8
    (9, 9),   -- Jeu 9, Studio 9
    (10, 10); -- Jeu 10, Studio 10