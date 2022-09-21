const router = require("express").Router();
const userController = require("../app/controllers/users.controller");
const auth = require("../app/middleware/auth");

router.post("/signUp", userController.signUp);

router.post("/logIn", userController.logIn);

router.post("/logOut",auth, userController.logOut);

router.post("/logOutAll",auth, userController.logOutAll);




module.exports = router;