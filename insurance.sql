-- -------------------------------------------------------------
-- TablePlus 6.2.1(578)
--
-- https://tableplus.com/
--
-- Database: insurance
-- Generation Time: 2025-01-15 11:36:05.4330
-- -------------------------------------------------------------


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

DROP TABLE IF EXISTS `group`;
CREATE TABLE `group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `groupTitle` varchar(255) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deletedAt` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `group_permission`;
CREATE TABLE `group_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `permissionLevel` decimal(10,0) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deletedAt` datetime(6) DEFAULT NULL,
  `groupId` int DEFAULT NULL,
  `permissionId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_fcdab8fc34786128955f90572cb` (`groupId`),
  KEY `FK_81069af06769aec203a02f0dc27` (`permissionId`),
  CONSTRAINT `FK_81069af06769aec203a02f0dc27` FOREIGN KEY (`permissionId`) REFERENCES `permission` (`id`),
  CONSTRAINT `FK_fcdab8fc34786128955f90572cb` FOREIGN KEY (`groupId`) REFERENCES `group` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `permission`;
CREATE TABLE `permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `permissionTitle` varchar(255) NOT NULL,
  `permissionModel` varchar(255) NOT NULL,
  `permissionLevels` longtext NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deletedAt` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE `permissioefefn` (
  `id` int NOT NULL AUTO_INCREMENT,
  `permissionTitle` varchar(255) NOT NULL,
  `permissionModel` varchar(255) NOT NULL,
  `permissionLevels` longtext NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deletedAt` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `role`;
CREATE TABLE `role` (
  `id` int NOT NULL AUTO_INCREMENT,
  `roleTitle` varchar(255) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deletedAt` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `role_permission`;
CREATE TABLE `role_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `permissionLevel` decimal(10,0) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deletedAt` datetime(6) DEFAULT NULL,
  `roleId` int DEFAULT NULL,
  `permissionId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_e3130a39c1e4a740d044e685730` (`roleId`),
  KEY `FK_72e80be86cab0e93e67ed1a7a9a` (`permissionId`),
  CONSTRAINT `FK_72e80be86cab0e93e67ed1a7a9a` FOREIGN KEY (`permissionId`) REFERENCES `permission` (`id`),
  CONSTRAINT `FK_e3130a39c1e4a740d044e685730` FOREIGN KEY (`roleId`) REFERENCES `role` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fullName` varchar(255) NOT NULL,
  `userName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `status` enum('verified','blocked') NOT NULL DEFAULT 'verified',
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deletedAt` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_da5934070b5f2726ebfd3122c8` (`userName`),
  UNIQUE KEY `IDX_e12875dfb3b1d92d7d7c5377e2` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `user_permission`;
CREATE TABLE `user_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `permissionLevel` decimal(10,0) DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deletedAt` datetime(6) DEFAULT NULL,
  `userId` int DEFAULT NULL,
  `permissionId` int DEFAULT NULL,
  `groupId` int DEFAULT NULL,
  `roleId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_deb59c09715314aed1866e18a81` (`userId`),
  KEY `FK_a592f2df24c9d464afd71401ff6` (`permissionId`),
  KEY `FK_fb20522c27dff769a48e8eae8ff` (`groupId`),
  KEY `FK_502b61366d2e0e761851b9a3c9c` (`roleId`),
  CONSTRAINT `FK_502b61366d2e0e761851b9a3c9c` FOREIGN KEY (`roleId`) REFERENCES `role` (`id`),
  CONSTRAINT `FK_a592f2df24c9d464afd71401ff6` FOREIGN KEY (`permissionId`) REFERENCES `permission` (`id`),
  CONSTRAINT `FK_deb59c09715314aed1866e18a81` FOREIGN KEY (`userId`) REFERENCES `user` (`id`),
  CONSTRAINT `FK_fb20522c27dff769a48e8eae8ff` FOREIGN KEY (`groupId`) REFERENCES `group` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `group` (`id`, `groupTitle`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'Mining Fights', '2025-01-13 20:11:42.461003', '2025-01-13 21:55:10.000000', NULL);

INSERT INTO `group_permission` (`id`, `permissionLevel`, `createdAt`, `updatedAt`, `deletedAt`, `groupId`, `permissionId`) VALUES
(1, 3, '2025-01-13 20:11:42.492843', '2025-01-13 20:11:42.492843', NULL, 1, 1),
(4, 2, '2025-01-13 20:11:42.503041', '2025-01-13 20:11:42.503041', NULL, 1, 3);

INSERT INTO `permission` (`id`, `permissionTitle`, `permissionModel`, `permissionLevels`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'Users', 'user', '[\"view\",\"create\",\"edit\",\"delete\"]', '2025-01-13 17:50:22.619357', '2025-01-13 17:50:22.619357', NULL),
(3, 'Permissions', 'permission', '[\"view\",\"assign\",\"create\",\"edit\",\"delete\"]', '2025-01-13 18:21:41.302940', '2025-01-13 18:21:41.302940', NULL),
(4, 'Role', 'role', '[\"view\",\"assign\",\"create\",\"edit\",\"delete\"]', '2025-01-14 12:38:31.791131', '2025-01-14 12:38:31.791131', NULL),
(5, 'Group', 'group', '[\"view\",\"assign\",\"create\",\"edit\",\"delete\"]', '2025-01-14 12:44:20.360093', '2025-01-14 12:44:20.360093', NULL);

INSERT INTO `role` (`id`, `roleTitle`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'Developer', '2025-01-13 19:01:13.039378', '2025-01-13 19:40:26.000000', NULL),
(3, 'Engineer', '2025-01-13 19:05:31.789626', '2025-01-13 19:05:31.789626', NULL),
(4, 'Data Miner', '2025-01-13 19:06:44.092355', '2025-01-13 19:06:44.092355', NULL),
(5, 'Super Admin', '2025-01-15 09:18:20.194810', '2025-01-15 09:18:20.194810', NULL);

INSERT INTO `role_permission` (`id`, `permissionLevel`, `createdAt`, `updatedAt`, `deletedAt`, `roleId`, `permissionId`) VALUES
(1, 2, '2025-01-13 19:05:31.824257', '2025-01-15 10:28:57.000000', NULL, 3, 1),
(2, 2, '2025-01-13 19:05:31.841830', '2025-01-13 19:05:31.841830', NULL, 3, 3),
(3, 3, '2025-01-13 19:06:44.121006', '2025-01-13 19:06:44.121006', NULL, 4, 1),
(4, 2, '2025-01-13 19:06:44.129896', '2025-01-13 19:06:44.129896', NULL, 4, 3),
(5, 4, '2025-01-15 09:18:20.222028', '2025-01-15 09:18:20.222028', NULL, 5, 1),
(6, 4, '2025-01-15 09:18:20.234294', '2025-01-15 09:18:20.234294', NULL, 5, 5),
(7, 4, '2025-01-15 09:18:20.234937', '2025-01-15 09:18:20.234937', NULL, 5, 3),
(8, 4, '2025-01-15 09:18:20.235366', '2025-01-15 09:18:20.235366', NULL, 5, 4);

INSERT INTO `user` (`id`, `fullName`, `userName`, `email`, `password`, `status`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(2, 'Dele', 'Dele', 'caspweeefr@luis.me', '$2b$10$4mH2W1mTktOR674J/OP1j.aaJ6dQWNmzueToWFSRmOX1XdBqxmdVG', 'verified', '2025-01-13 00:14:57.429296', '2025-01-13 00:50:21.000000', NULL);

INSERT INTO `user_permission` (`id`, `permissionLevel`, `createdAt`, `updatedAt`, `deletedAt`, `userId`, `permissionId`, `groupId`, `roleId`) VALUES
(7, 4, '2025-01-15 09:15:35.171319', '2025-01-15 09:27:23.000000', NULL, 2, 1, 1, 3),
(8, 4, '2025-01-15 09:17:02.770546', '2025-01-15 09:27:23.000000', NULL, 2, 3, 1, 3),
(9, 4, '2025-01-15 09:17:04.129483', '2025-01-15 09:27:23.000000', NULL, 2, 4, 1, 3),
(10, 4, '2025-01-15 09:17:05.612192', '2025-01-15 09:27:23.000000', NULL, 2, 5, 1, 3);



/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;