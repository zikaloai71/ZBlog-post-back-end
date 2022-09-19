const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    age: {
      type: Number,
      default: 21,
      min:18,
      required:true,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    image: { type: String, trim: true },
    password: {
      type: String,
      trim: true,
      required: true,
    },
    gender: {
      type: String,
      trim: true,
      enum: ["male", "female" ,"prefer not to say"],
      lowercase:true
    },
    tokens:[
      {
        token:{type:String , required:true}
      }
    ]
  },
  { timestamps: true }
);

userSchema.methods.toJSON = function () {
  const userData = this.toObject();
  delete userData.__v;
  return userData;
};

userSchema.pre("save", async function () {
  const data = this;
  if (data.isModified("password")) {
    data.password = await bcryptjs.hash(data.password, 12);
  }
});

userSchema.statics.login = async (email, pass) => {
    const userData = await User.findOne({ email });
    if (!userData) throw new Error("invalid email");
    const isValid = await bcryptjs.compare(pass, userData.password);
    if (!isValid) throw new Error("invalid password");
    return userData
  };

userSchema.methods.generateToken= async function(){
  const user = this;
  const token = jwt.sign({_id: user._id}, "zBlogPosts")
  if (user.tokens.length == 3 ) throw new Error("maximum logged in devices 3")
  user.tokens = user.tokens.concat({token}) //make all tokens of user in array
  await user.save()
  return token
}

const User = mongoose.model("User", userSchema);

module.exports = User;
