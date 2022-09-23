const router = require("express").Router();
const userController = require("../app/controllers/users.controller");
const auth = require("../app/middleware/auth");
const upload = require("../app/middleware/file.upload");

router.post("/signUp", userController.signUp);

router.post("/logIn", userController.logIn);

router.post("/logOut", auth, userController.logOut);

router.post("/logOutAll", auth, userController.logOutAll);

router.get("/me", auth, (req, res) => {
  res.send(req.user);
});

router.post(
  "/me/profileImage",
  auth,
  upload.single("img"),
  userController.imgUpload
);

router.patch("/me/editProfile", auth, userController.editProfile);

router.patch("/me/editPassword", auth, userController.editPassword);

router.post("/me/savedPosts/:id", auth, userController.savePost);

router.delete("/me/deletePost/:id", auth, userController.removeSavedPost);

router.delete("/me/deleteAccount", auth, userController.deleteAccount);

module.exports = router;
