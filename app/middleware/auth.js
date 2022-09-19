const jwt = require("jsonwebtoken");

const userModel = require("../database/models/user.model");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("bearer ", ""); 
    const decoded = jwt.verify(token, "zBlogPosts"); 
    const userData = await userModel.findOne({
      _id: decoded._id,
      "tokens.token": token,
    }); 
    
    if (!userData) throw new Error("unAuthorized"); 
    req.user = userData; 
    req.token = token; 
    next(); 
  } catch (e) {
    res.status(500).send({ apiStatus: false, date: e, message: e.message });
  }
};

module.exports = auth;