const mongoose=require("mongoose");
const {v4:uuid4}=require("uuid");
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

const Memory = mongoose.model('Memory', MemorySchema);
module.exports=Memory;