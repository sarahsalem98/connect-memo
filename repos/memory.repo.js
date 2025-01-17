const Memory = require("../models/memory.model");
const User=require("../models/user.model");

module.exports.createMemoryRepo = async (memorymodel) => {
    try {

        const memory = new Memory(memorymodel);
        const savedMemory = await memory.save();
        return savedMemory;

    } catch (error) {
        console.log(error);
    }

}
module.exports.updateMemoryRepo = async (memoryModel) => {
    try {
        var memory = await Memory.findOne({ memory_id: memoryModel.memory_id });
        if (memory) {
            memory.title = memoryModel.title || memory.title;
            memory.description = memoryModel.description || memory.description;
            memory.images = memoryModel.images.length > 0 ? memoryModel.images : memory.images;
            memory.multimediaTracks = memoryModel.multimediaTracks.length > 0 ? memoryModel.multimediaTracks : memory.multimediaTracks;
            memory.location = memoryModel.location || memory.location;
            memory.emotions = memoryModel.emotions.length > 0 ? memoryModel.emotions : memory.emotions;
            memory.colorTheme = memoryModel.colorTheme || memory.colorTheme;
            memory.privacy = memoryModel.privacy || memory.privacy;
            memory.viewied_by = memoryModel.viewied_by.length > 0 ? memoryModel.viewied_by : memory.viewied_by;

            // Save the updated memory
            var updatedMemory = await memory.save();
            return updatedMemory;

        } else {
            return null;

        }

    } catch (error) {
        console.log(error);
    }

}
module.exports.getMemory = async (id) => {
    try {
        var memory = await Memory.findOne({ memory_id: id });
        if(!memory){
            throw new Error("Memory not found");
        }
        const user= await User.findOne({user_id:memory.createdBy},'first_name last_name email');
        if(!user){
            throw new Error("user not found for the memory");
        }

        const sharedwithUsers= await User.find({
            user_id:{$in:memory.privacy.sharedWith}
        });
        const sharedwithTransformed=sharedwithUsers.map(user=>({
            name: user.first_name + " " + user.last_name,
            email: user.email,
            user_id: user.user_id,
        }));

        const memoryWithUser = {
            ...memory.toObject(),
            privacy:{
                ...memory.privacy,
                sharedWith:sharedwithTransformed
            },
            createdByDetails: {
                id: memory.createdBy,
                name: user.first_name +" "+user.last_name,
                email: user.email,
            },
        };
        return memoryWithUser;
    } catch (error) {
        console.log(error);
    }

}
module.exports.listAllMemories= async () => {
    try {
        const memories = await Memory.aggregate([
            // Perform a lookup to join with the User collection
            {
                $lookup: {
                    from: "users", 
                    localField: "createdBy",
                    foreignField: "user_id", 
                    as: "creatorDetails", 
                },
            },

        
            {
                $unwind: {
                    path: "$creatorDetails",
                    preserveNullAndEmptyArrays: true, 
                },
            },
            {
                $lookup: {
                    from: "users", 
                    localField: "privacy.sharedWith", 
                    foreignField: "user_id",
                    as: "sharedWithDetails", 
                },
            },
            {
                $project: {
                
                    memory_id: 1,
                    title: 1,
                    description: 1,
                    images: 1,
                    multimediaTracks: 1,
                    location: 1,
                    emotions: 1,
                    colorTheme: 1,
                    privacy: {
                        zone: 1,  
                        sharedWith: {
                   
                            $map: {
                                input: "$sharedWithDetails",
                                as: "user",
                                in: {
                                    name: { $concat: ["$$user.first_name", " ", "$$user.last_name"] },
                                    email: "$$user.email", 
                                    user_id: "$$user.user_id",
                                },
                            },
                        },
                    },
                    viewied_by: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    // Add user info to createdBy
                    createdByDetails: {
                        name: { $concat: ["$creatorDetails.first_name", " ", "$creatorDetails.last_name"] },
                        email: "$creatorDetails.email", 
                        user_id: "$creatorDetails.user_id" 
                    }
                 
                },
            },
        ]);

        return memories; 

    } catch (error) {
        console.log(error);
    }

}
module.exports.deleteMemory=async(id)=>{
    try{
   
        var memory = await Memory.findOneAndDelete({ memory_id: id });
        return memory;
    }catch(error){
        console.log(error);
    }
}