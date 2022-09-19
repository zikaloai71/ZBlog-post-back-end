const userModel = require("../database/models/user.model");

class User {
  static signUp = async (req, res) => {
    try {
      const user = new userModel(req.body);
      const token = await user.generateToken();
      await user.save();
      res.status(200).send({
        apiStatus: true,
        date: { user, token },
        message: "user added successfully",
      });
    } catch (e) {
      res.status(500).send({
        apiStatus: false,
        date: e,
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
        date: { userData, token },
        message: "logged in ",
      });
    } catch (e) {
      res.status(500).send({
        apiStatus: false,
        date: e,
        message: e.message,
      });
    }
  };
  
  static logOut = async (req, res) => {
    try {
       let index = req.user.tokens.findIndex(token=> token== req.token)
       req.user.tokens.splice(index,1)
       await req.user.save()
      res.status(200).send({
        apiStatus: true,
        date: req.user,
        message: "logged out ",
      });
    } catch (e) {
      res.status(500).send({
        apiStatus: false,
        date: e,
        message: e.message,
      });
    }
  };

  static logOutAll = async (req, res) => {
    try {
       req.user.tokens = []
       await req.user.save()
       res.status(200).send({
        apiStatus: true,
        date: req.user,
        message: "logged out from all devices",
       });
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
