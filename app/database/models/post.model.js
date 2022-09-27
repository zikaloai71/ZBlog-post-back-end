const mongoose = require("mongoose");

const postsSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      min: 5,
      max: 15,
      required: true,
      trim: true,
     
    },
    snippet: {
      type: String,
      min: 5,
      max: 30,
      trim: true,
      required: true,
    
    },
    content: {
      type: String,
      min:1000,
      required: true,
      trim: true,
      
    },
    category: {
      type: String,
      enum: [
        "science",
        "programming",
        "social",
        "political",
        "finance",
        "other",
      ],
      lowercase: true,
      required: true,
      trim: true,
    },
    comments: [
      {
        cuId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "User",
        },
        cuName: {
          type: String,
          trim: true,
          required: true,
          ref: "User",
        },
        conComm: {
          type: String,
          required: true,
        },
      },
    ],
    likes: [
      {
        liId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "User",
        },
        luName: {
          type: String,
          trim: true,
          required: true,
          ref: "User",
        },
      },
    ],
  },
  { timestamps: true }
);

postsSchema.methods.toJSON = function () {
  const postsData = this.toObject();
  delete postsData.__v;
  return postsData;
};

const posts = mongoose.model("posts", postsSchema);

module.exports = posts;
