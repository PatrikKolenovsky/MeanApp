const express = require("express");
const router = express.Router();
const usersController = require('../controllers/usersController');

router.post("/signup", usersController.userSignUp);

router.post("/login", usersController.userLogin);

router.delete("/:userId",  checkAuth, usersController.deleteUserById);

router.get('/all',  checkAuth, usersController.getAllUsers)

module.exports = router;
