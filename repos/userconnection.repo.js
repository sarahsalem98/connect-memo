
const Connection = require("../models/userconnection.model");

module.exports.send =async (currentuser_id,to_user_id) => {
    try {
        var data={
            user1:currentuser_id,
            user2:to_user_id
        }
      var connection= new Connection(data);
      var res= await connection.save();
      return res;
    } catch (error) {
        console.log(error);
    }
}


module.exports.getAll =async (currentuser_id) => {
    try {
      var res= await Connection.find({$or: [{user1:currentuser_id},{user2:currentuser_id}]});
      return res;
    } catch (error) {
        console.log(error);
    }
}


module.exports.changeStatus =async (connection_id,status) => {
    try {
        const validStatuses = [ 'accepted', 'blocked'];
        if (!validStatuses.includes(status)) {
          throw new Error(`Invalid status: ${status}. Valid statuses are: ${validStatuses.join(', ')}`);
        }
   
        const updatedConnection = await Connection.findOneAndUpdate(
          { connection_id: connection_id },
          { status: status },
          { new: true } 
        );
    
        if (!updatedConnection) {
          throw new Error(`Connection with ID ${connection_id} not found.`);
        }
      return updatedConnection;
    } catch (error) {
        console.log(error);
    }
}

