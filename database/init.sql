
CREATE DATABASE IF NOT EXISTS `user`;
USE `user`;

CREATE TABLE `account` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(100) NOT NULL UNIQUE,
  `hashedPsw` VARCHAR(250),
  `confirmed` TINYINT NOT NULL,
  PRIMARY KEY(id)
);
CREATE TABLE `profile` (
  `owner` INT NOT NULL,
  `firstName` VARCHAR(20) NOT NULL,
  `lastName` VARCHAR(20) NOT NULL,
  `displayName` VARCHAR(40) NOT NULL,
  `gender` ENUM('male', 'female', 'other') NOT NULL,
  `birthday` DATE NOT NULL,
  `about` TEXT,
  `activities` TEXT,
  `avatarUrl` VARCHAR(250),
  `photoUrls` TEXT,
  `status` ENUM('online', 'offline') NOT NULL,
  PRIMARY KEY(owner)
);
CREATE TABLE `settings` (
  `owner` INT NOT NULL,
  `currentLat` DECIMAL(10, 8) NOT NULL,
  `currentLng` DECIMAL(11, 8) NOT NULL,
  `locationRange` SMALLINT NOT NULL,
  `unit` ENUM('km', 'mi') NOT NULL,
  `notifications` ENUM('off', 'on') NOT NULL,
  `language` ENUM('en', 'ar') NOT NULL,
  `accountStatus` TINYINT NOT NULL,
  PRIMARY KEY(owner)
);


CREATE DATABASE IF NOT EXISTS `feeds`;
USE `feeds`;

CREATE TABLE `post` (
  `id` VARCHAR(150),
  `owner` INT NOT NULL,
  `activity` ENUM("Gym", "Exercise", "Pilates", "Swimming", "Running", "Soccer", "Flag football", "Rugby", "Handball", "Badminton", "Field Hockey", "Volleyball", "Basketball", "Tennis", "Cricket", "Table Tennis", "Baseball", "Golf", "Yoga", "Taekwondo", "Karate", "Acrobatics", "Baton twirling", "Juggling", "Bowling", "Book discussion", "Board game", "Card game", "Jigsaw Puzzle", "Crossword puzzle", "Coloring", "Crocheting", "Knitting", "Embroidery", "Needlepoint", "Jewelry making", "Cue Sport", "Dance", "Hula hooping", "Drawing", "Painting", "Pottery", "Woodworking", "Crafting", "Language", "Singing", "Playing Music", "Watching Movies", "Makeup", "Backgammon", "Chess", "Stand-up Comedy", "Poetry", "Trail running", "Climbing", "Rock Climbing", "Skydiving", "Paragliding", "Parkour", "Skiing", "Snowboarding", "Skating", "Skateboarding", "Cycling", "BMX Bike", "Snorkeling", "Scuba Diving", "Surfing", "Windsurfing", "Waterskiing", "Sailing", "Kayaking", "Rafting", "Walking", "Sun Tanning", "Backpacking", "Hiking", "Horseback Riding", "Archery", "Beekeeping", "Camping", "Flying Disc", "Gold Prospecting", "Hunting", "Sand Art", "Shooting", "Slacklining", "Travel") NOT NULL,
  `participants` TINYINT NOT NULL,
  `description` TEXT,
  `mediaUrls` TEXT NULL,
  `locationLat` DECIMAL(10, 8) NOT NULL,
  `locationLng` DECIMAL(11, 8) NOT NULL,
  `createdAt` TIMESTAMP NOT NULL,
  `startAt` DATETIME NOT NULL,
  `expireAt` DATETIME NOT NULL,
  PRIMARY KEY(id)
);

alter table `post` modify column `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL;

CREATE TABLE `request` (
  `receiver` VARCHAR(150),
  `sender` INT NOT NULL,
  PRIMARY KEY(receiver, sender)
);

CREATE TABLE `chat` (
  `member` INT NOT NULL,
  `postId` VARCHAR(150),
  `unseenMessages` SMALLINT NOT NULL,
  PRIMARY KEY(member, postId)
);

CREATE TABLE `message` (
  `id` VARCHAR(150),
  `chatId` VARCHAR(150),
  `owner` INT NOT NULL,
  `content` TEXT,
  `type`  ENUM('accept', 'reject', 'left', 'normal') NOT NULL,
  `createdAt` TIMESTAMP NOT NULL,
  PRIMARY KEY(id)
);

CREATE TABLE `notification` (
  `id` VARCHAR(150),
  `receiver` INT NOT NULL,
  `subjectId` VARCHAR(150) NOT NULL,
  `objectId` VARCHAR(150) NOT NULL,
  `text` TEXT NOT NULL,
  `type`  ENUM('join-request', 'friend-request') NOT NULL,
  `unseen` TINYINT NOT NULL,
  `createdAt` TIMESTAMP NOT NULL,
  PRIMARY KEY(id)
);

CREATE TABLE `view` (
  `owner` VARCHAR(150),
  `viewer` INT NOT NULL,
  PRIMARY KEY(owner, viewer)
);

CREATE DATABASE IF NOT EXISTS `archive`;
USE `archive`;

CREATE TABLE `report` (
  `itemId` VARCHAR(150),
  `table` ENUM('profile', 'post', 'message') NOT NULL,
  `content` TEXT NOT NULL,
  PRIMARY KEY(itemId)
);
CREATE TABLE `reporter` (
  `owner` VARCHAR(150) NOT NULL,
  `itemId` VARCHAR(150) NOT NULL,
  PRIMARY KEY(owner, itemId)
);

CREATE TABLE `deleted` (
  `id` VARCHAR(150),
  `table` ENUM('profile', 'post', 'message') NOT NULL,
  `content` TEXT NOT NULL,
  PRIMARY KEY(id)
);

-- This query show the utf-8 encoding for all databases.
-- SELECT SCHEMA_NAME 'database', default_character_set_name 'charset', DEFAULT_COLLATION_NAME 'collation' FROM information_schema.SCHEMATA;

-- This statement modify the utf-8 encoding to support Other languages.
-- ALTER TABLE `post` MODIFY COLUMN `description` LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL;
-- ALTER TABLE `message` MODIFY COLUMN `content` LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL;
-- If the column type is VARCHAR, replace LONGTEXT with VARCHAR(250)
-- Or
-- ALTER DATABASE feeds CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;