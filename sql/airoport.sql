CREATE TABLE `airoport`.`users` (
  `id_user` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  `email` VARCHAR(45) NULL,
  `password` VARCHAR(250) NULL,
  `role` VARCHAR(45) NULL ,
  PRIMARY KEY (`id_user`));


CREATE TABLE `airoport`.`plan` (
  `id_plan` INT NOT NULL AUTO_INCREMENT,
  `capacity` INT NULL,
  `occupation` VARCHAR(45) NULL,
  `disponibility` VARCHAR(45) NULL,
  PRIMARY KEY (`id_plan`));

  CREATE TABLE `airoport`.`city` (
  `id_city` INT NOT NULL AUTO_INCREMENT,
  `attitude_city` VARCHAR(45) NULL,
  `longitude_city` VARCHAR(45) NULL,
  PRIMARY KEY (`id_city`));

CREATE TABLE `airoport`.`traject` (
  `id_traject` INT NOT NULL AUTO_INCREMENT,
  `price_traject` VARCHAR(45) NULL,
  `date_traject` DATE NULL,
  `time_traject` TIME NULL,
  PRIMARY KEY (`id_traject`));

  CREATE TABLE `airoport`.`reservation` (
  `id_reservation` INT NOT NULL AUTO_INCREMENT,
  `date_reservation` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `total_price_r` DECIMAL NULL,
  `etat` VARCHAR(45) NULL,
  `nb_persens` INT NULL,
  PRIMARY KEY (`id_reservation`));

  ALTER TABLE `airoport`.`traject` 
ADD COLUMN `city_id` INT NULL AFTER `time_traject`,
ADD INDEX `fk_trajet_city_idx` (`city_id` ASC) VISIBLE;
;
ALTER TABLE `airoport`.`traject` 
ADD CONSTRAINT `fk_trajet_city`
  FOREIGN KEY (`city_id`)
  REFERENCES `airoport`.`city` (`id_city`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;


ALTER TABLE `airoport`.`reservation` 
ADD COLUMN `user_id` INT NULL AFTER `nb_persens`,
ADD INDEX `fk_reservation_user_idx` (`user_id` ASC) VISIBLE;
;
ALTER TABLE `airoport`.`reservation` 
ADD CONSTRAINT `fk_reservation_user`
  FOREIGN KEY (`user_id`)
  REFERENCES `airoport`.`users` (`id_user`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;


ALTER TABLE `airoport`.`reservation` 
ADD COLUMN `traject_id` INT NULL AFTER `user_id`,
ADD INDEX `fk_reservation_traject_idx` (`traject_id` ASC) VISIBLE;
;
ALTER TABLE `airoport`.`reservation` 
ADD CONSTRAINT `fk_reservation_traject`
  FOREIGN KEY (`traject_id`)
  REFERENCES `airoport`.`traject` (`id_traject`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;


CREATE TABLE `airoport`.`category` (
  `id_category` INT NOT NULL AUTO_INCREMENT,
  `name_category` VARCHAR(45) NULL,
  `price_category` DECIMAL NULL,
  `poursantage_reduction` DECIMAL NULL,
  PRIMARY KEY (`id_category`));


