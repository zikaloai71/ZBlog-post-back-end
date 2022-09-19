const mongoose = require("mongoose");

const postsSchema = mongoose.Schema(
  {
     userId:{
      type:mongoose.Schema.Types.ObjectId,
      required:true,
      ref:'User'
  },
    title:{
        type:String,
        required:true,
        trim:true,
        min:5,
        max:12,
    },
    snippet:{
        type:String,
        trim:true,
        required:true,
        min:5,
        max:20,
    },
    content:{
        type:String,
        required:true,
        trim:true,
    },
    category:{
        type:String,
        enum:['science','programming','social','political','finance','other'],
        lowercase:true,
        required:true,
        trim:true,
    },
    comments:[
        {
            cuId:{
                type:mongoose.Schema.Types.ObjectId,
                required:true,
                ref:'User'
            },
            conComm:{
                type:String,
                required:true,
            }
        }
    ],
    likes:{
      type:Number,
      default:0,
    }
        
  },
  { timestamps: true }
);

postsSchema.methods.toJSON = function(){
  const postsData = this.toObject()
  delete postsData.__v
  return postsData
}


const posts = mongoose.model("posts", postsSchema);

module.exports = posts;