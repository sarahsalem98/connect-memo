// viewModels/memory.js
class MemoryViewModel {
    constructor(data) {
        const {
            memory_id,
            title,
            description,
            images,
            multimediaTracks,
            location,
            emotions,
            colorTheme,
            privacy,
            viewied_by,
            createdBy,
        } = data;

        if (!title) {
            throw new Error("Title is required fields.");
        }
        this.memory_id=memory_id||undefined;
        this.title = title;
        this.description = description || null;
        this.images = Array.isArray(images) ? images : [];
        this.multimediaTracks = Array.isArray(multimediaTracks) ? multimediaTracks : [];
        this.location = location || null;
        this.emotions = Array.isArray(emotions) ? emotions : [];
        this.colorTheme = colorTheme || "#ffffff";
        this.privacy = privacy || { zone: "private", sharedWith: [] };
        this.viewied_by = Array.isArray(viewied_by) ? viewied_by : [];
        this.createdBy = createdBy||null;
    }
}

module.exports = MemoryViewModel;
