const mongoose=require("mongoose");
const {v4:uuid4}=require("uuid");
const User =require("./user.model");
const ConnectionSchema = new mongoose.Schema({
    connection_id: { type: String,default:()=>uuid4(), required:true}, 
    user1: { type: String, required: true },
    user2: { type: String, required: true },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'blocked'],
        default: 'pending',
    },
    requestedAt: { type: Date, default: Date.now },
    connectedAt: { type: Date },
}, {
    timestamps: true,
});

ConnectionSchema.pre("save", async function (next) {
    try {
     
      if (this.user1 === this.user2) {
        return next(new Error("user1 and user2 must not be the same."));
      }
  

      const user1Exists = await User.exists({ user_id: this.user1 });
      const user2Exists = await User.exists({ user_id: this.user2 });
  
      if (!user1Exists || !user2Exists) {
        return next(new Error("One or both user IDs do not exist in the User table."));
      }
  
      next();
    } catch (error) {
      next(error);
    }
  });

  ConnectionSchema.pre(["updateOne", "findOneAndUpdate"], async function (next) {
    try {
      const update = this.getUpdate();
  
      if (update.user1 && update.user2 && update.user1 === update.user2) {
        return next(new Error("user1 and user2 must not be the same."));
      }
  
      if (update.user1) {
        const user1Exists = await User.exists({ user_id: update.user1 });
        if (!user1Exists) {
          return next(new Error(`User1 with ID ${update.user1} does not exist.`));
        }
      }
  
      if (update.user2) {
        const user2Exists = await User.exists({ user_id: update.user2 });
        if (!user2Exists) {
          return next(new Error(`User2 with ID ${update.user2} does not exist.`));
        }
      }
  
      next();
    } catch (error) {
      next(error);
    }
  });
  
  
const Connection = mongoose.model('Connection', ConnectionSchema);
module.exports=Connection;