-- ─── LINKUP SEED DATA ────────────────────────────────────────────────────────
-- Datos de prueba iniciales para la aplicación Linkup.
-- Las contraseñas son el hash bcrypt de "password123"

USE linkup;

-- Limpiar en orden inverso para respetar las foreign keys
DELETE FROM likes;
DELETE FROM comments;
DELETE FROM posts;
DELETE FROM users;

-- Reiniciar auto_increment
ALTER TABLE likes    AUTO_INCREMENT = 1;
ALTER TABLE comments AUTO_INCREMENT = 1;
ALTER TABLE posts    AUTO_INCREMENT = 1;
ALTER TABLE users    AUTO_INCREMENT = 1;

-- ─── USUARIOS ─────────────────────────────────────────────────────────────────
-- Contraseña de todos: "password123"
INSERT INTO users (username, email, password, avatar_url) VALUES
  ('ana_garcia',   'ana@linkup.com',   '$2a$10$ZiIhtz.y7cjq.y7dn8YHmOuUFgzF2O1CIFRzDPAKMA8aMxBToCRvC', NULL),
  ('carlos_dev',   'carlos@linkup.com','$2a$10$ZiIhtz.y7cjq.y7dn8YHmOuUFgzF2O1CIFRzDPAKMA8aMxBToCRvC', NULL),
  ('sofia_ux',     'sofia@linkup.com', '$2a$10$ZiIhtz.y7cjq.y7dn8YHmOuUFgzF2O1CIFRzDPAKMA8aMxBToCRvC', NULL);

-- ─── POSTS ────────────────────────────────────────────────────────────────────
INSERT INTO posts (user_id, content, image_url) VALUES
  (1, '¡Bienvenidos a Linkup! La nueva red social para conectar con personas increíbles. 🚀', NULL),
  (2, 'Acabo de terminar mi primer proyecto en Node.js con Express. La arquitectura de 3 capas es realmente poderosa. ¡A seguir aprendiendo!', NULL),
  (3, 'Tip de UX: los formularios con validación en tiempo real mejoran la experiencia del usuario en un 40%. Siempre validen sus inputs antes de enviar al backend.', NULL),
  (1, 'MySQL es una excelente opción para aplicaciones web. Hoy aprendí sobre índices y cómo aceleran las consultas con JOIN. 💡', NULL),
  (2, '¿Alguien más usa Postman para probar sus APIs REST? Es indispensable en el flujo de desarrollo. ¡Comparte tus tips!', NULL),
  (3, 'Diseño responsivo no es opcional, es obligatorio. El 60% del tráfico web viene de dispositivos móviles.', NULL);

-- ─── COMENTARIOS ──────────────────────────────────────────────────────────────
INSERT INTO comments (post_id, user_id, content) VALUES
  (1, 2, '¡Qué emocionante! Ya me registré, la plataforma se ve muy bien.'),
  (1, 3, 'Me encanta la idea. ¿Planean agregar mensajes directos pronto?'),
  (2, 1, 'Excelente Carlos! El patrón MVC con Express es muy limpio.'),
  (2, 3, 'Totalmente de acuerdo, la separación de capas facilita el mantenimiento.'),
  (3, 1, 'Muy buen tip Sofía, yo uso React Hook Form para las validaciones.'),
  (3, 2, 'El 40% es mucho! Dónde puedo leer más sobre ese estudio?'),
  (4, 2, 'Los índices son fundamentales. EXPLAIN en MySQL te ayuda a ver si los está usando.'),
  (5, 1, 'Sí! Postman es esencial. También puedes usar Thunder Client si usas VS Code.'),
  (5, 3, 'Yo uso Insomnia, tiene una interfaz muy intuitiva.'),
  (6, 1, 'Completamente de acuerdo. Mobile first siempre.');

-- ─── LIKES ────────────────────────────────────────────────────────────────────
INSERT INTO likes (post_id, user_id) VALUES
  (1, 2), (1, 3),
  (2, 1), (2, 3),
  (3, 1), (3, 2),
  (4, 2), (4, 3),
  (5, 1), (5, 3),
  (6, 1), (6, 2);
