const bcrypt = require('bcryptjs');
const { getUsers, createUser, updateUser, getUser ,deleteUser ,changeStatus} = require("../repos/user.repo");
const User = require("../models/user.model");

module.exports.getUsers = async () => {
    try{
        var users=await getUsers();
        return { status: 1,message:"success", users:users};
            
    }catch(error){
        console.log(error);
    }
  
}
module.exports.createUser = async (UserViewModel) => {
    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(UserViewModel.password, 10);

        // Create user using the schema
        const newUser = new User({
            first_name: UserViewModel.first_name,
            last_name: UserViewModel.last_name,
            email: UserViewModel.email,
            password: hashedPassword,
            profilePicture: UserViewModel.profilePicture,
            is_active: UserViewModel.is_active,
        });
        var result = await createUser(newUser);
        return { status: 1,message:"success", user_id: result.user_id };
    } catch (error) {
        console.log(error);
    }
}

module.exports.updateUser = async (UserViewModel) => {
    try {
        if (!UserViewModel.user_id) {
            throw new Error("user_id is required");
        }
        const updatedUser = await updateUser(UserViewModel);
        if (updatedUser) {
            return {
                status: 1,
                message: 'User updated successfully',
                user_id: updatedUser.user_id,
                user: updatedUser
            };
        } else {
            return {
                status: 0,
                message: 'User not found',
                user_id: UserViewModel.user_id
            };
        }
    } catch (error) {
        console.log(error);
    }

}
module.exports.getUser = async (id) => {
    try {
        const user = await getUser(id);
        if (user) {
            return { status: 1, message: "success", user: user }
        } else {
            return { status: 0, message: "no user found", user: null }
        }
    } catch (error) {
        console.log(error);
    }

}

module.exports.deleteUser=async(id)=>{
    try{
     const result=await deleteUser(id);
      if(result){

          return {status:1, message:"user deleted successfully",user_id:id};
      }else{
        return {status:0, message:"something went wrong",user_id:id}
      }

    }catch(error){
        console.log(error);
    }
}

module.exports.softDeleteUser=async(id)=>{
   try{
    const result=await changeStatus(id);
    if(result){

        return {status:1, message:"user deleted successfully",user_id:id};
    }else{
      return {status:0, message:"something went wrong",user_id:id}
    } 
 
   }catch(error){
    console.log(error);
   }

}