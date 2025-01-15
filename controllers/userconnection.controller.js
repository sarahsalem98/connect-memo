const {sendConnectionService,getAllConnections,changeConnectionStatusService}=require("../services/userconnection.service");

module.exports = (() => {
    const router = require("express").Router();
    
    router.post("/connection/send", async (req, res, next) => {
       if(req.body.current_user&&req.body.to_user){
           let result = await sendConnectionService(req.body.current_user,req.body.to_user);
           res.json(result);
       }else{
        res.json({status:0,message:"please enter the users ids",res:null});
       }
    })

        
    router.post("/connection/get", async (req, res, next) => {
        if(req.body.current_user){
            let result = await getAllConnections(req.body.current_user);
            res.json(result);
        }else{
         res.json({status:0,message:"please enter the user id",res:null});
        }
     })


    router.post("/connection/changeStatus", async (req, res, next) => {
        if(req.body.connection_id&&req.body.status){
            let result = await changeConnectionStatusService(req.body.connection_id,req.body.status);
            res.json(result);
        }else{
         res.json({status:0,message:"please enter the users ids",res:null});
        }
     })
    return router;
})();   
