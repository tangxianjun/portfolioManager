CREATE DATABASE  IF NOT EXISTS `portfoliomanager` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `portfoliomanager`;
-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: portfoliomanager
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `com_icon`
--

DROP TABLE IF EXISTS `com_icon`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `com_icon` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `url` varchar(105) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `time` timestamp(6) NULL DEFAULT NULL,
  `sector` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `code_UNIQUE` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `com_icon`
--

LOCK TABLES `com_icon` WRITE;
/*!40000 ALTER TABLE `com_icon` DISABLE KEYS */;
INSERT INTO `com_icon` VALUES (1,'AAPL','https://logo.clearbit.com/apple.com','2025-07-29 03:49:14.000000','Technology','Apple Inc.'),(2,'ADDYY','https://logo.clearbit.com/adidas.com','2025-07-29 03:50:42.000000','Consumer Goods','Adidas AG.'),(3,'AMZN','https://logo.clearbit.com/amazon.com','2025-07-29 03:58:43.000000','Consumer Goods','Amazon.com Inc'),(4,'GOOGL','https://logo.clearbit.com/abc.xyz','2025-07-29 04:01:29.000000','Technology','Alphabet Inc.'),(5,'META','https://logo.clearbit.com/meta.com','2025-07-29 04:02:37.000000','Technology','Meta Platforms'),(6,'MSFT','https://logo.clearbit.com/microsoft.com','2025-07-29 04:03:52.000000','Technology','Microsoft Corp.'),(7,'NKE','https://logo.clearbit.com/nike.com','2025-07-29 04:05:19.000000','Consumer Goods','Nike Inc.'),(8,'NVDA','https://logo.clearbit.com/nvidia.com','2025-07-29 04:06:40.000000','Technology','NVIDIA Corp.'),(9,'TSLA','https://logo.clearbit.com/tesla.com','2025-07-29 04:07:37.000000','Energy','Tesla Inc.'),(10,'WMT','https://logo.clearbit.com/walmart.com','2025-07-29 04:08:33.000000','Consumer Goods','Walmart Inc.');
/*!40000 ALTER TABLE `com_icon` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-29  5:46:23
