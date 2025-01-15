const Memory = require("../models/memory.model");

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
        return memory;
    } catch (id) {
        console.log(id);
    }

}
module.exports.listAllMemories= async () => {
    try {
        var memories=await Memory.find({});
        return memories;

    } catch (error) {
        console.log(error);
    }

}
module.exports.deleteMemory=async()=>{
    try{
   
        var memory = await Memory.findOneAndDelete({ memory_id: id });
        return memory;
    }catch(error){
        console.log(error);
    }
}