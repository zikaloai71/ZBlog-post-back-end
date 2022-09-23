const router = require("express").Router();
const postController = require("../app/controllers/posts.controller");
const auth = require("../app/middleware/auth");

router.post("/addPost", auth, postController.addPost);

router.get("/allPosts", postController.allPosts);

router.get("/readPost/:id", postController.readPost);

router.post("/readPost/toggleLike/:id", auth, postController.toggleLike);

router.get("/readPost/numberOfLikes/:id", postController.numberOfLikes);

router.post("/readPost/addComment/:id", auth, postController.addComment);

router.patch("/readPost/editComment/:id", auth, postController.editComment);

router.delete(
  "/readPost/deleteComment/:id",
  auth,
  postController.deleteComment
);

router.get("/myPosts", auth, postController.myPosts);

router.delete("/myPosts/deletePost/:id", auth, postController.deletePost);

router.patch("/myPosts/editPost/:id", auth, postController.editPost);

module.exports = router;
