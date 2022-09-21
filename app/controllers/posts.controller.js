const postModel = require("../database/models/post.model");

class Post {
  static allPosts = async (req, res) => {
    try {
      const posts = await postModel.find();

      res.status(200).send({
        apiStatus: true,
        data: posts,
        message: "all posts fetched",
      });
    } catch (e) {
      res.status(500).send({
        apiStatus: false,
        message: e.message,
      });
    }
  };
  static addPost = async (req, res) => {
    try {
      const postData = new postModel({
        ...req.body,
        userId: req.user._id,
        author: req.user.name,
      });
      await postData.save();
      res.status(200).send({
        apiStatus: true,
        data: postData,
        message: "post added",
      });
    } catch (e) {
      res.status(500).send({
        apiStatus: false,
        message: e.message,
      });
    }
  };

  static readPost = async (req, res) => {
    try {
      const post = await postModel.findOne({ _id: req.params.id });

      res.status(200).send({
        apiStatus: true,
        data: post,
        message: "post fetched",
      });
    } catch (e) {
      res.status(500).send({
        apiStatus: false,
        data: e,
        message: e.message,
      });
    }
  };

  static myPosts = async (req, res) => {
    try {
      await req.user.populate("myPosts");

      res.status(200).send({
        apiStatus: true,
        data: req.user.myPosts,
        message: "user posts fetched",
      });
    } catch (e) {
      res.status(500).send({
        apiStatus: false,
        data: e,
        message: e.message,
      });
    }
  };

  //virtual doesn't make changes to actual db fix this
  static deletePost = async (req, res) => {
    try {
      await postModel.findOneAndDelete({
        _id: req.params.id,
        userId: req.user._id,
      });
      await req.user.populate("myPosts");
      await req.user.save();
      res.status(200).send({
        apiStatus: true,
        data: req.user.myPosts,
        message: "post deleted",
      });
    } catch (e) {
      res.status(500).send({
        apiStatus: false,
        data: e,
        message: e.message,
      });
    }
  };

  static editPost = async (req, res) => {
    try {
      const updates = Object.keys(req.body);
      const post = await postModel.findOne({
        _id: req.params.id,
        userId: req.user._id,
      });
      updates.forEach((key) => (post[key] = req.body[key]));
      await post.save();
      res.status(200).send({
        apiStatus: true,
        data: post,
        message: "post edited",
      });
    } catch (e) {
      res.status(500).send({
        apiStatus: false,
        data: e,
        message: e.message,
      });
    }
  };

  static addComment = async (req, res) => {
    try {
      const post = await postModel.findById(req.params.id);
      let obj = {
        cuId: req.user._id,
        cuName: req.user.name,
        conComm: req.body.conComm,
      };
      post.comments.push(obj);
      await post.save();
      res.status(200).send({
        apiStatus: true,
        data: post,
        message: "comment added",
      });
    } catch (e) {
      res.status(500).send({
        apiStatus: false,
        message: e.message,
      });
    }
  };

  static editComment = async (req, res) => {
    try {
      const post = await postModel.findOne({
        "comments._id": req.params.id,
      });

      let c = post.comments.find((comment) => comment.id == req.params.id);

      if (String(req.user._id) != String(c.cuId))
        throw new Error("not Authorized");

      c.conComm = req.body.conComm;
      post.save();

      res.status(200).send({
        apiStatus: true,
        data: post,
        message: "comment edited",
      });
    } catch (e) {
      res.status(500).send({
        apiStatus: false,
        message: e.message,
      });
    }
  };

  static deleteComment = async (req, res) => {
    try {
      const post = await postModel.findOne({
        "comments._id": req.params.id,
      });

      let c = post.comments.find((comment) => comment.id == req.params.id);
      let index = post.comments.findIndex((comment) => comment.id == req.params.id);
      
      if (String(req.user._id) != String(c.cuId))
        throw new Error("not Authorized");

      post.comments.splice(index,1)
      post.save();

      res.status(200).send({
        apiStatus: true,
        data: post,
        message: "comment deleted",
      });
    } catch (e) {
      res.status(500).send({
        apiStatus: false,
        message: e.message,
      });
    }
  };
}

module.exports = Post;
