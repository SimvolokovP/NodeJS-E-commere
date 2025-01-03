const Router = require("express");
const router = new Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/registration", userController.register);
router.post("/login", userController.login);
router.get("/auth", authMiddleware, userController.check);

module.exports = router;
