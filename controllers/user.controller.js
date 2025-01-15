
const UserViewModel = require("../viewModels/user");
const { uploadService } = require("../services/media.service");
const { getUsers, createUser,updateUser,getUser,softDeleteUser, deleteUser } = require("../services/user.service");
const { imageKitPayloadBuilder } = require("../utils/media.util");

module.exports = (() => {
    const router = require("express").Router();

    router.get("/user", async (req, res, next) => {
        const users = await getUsers();
        res.status(200).json(users);

    })

    router.post("/user/create", async (req, res, next) => {
        let profilePicture = null;

        if (req.files && req.files.profilePicture) {
            profilePicture = await uploadProfilePicture(req.files.profilePicture, "userspic");
        }

        const uservmodel = new UserViewModel({ ...req.body, profilePicture });

        const result = await createUser(uservmodel);
        res.json({ status: result.status, user_id: result.user_id });
    })


    router.put("/user/update", async (req, res, next) => {
        let profilePicture = null;
       
        if (req.files && req.files.profilePicture) {
            profilePicture = await uploadProfilePicture(req.files.profilePicture, "userspic");
        }

        const userViewModel = new UserViewModel({ ...req.body, profilePicture });
        const result = await updateUser(userViewModel);
        res.json(result);

    })

    router.get("/user/:user_id", async (req, res, next) => {
        let user_id=req.params.user_id;
        const result = await getUser(user_id);
        res.json(result);

    })
    router.delete("/user/:user_id", async (req, res, next) => {
        let result;
        let user_id = req.params.user_id;
        result = await softDeleteUser(user_id);
        res.json(result);
    })



    const uploadProfilePicture = async (uploadedFile, folderName) => {
        if (uploadedFile) {
            const { fileName, src } = imageKitPayloadBuilder(uploadedFile);
            const profilePic = { src, fileName };

            const result = await uploadService.uploadOneFile({ file: profilePic, folderName });
            if (result.status === 1) {
                return result.url;
            } else {
                throw new Error("Error uploading file");
            }
        }
        return null;
    };

    return router;
})();