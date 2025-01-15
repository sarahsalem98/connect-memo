const MemoryViewModel = require("../viewModels/memory");
const { uploadService } = require("../services/media.service");
const { createMemoryService,updateMemoryService,allMemoriesService,deleteMemoryService } = require("../services/memory.service");
const { imageKitPayloadBuilder } = require("../utils/media.util");



module.exports = (() => {
    const router = require("express").Router();

    router.post("/memory", async (req, res, next) => {
        const data = req.body;
        if (typeof data.emotions == "string") {
            data.emotions = JSON.parse(data.emotions);
        }
        if (typeof data.location == "string") {
            data.location = JSON.parse(data.location);
        }
        if (typeof data.privacy == "string") {
            data.privacy = JSON.parse(data.privacy);
        }
        let images=[];
        let multimediaTracks=[];
        if (req.files && req.files.images) {
            let uploadedImagesPayloads = [];
            let uploadedImages = req.files.images;
            if (Array.isArray(uploadedImages)) {
                for (let image of uploadedImages) {
                    const { fileName, src } = imageKitPayloadBuilder(image);
                    uploadedImagesPayloads.push({
                        src,
                        fileName,
                    });
                }
            } else {
                const { fileName, src } = imageKitPayloadBuilder(uploadedImages);
                uploadedImagesPayloads.push({
                    src,
                    fileName,
                });
            }
            const responseimgsUrls = await uploadService.upload({
                files: uploadedImagesPayloads,
                folderName: "memory/images"
            });
            if(responseimgsUrls.status==1){images=responseimgsUrls.results.map(res=>res.url)}
        }

        if (req.files && req.files.multimediaTracks) {
            var uploadedMultimediaTracksPayloads = [];
            var uploadedMultimediaTracks = req.files.multimediaTracks;
            if (Array.isArray(uploadedMultimediaTracks)) {
                for (let file of uploadedMultimediaTracks) {
                    const { fileName, src } = imageKitPayloadBuilder(file);
                    uploadedMultimediaTracksPayloads.push({
                        src,
                        fileName,
                    });
                }
            } else {
                const { fileName, src } = imageKitPayloadBuilder(uploadedMultimediaTracks);
                uploadedMultimediaTracksPayloads.push({
                    src,
                    fileName,
                });
            }
            const responsemultimediaTracksUrls = await uploadService.upload({
                files: uploadedMultimediaTracksPayloads,
                folderName: "memory/multimediaTracks"
            });
            if(responsemultimediaTracksUrls.status==1){
                multimediaTracks=responsemultimediaTracksUrls.results.map((res,index)=>{
                    return{
                        type:getFileType(res.name),
                        path:res.url
                    }
                })
            }
        }
        const memoryViewModel = new MemoryViewModel({...data,images,multimediaTracks});
        const result = await createMemoryService(memoryViewModel);
        res.json(result);

    })

    router.put("/memory", async (req, res, next) => {

        const data = req.body;
        if (typeof data.emotions == "string") {
            data.emotions = JSON.parse(data.emotions);
        }
        if (typeof data.location == "string") {
            data.location = JSON.parse(data.location);
        }
        if (typeof data.privacy == "string") {
            data.privacy = JSON.parse(data.privacy);
        }
        if (typeof data.viewied_by == "string") {
            data.viewied_by = JSON.parse(data.viewied_by);
        }
        let images=[];
        let multimediaTracks=[];
        if (req.files && req.files.images) {
            let uploadedImagesPayloads = [];
            let uploadedImages = req.files.images;
            if (Array.isArray(uploadedImages)) {
                for (let image of uploadedImages) {
                    const { fileName, src } = imageKitPayloadBuilder(image);
                    uploadedImagesPayloads.push({
                        src,
                        fileName,
                    });
                }
            } else {
                const { fileName, src } = imageKitPayloadBuilder(uploadedImages);
                uploadedImagesPayloads.push({
                    src,
                    fileName,
                });
            }
            const responseimgsUrls = await uploadService.upload({
                files: uploadedImagesPayloads,
                folderName: "memory/images"
            });
            if(responseimgsUrls.status==1){images=responseimgsUrls.results.map(res=>res.url)}
        }

        if (req.files && req.files.multimediaTracks) {
            var uploadedMultimediaTracksPayloads = [];
            var uploadedMultimediaTracks = req.files.multimediaTracks;
            if (Array.isArray(uploadedMultimediaTracks)) {
                for (let file of uploadedMultimediaTracks) {
                    const { fileName, src } = imageKitPayloadBuilder(file);
                    uploadedMultimediaTracksPayloads.push({
                        src,
                        fileName,
                    });
                }
            } else {
                const { fileName, src } = imageKitPayloadBuilder(uploadedMultimediaTracks);
                uploadedMultimediaTracksPayloads.push({
                    src,
                    fileName,
                });
            }
            const responsemultimediaTracksUrls = await uploadService.upload({
                files: uploadedMultimediaTracksPayloads,
                folderName: "memory/multimediaTracks"
            });
            if(responsemultimediaTracksUrls.status==1){
                multimediaTracks=responsemultimediaTracksUrls.results.map((res,index)=>{
                    return{
                        type:getFileType(res.name),
                        path:res.url
                    }
                })
            }
        }
        const memoryViewModel = new MemoryViewModel({...data,images,multimediaTracks});
        const result = await updateMemoryService(memoryViewModel);
        res.json(result);

    })

    router.get("/memory/:memory_id",async(req,res,next)=>{
        var memory_id=req.params.memory_id;
        var response=await allMemoriesService(memory_id);
        return res.json(response);
    })
    router.get("/memory",async(req,res,next)=>{
        var response=await allMemoriesService(null);
        return res.json(response);
    })
    
    router.delete("/memory/:memory_id",async(req,res,next)=>{
        var memory_id=req.params.memory_id;
        var response=await deleteMemoryService(memory_id);
        return res.json(response);
    })


    const getFileType =(fileName) => {
        const ext = fileName.split('.').pop().toLowerCase();
        if (['mp3', 'wav', 'flac'].includes(ext)) {
            return 'audio';
        }
        if (['mp4', 'avi', 'mov'].includes(ext)) {
            return 'video';
        }
        if (['pdf', 'docx', 'xlsx','txt'].includes(ext)) {
            return 'document';
        }
        return 'other'; 
    };


    return router;
})();