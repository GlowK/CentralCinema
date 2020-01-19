// ============================
// SUPERUSERS ROUTES
// ============================
// ============================
// Basic setup - inicial
// ============================
const express = require("express");
const router = express.Router();
const cinemaCentralController = require("../controllers/centralcinema.controllers")
// ============================
// SCIEZKA DO WYSLANIE SYGNALU POST DLA STWORZENIA NOWEGO UZYTKOWNIKA
// ============================
router.post("/", cinemaCentralController.createNewUser);

module.exports = router;