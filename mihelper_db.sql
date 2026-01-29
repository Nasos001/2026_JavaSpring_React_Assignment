-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Εξυπηρετητής: 127.0.0.1
-- Χρόνος δημιουργίας: 29 Ιαν 2026 στις 20:34:16
-- Έκδοση διακομιστή: 10.4.32-MariaDB
-- Έκδοση PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Βάση δεδομένων: `mihelper_db`
--

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `announcements`
--

CREATE TABLE `announcements` (
  `id` int(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `announcements`
--

INSERT INTO `announcements` (`id`, `title`, `content`, `created_at`) VALUES
(1, 'Maintenance', 'There will be a maintenance tomorrow', '2026-01-27 17:25:11'),
(2, 'An important announcement', 'I like pizza, but no money :(', '2026-01-27 17:25:11');

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `categories`
--

CREATE TABLE `categories` (
  `id` int(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `priority` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `categories`
--

INSERT INTO `categories` (`id`, `name`, `description`, `priority`) VALUES
(15, 'Incident', 'A problem you encountered recently using our services.', 'HIGH'),
(16, 'Reccurring Problem', 'An ongoing problem that hinders your experience using our services.', 'HIGH'),
(17, 'User Information', 'A request for your information to be updated on our services.', 'LOW'),
(18, 'Informational', 'A question you have about our services.', 'MEDIUM');

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `requests`
--

CREATE TABLE `requests` (
  `id` bigint(20) NOT NULL,
  `description` varchar(1000) NOT NULL,
  `category_id` int(11) NOT NULL,
  `status` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `user_id` int(11) NOT NULL,
  `technician` int(11) DEFAULT NULL,
  `comments` varchar(255) DEFAULT NULL,
  `actions` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `requests`
--

INSERT INTO `requests` (`id`, `description`, `category_id`, `status`, `created_at`, `updated_at`, `user_id`, `technician`, `comments`, `actions`) VALUES
(10, 'I have a problem', 15, 'COMPLETED', '2026-01-29 12:54:54', '2026-01-29 19:33:03', 17, 15, 'It was nothing serious', 'Do this and that'),
(11, 'I have recently encountered a very scary looking pixel in your game...', 15, 'IN_PROGRESS', '2026-01-29 13:58:20', '2026-01-29 14:08:31', 17, 18, NULL, NULL),
(12, 'Can you help me with ...', 15, 'NEW', '2026-01-29 19:26:30', '2026-01-29 19:33:45', 17, NULL, NULL, '');

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `request_files`
--

CREATE TABLE `request_files` (
  `id` bigint(20) NOT NULL,
  `filename` varchar(255) NOT NULL,
  `path` varchar(255) NOT NULL,
  `request_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `request_files`
--

INSERT INTO `request_files` (`id`, `filename`, `path`, `request_id`) VALUES
(13, 'Consensus_Illustration.png', '3ff8e5f1-0854-4f4b-b54f-4fcf6317b9c7_Consensus_Illustration.png', 11),
(14, 'revocation.uxf', '465db9dc-c162-40cb-8d29-996db9c8f3a1_revocation.uxf', 12);

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `surname` varchar(255) NOT NULL,
  `country` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `role` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `name`, `surname`, `country`, `city`, `address`, `username`, `role`) VALUES
(9, 'admin123@gmail.com', '$2a$10$OAD5CaoTmtcKkOvZ9QhA2ejF2VAi9.tnQ3WdWe.Xo8GtENB0juIW6', 'Ad', 'Min', 'Afghanistan', 'Herat', 'Addres', 'Admin', 'ADMIN'),
(15, 'some@gmail.com', '$2a$10$g3Xh3g/Tpp6vIi6mwWmwBuYvC/yJ20wO.05/jTVsUZKA7ZHmYl/Ui', 'someName', 'someSurname', 'Armenia', 'Erebuni Fortress', '12 23', 'someUsername', 'TECHNICIAN'),
(17, 'jondoe@gmail.com', '$2a$10$Qfh28s1Ry9Twct2S9IRLcO3Vq6zIXM37fakEzTh/E5fgzx/x6jNZO', 'Jon', 'Doe', 'Armenia', 'Ijevan', 'jondoe 3-5', 'Jonnie', 'USER'),
(18, 'makos@gmail.com', '$2a$10$ESEfideXZVvjr75Oe4kR/OWCst.GBFDeEpkWDTIn1RiDTpdw0L4WW', 'Makos', 'Papas', 'Australia', 'Agnes Water', 'somewhere', 'Mike', 'TECHNICIAN');

--
-- Ευρετήρια για άχρηστους πίνακες
--

--
-- Ευρετήρια για πίνακα `announcements`
--
ALTER TABLE `announcements`
  ADD PRIMARY KEY (`id`);

--
-- Ευρετήρια για πίνακα `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Ευρετήρια για πίνακα `requests`
--
ALTER TABLE `requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `fk_requests_user` (`user_id`);

--
-- Ευρετήρια για πίνακα `request_files`
--
ALTER TABLE `request_files`
  ADD PRIMARY KEY (`id`),
  ADD KEY `request_id` (`request_id`);

--
-- Ευρετήρια για πίνακα `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_users_email` (`email`);

--
-- AUTO_INCREMENT για άχρηστους πίνακες
--

--
-- AUTO_INCREMENT για πίνακα `announcements`
--
ALTER TABLE `announcements`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT για πίνακα `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT για πίνακα `requests`
--
ALTER TABLE `requests`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT για πίνακα `request_files`
--
ALTER TABLE `request_files`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT για πίνακα `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- Περιορισμοί για άχρηστους πίνακες
--

--
-- Περιορισμοί για πίνακα `requests`
--
ALTER TABLE `requests`
  ADD CONSTRAINT `fk_requests_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `requests_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);

--
-- Περιορισμοί για πίνακα `request_files`
--
ALTER TABLE `request_files`
  ADD CONSTRAINT `request_files_ibfk_1` FOREIGN KEY (`request_id`) REFERENCES `requests` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
