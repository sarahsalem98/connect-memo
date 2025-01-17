const mongoose=require("mongoose");
const {v4:uuid4}=require("uuid");
const User= require("./user.model");
const MemorySchema = new mongoose.Schema({
    memory_id: {type: String,default:()=>uuid4(), required: true },
    title: { type: String, required: true },
    description: { type: String },
    images: [{ type: String }], // URLs or paths to stored images
    multimediaTracks: [{
        type: { type: String, enum: ['audio', 'document', 'other'], required: true },
        path: { type: String, required: true }, // File storage path
    }],
    location: {
        latitude: { type: Number },
        longitude: { type: Number },
    },
    emotions: [{ type: String }], // e.g., 'happy', 'nostalgic', 'emotion codes'
    colorTheme: { type: String, default: '#ffffff' },
    privacy: {
        zone: { type: String, enum: ['private', 'public'], default: 'private' },
        sharedWith: [{ type: String }],
    },
    viewied_by: [{ type: String}],
    createdBy: { type: String, required: true },
}, {
    timestamps: true,
});


MemorySchema.pre("save", async function (next) {
    try {

      const creatorExists = await User.exists({ user_id: this.createdBy });
      if (!creatorExists) {
        throw new Error(`Invalid createdBy: No user found with ID ${this.createdBy}`);
      }
  

      if (this.privacy.sharedWith && this.privacy.sharedWith.length > 0) {
        const sharedWithValidations = await Promise.all(
          this.privacy.sharedWith.map((userId) => User.exists({ user_id: userId }))
        );
  
        if (sharedWithValidations.some((isValid) => !isValid)) {
          throw new Error("One or more user IDs in privacy.sharedWith are invalid.");
        }
      }
  
      next();
    } catch (error) {
      next(error);
    }
  });

  MemorySchema.pre(["updateOne", "findOneAndUpdate"], async function (next) {
    try {
      const update = this.getUpdate();
  
      // Validate `createdBy` if being updated
      if (update.createdBy) {
        const creatorExists = await User.exists({ user_id: update.createdBy });
        if (!creatorExists) {
          throw new Error(`Invalid createdBy: No user found with ID ${update.createdBy}`);
        }
      }
  
      // Validate `privacy.sharedWith` if being updated
      if (update["privacy.sharedWith"]) {
        const sharedWithValidations = await Promise.all(
          update["privacy.sharedWith"].map((userId) => User.exists({ user_id: userId }))
        );
  
        if (sharedWithValidations.some((isValid) => !isValid)) {
          throw new Error("One or more user IDs in privacy.sharedWith are invalid.");
        }
      }
  
      next();
    } catch (error) {
      next(error);
    }
  });

const Memory = mongoose.model('Memory', MemorySchema);
module.exports=Memory;