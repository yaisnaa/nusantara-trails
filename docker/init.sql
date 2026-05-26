-- Script inisialisasi MariaDB
-- Dijalankan otomatis saat container db pertama kali dibuat
-- Memastikan database dan encoding yang benar sudah tersedia

CREATE DATABASE IF NOT EXISTS `nusantara_trails`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
