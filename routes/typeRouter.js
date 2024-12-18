const Router = require("express");
const router = new Router();
const typeController = require("../controllers/typeController");
const roleMiddleware = require("../middlewares/checkRoleMiddleware");

router.post("/", roleMiddleware("ADMIN"), typeController.create);
router.get("/", typeController.getAll);


module.exports = router;