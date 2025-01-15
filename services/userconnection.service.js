const { send,getAll,changeStatus } = require("../repos/userconnection.repo");

module.exports.sendConnectionService = async (currentuser_id, to_user_id) => {
    try {
        var res= await send(currentuser_id,to_user_id);
        if(res){
            return {status:1,message:"connection sent successfully",result:res};
        }else{
            return {status:1,message:"something went wrong",result:null}
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports.getAllConnections = async (currentuser_id, to_user_id) => {
    try {
        var res= await getAll(currentuser_id);
        if(res){
            return {status:1,message:"success",result:res};
        }else{
            return {status:1,message:"something went wrong",result:null}
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports.changeConnectionStatusService = async (connection_id, status) => {
    try {
        var res= await changeStatus(connection_id,status);
        if(res){
            return {status:1,message:"connection updatet successfully",result:res};
        }else{
            return {status:1,message:"something went wrong",result:null}
        }
    } catch (error) {
        console.log(error);
    }
}