CREATE TABLE `user_likes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `post_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_like` (`user_id`,`post_id`),
  UNIQUE KEY `UK2lm8qgtxyg539mx4jy7mk5msv` (`user_id`,`post_id`),
  UNIQUE KEY `UKk9r8nwpcdfxn3s1m9c1r9at5a` (`user_id`,`post_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
SELECT * FROM board.user_likes;