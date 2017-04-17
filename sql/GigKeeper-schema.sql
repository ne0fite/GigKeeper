# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: localhost (MySQL 5.6.28)
# Database: gigkeeper
# Generation Time: 2017-04-17 18:16:26 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table contractors
# ------------------------------------------------------------

DROP TABLE IF EXISTS `contractors`;

CREATE TABLE `contractors` (
  `id` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `profileId` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `name` varchar(255) NOT NULL,
  `address1` varchar(255) DEFAULT NULL,
  `address2` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `region` varchar(255) DEFAULT NULL,
  `postalCode` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `web` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `profileId` (`profileId`),
  CONSTRAINT `contractors_ibfk_1` FOREIGN KEY (`profileId`) REFERENCES `profiles` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table gig_tags
# ------------------------------------------------------------

DROP TABLE IF EXISTS `gig_tags`;

CREATE TABLE `gig_tags` (
  `id` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `profileId` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `gigId` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '',
  `tagId` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `gig_id` (`gigId`),
  KEY `profileId` (`profileId`),
  KEY `tagId` (`tagId`),
  CONSTRAINT `gig_tags_ibfk_1` FOREIGN KEY (`profileId`) REFERENCES `profiles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `gig_tags_ibfk_2` FOREIGN KEY (`gigId`) REFERENCES `gigs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `gig_tags_ibfk_3` FOREIGN KEY (`tagId`) REFERENCES `tags` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table gigs
# ------------------------------------------------------------

DROP TABLE IF EXISTS `gigs`;

CREATE TABLE `gigs` (
  `id` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `profileId` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `contractorId` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `name` varchar(255) NOT NULL,
  `place` text,
  `distance` decimal(8,2) DEFAULT NULL,
  `duration` decimal(8,2) DEFAULT NULL,
  `startDate` datetime NOT NULL,
  `endDate` datetime NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `profileId` (`profileId`),
  KEY `contractorId` (`contractorId`),
  CONSTRAINT `gigs_ibfk_1` FOREIGN KEY (`profileId`) REFERENCES `profiles` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `gigs_ibfk_2` FOREIGN KEY (`contractorId`) REFERENCES `contractors` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table profiles
# ------------------------------------------------------------

DROP TABLE IF EXISTS `profiles`;

CREATE TABLE `profiles` (
  `id` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `homeBasePlace` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table tags
# ------------------------------------------------------------

DROP TABLE IF EXISTS `tags`;

CREATE TABLE `tags` (
  `id` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '',
  `profileId` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '',
  `name` varchar(255) NOT NULL DEFAULT '',
  `description` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `profileId` (`profileId`),
  CONSTRAINT `tags_ibfk_1` FOREIGN KEY (`profileId`) REFERENCES `profiles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `profileId` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `active` tinyint(1) DEFAULT '0',
  `scope` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `profileId` (`profileId`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`profileId`) REFERENCES `profiles` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
