const { Router } = require("express");
const express = require("express");
const route = express.Router();
const UserController = require("../controller/user_controller");

route.post("/signup", UserController.signup);
route.post("/login", UserController.login);
route.get("/verify/:id", UserController.verify);
module.exports = route;
