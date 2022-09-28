const userModel = require("../database/models/user.model");
const postModel = require("../database/models/post.model");
const path = require("path");
const fs = require("fs");
class User {
  static signUp = async (req, res) => {
    try {
      const user = new userModel(req.body);
      const token = await user.generateToken();
      await user.save();
      res.status(200).send({
        apiStatus: true,
        data: { user, token },
        message: "user added successfully",
      });
    } catch (e) {
      res.status(500).send({
        apiStatus: false,
        data: e,
        message: e.message,
      });
    }
  };


  static logIn = async (req, res) => {
    try {
      const userData = await userModel.login(req.body.email, req.body.password);
      const token = await userData.generateToken();
      res.status(200).send({
        apiStatus: true,
        data: { userData, token },
        message: "logged in ",
      });
    } catch (e) {
      res.status(500).send({
        apiStatus: false,
        data: e,
        message: e.message,
      });
    }
  };

  static logOut = async (req, res) => {
    try {
      let index = req.user.tokens.findIndex((token) => token == req.token);
      req.user.tokens.splice(index, 1);
      await req.user.save();
      res.status(200).send({
        apiStatus: true,
        data: req.user,
        message: "logged out ",
      });
    } catch (e) {
      res.status(500).send({
        apiStatus: false,
        data: e,
        message: e.message,
      });
    }
  };

  static logOutAll = async (req, res) => {
    try {
      req.user.tokens = [];
      await req.user.save();
      res.status(200).send({
        apiStatus: true,
        data: req.user,
        message: "logged out from all devices",
      });
    } catch (e) {
      res.status(500).send({
        apiStatus: false,
        data: e,
        message: e.message,
      });
    }
  };
  static editPassword = async (req, res) => {
    try {
      const valid = await userModel.checkPass(req.user, req.body.oldPass);

      if (!valid) throw new Error("enter correct pass");

      req.user.password = req.body.password;
      await req.user.save();

      res.status(200).send({
        apiStatus: true,
        data: req.user,
        message: "password updated",
      });
    } catch (e) {
      res.status(500).send({
        apiStatus: false,
        data: e,
        message: e.message,
      });
    }
  };

  static editProfile = async (req, res) => {
    try {
      const myUpdates = Object.keys(req.body);
      const allowedEdits = ["name", "age"];
      const validEdits = myUpdates.every((update) =>
        allowedEdits.includes(update)
      );
      if (!validEdits) throw new Error("invalid edits");
      myUpdates.forEach((update) => (req.user[update] = req.body[update]));
  
      await postModel.updateMany({userId:req.user._id}, { $set: { author: req.body.name } });
      
      await req.user.save();

      res.status(200).send({
        apiStatus: true,
        data: req.user,
        message: "data edited",
      });
    } catch (e) {
      res.status(500).send({
        apiStatus: false,
        data: e,
        message: e.message,
      });
    }
  };

  static imgUpload = async (req, res) => {
    try {
      let oldImg;
      
      if (! req.file.path ) throw new Error('no input image');

      if (req.user.image) oldImg = path.join(__dirname, "../../", req.user.image);
      else oldImg = null;

      if (oldImg) fs.unlinkSync(oldImg); 
      
      req.user.image = req.file.path;

      await req.user.save();

      res.status(200).send({
        apiStatus: true,
        data: req.user,
      });
    } catch (e) {
      res.status(500).send({
        apiStatus: false,
        date: e,
        message: e.message,
      });
    }
  };


  static savePost = async (req, res) => {
    try {
      let post = await postModel.findById(req.params.id);

      const check = req.user.savedPosts.findIndex(
        (post) => String(post.postId) == String(req.params.id)
      );
      if (check >= 0) throw new Error("already in saved posts");
      let obj = {
        postId: post._id,
        title: post.title,
        author: post.author,
        snippet: post.snippet,
        content: post.content,
      };
      req.user.savedPosts.push(obj);
      await req.user.save();
      res.status(200).send({
        apiStatus: true,
        data: req.user,
      });
    } catch (e) {
      res.status(500).send({
        apiStatus: false,
        date: e,
        message: e.message,
      });
    }
  };

  static removeSavedPost = async (req, res) => {
    try {
      const index = req.user.savedPosts.findIndex(
        (post) => String(post.postId) == String(req.params.id)
      );

      req.user.savedPosts.splice(index, 1);

      await req.user.save();
      res.status(200).send({
        apiStatus: true,
        data: req.user,
      });
    } catch (e) {
      res.status(500).send({
        apiStatus: false,
        data: e,
        message: e.message,
      });
    }
  };
  static deleteAccount = async (req, res) => {
    try {
      await req.user.remove();
      res.send("done");
    } catch (e) {
      res.status(500).send({
        apiStatus: false,
        date: e,
        message: e.message,
      });
    }
  };
}

module.exports = User;
