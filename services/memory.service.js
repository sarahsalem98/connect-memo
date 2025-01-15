const { createMemoryRepo, updateMemoryRepo, listAllMemories, getMemory, deleteMemory } = require("../repos/memory.repo");

module.exports.createMemoryService = async (memoryViewModel) => {
    try {
        const memoryData = {
            title: memoryViewModel.title,
            description: memoryViewModel.description,
            images: memoryViewModel.images,
            multimediaTracks: memoryViewModel.multimediaTracks,
            location: memoryViewModel.location,
            emotions: memoryViewModel.emotions,
            colorTheme: memoryViewModel.colorTheme,
            privacy: memoryViewModel.privacy,
            viewed_by: memoryViewModel.viewed_by,
            createdBy: memoryViewModel.createdBy,
        };

        const newMemory = await createMemoryRepo(memoryData);
        return { status: 1, message: "memory created successfully", memory: newMemory };

    } catch (error) {
        console.log(error);
    }

}
module.exports.updateMemoryService = async (memoryViewModel) => {
    try {
        const memoryData = {
            memory_id: memoryViewModel.memory_id,
            title: memoryViewModel.title,
            description: memoryViewModel.description,
            images: memoryViewModel.images,
            multimediaTracks: memoryViewModel.multimediaTracks,
            location: memoryViewModel.location,
            emotions: memoryViewModel.emotions,
            colorTheme: memoryViewModel.colorTheme,
            privacy: memoryViewModel.privacy,
            viewied_by: memoryViewModel.viewied_by,
            createdBy: memoryViewModel.createdBy,
        };
        const updateddata = await updateMemoryRepo(memoryData);
        if (updateddata) {
            return { status: 1, message: "memory updated successfully", updatedMemory: updateddata };
        } else {
            return { status: 0, message: "something went wrong", updatedMemory: null };

        }

    } catch (error) {
        console.log(error);
    }


}
module.exports.allMemoriesService = async (id) => {
    try {
        var res=null;
        if (id) {
             res = await getMemory(id);
        } else {
           res= await listAllMemories();
        }
        if (res) {
            return { status: 1, message: "success", result: res };
        } else {
            return { status: 0, message: "no memory found", result: null };
        }

    } catch (error) {
        console.log(error);
    }
}
module.exports.deleteMemoryService=async(id)=>{
   try{
    var res= deleteMemory(id);
    if(res){
        return { status: 1, message: "memory deleted successfully" }; 
    }else{
        return { status: 0, message: "something went wrong" }; 
    }
   }catch(error){
    console.log(error);
   }

}

