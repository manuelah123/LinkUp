-- ─── LINKUP DATABASE SCHEMA ──────────────────────────────────────────────────
-- Base de datos: MySQL (compatible con AWS RDS MySQL)
-- Crear y seleccionar la base de datos

CREATE DATABASE IF NOT EXISTS linkup
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE linkup;

-- ─── TABLA: users ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id         INT          NOT NULL AUTO_INCREMENT,
  username   VARCHAR(50)  NOT NULL,
  email      VARCHAR(100) NOT NULL,
  password   VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(500) DEFAULT NULL,
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email    (email),
  UNIQUE KEY uq_users_username (username)
);

-- ─── TABLA: posts ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS posts (
  id         INT          NOT NULL AUTO_INCREMENT,
  user_id    INT          NOT NULL,
  content    VARCHAR(500) NOT NULL,
  image_url  VARCHAR(500) DEFAULT NULL,
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_posts_user_id (user_id),
  KEY idx_posts_created_at (created_at),
  CONSTRAINT fk_posts_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- ─── TABLA: comments ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS comments (
  id         INT          NOT NULL AUTO_INCREMENT,
  post_id    INT          NOT NULL,
  user_id    INT          NOT NULL,
  content    VARCHAR(500) NOT NULL,
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_comments_post_id (post_id),
  KEY idx_comments_user_id (user_id),
  CONSTRAINT fk_comments_post FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE,
  CONSTRAINT fk_comments_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- ─── TABLA: likes ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS likes (
  id      INT NOT NULL AUTO_INCREMENT,
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_likes_post_user (post_id, user_id),
  CONSTRAINT fk_likes_post FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE,
  CONSTRAINT fk_likes_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);
