-- + CREATE TABLE `person` (
-- + `id` int unsigned NOT NULL AUTO_INCREMENT,
-- + `preferred_name` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci,
-- + `country_id` int,
-- + `profile_photo_id` char(21),
-- + `blurb` varchar(280) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci,
-- + `username` varchar(30),
-- + `instagram_handle` varchar(150),
-- + `tiktok_handle` varchar(150),
-- + `birthdate` date,
-- + `user_id` varchar(255),
-- + `given_name` varchar(255),
-- + `family_name` varchar(255),
-- + PRIMARY KEY (`id`),
-- + UNIQUE KEY `user_id` (`user_id`),
-- + UNIQUE KEY `username` (`username`),
-- + KEY `idx_given_name` (`given_name`),
-- + KEY `idx_family_name` (`family_name`),
-- + KEY `idx_preferred_name` (`preferred_name`)
-- + ) ENGINE InnoDB,
-- + CHARSET utf8mb4,
-- + COLLATE utf8mb4_0900_ai_ci;




CREATE TABLE "country" (
    country_id SERIAL PRIMARY KEY,
    name varchar(75) NOT NULL,
    continent char(2) NOT NULL
);

CREATE INDEX "country_name" ON "country" (name);

CREATE TABLE "person"(
    id uuid REFERENCES auth.users(id) PRIMARY KEY,
    preferred_name varchar(75),
    country_id INTEGER,
    profile_photo_id char(21),
    blurb varchar(280),
    username varchar(30),
    social_media_handles JSONB,
    birthdate DATE,
    user_id varchar(255),
    given_name varchar(255),
    family_name varchar(255),
    FOREIGN KEY (country_id) REFERENCES country(country_id)
);
CREATE INDEX idx_given_name ON person(given_name);
CREATE INDEX idx_family_name ON person(family_name);
CREATE INDEX idx_preferred_name ON person(preferred_name);




